'use client';

import { useState, useEffect } from 'react';
import { Event, getAllOpenClimateContracts, CLIMATE_CATEGORIES } from '@/lib/api';
import { formatCategoryName } from '@/lib/utils';
import ContractCard from '@/components/ContractCard';
import CategoryStats from '@/components/CategoryStats';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClimateContracts() {
      try {
        setLoading(true);
        const contracts = await getAllOpenClimateContracts();
        setEvents(contracts);
        setFilteredEvents(contracts);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch climate contracts. Please try again later.');
        setLoading(false);
      }
    }

    fetchClimateContracts();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(event => event.category === selectedCategory));
    }
  }, [selectedCategory, events]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Kalshi Climate Contracts</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Filter by Category</h2>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-full ${
              selectedCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => handleCategoryChange('all')}
          >
            All
          </button>
          {CLIMATE_CATEGORIES.map(category => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {formatCategoryName(category)}
            </button>
          ))}
        </div>
      </div>
      
      {selectedCategory !== 'all' && (
        <div className="mb-6">
          <CategoryStats category={selectedCategory} />
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {selectedCategory === 'all' 
              ? 'All Climate Contracts' 
              : `${formatCategoryName(selectedCategory)} Contracts`}
          </h2>
          
          {filteredEvents.length === 0 ? (
            <div className="bg-gray-100 p-4 rounded text-center">
              No contracts found for this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map(event => (
                <ContractCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
