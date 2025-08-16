import React, { useState } from 'react';
import { Route, Navigation, Cloud, Wind, Clock, Zap } from 'lucide-react';

const RouteOptimization: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const routes = [
    {
      id: 'RT-001',
      from: 'Central Hospital',
      to: 'Emergency Center',
      drone: 'DR-001',
      distance: '12.5km',
      estimatedTime: '15 mins',
      optimizedTime: '11 mins',
      savings: '27%',
      weatherCondition: 'clear',
      trafficLevel: 'low',
      airspace: 'unrestricted'
    },
    {
      id: 'RT-002',
      from: 'Blood Bank',
      to: 'Regional Hospital',
      drone: 'DR-002',
      distance: '8.2km',
      estimatedTime: '12 mins',
      optimizedTime: '9 mins',
      savings: '25%',
      weatherCondition: 'light-rain',
      trafficLevel: 'moderate',
      airspace: 'restricted'
    },
    {
      id: 'RT-003',
      from: 'Pharmacy Hub',
      to: 'Community Clinic',
      drone: 'DR-003',
      distance: '6.8km',
      estimatedTime: '10 mins',
      optimizedTime: '8 mins',
      savings: '20%',
      weatherCondition: 'clear',
      trafficLevel: 'high',
      airspace: 'unrestricted'
    }
  ];

  const weatherIcons = {
    clear: '☀️',
    'light-rain': '🌦️',
    cloudy: '☁️',
    windy: '💨'
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'clear': return 'text-green-600';
      case 'light-rain': return 'text-yellow-600';
      case 'cloudy': return 'text-gray-600';
      case 'windy': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getTrafficColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getAirspaceColor = (status: string) => {
    return status === 'unrestricted' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Route Optimization</h1>
          <p className="text-gray-600">AI-powered route planning and optimization</p>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Optimize All Routes
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            Weather Update
          </button>
        </div>
      </div>

      {/* Optimization Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">23%</span>
          </div>
          <p className="text-sm text-gray-600">Avg Time Saved</p>
          <p className="text-xs text-green-600 mt-1">Through optimization</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Route className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">3</span>
          </div>
          <p className="text-sm text-gray-600">Active Routes</p>
          <p className="text-xs text-blue-600 mt-1">Being optimized</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Cloud className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Good</span>
          </div>
          <p className="text-sm text-gray-600">Weather Conditions</p>
          <p className="text-xs text-yellow-600 mt-1">Optimal for flights</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Navigation className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">98.7%</span>
          </div>
          <p className="text-sm text-gray-600">Route Accuracy</p>
          <p className="text-xs text-purple-600 mt-1">GPS precision</p>
        </div>
      </div>

      {/* Route Planning Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Optimized Routes</h2>
          <div className="space-y-4">
            {routes.map((route) => (
              <div 
                key={route.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedRoute === route.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedRoute(route.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Route className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{route.id}</h3>
                      <p className="text-sm text-gray-600">{route.drone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 line-through">{route.estimatedTime}</span>
                      <span className="text-sm font-medium text-green-600">{route.optimizedTime}</span>
                    </div>
                    <div className="text-xs text-green-600">-{route.savings} saved</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-600">Route</p>
                    <p className="text-sm font-medium text-gray-900">{route.from} → {route.to}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Distance</p>
                    <p className="text-sm font-medium text-gray-900">{route.distance}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className={`flex items-center ${getConditionColor(route.weatherCondition)}`}>
                      <span className="mr-1">{weatherIcons[route.weatherCondition as keyof typeof weatherIcons]}</span>
                      <span className="capitalize">{route.weatherCondition.replace('-', ' ')}</span>
                    </div>
                    <div className={`${getTrafficColor(route.trafficLevel)}`}>
                      Traffic: {route.trafficLevel}
                    </div>
                    <div className={`${getAirspaceColor(route.airspace)}`}>
                      {route.airspace}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Route Details & Optimization Panel */}
        <div className="space-y-6">
          {/* Real-time Conditions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Conditions</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Cloud className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Weather</span>
                </div>
                <span className="text-sm text-blue-600">Clear, 22°C</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Wind className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Wind</span>
                </div>
                <span className="text-sm text-green-600">5 km/h NE</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Navigation className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-900">Airspace</span>
                </div>
                <span className="text-sm text-yellow-600">Moderate</span>
              </div>
            </div>
          </div>

          {/* Route Optimization Results */}
          {selectedRoute && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Results</h3>
              {(() => {
                const route = routes.find(r => r.id === selectedRoute);
                if (!route) return null;
                
                return (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">Time Savings</span>
                        <span className="text-lg font-bold text-green-600">{route.savings}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Original: {route.estimatedTime} → Optimized: {route.optimizedTime}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Route Distance</span>
                        <span className="font-medium text-gray-900">{route.distance}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Weather Impact</span>
                        <span className="font-medium text-gray-900">Minimal</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Fuel Efficiency</span>
                        <span className="font-medium text-green-600">+15%</span>
                      </div>
                    </div>
                    
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Apply Optimization
                    </button>
                  </div>
                );
              })()}
            </div>
          )}

          {/* AI Recommendations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Route Efficiency</span>
                </div>
                <p className="text-xs text-gray-600">Consider altitude adjustment for RT-002 to avoid restricted airspace</p>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-900">Timing Optimization</span>
                </div>
                <p className="text-xs text-gray-600">Peak traffic window ending in 15 minutes - optimal launch time</p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Navigation className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Weather Window</span>
                </div>
                <p className="text-xs text-gray-600">Clear conditions for next 2 hours - ideal for all planned routes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteOptimization;