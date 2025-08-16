import React, { useState, useEffect } from 'react';
import { MapPin, Plane, Navigation, Thermometer } from 'lucide-react';

const LiveMap: React.FC = () => {
  const [selectedDrone, setSelectedDrone] = useState<string | null>(null);
  const [drones, setDrones] = useState([
    { id: 'DR-001', status: 'active', location: { x: 25, y: 30 }, cargo: 'Blood Type O+', temp: '4.2°C' },
    { id: 'DR-002', status: 'returning', location: { x: 60, y: 45 }, cargo: 'Insulin', temp: '2.8°C' },
    { id: 'DR-003', status: 'active', location: { x: 80, y: 20 }, cargo: 'Heart (Critical)', temp: '4.0°C' },
    { id: 'DR-004', status: 'standby', location: { x: 15, y: 70 }, cargo: 'Vaccines', temp: '3.1°C' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDrones(prev => prev.map(drone => ({
        ...drone,
        location: {
          x: Math.max(5, Math.min(95, drone.location.x + (Math.random() - 0.5) * 4)),
          y: Math.max(5, Math.min(95, drone.location.y + (Math.random() - 0.5) * 4))
        }
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const statusColors = {
    active: 'bg-green-500',
    returning: 'bg-blue-500',
    standby: 'bg-gray-500'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Live Fleet Tracking</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live</span>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Map Background */}
        <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-gray-200 relative overflow-hidden">
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(to right, #000 1px, transparent 1px),
                linear-gradient(to bottom, #000 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}></div>
          </div>

          {/* Hospitals */}
          <div className="absolute top-4 left-4 p-2 bg-white rounded-lg shadow-sm">
            <MapPin className="w-5 h-5 text-red-500" />
            <span className="text-xs text-gray-600 ml-1">General Hospital</span>
          </div>
          <div className="absolute bottom-4 right-4 p-2 bg-white rounded-lg shadow-sm">
            <MapPin className="w-5 h-5 text-red-500" />
            <span className="text-xs text-gray-600 ml-1">Emergency Center</span>
          </div>

          {/* Drones */}
          {drones.map((drone) => (
            <div
              key={drone.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                selectedDrone === drone.id ? 'z-10' : ''
              }`}
              style={{
                left: `${drone.location.x}%`,
                top: `${drone.location.y}%`
              }}
              onClick={() => setSelectedDrone(selectedDrone === drone.id ? null : drone.id)}
            >
              <div className={`relative p-3 rounded-full ${statusColors[drone.status as keyof typeof statusColors]} shadow-lg hover:shadow-xl transition-all`}>
                <Plane className="w-5 h-5 text-white" />
                {drone.status === 'active' && (
                  <div className="absolute inset-0 rounded-full border-2 border-white animate-ping"></div>
                )}
              </div>
              
              {selectedDrone === drone.id && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white p-3 rounded-lg shadow-lg border min-w-48">
                  <div className="text-sm font-medium text-gray-900 mb-2">{drone.id}</div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center">
                      <Navigation className="w-3 h-3 mr-1" />
                      Status: {drone.status}
                    </div>
                    <div className="flex items-center">
                      <Thermometer className="w-3 h-3 mr-1" />
                      Temp: {drone.temp}
                    </div>
                    <div>Cargo: {drone.cargo}</div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Flight Paths */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {drones.filter(d => d.status === 'active').map((drone, index) => (
              <path
                key={drone.id}
                d={`M${drone.location.x * 4}% ${drone.location.y * 4}% L${(drone.location.x + 20) * 4}% ${(drone.location.y + 10) * 4}%`}
                stroke="#3B82F6"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.6"
                className="animate-pulse"
              />
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Active Delivery</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Returning</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Standby</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;