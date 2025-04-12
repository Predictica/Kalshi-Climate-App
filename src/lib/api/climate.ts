/**
 * Kalshi Climate Contracts API
 * 
 * This file contains functions for fetching climate contracts from the Kalshi API.
 */

import { kalshiApi } from './client';
import { CLIMATE_CATEGORIES } from './config';

/**
 * Interface for Series data
 */
export interface Series {
  ticker: string;
  title: string;
  category: string;
  settlement_sources: string[];
  settlement_date: string;
  settlement_value_type: string;
  settlement_value?: string | number;
  status: string;
  created_time: string;
  last_updated_time: string;
}

/**
 * Interface for Event data
 */
export interface Event {
  id: string;
  ticker: string;
  series_ticker: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  settlement_sources: string[];
  settlement_date: string;
  settlement_value_type: string;
  settlement_value?: string | number;
  status: string;
  created_time: string;
  last_updated_time: string;
  markets?: Market[];
}

/**
 * Interface for Market data
 */
export interface Market {
  ticker: string;
  event_ticker: string;
  title: string;
  subtitle: string;
  settlement_value?: string | number;
  status: string;
  open_time: string;
  close_time: string;
  expiration_time: string;
  settlement_time?: string;
  yes_bid?: number;
  yes_ask?: number;
  no_bid?: number;
  no_ask?: number;
  last_price?: number;
  previous_price?: number;
  volume?: number;
  volume_24h?: number;
  liquidity?: number;
}

/**
 * Fetch all climate series from Kalshi
 * 
 * @returns Promise with the list of climate series
 */
export async function getClimateSeries(): Promise<Series[]> {
  const allSeries: Series[] = [];
  
  // Fetch series for each climate category
  for (const category of CLIMATE_CATEGORIES) {
    const response = await kalshiApi.get<{ series: Series[] }>('/series', { 
      category,
      include_product_metadata: 'true'
    });
    
    if (response.data?.series) {
      allSeries.push(...response.data.series);
    }
  }
  
  return allSeries;
}

/**
 * Fetch climate events from Kalshi
 * 
 * @param seriesTicker - Optional series ticker to filter events
 * @param status - Optional status to filter events (e.g., 'open', 'closed')
 * @returns Promise with the list of climate events
 */
export async function getClimateEvents(seriesTicker?: string, status?: string): Promise<Event[]> {
  const queryParams: Record<string, string> = {};
  
  if (seriesTicker) {
    queryParams.series_ticker = seriesTicker;
  }
  
  if (status) {
    queryParams.status = status;
  }
  
  // Add with_nested_markets to get market data with events
  queryParams.with_nested_markets = 'true';
  
  const response = await kalshiApi.get<{ events: Event[] }>('/events', queryParams);
  
  if (response.error) {
    console.error('Error fetching climate events:', response.error);
    return [];
  }
  
  return response.data?.events || [];
}

/**
 * Fetch daily climate contracts from Kalshi
 * 
 * @returns Promise with the list of daily climate events
 */
export async function getDailyClimateContracts(): Promise<Event[]> {
  // First get all series related to daily temperature
  const response = await kalshiApi.get<{ series: Series[] }>('/series', { 
    category: 'daily_temperature',
    include_product_metadata: 'true'
  });
  
  if (response.error) {
    console.error('Error fetching daily temperature series:', response.error);
    return [];
  }
  
  const series = response.data?.series || [];
  const dailyEvents: Event[] = [];
  
  // For each series, get the events
  for (const s of series) {
    const events = await getClimateEvents(s.ticker, 'open');
    dailyEvents.push(...events);
  }
  
  return dailyEvents;
}

/**
 * Get all open climate contracts
 * 
 * @returns Promise with all open climate contracts
 */
export async function getAllOpenClimateContracts(): Promise<Event[]> {
  const allEvents: Event[] = [];
  
  for (const category of CLIMATE_CATEGORIES) {
    // Get series for this category
    const seriesResponse = await kalshiApi.get<{ series: Series[] }>('/series', { 
      category,
      include_product_metadata: 'true'
    });
    
    if (seriesResponse.error) {
      console.error(`Error fetching ${category} series:`, seriesResponse.error);
      continue;
    }
    
    const series = seriesResponse.data?.series || [];
    
    // For each series, get open events
    for (const s of series) {
      const events = await getClimateEvents(s.ticker, 'open');
      allEvents.push(...events);
    }
  }
  
  return allEvents;
}

/**
 * Get climate contracts by category
 * 
 * @param category - Category to filter contracts
 * @param status - Optional status filter (defaults to 'open')
 * @returns Promise with climate contracts for the specified category
 */
export async function getClimateContractsByCategory(
  category: string, 
  status: string = 'open'
): Promise<Event[]> {
  // Get series for this category
  const seriesResponse = await kalshiApi.get<{ series: Series[] }>('/series', { 
    category,
    include_product_metadata: 'true'
  });
  
  if (seriesResponse.error) {
    console.error(`Error fetching ${category} series:`, seriesResponse.error);
    return [];
  }
  
  const series = seriesResponse.data?.series || [];
  const categoryEvents: Event[] = [];
  
  // For each series, get events with the specified status
  for (const s of series) {
    const events = await getClimateEvents(s.ticker, status);
    categoryEvents.push(...events);
  }
  
  return categoryEvents;
}
