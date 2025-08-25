import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Clock, X } from 'lucide-react';

const AlertPanel: React.FC = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 'ALT-001',
      type: 'critical',
      title: 'Low Battery Warning',
      description: 'Drone DR-003 battery level at 15%',
      time: '2 mins ago',
      status: 'active'
    },
    {
      id: 'ALT-002',
      type: 'warning',
      title: 'Weather Alert',
      description: 'High winds detected in Sector 7',
      time: '5 mins ago',
      status: 'active'
    },
    {
      id: 'ALT-003',
      type: 'info',
      title: 'Route Optimization',
      description: 'New fastest route calculated for DR-001',
      time: '8 mins ago',
      status: 'resolved'
    },
    {
      id: 'ALT-004',
      type: 'critical',
      title: 'Temperature Alert',
      description: 'Cargo temperature exceeded threshold in DR-005',
      time: '12 mins ago',
      status: 'active'
    },
    {
      id: 'ALT-005',
      type: 'info',
      title: 'System Update',
      description: 'Flight control system updated successfully',
      time: '15 mins ago',
      status: 'resolved'
    }
  ]);

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return XCircle;
      case 'warning': return AlertTriangle;
      case 'info': return CheckCircle;
      default: return Clock;
    }
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const resolvedAlerts = alerts.filter(alert => alert.status === 'resolved');

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">System Alerts</h2>
        <div className="flex items-center space-x-1">
          <span className="text-xs text-gray-500 dark:text-gray-300">Active:</span>
          <span className="text-xs font-medium text-red-600 dark:text-red-400">{activeAlerts.length}</span>
        </div>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {/* Active Alerts */}
        {activeAlerts.map((alert) => {
          const AlertIcon = getAlertIcon(alert.type);
          return (
            <div
              key={alert.id}
              className={`flex items-start space-x-2 p-2.5 rounded-md border ${getAlertColor(alert.type)} dark:bg-gray-800 dark:border-gray-700`}
            >
              <AlertIcon className="w-4 h-4 flex-shrink-0 mt-0.5 dark:text-white" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.title}</p>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-gray-600 mb-1 dark:text-gray-300">{alert.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-300">{alert.time}</span>
                  <span className="text-xs font-medium px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full dark:bg-red-900 dark:text-red-100">
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Resolved Alerts */}
        {resolvedAlerts.length > 0 && (
          <>
            <div className="border-t pt-3 mt-3 dark:border-gray-700">
              <h3 className="text-xs font-medium text-gray-700 mb-2 dark:text-gray-300">Recently Resolved</h3>
            </div>
            {resolvedAlerts.map((alert) => {
              const AlertIcon = getAlertIcon(alert.type);
              return (
                <div
                  key={alert.id}
                  className="flex items-start space-x-2 p-2.5 rounded-md bg-gray-50 border border-gray-200 opacity-75 dark:bg-gray-800 dark:border-gray-700"
                >
                  <AlertIcon className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400 dark:text-gray-300" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{alert.title}</p>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mb-1 dark:text-gray-300">{alert.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-300">{alert.time}</span>
                      <span className="text-xs font-medium px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full dark:bg-green-900 dark:text-green-100">
                        RESOLVED
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-6 text-gray-500 dark:text-gray-300">
          <CheckCircle className="w-6 h-6 mx-auto mb-1 dark:text-gray-300" />
          <p className="text-xs">No active alerts</p>
        </div>
      )}
    </div>
  );
};

export default AlertPanel;