import React from 'react';
import { CheckCircle, Clock, MapPin, Thermometer } from 'lucide-react';

const RecentDeliveries: React.FC = () => {
  const deliveries = [
    {
      id: 'DEL-001',
      type: 'Blood Type O+',
      from: 'Central Blood Bank',
      to: 'General Hospital',
      status: 'delivered',
      time: '2 mins ago',
      temperature: '4.1°C',
      drone: 'DR-001'
    },
    {
      id: 'DEL-002',
      type: 'Emergency Insulin',
      from: 'Pharmacy Hub',
      to: 'Emergency Center',
      status: 'in-transit',
      time: '5 mins ago',
      temperature: '2.8°C',
      drone: 'DR-003'
    },
    {
      id: 'DEL-003',
      type: 'Heart (Critical)',
      from: 'Regional Hospital',
      to: 'Cardiac Center',
      status: 'delivered',
      time: '12 mins ago',
      temperature: '4.0°C',
      drone: 'DR-002'
    },
    {
      id: 'DEL-004',
      type: 'COVID Vaccines',
      from: 'Distribution Center',
      to: 'Community Clinic',
      status: 'delivered',
      time: '18 mins ago',
      temperature: '3.2°C',
      drone: 'DR-004'
    },
    {
      id: 'DEL-005',
      type: 'Plasma Units',
      from: 'Blood Bank',
      to: 'Trauma Center',
      status: 'in-transit',
      time: '25 mins ago',
      temperature: '4.3°C',
      drone: 'DR-005'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'in-transit': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'in-transit': return Clock;
      default: return Clock;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Deliveries</h2>
        <button className="text-xs text-blue-600 hover:text-blue-800 font-medium dark:text-blue-400 dark:hover:text-blue-300">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {deliveries.map((delivery) => {
          const StatusIcon = getStatusIcon(delivery.status);
          return (
            <div key={delivery.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              <div className={`p-1.5 rounded-full ${getStatusColor(delivery.status)}`}>
                <StatusIcon className="w-3.5 h-3.5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">{delivery.type}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-300">{delivery.time}</span>
                </div>
                
                <div className="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <MapPin className="w-2.5 h-2.5 mr-1 dark:text-gray-300" />
                    <span className="truncate">{delivery.from} → {delivery.to}</span>
                  </div>
                  <div className="flex items-center">
                    <Thermometer className="w-2.5 h-2.5 mr-1 dark:text-gray-300" />
                    <span>{delivery.temperature}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-gray-500 dark:text-gray-300">Drone: {delivery.drone}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${getStatusColor(delivery.status)}`}>
                    {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentDeliveries;