'use client';

import { useState } from 'react';
import { Event, Market } from '@/lib/api';
import { formatPrice, formatDate, getCurrentPrice, getPriceChangeColor } from '@/lib/utils';

interface ContractDetailsProps {
  event: Event;
  onClose: () => void;
}

export default function ContractDetails({ event, onClose }: ContractDetailsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'markets' | 'details'>('overview');
  
  // Get the markets if available
  const markets = event.markets || [];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-xl font-bold truncate">{event.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="border-b">
          <div className="flex">
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'overview' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'markets' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('markets')}
            >
              Markets ({markets.length})
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === 'details' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-gray-700">{event.description || event.subtitle || 'No description available.'}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Event Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Event ID</div>
                        <div className="font-medium">{event.id}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Ticker</div>
                        <div className="font-medium">{event.ticker}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Series</div>
                        <div className="font-medium">{event.series_ticker}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Status</div>
                        <div className="font-medium capitalize">{event.status}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Created</div>
                        <div className="font-medium">{formatDate(event.created_time)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Last Updated</div>
                        <div className="font-medium">{formatDate(event.last_updated_time)}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Settlement Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Settlement Date</div>
                        <div className="font-medium">{formatDate(event.settlement_date)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Settlement Value Type</div>
                        <div className="font-medium capitalize">{event.settlement_value_type}</div>
                      </div>
                      {event.settlement_value && (
                        <div>
                          <div className="text-sm text-gray-500">Settlement Value</div>
                          <div className="font-medium">{event.settlement_value}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-gray-500">Settlement Sources</div>
                        <div className="font-medium">
                          {event.settlement_sources.join(', ') || 'None specified'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {markets.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Featured Market</h3>
                  <MarketCard market={markets[0]} />
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'markets' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Available Markets</h3>
              
              {markets.length === 0 ? (
                <div className="bg-gray-100 p-4 rounded text-center">
                  No markets available for this event.
                </div>
              ) : (
                <div className="space-y-4">
                  {markets.map((market) => (
                    <MarketCard key={market.ticker} market={market} />
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'details' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Technical Details</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <pre className="whitespace-pre-wrap text-sm">
                  {JSON.stringify(event, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function MarketCard({ market }: { market: Market }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="bg-gray-50 px-4 py-3 border-b">
        <h4 className="font-medium truncate" title={market.title}>
          {market.title}
        </h4>
        {market.subtitle && (
          <p className="text-sm text-gray-600 truncate">{market.subtitle}</p>
        )}
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-gray-500">Open Time</div>
            <div className="font-medium">{formatDate(market.open_time)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Close Time</div>
            <div className="font-medium">{formatDate(market.close_time)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Expiration</div>
            <div className="font-medium">{formatDate(market.expiration_time)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Status</div>
            <div className="font-medium capitalize">{market.status}</div>
          </div>
        </div>
        
        <div className="border-t pt-3">
          <div className="flex justify-between items-center mb-2">
            <div>
              <div className="text-xs text-gray-500">Current Price</div>
              <div className="text-xl font-bold">
                {formatPrice(getCurrentPrice(market))}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-xs text-gray-500">Volume</div>
              <div className="font-medium">
                {market.volume ? `$${market.volume.toLocaleString()}` : 'N/A'}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500">Yes Bid/Ask</div>
              <div className={`font-medium ${getPriceChangeColor(market)}`}>
                {market.yes_bid && market.yes_ask
                  ? `${formatPrice(market.yes_bid)} / ${formatPrice(market.yes_ask)}`
                  : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">No Bid/Ask</div>
              <div className={`font-medium ${getPriceChangeColor(market)}`}>
                {market.no_bid && market.no_ask
                  ? `${formatPrice(market.no_bid)} / ${formatPrice(market.no_ask)}`
                  : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
