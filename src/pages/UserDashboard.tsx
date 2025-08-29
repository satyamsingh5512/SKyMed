import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, AlertTriangle, Plus, MapPin } from 'lucide-react';
import MapView from '../components/MapView';
import WelcomeModal from '../components/WelcomeModal';

import { useDeliveries } from '../hooks/useDeliveries';
import { useAuthCallback } from '../hooks/useAuthCallback';

const UserDashboard: React.FC = () => {
  const { deliveries, loading } = useDeliveries();
  useAuthCallback(); // Handle OAuth profile creation

  // Format deliveries for display
  const recentParcels = deliveries.slice(0, 5).map(delivery => ({
    id: `SP-${delivery.id.slice(-6).toUpperCase()}`,
    type: delivery.package_type,
    status: delivery.status,
    from: delivery.pickup_address.split(',')[0] || 'Pickup Location',
    to: delivery.delivery_address.split(',')[0] || 'Delivery Location',
    time: formatTimeAgo(delivery.created_at),
    estimatedTime: formatEstimatedTime(delivery.estimated_delivery),
    actualTime: delivery.actual_delivery ? formatEstimatedTime(delivery.actual_delivery) : null,
    priority: delivery.priority
  }));

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const formatEstimatedTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((date.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffInMinutes <= 0) return 'Delivered';
    if (diffInMinutes < 60) return `${diffInMinutes} mins`;
    return `${Math.floor(diffInMinutes / 60)}h ${diffInMinutes % 60}m`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-transit': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default: return <Package className="w-5 h-5 text-gray-600" />;
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
    <>
      <WelcomeModal />
      <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">Welcome to AeroVita</h1>
        <p className="text-base text-gray-600 mb-6 dark:text-gray-300">Emergency delivery service at your fingertips</p>
        
        <Link
          to="/send"
          className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-base font-semibold shadow hover:shadow-md"
        >
          <Plus className="w-5 h-5 mr-2" />
          Send Emergency Parcel
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-100 p-2 rounded-md dark:bg-green-900">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">12</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">Successful Deliveries</p>
          <p className="text-xs text-green-600 mt-1 dark:text-green-400">This month</p>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-100 p-2 rounded-md dark:bg-blue-900">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">14 min</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">Average Delivery Time</p>
          <p className="text-xs text-blue-600 mt-1 dark:text-blue-400">Faster than traditional</p>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-100 p-2 rounded-md dark:bg-purple-900">
              <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">1</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">Active Deliveries</p>
          <p className="text-xs text-purple-600 mt-1 dark:text-purple-400">In progress</p>
        </div>
      </div>

      {/* Recent Parcels */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Parcels</h2>
          <div className="flex space-x-3">
            <Link
              to="/history"
              className="text-xs text-blue-600 hover:text-blue-800 font-medium dark:text-blue-400 dark:hover:text-blue-300"
            >
              Order History
            </Link>
            <Link
              to="/track"
              className="text-xs text-blue-600 hover:text-blue-800 font-medium dark:text-blue-400 dark:hover:text-blue-300"
            >
              Track All
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          {recentParcels.map((parcel) => (
            <div key={parcel.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              <div className="flex-shrink-0">
                {getStatusIcon(parcel.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{parcel.type}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-300">{parcel.time}</span>
                </div>
                
                <div className="flex items-center space-x-3 text-xs text-gray-600 mb-1.5 dark:text-gray-300">
                  <div className="flex items-center">
                    <MapPin className="w-2.5 h-2.5 mr-1 dark:text-gray-300" />
                    <span>{parcel.from} → {parcel.to}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${getStatusColor(parcel.status)}`}>
                    {parcel.status.charAt(0).toUpperCase() + parcel.status.slice(1)}
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-300">
                    {parcel.actualTime ? (
                      <span>Delivered in {parcel.actualTime}</span>
                    ) : (
                      <span>ETA: {parcel.estimatedTime}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Map Preview */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Live Deliveries</h2>
          <Link
            to="/maps"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium dark:text-blue-400 dark:hover:text-blue-300"
          >
            View Full Map
          </Link>
        </div>
        <MapView 
          routes={recentParcels.filter(p => p.status !== 'delivered').map(parcel => ({
            id: parcel.id,
            from: { lat: 28.6139, lng: 77.2090, name: parcel.from },
            to: { lat: 28.6219, lng: 77.2285, name: parcel.to },
            status: parcel.status as 'pending' | 'in-transit' | 'delivered',
            estimatedTime: parcel.estimatedTime || 'N/A',
            droneId: `SKY-${parcel.id.split('-')[1]}`,
            parcelType: parcel.type
          }))}
          showDrones={true}
          height="300px"
        />
      </div>



      {/* Emergency Contact */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900 dark:border-red-800">
        <div className="flex items-center space-x-2 mb-3">
          <div className="bg-red-100 p-1.5 rounded-md dark:bg-red-800">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-base font-semibold text-red-900 dark:text-red-100">Emergency Support</h3>
        </div>
        <p className="text-red-700 mb-3 text-sm dark:text-red-200">
          Need immediate assistance with your delivery? Our 24/7 emergency support team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors dark:bg-red-700 dark:hover:bg-red-800">
            Call Emergency: 112
          </button>
          <button className="px-3 py-1.5 bg-white text-red-600 border border-red-300 rounded-md text-sm hover:bg-red-50 transition-colors dark:bg-gray-800 dark:text-red-400 dark:border-red-800 dark:hover:bg-gray-700">
            Live Chat Support
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default UserDashboard;