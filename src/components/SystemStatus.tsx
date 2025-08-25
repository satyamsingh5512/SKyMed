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
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">System Health</h2>
        <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium dark:text-white">All Systems Operational</span>
        </div>
      </div>

      <div className="space-y-3">
        {systemComponents.map((component, index) => {
          const StatusIcon = getStatusIcon(component.status);
          return (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <StatusIcon className={`w-4 h-4 ${getStatusColor(component.status)} dark:text-white`} />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{component.name}</p>
                  <p className="text-xs text-gray-500 capitalize dark:text-gray-300">{component.status}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-gray-900 dark:text-white">{component.uptime}</p>
                <p className="text-xs text-gray-500 dark:text-gray-300">Uptime</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="text-center p-2 bg-blue-50 rounded-md dark:bg-gray-800">
          <Wifi className="w-4 h-4 text-blue-600 mx-auto mb-1 dark:text-blue-400" />
          <p className="text-xs font-medium text-gray-900 dark:text-white">Network</p>
          <p className="text-xs text-gray-600 dark:text-gray-300">Strong</p>
        </div>
        <div className="text-center p-2 bg-green-50 rounded-md dark:bg-gray-800">
          <Battery className="w-4 h-4 text-green-600 mx-auto mb-1 dark:text-green-400" />
          <p className="text-xs font-medium text-gray-900 dark:text-white">Power</p>
          <p className="text-xs text-gray-600 dark:text-gray-300">98%</p>
        </div>
        <div className="text-center p-2 bg-purple-50 rounded-md dark:bg-gray-800">
          <Thermometer className="w-4 h-4 text-purple-600 mx-auto mb-1 dark:text-purple-400" />
          <p className="text-xs font-medium text-gray-900 dark:text-white">Temp</p>
          <p className="text-xs text-gray-600 dark:text-gray-300">Optimal</p>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;