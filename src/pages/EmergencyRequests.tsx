import React, { useState } from 'react';
import { AlertTriangle, Clock, MapPin, Phone, Plus, Filter } from 'lucide-react';

const EmergencyRequests: React.FC = () => {
  const [requests, setRequests] = useState([
    {
      id: 'ER-001',
      priority: 'critical',
      type: 'Organ Transport',
      item: 'Heart for transplant',
      from: 'Regional Hospital',
      to: 'Cardiac Center',
      requestTime: '2 mins ago',
      estimatedDelivery: '18 mins',
      status: 'dispatched',
      distance: '12.5km',
      requester: 'Dr. Sarah Johnson',
      phone: '+1 (555) 123-4567'
    },
    {
      id: 'ER-002',
      priority: 'high',
      type: 'Blood Products',
      item: 'O- Blood (4 units)',
      from: 'Blood Bank Central',
      to: 'Emergency Room',
      requestTime: '8 mins ago',
      estimatedDelivery: '15 mins',
      status: 'in-transit',
      distance: '8.2km',
      requester: 'Dr. Michael Chen',
      phone: '+1 (555) 987-6543'
    },
    {
      id: 'ER-003',
      priority: 'medium',
      type: 'Medication',
      item: 'Emergency Insulin',
      from: 'Pharmacy Hub',
      to: 'Community Hospital',
      requestTime: '15 mins ago',
      estimatedDelivery: '12 mins',
      status: 'pending',
      distance: '6.8km',
      requester: 'Nurse Lisa Rodriguez',
      phone: '+1 (555) 456-7890'
    },
    {
      id: 'ER-004',
      priority: 'high',
      type: 'Antidote',
      item: 'Snake Antivenom',
      from: 'Poison Control Center',
      to: 'Rural Clinic',
      requestTime: '22 mins ago',
      estimatedDelivery: '8 mins',
      status: 'delivered',
      distance: '15.3km',
      requester: 'Dr. James Wilson',
      phone: '+1 (555) 234-5678'
    }
  ]);

  const [showNewRequest, setShowNewRequest] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-300';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'low': return 'text-green-700 bg-green-100 border-green-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'dispatched': return 'text-blue-700 bg-blue-100';
      case 'in-transit': return 'text-purple-700 bg-purple-100';
      case 'pending': return 'text-yellow-700 bg-yellow-100';
      case 'delivered': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emergency Requests</h1>
          <p className="text-gray-600">Manage critical medical delivery requests</p>
        </div>
        <div className="flex space-x-4">
          <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button 
            onClick={() => setShowNewRequest(true)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Emergency Request
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">2</span>
          </div>
          <p className="text-sm text-gray-600">Critical Requests</p>
          <p className="text-xs text-red-600 mt-1">Immediate attention</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">12.5</span>
          </div>
          <p className="text-sm text-gray-600">Avg Response Time</p>
          <p className="text-xs text-blue-600 mt-1">minutes</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">3</span>
          </div>
          <p className="text-sm text-gray-600">Active Deliveries</p>
          <p className="text-xs text-green-600 mt-1">In progress</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Phone className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">98.4%</span>
          </div>
          <p className="text-sm text-gray-600">Success Rate</p>
          <p className="text-xs text-purple-600 mt-1">Last 30 days</p>
        </div>
      </div>

      {/* Emergency Requests List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Active Emergency Requests</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {requests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{request.id}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                          {request.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{request.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{request.item}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-gray-600">From: {request.from}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-gray-600">To: {request.to}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600">Distance: {request.distance}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Request Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Requester: </span>
                        <span className="font-medium text-gray-900">{request.requester}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone: </span>
                        <span className="font-medium text-gray-900">{request.phone}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Request Time: </span>
                        <span className="font-medium text-gray-900">{request.requestTime}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">ETA: </span>
                        <span className="font-medium text-gray-900">{request.estimatedDelivery}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Requested {request.requestTime}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Track
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Request Modal */}
      {showNewRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">New Emergency Request</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Blood Products</option>
                    <option>Organ Transport</option>
                    <option>Medication</option>
                    <option>Antidote</option>
                    <option>Vaccine</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Description</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Heart for transplant, O- Blood (4 units)"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Hospital or facility name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Destination hospital or facility"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requester Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Dr. Name or Nurse Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input 
                    type="tel" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button 
                onClick={() => setShowNewRequest(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowNewRequest(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Submit Emergency Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyRequests;