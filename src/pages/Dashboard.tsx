import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Plane, 
  Clock, 
  MapPin, 
  Thermometer, 
  AlertTriangle,
  TrendingUp,
  Users,
  Package,
  Zap
} from 'lucide-react';
import StatCard from '../components/StatCard';
import LiveMap from '../components/LiveMap';
import RecentDeliveries from '../components/RecentDeliveries';
import SystemStatus from '../components/SystemStatus';
import AlertPanel from '../components/AlertPanel';

const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      title: 'Active Drones',
      value: '24',
      change: '+2',
      icon: Plane,
      color: 'blue'
    },
    {
      title: 'Avg Delivery Time',
      value: '12.5min',
      change: '-23%',
      icon: Clock,
      color: 'green'
    },
    {
      title: 'Success Rate',
      value: '98.4%',
      change: '+0.8%',
      icon: TrendingUp,
      color: 'emerald'
    },
    {
      title: 'Critical Deliveries',
      value: '156',
      change: '+12',
      icon: AlertTriangle,
      color: 'red'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mission Control Dashboard</h1>
          <p className="text-gray-600">Real-time emergency response network monitoring</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Current Time</p>
          <p className="text-lg font-mono text-gray-900">{currentTime.toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Map */}
        <div className="lg:col-span-1">
          <LiveMap />
        </div>

        {/* System Status */}
        <div className="lg:col-span-1">
          <SystemStatus />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Deliveries */}
        <RecentDeliveries />

        {/* Alert Panel */}
        <AlertPanel />
      </div>
    </div>
  );
};

export default Dashboard;