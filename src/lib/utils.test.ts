/**
 * Tests for utility functions
 */

import { formatPrice, formatDate, getCurrentPrice, getPriceChange, getPriceChangePercentage, getPriceChangeColor, groupEventsByCategory, formatCategoryName } from '../utils';
import { Market } from '@/lib/api';

describe('Utility Functions', () => {
  test('formatPrice formats price as percentage', () => {
    expect(formatPrice(0.75)).toBe('75%');
    expect(formatPrice(0.25)).toBe('25%');
    expect(formatPrice(0)).toBe('0%');
    expect(formatPrice(undefined)).toBe('N/A');
  });
  
  test('formatDate formats date string correctly', () => {
    const date = new Date('2025-04-11T12:00:00Z');
    expect(formatDate(date.toISOString())).toMatch(/Apr 11, 2025/);
  });
  
  test('getCurrentPrice returns the correct price', () => {
    const market: Market = {
      ticker: 'TEST',
      event_ticker: 'EVENT',
      title: 'Test Market',
      subtitle: 'Test Subtitle',
      status: 'open',
      open_time: '2025-01-01T00:00:00Z',
      close_time: '2025-12-31T23:59:59Z',
      expiration_time: '2025-12-31T23:59:59Z',
      last_price: 0.75,
      yes_ask: 0.80,
    };
    
    expect(getCurrentPrice(market)).toBe(0.75);
    
    const marketNoLastPrice: Market = {
      ...market,
      last_price: undefined,
    };
    
    expect(getCurrentPrice(marketNoLastPrice)).toBe(0.80);
  });
  
  test('getPriceChange calculates price change correctly', () => {
    const market: Market = {
      ticker: 'TEST',
      event_ticker: 'EVENT',
      title: 'Test Market',
      subtitle: 'Test Subtitle',
      status: 'open',
      open_time: '2025-01-01T00:00:00Z',
      close_time: '2025-12-31T23:59:59Z',
      expiration_time: '2025-12-31T23:59:59Z',
      last_price: 0.75,
      previous_price: 0.70,
    };
    
    expect(getPriceChange(market)).toBe(0.05);
    
    const marketNoChange: Market = {
      ...market,
      last_price: undefined,
    };
    
    expect(getPriceChange(marketNoChange)).toBeUndefined();
  });
  
  test('getPriceChangePercentage calculates percentage correctly', () => {
    const market: Market = {
      ticker: 'TEST',
      event_ticker: 'EVENT',
      title: 'Test Market',
      subtitle: 'Test Subtitle',
      status: 'open',
      open_time: '2025-01-01T00:00:00Z',
      close_time: '2025-12-31T23:59:59Z',
      expiration_time: '2025-12-31T23:59:59Z',
      last_price: 0.75,
      previous_price: 0.50,
    };
    
    expect(getPriceChangePercentage(market)).toBe('+50.00%');
    
    const marketNegativeChange: Market = {
      ...market,
      last_price: 0.40,
      previous_price: 0.50,
    };
    
    expect(getPriceChangePercentage(marketNegativeChange)).toBe('-20.00%');
  });
  
  test('getPriceChangeColor returns correct color class', () => {
    const marketPositive: Market = {
      ticker: 'TEST',
      event_ticker: 'EVENT',
      title: 'Test Market',
      subtitle: 'Test Subtitle',
      status: 'open',
      open_time: '2025-01-01T00:00:00Z',
      close_time: '2025-12-31T23:59:59Z',
      expiration_time: '2025-12-31T23:59:59Z',
      last_price: 0.75,
      previous_price: 0.70,
    };
    
    expect(getPriceChangeColor(marketPositive)).toBe('text-green-500');
    
    const marketNegative: Market = {
      ...marketPositive,
      last_price: 0.65,
    };
    
    expect(getPriceChangeColor(marketNegative)).toBe('text-red-500');
  });
  
  test('groupEventsByCategory groups events correctly', () => {
    const events = [
      { id: '1', category: 'daily_temperature', title: 'Event 1' },
      { id: '2', category: 'climate_change', title: 'Event 2' },
      { id: '3', category: 'daily_temperature', title: 'Event 3' },
    ];
    
    const grouped = groupEventsByCategory(events as any);
    
    expect(Object.keys(grouped)).toHaveLength(2);
    expect(grouped.daily_temperature).toHaveLength(2);
    expect(grouped.climate_change).toHaveLength(1);
  });
  
  test('formatCategoryName formats category names correctly', () => {
    expect(formatCategoryName('daily_temperature')).toBe('Daily Temperature');
    expect(formatCategoryName('climate_change')).toBe('Climate Change');
    expect(formatCategoryName('natural_disasters')).toBe('Natural Disasters');
  });
});
