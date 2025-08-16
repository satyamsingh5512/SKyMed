import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Wifi, Battery, Thermometer } from 'lucide-react';

const SystemStatus: React.FC = () => {
  const systemComponents = [
    { name: 'Flight Control System', status: 'operational', uptime: '99.8%', icon: CheckCircle },
    { name: 'GPS Navigation', status: 'operational', uptime: '99.9%', icon: CheckCircle },
    { name: 'Weather Monitoring', status: 'warning', uptime: '98.2%', icon: AlertTriangle },
    { name: 'Temperature Control', status: 'operational', uptime: '99.5%', icon: CheckCircle },
    { name: 'Communication Network', status: 'operational', uptime: '99.7%', icon: CheckCircle },
    { name: 'Emergency Protocols', status: 'operational', uptime: '100%', icon: CheckCircle },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return XCircle;
      default: return CheckCircle;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">System Health</h2>
        <div className="flex items-center space-x-2 text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">All Systems Operational</span>
        </div>
      </div>

      <div className="space-y-4">
        {systemComponents.map((component, index) => {
          const StatusIcon = getStatusIcon(component.status);
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <StatusIcon className={`w-5 h-5 ${getStatusColor(component.status)}`} />
                <div>
                  <p className="font-medium text-gray-900">{component.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{component.status}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{component.uptime}</p>
                <p className="text-xs text-gray-500">Uptime</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <Wifi className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900">Network</p>
          <p className="text-xs text-gray-600">Strong Signal</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <Battery className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900">Power</p>
          <p className="text-xs text-gray-600">98% Avg</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <Thermometer className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900">Temp</p>
          <p className="text-xs text-gray-600">Optimal</p>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;