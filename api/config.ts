/**
 * Kalshi API Configuration
 * 
 * This file contains configuration settings for the Kalshi API.
 */

export const KALSHI_API_CONFIG = {
  baseUrl: 'https://api.elections.kalshi.com/trade-api/v2',
  apiKey: '6b65e12d-83c3-4e1f-8a50-897f45ef41f3',
  defaultHeaders: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  // Rate limits as per Kalshi API documentation
  rateLimits: {
    requestsPerMinute: 100,
    requestsPerHour: 1000,
  },
};

/**
 * Climate contract categories available on Kalshi
 */
export const CLIMATE_CATEGORIES = [
  'climate_change',
  'daily_temperature',
  'natural_disasters',
  'climate_goals',
  'hurricanes',
  'snow_and_rain',
];
