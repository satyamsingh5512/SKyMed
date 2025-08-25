import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Truck, Clock, AlertCircle } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
  name: string;
}

interface DeliveryRoute {
  id: string;
  from: Location;
  to: Location;
  status: 'pending' | 'in-transit' | 'delivered';
  estimatedTime: string;
  droneId: string;
  parcelType: string;
}

interface MapViewProps {
  routes?: DeliveryRoute[];
  selectedRoute?: string;
  onRouteSelect?: (routeId: string) => void;
  showDrones?: boolean;
  height?: string;
}

const MapView: React.FC<MapViewProps> = ({ 
  routes = [], 
  selectedRoute, 
  onRouteSelect,
  showDrones = true,
  height = "400px" 
}) => {
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 }); // Delhi
  const [zoom, setZoom] = useState(12);

  // Sample drone locations
  const droneLocations = [
    { id: 'D001', lat: 28.6129, lng: 77.2295, status: 'active', battery: 85 },
    { id: 'D002', lat: 28.6219, lng: 77.2085, status: 'in-transit', battery: 72 },
    { id: 'D003', lat: 28.6089, lng: 77.2195, status: 'charging', battery: 45 },
  ];

  // Sample delivery routes if none provided
  const defaultRoutes: DeliveryRoute[] = [
    {
      id: 'R001',
      from: { lat: 28.6139, lng: 77.2090, name: 'Medical Center' },
      to: { lat: 28.6219, lng: 77.2285, name: 'City Hospital' },
      status: 'in-transit',
      estimatedTime: '8 mins',
      droneId: 'D002',
      parcelType: 'Blood Sample'
    },
    {
      id: 'R002',
      from: { lat: 28.6089, lng: 77.2195, name: 'Pharmacy Hub' },
      to: { lat: 28.6159, lng: 77.2095, name: 'Emergency Clinic' },
      status: 'pending',
      estimatedTime: '12 mins',
      droneId: 'D001',
      parcelType: 'Emergency Medication'
    }
  ];

  const displayRoutes = routes.length > 0 ? routes : defaultRoutes;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'in-transit': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDroneStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'in-transit': return 'bg-blue-500';
      case 'charging': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Live Delivery Map</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>In Transit</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Active Drones</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative" style={{ height }}>
        {/* Map Container - Simulated map view */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700">
          {/* Grid pattern to simulate map */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Delivery Routes */}
          {displayRoutes.map((route, index) => (
            <div key={route.id} className="absolute">
              {/* Route Line */}
              <svg 
                className="absolute inset-0 pointer-events-none"
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + index * 10}%`,
                  width: '200px',
                  height: '100px'
                }}
              >
                <path
                  d="M 20 20 Q 100 10 180 80"
                  stroke={route.status === 'in-transit' ? '#3b82f6' : '#6b7280'}
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={route.status === 'pending' ? '5,5' : 'none'}
                />
              </svg>

              {/* From Location */}
              <div 
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + index * 10}%`
                }}
              >
                <div className="bg-red-500 w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>
                <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap dark:bg-gray-800 dark:text-white">
                  {route.from.name}
                </div>
              </div>

              {/* To Location */}
              <div 
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `${50 + index * 15}%`,
                  top: `${60 + index * 10}%`
                }}
              >
                <div className="bg-green-500 w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>
                <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap dark:bg-gray-800 dark:text-white">
                  {route.to.name}
                </div>
              </div>

              {/* Drone Position (for in-transit routes) */}
              {route.status === 'in-transit' && (
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                  style={{
                    left: `${35 + index * 15}%`,
                    top: `${45 + index * 10}%`
                  }}
                >
                  <div className="bg-blue-600 w-3 h-3 rounded-full border border-white shadow-lg"></div>
                  <Navigation className="absolute -top-1 -left-1 w-5 h-5 text-blue-600" />
                </div>
              )}
            </div>
          ))}

          {/* Static Drone Locations */}
          {showDrones && droneLocations.map((drone, index) => (
            <div 
              key={drone.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${70 + index * 8}%`,
                top: `${20 + index * 15}%`
              }}
            >
              <div className={`w-3 h-3 rounded-full border border-white shadow-lg ${getDroneStatusColor(drone.status)}`}></div>
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap dark:bg-gray-800 dark:text-white">
                {drone.id} ({drone.battery}%)
              </div>
            </div>
          ))}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <button 
              onClick={() => setZoom(zoom + 1)}
              className="bg-white p-2 rounded shadow hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <span className="text-lg font-bold text-gray-700 dark:text-gray-300">+</span>
            </button>
            <button 
              onClick={() => setZoom(zoom - 1)}
              className="bg-white p-2 rounded shadow hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <span className="text-lg font-bold text-gray-700 dark:text-gray-300">−</span>
            </button>
          </div>
        </div>
      </div>

      {/* Route Details Panel */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayRoutes.map((route) => (
            <div 
              key={route.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedRoute === route.id 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400' 
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
              }`}
              onClick={() => onRouteSelect?.(route.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm text-gray-900 dark:text-white">{route.id}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(route.status)}`}>
                  {route.status}
                </span>
              </div>
              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1 text-red-500" />
                  <span>{route.from.name}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1 text-green-500" />
                  <span>{route.to.name}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>ETA: {route.estimatedTime}</span>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400">{route.droneId}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapView;