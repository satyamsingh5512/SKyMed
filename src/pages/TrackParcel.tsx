import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Package, CheckCircle, Truck, Plane } from 'lucide-react';
import MapView from '../components/MapView';
import { useTracking } from '../hooks/useTracking';

const TrackParcel: React.FC = () => {
  const [trackingId, setTrackingId] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);
  const { trackDelivery, loading, error } = useTracking();

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

  const handleTrack = async () => {
    if (!trackingId.trim()) return;
    
    const delivery = await trackDelivery(trackingId.trim());
    if (delivery) {
      // Transform database data to match the expected format
      const transformedData = {
        id: `SP-${delivery.id.slice(-6).toUpperCase()}`,
        type: delivery.package_type,
        status: delivery.status,
        urgency: delivery.priority,
        from: delivery.pickup_address,
        to: delivery.delivery_address,
        estimatedDelivery: delivery.status === 'delivered' ? 'Delivered' : formatTimeRemaining(delivery.estimated_delivery),
        currentLocation: getCurrentLocation(delivery.status, delivery.tracking),
        droneId: 'DR-001', // You can enhance this with actual drone assignment
        timeline: generateTimeline(delivery),
        recipient: delivery.recipient_name,
        phone: delivery.recipient_phone
      };
      setTrackingData(transformedData);
    } else {
      setTrackingData(null);
    }
  };

  const formatTimeRemaining = (estimatedDelivery: string): string => {
    const now = new Date();
    const delivery = new Date(estimatedDelivery);
    const diffInMinutes = Math.floor((delivery.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffInMinutes <= 0) return 'Delivered';
    if (diffInMinutes < 60) return `${diffInMinutes} mins`;
    return `${Math.floor(diffInMinutes / 60)}h ${diffInMinutes % 60}m`;
  };

  const getCurrentLocation = (status: string, tracking: any[]): string => {
    if (status === 'delivered') return 'Delivered successfully';
    if (status === 'in_transit') return 'En route to destination';
    if (status === 'assigned') return 'Drone assigned, preparing for pickup';
    return 'Processing your request';
  };

  const generateTimeline = (delivery: any) => {
    const timeline = [
      { 
        time: new Date(delivery.created_at).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }), 
        status: 'Order Received', 
        completed: true, 
        description: 'Emergency request submitted' 
      }
    ];

    if (delivery.status !== 'pending') {
      timeline.push({
        time: new Date(new Date(delivery.created_at).getTime() + 2 * 60000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        status: 'Drone Dispatched',
        completed: true,
        description: 'Drone assigned and launched'
      });
    }

    if (delivery.status === 'in_transit' || delivery.status === 'delivered') {
      timeline.push({
        time: new Date(new Date(delivery.created_at).getTime() + 5 * 60000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        status: 'Package Collected',
        completed: true,
        description: 'Package secured and verified'
      });

      timeline.push({
        time: new Date(new Date(delivery.created_at).getTime() + 8 * 60000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        status: 'In Transit',
        completed: delivery.status === 'delivered',
        description: delivery.status === 'in_transit' ? 'Currently flying to destination' : 'Completed transit',
        active: delivery.status === 'in_transit'
      });
    }

    timeline.push({
      time: new Date(delivery.estimated_delivery).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      status: 'Delivery',
      completed: delivery.status === 'delivered',
      description: delivery.status === 'delivered' ? 'Successfully delivered' : 'Expected delivery time'
    });

    return timeline;
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-black dark:border-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">Track Your Parcel</h1>
        
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter tracking ID (e.g., SP-123456)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            />
          </div>
          <button
            onClick={handleTrack}
            disabled={!trackingId || loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center dark:bg-blue-700 dark:hover:bg-blue-800 dark:disabled:bg-gray-700"
          >
            {loading ? (
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
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          <p>Try these sample tracking IDs:</p>
          <div className="flex space-x-4 mt-2">
            <button
              onClick={() => setTrackingId('SP-123456')}
              className="text-blue-600 hover:text-blue-800 underline dark:text-blue-400 dark:hover:text-blue-300"
            >
              SP-123456 (In Transit)
            </button>
            <button
              onClick={() => setTrackingId('SP-789012')}
              className="text-blue-600 hover:text-blue-800 underline dark:text-blue-400 dark:hover:text-blue-300"
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-black dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tracking: {trackingData.id}</h2>
              <div className="flex space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingData.status)} dark:text-white`}>
                  {trackingData.status.charAt(0).toUpperCase() + trackingData.status.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(trackingData.urgency)} dark:text-white`}>
                  {trackingData.urgency.charAt(0).toUpperCase() + trackingData.urgency.slice(1)} Priority
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3 dark:text-white">Parcel Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 text-gray-500 mr-2 dark:text-gray-300" />
                    <span className="text-gray-600 dark:text-gray-300">Type:</span>
                    <span className="ml-2 font-medium dark:text-white">{trackingData.type}</span>
                  </div>
                  <div className="flex items-center">
                    <Plane className="w-4 h-4 text-gray-500 mr-2 dark:text-gray-300" />
                    <span className="text-gray-600 dark:text-gray-300">Drone:</span>
                    <span className="ml-2 font-medium dark:text-white">{trackingData.droneId}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-500 mr-2 dark:text-gray-300" />
                    <span className="text-gray-600 dark:text-gray-300">ETA:</span>
                    <span className="ml-2 font-medium dark:text-white">{trackingData.estimatedDelivery}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3 dark:text-white">Delivery Details</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">From:</span>
                    <p className="font-medium dark:text-white">{trackingData.from}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">To:</span>
                    <p className="font-medium dark:text-white">{trackingData.to}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Recipient:</span>
                    <p className="font-medium dark:text-white">{trackingData.recipient}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900 dark:border-blue-800">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-blue-600 mr-2 dark:text-blue-400" />
                <span className="font-medium text-blue-900 dark:text-blue-100">Current Status:</span>
                <span className="ml-2 text-blue-700 dark:text-blue-300">{trackingData.currentLocation}</span>
              </div>
            </div>
          </div>

          {/* Live Map */}
          <MapView 
            routes={[{
              id: trackingData.id,
              from: { lat: 28.6139, lng: 77.2090, name: trackingData.from.split(',')[0] },
              to: { lat: 28.6219, lng: 77.2285, name: trackingData.to.split(',')[0] },
              status: trackingData.status as 'pending' | 'in-transit' | 'delivered',
              estimatedTime: trackingData.estimatedDelivery,
              droneId: trackingData.droneId,
              parcelType: trackingData.type
            }]}
            selectedRoute={trackingData.id}
            showDrones={true}
            height="350px"
          />

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-black dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Delivery Timeline</h3>
            <div className="space-y-4">
              {trackingData.timeline.map((event: any, index: number) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    event.completed
                      ? event.active
                        ? 'bg-blue-600 animate-pulse'
                        : 'bg-green-600'
                      : 'bg-gray-300 dark:bg-gray-700'
                  }`}>
                    {event.completed ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <Clock className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${
                        event.completed ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {event.status}
                      </h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{event.time}</span>
                    </div>
                    <p className={`text-sm ${
                      event.completed ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 dark:bg-gray-900 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Need Help?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Contact our 24/7 support team</p>
              </div>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800">
                  Live Chat
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                  Call Support
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {trackingId && !trackingData && !loading && error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center dark:bg-black dark:border-gray-800">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4 dark:text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">Tracking ID Not Found</h3>
          <p className="text-gray-600 mb-4 dark:text-gray-300">
            We couldn't find a parcel with tracking ID "{trackingId}".
            Please check the ID and try again.
          </p>
          <button
            onClick={() => {setTrackingId(''); setTrackingData(null);}}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default TrackParcel;