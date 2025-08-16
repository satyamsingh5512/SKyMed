import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Package, CheckCircle, Truck, Plane } from 'lucide-react';

const TrackParcel: React.FC = () => {
  const [trackingId, setTrackingId] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sample tracking data
  const sampleTrackingData = {
    'SP-123456': {
      id: 'SP-123456',
      type: 'Medical Supplies',
      status: 'in-transit',
      urgency: 'high',
      from: '123 Main St, Downtown',
      to: 'City General Hospital, 456 Health Ave',
      estimatedDelivery: '15 mins',
      currentLocation: 'En route - 2.3km from destination',
      droneId: 'DR-002',
      timeline: [
        { time: '14:30', status: 'Order Received', completed: true, description: 'Emergency request submitted' },
        { time: '14:32', status: 'Drone Dispatched', completed: true, description: 'Drone DR-002 assigned and launched' },
        { time: '14:35', status: 'Package Collected', completed: true, description: 'Package secured and verified' },
        { time: '14:42', status: 'In Transit', completed: true, description: 'Currently flying to destination', active: true },
        { time: '14:47', status: 'Delivery', completed: false, description: 'Expected delivery time' }
      ],
      recipient: 'Dr. Sarah Johnson',
      phone: '+1 (555) 123-4567'
    },
    'SP-789012': {
      id: 'SP-789012',
      type: 'Blood Sample',
      status: 'delivered',
      urgency: 'critical',
      from: 'Community Clinic, 789 Care St',
      to: 'Central Lab, 321 Science Blvd',
      estimatedDelivery: 'Delivered',
      currentLocation: 'Delivered successfully',
      droneId: 'DR-001',
      timeline: [
        { time: '13:15', status: 'Order Received', completed: true, description: 'Critical blood sample request' },
        { time: '13:16', status: 'Drone Dispatched', completed: true, description: 'Priority drone DR-001 launched' },
        { time: '13:18', status: 'Package Collected', completed: true, description: 'Temperature-controlled pickup' },
        { time: '13:25', status: 'In Transit', completed: true, description: 'Express delivery route' },
        { time: '13:28', status: 'Delivered', completed: true, description: 'Successfully delivered to lab technician' }
      ],
      recipient: 'Lab Technician Mike',
      phone: '+1 (555) 987-6543'
    }
  };

  const handleTrack = () => {
    setIsLoading(true);
    setTimeout(() => {
      const data = sampleTrackingData[trackingId as keyof typeof sampleTrackingData];
      setTrackingData(data || null);
      setIsLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-700 bg-green-100';
      case 'in-transit': return 'text-blue-700 bg-blue-100';
      case 'pending': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-700 bg-red-100';
      case 'high': return 'text-orange-700 bg-orange-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'standard': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Track Your Parcel</h1>
        
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter tracking ID (e.g., SP-123456)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleTrack}
            disabled={!trackingId || isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Track
              </>
            )}
          </button>
        </div>

        {/* Sample IDs */}
        <div className="mt-4 text-sm text-gray-600">
          <p>Try these sample tracking IDs:</p>
          <div className="flex space-x-4 mt-2">
            <button
              onClick={() => setTrackingId('SP-123456')}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              SP-123456 (In Transit)
            </button>
            <button
              onClick={() => setTrackingId('SP-789012')}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              SP-789012 (Delivered)
            </button>
          </div>
        </div>
      </div>

      {/* Tracking Results */}
      {trackingData && (
        <div className="space-y-6">
          {/* Status Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Tracking: {trackingData.id}</h2>
              <div className="flex space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingData.status)}`}>
                  {trackingData.status.charAt(0).toUpperCase() + trackingData.status.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(trackingData.urgency)}`}>
                  {trackingData.urgency.charAt(0).toUpperCase() + trackingData.urgency.slice(1)} Priority
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Parcel Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-600">Type:</span>
                    <span className="ml-2 font-medium">{trackingData.type}</span>
                  </div>
                  <div className="flex items-center">
                    <Plane className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-600">Drone:</span>
                    <span className="ml-2 font-medium">{trackingData.droneId}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-600">ETA:</span>
                    <span className="ml-2 font-medium">{trackingData.estimatedDelivery}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Delivery Details</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">From:</span>
                    <p className="font-medium">{trackingData.from}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">To:</span>
                    <p className="font-medium">{trackingData.to}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Recipient:</span>
                    <p className="font-medium">{trackingData.recipient}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-900">Current Status:</span>
                <span className="ml-2 text-blue-700">{trackingData.currentLocation}</span>
              </div>
            </div>
          </div>

          {/* Live Map Simulation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Tracking</h3>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-gray-200 relative overflow-hidden">
              {/* Simulated Map */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-blue-600 p-3 rounded-full w-12 h-12 mx-auto mb-4 animate-pulse">
                    <Plane className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-600">Drone {trackingData.droneId} is en route</p>
                  <p className="text-sm text-gray-500 mt-1">{trackingData.currentLocation}</p>
                </div>
              </div>
              
              {/* Route Line */}
              <svg className="absolute inset-0 w-full h-full">
                <path
                  d="M50 200 Q150 100 250 150"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeDasharray="10,5"
                  fill="none"
                  className="animate-pulse"
                />
              </svg>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Timeline</h3>
            <div className="space-y-4">
              {trackingData.timeline.map((event: any, index: number) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    event.completed 
                      ? event.active 
                        ? 'bg-blue-600 animate-pulse' 
                        : 'bg-green-600'
                      : 'bg-gray-300'
                  }`}>
                    {event.completed ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <Clock className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${
                        event.completed ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {event.status}
                      </h4>
                      <span className="text-sm text-gray-500">{event.time}</span>
                    </div>
                    <p className={`text-sm ${
                      event.completed ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Need Help?</h3>
                <p className="text-sm text-gray-600">Contact our 24/7 support team</p>
              </div>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Live Chat
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                  Call Support
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {trackingId && !trackingData && !isLoading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tracking ID Not Found</h3>
          <p className="text-gray-600 mb-4">
            We couldn't find a parcel with tracking ID "{trackingId}". 
            Please check the ID and try again.
          </p>
          <button
            onClick={() => {setTrackingId(''); setTrackingData(null);}}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default TrackParcel;