/**
 * Kalshi API Client
 * 
 * This file contains the API client for interacting with the Kalshi API.
 */

import { KALSHI_API_CONFIG } from './config';

/**
 * Interface for API response
 */
interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}

/**
 * Kalshi API client for making authenticated requests
 */
export class KalshiApiClient {
  private baseUrl: string;
  private apiKey: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseUrl = KALSHI_API_CONFIG.baseUrl;
    this.apiKey = KALSHI_API_CONFIG.apiKey;
    this.defaultHeaders = {
      ...KALSHI_API_CONFIG.defaultHeaders,
      'Authorization': `Bearer ${this.apiKey}`,
    };
  }

  /**
   * Make a GET request to the Kalshi API
   * 
   * @param endpoint - API endpoint to call
   * @param queryParams - Query parameters to include in the request
   * @returns Promise with the API response
   */
  async get<T>(endpoint: string, queryParams: Record<string, string> = {}): Promise<ApiResponse<T>> {
    try {
      // Build query string from parameters
      const queryString = Object.entries(queryParams)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      
      const url = `${this.baseUrl}${endpoint}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.defaultHeaders,
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          error: {
            message: errorData.message || 'Unknown error occurred',
            code: errorData.code || response.status.toString(),
          },
        };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          code: 'CLIENT_ERROR',
        },
      };
    }
  }

  /**
   * Make a POST request to the Kalshi API
   * 
   * @param endpoint - API endpoint to call
   * @param body - Request body
   * @returns Promise with the API response
   */
  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: this.defaultHeaders,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          error: {
            message: errorData.message || 'Unknown error occurred',
            code: errorData.code || response.status.toString(),
          },
        };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          code: 'CLIENT_ERROR',
        },
      };
    }
  }
}

// Export a singleton instance of the API client
export const kalshiApi = new KalshiApiClient();
