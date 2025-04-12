/**
 * Utility functions for the application
 */

import { Event, Market } from '@/lib/api';

/**
 * Format a price as a percentage
 */
export function formatPrice(price?: number): string {
  if (price === undefined || price === null) {
    return 'N/A';
  }
  return `${(price * 100).toFixed(0)}%`;
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get the current price of a market
 */
export function getCurrentPrice(market: Market): number | undefined {
  return market.last_price || market.yes_ask;
}

/**
 * Get the price change of a market
 */
export function getPriceChange(market: Market): number | undefined {
  if (market.last_price === undefined || market.previous_price === undefined) {
    return undefined;
  }
  return market.last_price - market.previous_price;
}

/**
 * Get the price change percentage of a market
 */
export function getPriceChangePercentage(market: Market): string {
  const change = getPriceChange(market);
  if (change === undefined || market.previous_price === undefined || market.previous_price === 0) {
    return 'N/A';
  }
  const percentage = (change / market.previous_price) * 100;
  const sign = percentage > 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
}

/**
 * Get the color for a price change (green for positive, red for negative)
 */
export function getPriceChangeColor(market: Market): string {
  const change = getPriceChange(market);
  if (change === undefined) {
    return 'text-gray-500';
  }
  return change >= 0 ? 'text-green-500' : 'text-red-500';
}

/**
 * Group events by category
 */
export function groupEventsByCategory(events: Event[]): Record<string, Event[]> {
  return events.reduce((acc, event) => {
    const category = event.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(event);
    return acc;
  }, {} as Record<string, Event[]>);
}

/**
 * Format a category name for display
 */
export function formatCategoryName(category: string): string {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Utility function for combining class names (simplified version)
 */
export function cn(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}
