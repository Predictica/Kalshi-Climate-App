/**
 * Tests for API client
 */

import { KalshiApiClient } from './client';
import { KALSHI_API_CONFIG } from './config';

// Mock fetch
global.fetch = jest.fn();

describe('KalshiApiClient', () => {
  let apiClient: KalshiApiClient;
  
  beforeEach(() => {
    apiClient = new KalshiApiClient();
    (global.fetch as jest.Mock).mockClear();
  });
  
  test('constructor initializes with correct properties', () => {
    expect(apiClient['baseUrl']).toBe(KALSHI_API_CONFIG.baseUrl);
    expect(apiClient['apiKey']).toBe(KALSHI_API_CONFIG.apiKey);
    expect(apiClient['defaultHeaders']).toHaveProperty('Authorization');
    expect(apiClient['defaultHeaders'].Authorization).toBe(`Bearer ${KALSHI_API_CONFIG.apiKey}`);
  });
  
  test('get method builds correct URL and includes headers', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: 'test' }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    
    await apiClient.get('/test', { param1: 'value1', param2: 'value2' });
    
    expect(global.fetch).toHaveBeenCalledWith(
      `${KALSHI_API_CONFIG.baseUrl}/test?param1=value1&param2=value2`,
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Authorization': `Bearer ${KALSHI_API_CONFIG.apiKey}`,
        }),
      })
    );
  });
  
  test('post method sends correct body and includes headers', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: 'test' }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    
    const body = { test: 'data' };
    await apiClient.post('/test', body);
    
    expect(global.fetch).toHaveBeenCalledWith(
      `${KALSHI_API_CONFIG.baseUrl}/test`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': `Bearer ${KALSHI_API_CONFIG.apiKey}`,
        }),
        body: JSON.stringify(body),
      })
    );
  });
  
  test('get method handles error responses', async () => {
    const errorResponse = {
      ok: false,
      status: 401,
      json: jest.fn().mockResolvedValue({ 
        message: 'Unauthorized', 
        code: 'AUTH_ERROR' 
      }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(errorResponse);
    
    const result = await apiClient.get('/test');
    
    expect(result).toEqual({
      error: {
        message: 'Unauthorized',
        code: 'AUTH_ERROR',
      },
    });
  });
});
