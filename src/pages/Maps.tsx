import React, { useState } from 'react';
import { MapPin, Navigation, Filter, Search, RefreshCw } from 'lucide-react';
import MapView from '../components/MapView';

const Maps: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const deliveryRoutes = [
    {
      id: 'SP-001',
      from: { lat: 28.6139, lng: 77.2090, name: 'AIIMS Delhi' },
      to: { lat: 28.6219, lng: 77.2285, name: 'Safdarjung Hospital' },
      status: 'in-transit' as const,
      estimatedTime: '8 mins',
      droneId: 'SKY-D002',
      parcelType: 'Blood Sample',
      priority: 'Critical',
      startTime: '14:30',
      distance: '3.2 km'
    },
    {
      id: 'SP-002',
      from: { lat: 28.6089, lng: 77.2195, name: 'Apollo Pharmacy' },
      to: { lat: 28.6159, lng: 77.2095, name: 'Max Hospital' },
      status: 'pending' as const,
      estimatedTime: '12 mins',
      droneId: 'SKY-D001',
      parcelType: 'Emergency Medication',
      priority: 'High',
      startTime: '14:45',
      distance: '2.8 km'
    },
    {
      id: 'SP-003',
      from: { lat: 28.6200, lng: 77.2100, name: 'Fortis Hospital' },
      to: { lat: 28.6050, lng: 77.2250, name: 'BLK Hospital' },
      status: 'delivered' as const,
      estimatedTime: 'Completed',
      droneId: 'SKY-D003',
      parcelType: 'Medical Supplies',
      priority: 'Medium',
      startTime: '14:15',
      distance: '4.1 km'
    }
  ];

  const filteredRoutes = deliveryRoutes.filter(route => {
    const matchesStatus = filterStatus === 'all' || route.status === filterStatus;
    const matchesSearch = route.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         route.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         route.to.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         route.parcelType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-red-700 bg-red-100 border-red-200';
      case 'High': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'Medium': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-700 bg-green-100';
      case 'in-transit': return 'text-blue-700 bg-blue-100';
      case 'pending': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Delivery Map</h1>
          <p className="text-gray-600 dark:text-gray-300">Track all emergency deliveries in real-time</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search deliveries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Map Component */}
      <MapView 
        routes={filteredRoutes}
        selectedRoute={selectedRoute}
        onRouteSelect={setSelectedRoute}
        showDrones={true}
        height="500px"
      />

      {/* Delivery Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Active Deliveries</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {deliveryRoutes.filter(r => r.status === 'in-transit').length}
              </p>
            </div>
            <Navigation className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {deliveryRoutes.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <MapPin className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Completed Today</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {deliveryRoutes.filter(r => r.status === 'delivered').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center dark:bg-green-900">
              <span className="text-green-600 font-bold dark:text-green-400">✓</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Avg Delivery Time</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">11.2m</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center dark:bg-purple-900">
              <span className="text-purple-600 text-sm font-bold dark:text-purple-400">⏱</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Route List */}
      <div className="bg-white rounded-lg shadow border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delivery Details</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredRoutes.map((route) => (
            <div 
              key={route.id}
              className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                selectedRoute === route.id ? 'bg-blue-50 dark:bg-blue-900' : ''
              }`}
              onClick={() => setSelectedRoute(route.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900 dark:text-white">{route.id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(route.status)}`}>
                    {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(route.priority)}`}>
                    {route.priority}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Started: {route.startTime}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-300 mb-1">Route</p>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-gray-900 dark:text-white">{route.from.name}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-gray-900 dark:text-white">{route.to.name}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-300 mb-1">Details</p>
                  <div className="space-y-1">
                    <p className="text-gray-900 dark:text-white">Type: {route.parcelType}</p>
                    <p className="text-gray-900 dark:text-white">Drone: {route.droneId}</p>
                    <p className="text-gray-900 dark:text-white">Distance: {route.distance}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-300 mb-1">Status</p>
                  <div className="space-y-1">
                    <p className="text-gray-900 dark:text-white">ETA: {route.estimatedTime}</p>
                    {route.status === 'in-transit' && (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                        <span className="text-blue-600 dark:text-blue-400">En route</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Maps;