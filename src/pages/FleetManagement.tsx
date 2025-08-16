import React, { useState } from 'react';
import { Plane, Battery, MapPin, Settings, Play, Pause, RotateCcw } from 'lucide-react';

const FleetManagement: React.FC = () => {
  const [drones, setDrones] = useState([
    {
      id: 'DR-001',
      model: 'SkyMed Pro X1',
      status: 'active',
      battery: 87,
      location: 'Downtown Medical',
      lastMaintenance: '2024-01-15',
      flightHours: 342,
      cargo: 'Blood Type A+',
      range: '25km',
      maxPayload: '15kg'
    },
    {
      id: 'DR-002',
      model: 'SkyMed Pro X1',
      status: 'charging',
      battery: 45,
      location: 'Base Station Alpha',
      lastMaintenance: '2024-01-12',
      flightHours: 289,
      cargo: 'None',
      range: '25km',
      maxPayload: '15kg'
    },
    {
      id: 'DR-003',
      model: 'SkyMed Heavy X2',
      status: 'maintenance',
      battery: 0,
      location: 'Maintenance Bay',
      lastMaintenance: '2024-01-18',
      flightHours: 567,
      cargo: 'None',
      range: '40km',
      maxPayload: '25kg'
    },
    {
      id: 'DR-004',
      model: 'SkyMed Lite L1',
      status: 'standby',
      battery: 100,
      location: 'Base Station Beta',
      lastMaintenance: '2024-01-10',
      flightHours: 123,
      cargo: 'None',
      range: '15km',
      maxPayload: '8kg'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-700 bg-green-100';
      case 'charging': return 'text-blue-700 bg-blue-100';
      case 'maintenance': return 'text-red-700 bg-red-100';
      case 'standby': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 50) return 'text-green-600';
    if (battery > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fleet Management</h1>
          <p className="text-gray-600">Monitor and control autonomous delivery drones</p>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Deploy New Drone
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            Maintenance Schedule
          </button>
        </div>
      </div>

      {/* Fleet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Plane className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">4</span>
          </div>
          <p className="text-sm text-gray-600">Total Drones</p>
          <p className="text-xs text-green-600 mt-1">All systems operational</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Play className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">1</span>
          </div>
          <p className="text-sm text-gray-600">Active Missions</p>
          <p className="text-xs text-blue-600 mt-1">25% capacity</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Battery className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">58%</span>
          </div>
          <p className="text-sm text-gray-600">Avg Battery</p>
          <p className="text-xs text-yellow-600 mt-1">Good condition</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">1</span>
          </div>
          <p className="text-sm text-gray-600">In Maintenance</p>
          <p className="text-xs text-purple-600 mt-1">Scheduled service</p>
        </div>
      </div>

      {/* Drone List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Active Fleet</h2>
        </div>
        <div className="p-6">
          <div className="grid gap-6">
            {drones.map((drone) => (
              <div key={drone.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Plane className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{drone.id}</h3>
                      <p className="text-sm text-gray-600">{drone.model}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(drone.status)}`}>
                      {drone.status.charAt(0).toUpperCase() + drone.status.slice(1)}
                    </span>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg">
                        <Pause className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Battery</span>
                      <span className={`text-sm font-medium ${getBatteryColor(drone.battery)}`}>
                        {drone.battery}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${drone.battery > 50 ? 'bg-green-500' : drone.battery > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${drone.battery}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{drone.location}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Flight Hours</p>
                    <p className="text-sm font-medium text-gray-900">{drone.flightHours}h</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current Cargo</p>
                    <p className="text-sm font-medium text-gray-900">{drone.cargo}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Range: </span>
                      <span className="font-medium text-gray-900">{drone.range}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Max Payload: </span>
                      <span className="font-medium text-gray-900">{drone.maxPayload}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Last Maintenance: </span>
                      <span className="font-medium text-gray-900">{drone.lastMaintenance}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetManagement;