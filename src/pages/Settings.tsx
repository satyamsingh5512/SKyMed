import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Database, Wifi, Users, Save } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: {
      emergencyAlerts: true,
      systemUpdates: true,
      lowBattery: true,
      weatherWarnings: true,
      deliveryConfirmations: true
    },
    system: {
      autoOptimization: true,
      realTimeTracking: true,
      backupFrequency: '1hour',
      dataRetention: '90days',
      temperatureUnits: 'celsius'
    },
    security: {
      twoFactorAuth: true,
      encryptionLevel: 'high',
      accessLogging: true,
      sessionTimeout: '30min'
    },
    fleet: {
      maxFlightTime: '45min',
      batteryThreshold: '20%',
      maintenanceInterval: '200hours',
      emergencyLanding: true
    }
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const settingSections = [
    {
      title: 'Notifications',
      icon: Bell,
      category: 'notifications',
      items: [
        { key: 'emergencyAlerts', label: 'Emergency Alerts', type: 'toggle' },
        { key: 'systemUpdates', label: 'System Updates', type: 'toggle' },
        { key: 'lowBattery', label: 'Low Battery Warnings', type: 'toggle' },
        { key: 'weatherWarnings', label: 'Weather Warnings', type: 'toggle' },
        { key: 'deliveryConfirmations', label: 'Delivery Confirmations', type: 'toggle' }
      ]
    },
    {
      title: 'System Configuration',
      icon: Database,
      category: 'system',
      items: [
        { key: 'autoOptimization', label: 'Auto Route Optimization', type: 'toggle' },
        { key: 'realTimeTracking', label: 'Real-time Tracking', type: 'toggle' },
        { 
          key: 'backupFrequency', 
          label: 'Backup Frequency', 
          type: 'select',
          options: [
            { value: '15min', label: '15 Minutes' },
            { value: '1hour', label: '1 Hour' },
            { value: '6hours', label: '6 Hours' },
            { value: '24hours', label: '24 Hours' }
          ]
        },
        { 
          key: 'dataRetention', 
          label: 'Data Retention', 
          type: 'select',
          options: [
            { value: '30days', label: '30 Days' },
            { value: '90days', label: '90 Days' },
            { value: '1year', label: '1 Year' },
            { value: 'indefinite', label: 'Indefinite' }
          ]
        },
        { 
          key: 'temperatureUnits', 
          label: 'Temperature Units', 
          type: 'select',
          options: [
            { value: 'celsius', label: 'Celsius' },
            { value: 'fahrenheit', label: 'Fahrenheit' }
          ]
        }
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      category: 'security',
      items: [
        { key: 'twoFactorAuth', label: 'Two-Factor Authentication', type: 'toggle' },
        { key: 'accessLogging', label: 'Access Logging', type: 'toggle' },
        { 
          key: 'encryptionLevel', 
          label: 'Encryption Level', 
          type: 'select',
          options: [
            { value: 'standard', label: 'Standard' },
            { value: 'high', label: 'High' },
            { value: 'maximum', label: 'Maximum' }
          ]
        },
        { 
          key: 'sessionTimeout', 
          label: 'Session Timeout', 
          type: 'select',
          options: [
            { value: '15min', label: '15 Minutes' },
            { value: '30min', label: '30 Minutes' },
            { value: '1hour', label: '1 Hour' },
            { value: '4hours', label: '4 Hours' }
          ]
        }
      ]
    },
    {
      title: 'Fleet Management',
      icon: Users,
      category: 'fleet',
      items: [
        { key: 'emergencyLanding', label: 'Emergency Landing Protocol', type: 'toggle' },
        { key: 'maxFlightTime', label: 'Maximum Flight Time', type: 'input' },
        { key: 'batteryThreshold', label: 'Battery Warning Threshold', type: 'input' },
        { key: 'maintenanceInterval', label: 'Maintenance Interval', type: 'input' }
      ]
    }
  ];

  const handleSave = () => {
    // Save settings logic would go here
    console.log('Settings saved:', settings);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure system preferences and security options</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <Wifi className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
            <p className="text-sm text-gray-600">All systems operational</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Network Status</span>
              <span className="text-sm text-green-600">Online</span>
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Database</span>
              <span className="text-sm text-blue-600">Connected</span>
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">AI Systems</span>
              <span className="text-sm text-purple-600">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.category} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
              </div>
              
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">{item.label}</label>
                    
                    {item.type === 'toggle' && (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={settings[section.category as keyof typeof settings][item.key as keyof any]}
                          onChange={(e) => handleSettingChange(section.category, item.key, e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    )}
                    
                    {item.type === 'select' && (
                      <select
                        value={settings[section.category as keyof typeof settings][item.key as keyof any]}
                        onChange={(e) => handleSettingChange(section.category, item.key, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {item.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                    
                    {item.type === 'input' && (
                      <input
                        type="text"
                        value={settings[section.category as keyof typeof settings][item.key as keyof any]}
                        onChange={(e) => handleSettingChange(section.category, item.key, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Advanced Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-red-100 p-3 rounded-lg">
            <SettingsIcon className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Advanced Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-medium text-yellow-800 mb-2">System Reset</h3>
            <p className="text-sm text-yellow-700 mb-3">Reset all settings to default values. This action cannot be undone.</p>
            <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              Reset to Defaults
            </button>
          </div>
          
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-medium text-red-800 mb-2">Emergency Protocol</h3>
            <p className="text-sm text-red-700 mb-3">Activate emergency mode to ground all drones immediately.</p>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Activate Emergency Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;