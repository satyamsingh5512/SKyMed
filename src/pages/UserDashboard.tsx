import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, AlertTriangle, Plus, MapPin } from 'lucide-react';

const UserDashboard: React.FC = () => {
  const recentParcels = [
    {
      id: 'SP-001',
      type: 'Medical Supplies',
      status: 'delivered',
      from: 'Your Location',
      to: 'City Hospital',
      time: '2 hours ago',
      estimatedTime: '15 mins',
      actualTime: '12 mins'
    },
    {
      id: 'SP-002',
      type: 'Emergency Medication',
      status: 'in-transit',
      from: 'Your Location',
      to: 'Community Clinic',
      time: '30 mins ago',
      estimatedTime: '20 mins',
      actualTime: null
    },
    {
      id: 'SP-003',
      type: 'Blood Sample',
      status: 'pending',
      from: 'Your Location',
      to: 'Lab Center',
      time: '5 mins ago',
      estimatedTime: '25 mins',
      actualTime: null
    }
  ];

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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to SkyMed</h1>
        <p className="text-lg text-gray-600 mb-8">Emergency delivery service at your fingertips</p>
        
        <Link
          to="/send"
          className="inline-flex items-center px-8 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl"
        >
          <Plus className="w-6 h-6 mr-3" />
          Send Emergency Parcel
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">12</span>
          </div>
          <p className="text-sm text-gray-600">Successful Deliveries</p>
          <p className="text-xs text-green-600 mt-1">This month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">14 min</span>
          </div>
          <p className="text-sm text-gray-600">Average Delivery Time</p>
          <p className="text-xs text-blue-600 mt-1">Faster than traditional</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">1</span>
          </div>
          <p className="text-sm text-gray-600">Active Deliveries</p>
          <p className="text-xs text-purple-600 mt-1">In progress</p>
        </div>
      </div>

      {/* Recent Parcels */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Parcels</h2>
          <Link
            to="/track"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {recentParcels.map((parcel) => (
            <div key={parcel.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0">
                {getStatusIcon(parcel.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-900">{parcel.type}</p>
                  <span className="text-xs text-gray-500">{parcel.time}</span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{parcel.from} → {parcel.to}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(parcel.status)}`}>
                    {parcel.status.charAt(0).toUpperCase() + parcel.status.slice(1)}
                  </span>
                  <div className="text-xs text-gray-500">
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

      {/* Emergency Contact */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-red-100 p-2 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-900">Emergency Support</h3>
        </div>
        <p className="text-red-700 mb-4">
          Need immediate assistance with your delivery? Our 24/7 emergency support team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Call Emergency: 911
          </button>
          <button className="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
            Live Chat Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;