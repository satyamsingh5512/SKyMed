import React, { useState } from 'react';
import { BarChart3, TrendingUp, Clock, Target, Calendar, Download } from 'lucide-react';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const deliveryData = [
    { month: 'Jan', deliveries: 245, success: 98.2, avgTime: 14.5 },
    { month: 'Feb', deliveries: 312, success: 97.8, avgTime: 13.2 },
    { month: 'Mar', deliveries: 298, success: 99.1, avgTime: 12.8 },
    { month: 'Apr', deliveries: 387, success: 98.7, avgTime: 11.9 },
    { month: 'May', deliveries: 423, success: 99.3, avgTime: 11.2 },
    { month: 'Jun', deliveries: 456, success: 98.9, avgTime: 10.8 }
  ];

  const performanceMetrics = [
    { label: 'Total Deliveries', value: '2,156', change: '+12.3%', trend: 'up' },
    { label: 'Success Rate', value: '98.7%', change: '+0.8%', trend: 'up' },
    { label: 'Avg Delivery Time', value: '11.2 min', change: '-23.1%', trend: 'down' },
    { label: 'Cost per Delivery', value: '₹3,980', change: '-8.5%', trend: 'down' }
  ];

  const dronePerformance = [
    { id: 'DR-001', flights: 287, success: 99.3, avgTime: 10.5, efficiency: 94.2 },
    { id: 'DR-002', flights: 251, success: 98.8, avgTime: 11.8, efficiency: 92.1 },
    { id: 'DR-003', flights: 198, success: 97.5, avgTime: 12.3, efficiency: 89.7 },
    { id: 'DR-004', flights: 342, success: 99.1, avgTime: 10.9, efficiency: 93.8 }
  ];

  const routeAnalytics = [
    { route: 'Central → General Hospital', frequency: 23, avgTime: 12.5, reliability: 98.9 },
    { route: 'Blood Bank → Emergency Center', frequency: 18, avgTime: 9.2, reliability: 99.4 },
    { route: 'Pharmacy → Community Clinic', frequency: 15, avgTime: 8.7, reliability: 97.8 },
    { route: 'Regional → Cardiac Center', frequency: 12, avgTime: 16.3, reliability: 98.2 }
  ];

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? '↗' : '↘';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Performance metrics and insights</p>
        </div>
        <div className="flex space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow border border-gray-200 p-4 dark:bg-gray-900 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-gray-600 dark:text-gray-300">{metric.label}</h3>
              <span className={`text-xs font-medium ${getTrendColor(metric.trend)} dark:text-white`}>
                {getTrendIcon(metric.trend)} {metric.change}
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Delivery Volume Chart */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Delivery Volume</h2>
            <BarChart3 className="w-4 h-4 text-gray-500 dark:text-gray-300" />
          </div>
          <div className="h-48">
            <div className="flex items-end justify-between h-full space-x-1">
              {deliveryData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gray-200 rounded-t-md relative dark:bg-gray-700" style={{ height: '100%' }}>
                    <div
                      className="w-full bg-blue-500 rounded-t-md absolute bottom-0 transition-all duration-1000"
                      style={{ height: `${(data.deliveries / 500) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-1.5 text-center">
                    <p className="text-xs font-medium text-gray-900 dark:text-white">{data.deliveries}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-300">{data.month}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Success Rate Trend */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Success Rate Trend</h2>
            <TrendingUp className="w-4 h-4 text-gray-500 dark:text-gray-300" />
          </div>
          <div className="h-48">
            <div className="flex items-end justify-between h-full space-x-1">
              {deliveryData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gray-200 rounded-t-md relative dark:bg-gray-700" style={{ height: '100%' }}>
                    <div
                      className="w-full bg-green-500 rounded-t-md absolute bottom-0 transition-all duration-1000"
                      style={{ height: `${((data.success - 95) / 5) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-1.5 text-center">
                    <p className="text-xs font-medium text-gray-900 dark:text-white">{data.success}%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-300">{data.month}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Drone Performance */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 dark:bg-gray-900 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 mb-3 dark:text-white">Drone Performance</h2>
          <div className="space-y-3">
            {dronePerformance.map((drone) => (
              <div key={drone.id} className="p-3 bg-gray-50 rounded-md dark:bg-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">{drone.id}</h3>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{drone.efficiency}% Efficiency</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Flights</p>
                    <p className="font-medium text-gray-900 dark:text-white">{drone.flights}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Success</p>
                    <p className="font-medium text-gray-900 dark:text-white">{drone.success}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Avg Time</p>
                    <p className="font-medium text-gray-900 dark:text-white">{drone.avgTime} min</p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000"
                      style={{ width: `${drone.efficiency}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Route Analytics */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 dark:bg-gray-900 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 mb-3 dark:text-white">Route Analytics</h2>
          <div className="space-y-3">
            {routeAnalytics.map((route, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-md dark:bg-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">{route.route}</h3>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">{route.reliability}% Reliable</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Frequency</p>
                    <p className="font-medium text-gray-900 dark:text-white">{route.frequency} flights/week</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Avg Time</p>
                    <p className="font-medium text-gray-900 dark:text-white">{route.avgTime} min</p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                    <div
                      className="bg-green-500 h-1.5 rounded-full transition-all duration-1000"
                      style={{ width: `${route.reliability}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Insights */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4 dark:bg-gray-900 dark:border-gray-800">
        <h2 className="text-sm font-semibold text-gray-900 mb-3 dark:text-white">Operational Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="p-3 bg-blue-50 rounded-md dark:bg-blue-900">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Peak Hours</h3>
            </div>
            <p className="text-xs text-gray-600 mb-1.5 dark:text-gray-300">Highest delivery demand occurs between 2-4 PM</p>
            <p className="text-xs text-blue-600 dark:text-blue-300">Recommendation: Pre-position drones during this window</p>
          </div>
          
          <div className="p-3 bg-green-50 rounded-md dark:bg-green-900">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Efficiency Gains</h3>
            </div>
            <p className="text-xs text-gray-600 mb-1.5 dark:text-gray-300">23% improvement in delivery times this month</p>
            <p className="text-xs text-green-600 dark:text-green-300">Route optimization AI is performing well</p>
          </div>
          
          <div className="p-3 bg-yellow-50 rounded-md dark:bg-yellow-900">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Maintenance Schedule</h3>
            </div>
            <p className="text-xs text-gray-600 mb-1.5 dark:text-gray-300">DR-003 due for scheduled maintenance</p>
            <p className="text-xs text-yellow-600 dark:text-yellow-300">Schedule for off-peak hours to minimize impact</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;