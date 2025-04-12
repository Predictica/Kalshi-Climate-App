'use client';

import { useState, useEffect } from 'react';
import { Event, Market, getClimateContractsByCategory } from '@/lib/api';
import { formatPrice, formatDate, getCurrentPrice } from '@/lib/utils';

interface CategoryStatsProps {
  category: string;
}

export default function CategoryStats({ category }: CategoryStatsProps) {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalMarkets: 0,
    averagePrice: 0,
    highestVolume: 0,
    nearestSettlement: null as string | null,
  });

  useEffect(() => {
    async function fetchCategoryData() {
      try {
        setLoading(true);
        const contracts = await getClimateContractsByCategory(category);
        setEvents(contracts);
        
        // Calculate statistics
        const totalEvents = contracts.length;
        let totalMarkets = 0;
        let priceSum = 0;
        let priceCount = 0;
        let highestVolume = 0;
        let nearestSettlement: string | null = null;
        let nearestDate: Date | null = null;
        
        contracts.forEach(event => {
          if (event.markets) {
            totalMarkets += event.markets.length;
            
            event.markets.forEach(market => {
              const price = getCurrentPrice(market);
              if (price !== undefined) {
                priceSum += price;
                priceCount++;
              }
              
              if (market.volume_24h && market.volume_24h > highestVolume) {
                highestVolume = market.volume_24h;
              }
            });
          }
          
          const settlementDate = new Date(event.settlement_date);
          if (
            settlementDate > new Date() && 
            (nearestDate === null || settlementDate < nearestDate)
          ) {
            nearestDate = settlementDate;
            nearestSettlement = event.settlement_date;
          }
        });
        
        setStats({
          totalEvents,
          totalMarkets,
          averagePrice: priceCount > 0 ? priceSum / priceCount : 0,
          highestVolume,
          nearestSettlement,
        });
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch category statistics.');
        setLoading(false);
      }
    }

    fetchCategoryData();
  }, [category]);

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-100 rounded-lg p-6 h-48"></div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Category Statistics</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-500">Total Events</div>
          <div className="text-xl font-bold">{stats.totalEvents}</div>
        </div>
        
        <div>
          <div className="text-sm text-gray-500">Total Markets</div>
          <div className="text-xl font-bold">{stats.totalMarkets}</div>
        </div>
        
        <div>
          <div className="text-sm text-gray-500">Average Price</div>
          <div className="text-xl font-bold">{formatPrice(stats.averagePrice)}</div>
        </div>
        
        <div>
          <div className="text-sm text-gray-500">Highest 24h Volume</div>
          <div className="text-xl font-bold">
            {stats.highestVolume > 0 ? `$${stats.highestVolume.toLocaleString()}` : 'N/A'}
          </div>
        </div>
      </div>
      
      {stats.nearestSettlement && (
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm text-gray-500">Nearest Settlement Date</div>
          <div className="font-medium">{formatDate(stats.nearestSettlement)}</div>
        </div>
      )}
    </div>
  );
}
