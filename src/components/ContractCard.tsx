'use client';

import { useState } from 'react';
import { Event } from '@/lib/api';
import ContractDetails from '@/components/ContractDetails';
import { formatCategoryName } from '@/lib/utils';

interface ContractCardProps {
  event: Event;
}

export default function ContractCard({ event }: ContractCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Get the first market if available
  const market = event.markets && event.markets.length > 0 ? event.markets[0] : undefined;
  
  const handleCardClick = () => {
    setShowDetails(true);
  };
  
  const handleCloseDetails = () => {
    setShowDetails(false);
  };
  
  return (
    <>
      <div 
        className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="bg-gray-50 px-4 py-3 border-b">
          <div className="text-xs text-gray-500 mb-1">{formatCategoryName(event.category)}</div>
          <h3 className="font-medium text-lg truncate" title={event.title}>
            {event.title}
          </h3>
        </div>
        
        <div className="p-4">
          {event.subtitle && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.subtitle}</p>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-gray-500">Status</div>
              <div className="font-medium capitalize">{event.status}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Markets</div>
              <div className="font-medium">{event.markets?.length || 0}</div>
            </div>
          </div>
          
          {market ? (
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs text-gray-500">Market</div>
                  <div className="font-medium truncate" title={market.title}>
                    {market.title}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic">No market data available</div>
          )}
        </div>
      </div>
      
      {showDetails && (
        <ContractDetails event={event} onClose={handleCloseDetails} />
      )}
    </>
  );
}
