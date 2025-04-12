/**
 * Tests for climate contracts API functions
 */

import { getClimateSeries, getClimateEvents, getDailyClimateContracts, getAllOpenClimateContracts, getClimateContractsByCategory } from './climate';
import { kalshiApi } from './client';

// Mock the kalshiApi
jest.mock('./client', () => ({
  kalshiApi: {
    get: jest.fn(),
  },
}));

describe('Climate API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('getClimateSeries fetches series for each climate category', async () => {
    const mockSeries = [{ ticker: 'TEMP', title: 'Temperature' }];
    (kalshiApi.get as jest.Mock).mockResolvedValue({ data: { series: mockSeries } });
    
    const result = await getClimateSeries();
    
    // Should call the API once for each climate category
    expect(kalshiApi.get).toHaveBeenCalledTimes(6);
    expect(kalshiApi.get).toHaveBeenCalledWith('/series', expect.objectContaining({
      include_product_metadata: 'true'
    }));
    
    // Should return the combined series from all categories
    expect(result).toHaveLength(6);
  });
  
  test('getClimateEvents fetches events with correct parameters', async () => {
    const mockEvents = [{ id: '123', title: 'Test Event' }];
    (kalshiApi.get as jest.Mock).mockResolvedValue({ data: { events: mockEvents } });
    
    const result = await getClimateEvents('TEMP', 'open');
    
    expect(kalshiApi.get).toHaveBeenCalledWith('/events', {
      series_ticker: 'TEMP',
      status: 'open',
      with_nested_markets: 'true'
    });
    
    expect(result).toEqual(mockEvents);
  });
  
  test('getDailyClimateContracts fetches daily temperature events', async () => {
    const mockSeries = [{ ticker: 'TEMP' }];
    const mockEvents = [{ id: '123', title: 'Daily Temperature' }];
    
    (kalshiApi.get as jest.Mock)
      .mockResolvedValueOnce({ data: { series: mockSeries } })
      .mockResolvedValueOnce({ data: { events: mockEvents } });
    
    const result = await getDailyClimateContracts();
    
    expect(kalshiApi.get).toHaveBeenCalledWith('/series', {
      category: 'daily_temperature',
      include_product_metadata: 'true'
    });
    
    expect(result).toEqual(mockEvents);
  });
  
  test('getAllOpenClimateContracts fetches events for all categories', async () => {
    const mockSeries = [{ ticker: 'TEMP' }];
    const mockEvents = [{ id: '123', title: 'Climate Event' }];
    
    (kalshiApi.get as jest.Mock)
      .mockResolvedValue({ data: { series: mockSeries } })
      .mockResolvedValueOnce({ data: { series: mockSeries } })
      .mockResolvedValueOnce({ data: { events: mockEvents } });
    
    const result = await getAllOpenClimateContracts();
    
    // Should call the API for each category to get series
    expect(kalshiApi.get).toHaveBeenCalledWith('/series', expect.objectContaining({
      include_product_metadata: 'true'
    }));
    
    // Should return events from all categories
    expect(result.length).toBeGreaterThan(0);
  });
  
  test('getClimateContractsByCategory fetches events for specific category', async () => {
    const mockSeries = [{ ticker: 'TEMP' }];
    const mockEvents = [{ id: '123', title: 'Climate Event' }];
    
    (kalshiApi.get as jest.Mock)
      .mockResolvedValueOnce({ data: { series: mockSeries } })
      .mockResolvedValueOnce({ data: { events: mockEvents } });
    
    const result = await getClimateContractsByCategory('daily_temperature');
    
    expect(kalshiApi.get).toHaveBeenCalledWith('/series', {
      category: 'daily_temperature',
      include_product_metadata: 'true'
    });
    
    expect(result).toEqual(mockEvents);
  });
});
