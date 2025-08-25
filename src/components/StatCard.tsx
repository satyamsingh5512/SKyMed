import React from 'react';
import { Divide as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-50',
    green: 'bg-green-500 text-green-50',
    emerald: 'bg-emerald-500 text-emerald-50',
    red: 'bg-red-500 text-red-50',
    yellow: 'bg-yellow-500 text-yellow-50',
    purple: 'bg-purple-500 text-purple-50'
  };

  const changeColor = change.startsWith('+') ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4 hover:shadow-md transition-shadow dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-md ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`text-xs font-medium ${changeColor} dark:text-white`}>{change}</span>
      </div>
      <div>
        <p className="text-xl font-bold text-gray-900 mb-1 dark:text-white">{value}</p>
        <p className="text-xs text-gray-600 dark:text-gray-300">{title}</p>
      </div>
    </div>
  );
};

export default StatCard;