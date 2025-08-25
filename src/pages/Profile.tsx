import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Bell, Shield, CreditCard, Save } from 'lucide-react';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState({
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, Downtown, City 12345',
    emergencyContact: 'Jane Smith - +1 (555) 987-6543',
    notifications: {
      sms: true,
      email: true,
      push: true
    },
    preferences: {
      defaultUrgency: 'high',
      autoFillAddress: true,
      savePayment: true
    }
  });

  const [activeTab, setActiveTab] = useState('personal');

  const handleInputChange = (field: string, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (category: string, field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const deliveryHistory = [
    { id: 'SP-001', date: '2024-01-15', type: 'Medical Supplies', status: 'Delivered', cost: '₹5,580' },
    { id: 'SP-002', date: '2024-01-12', type: 'Blood Sample', status: 'Delivered', cost: '₹7,410' },
    { id: 'SP-003', date: '2024-01-08', type: 'Emergency Kit', status: 'Delivered', cost: '₹3,750' },
    { id: 'SP-004', date: '2024-01-05', type: 'Medication', status: 'Delivered', cost: '₹2,410' }
  ];

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'history', label: 'History', icon: MapPin }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-black dark:border-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">Profile Settings</h1>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6 dark:border-gray-700">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 dark:text-white" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Personal Information */}
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Phone Number</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Emergency Contact</label>
                <input
                  type="text"
                  value={profile.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Default Address</label>
              <textarea
                value={profile.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                rows={3}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Default Urgency Level</label>
                  <select
                    value={profile.preferences.defaultUrgency}
                    onChange={(e) => handleNestedChange('preferences', 'defaultUrgency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  >
                    <option value="standard">Standard</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-fill address</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={profile.preferences.autoFillAddress}
                      onChange={(e) => handleNestedChange('preferences', 'autoFillAddress', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notification Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:bg-gray-900">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">SMS Notifications</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Receive delivery updates via text message</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={profile.notifications.sms}
                    onChange={(e) => handleNestedChange('notifications', 'sms', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:bg-gray-900">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Receive delivery confirmations and receipts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={profile.notifications.email}
                    onChange={(e) => handleNestedChange('notifications', 'email', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:bg-gray-900">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Push Notifications</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Real-time updates on your device</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={profile.notifications.push}
                    onChange={(e) => handleNestedChange('notifications', 'push', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Payment */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Payment Methods</h3>
            
            <div className="border border-gray-200 rounded-lg p-4 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">VISA</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">•••• •••• •••• 4242</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Expires 12/25</p>
                  </div>
                </div>
                <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded dark:bg-green-900 dark:text-green-300">Default</span>
              </div>
            </div>

            <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-gray-200">
              + Add New Payment Method
            </button>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 dark:bg-yellow-900 dark:border-yellow-800">
              <h4 className="font-medium text-yellow-800 mb-2 dark:text-yellow-200">Emergency Payment</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                In critical situations, we can process payments after delivery to ensure no delays in emergency medical transport.
              </p>
            </div>
          </div>
        )}

        {/* History */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Delivery History</h3>
            
            <div className="space-y-4">
              {deliveryHistory.map((delivery) => (
                <div key={delivery.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:bg-gray-900">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-2 rounded-lg dark:bg-green-900">
                      <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{delivery.type}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{delivery.id} • {delivery.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">{delivery.cost}</p>
                    <p className="text-sm text-green-600 dark:text-green-400">{delivery.status}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                Load More
              </button>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
          <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;