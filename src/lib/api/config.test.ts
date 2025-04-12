/**
 * Tests for API configuration
 */

import { KALSHI_API_CONFIG, CLIMATE_CATEGORIES } from './config';

describe('API Configuration', () => {
  test('KALSHI_API_CONFIG has the correct structure', () => {
    expect(KALSHI_API_CONFIG).toHaveProperty('baseUrl');
    expect(KALSHI_API_CONFIG).toHaveProperty('apiKey');
    expect(KALSHI_API_CONFIG).toHaveProperty('defaultHeaders');
    expect(KALSHI_API_CONFIG).toHaveProperty('rateLimits');
    
    expect(typeof KALSHI_API_CONFIG.baseUrl).toBe('string');
    expect(typeof KALSHI_API_CONFIG.apiKey).toBe('string');
    expect(typeof KALSHI_API_CONFIG.defaultHeaders).toBe('object');
    expect(typeof KALSHI_API_CONFIG.rateLimits).toBe('object');
  });
  
  test('CLIMATE_CATEGORIES contains expected categories', () => {
    expect(CLIMATE_CATEGORIES).toContain('climate_change');
    expect(CLIMATE_CATEGORIES).toContain('daily_temperature');
    expect(CLIMATE_CATEGORIES).toContain('natural_disasters');
    expect(CLIMATE_CATEGORIES).toContain('climate_goals');
    expect(CLIMATE_CATEGORIES).toContain('hurricanes');
    expect(CLIMATE_CATEGORIES).toContain('snow_and_rain');
  });
});
