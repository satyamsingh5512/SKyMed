import React, { useState } from 'react';
import { MapPin, Package, Clock, AlertTriangle, CheckCircle, User, Phone } from 'lucide-react';

const SendParcel: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    parcelType: '',
    urgencyLevel: '',
    description: '',
    weight: '',
    fromAddress: '',
    toAddress: '',
    recipientName: '',
    recipientPhone: '',
    senderName: '',
    senderPhone: '',
    specialInstructions: ''
  });

  const parcelTypes = [
    { id: 'medical', label: 'Medical Supplies', icon: '🏥', description: 'Medications, medical devices' },
    { id: 'blood', label: 'Blood Products', icon: '🩸', description: 'Blood samples, plasma' },
    { id: 'organ', label: 'Organ Transport', icon: '❤️', description: 'Critical organ delivery' },
    { id: 'emergency', label: 'Emergency Kit', icon: '🚨', description: 'First aid, emergency supplies' },
    { id: 'documents', label: 'Medical Documents', icon: '📋', description: 'Test results, prescriptions' },
    { id: 'other', label: 'Other Urgent', icon: '📦', description: 'Other time-sensitive items' }
  ];

  const urgencyLevels = [
    { id: 'critical', label: 'Critical', color: 'red', time: '5-10 mins', description: 'Life-threatening emergency' },
    { id: 'high', label: 'High', color: 'orange', time: '10-20 mins', description: 'Urgent medical need' },
    { id: 'medium', label: 'Medium', color: 'yellow', time: '20-45 mins', description: 'Important but not critical' },
    { id: 'standard', label: 'Standard', color: 'green', time: '45-90 mins', description: 'Regular priority' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Simulate submission
    setStep(4);
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'critical': return 'border-red-500 bg-red-50 text-red-700';
      case 'high': return 'border-orange-500 bg-orange-50 text-orange-700';
      case 'medium': return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      case 'standard': return 'border-green-500 bg-green-50 text-green-700';
      default: return 'border-gray-300 bg-white text-gray-700';
    }
  };

  if (step === 4) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Parcel Request Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your emergency delivery request has been received and is being processed. 
            A drone will be dispatched shortly.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-blue-900">Tracking ID:</span>
              <span className="font-mono text-blue-700">SP-{Date.now().toString().slice(-6)}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-blue-900">Estimated Delivery:</span>
              <span className="text-blue-700">
                {urgencyLevels.find(u => u.id === formData.urgencyLevel)?.time || '15-30 mins'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-blue-900">Status:</span>
              <span className="text-blue-700">Drone Dispatching</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => window.location.href = '/track'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Track Your Parcel
            </button>
            <button 
              onClick={() => {setStep(1); setFormData({} as any);}}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Send Another Parcel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {stepNum}
              </div>
              {stepNum < 3 && (
                <div className={`w-24 h-1 mx-4 ${
                  step > stepNum ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Parcel Details</span>
          <span>Delivery Info</span>
          <span>Review & Send</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Step 1: Parcel Details */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What are you sending?</h2>
            
            {/* Parcel Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Parcel Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parcelTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleInputChange('parcelType', type.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      formData.parcelType === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{type.icon}</span>
                      <span className="font-medium text-gray-900">{type.label}</span>
                    </div>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Urgency Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Urgency Level</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {urgencyLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => handleInputChange('urgencyLevel', level.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      formData.urgencyLevel === level.id
                        ? getUrgencyColor(level.id)
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{level.label}</span>
                      <span className="text-sm font-medium">{level.time}</span>
                    </div>
                    <p className="text-sm">{level.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Description and Weight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe what you're sending..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Approximate Weight</label>
                <select
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select weight range</option>
                  <option value="under-1kg">Under 1kg</option>
                  <option value="1-5kg">1-5kg</option>
                  <option value="5-10kg">5-10kg</option>
                  <option value="10-15kg">10-15kg (Max)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!formData.parcelType || !formData.urgencyLevel}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Next: Delivery Details
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Delivery Information */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Where should we deliver?</h2>
            
            {/* Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Pickup Address
                </label>
                <textarea
                  value={formData.fromAddress}
                  onChange={(e) => handleInputChange('fromAddress', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter pickup address..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Delivery Address
                </label>
                <textarea
                  value={formData.toAddress}
                  onChange={(e) => handleInputChange('toAddress', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter delivery address..."
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Sender Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={formData.senderName}
                    onChange={(e) => handleInputChange('senderName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Phone</label>
                  <input
                    type="tel"
                    value={formData.senderPhone}
                    onChange={(e) => handleInputChange('senderPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Recipient Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name</label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) => handleInputChange('recipientName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Recipient's full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Phone</label>
                  <input
                    type="tel"
                    value={formData.recipientPhone}
                    onChange={(e) => handleInputChange('recipientPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 987-6543"
                  />
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions (Optional)</label>
              <textarea
                value={formData.specialInstructions}
                onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Any special handling instructions..."
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.fromAddress || !formData.toAddress || !formData.recipientName || !formData.recipientPhone}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Review Order
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review and Confirm */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Request</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Parcel Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Parcel Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">
                      {parcelTypes.find(t => t.id === formData.parcelType)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Urgency:</span>
                    <span className={`font-medium ${
                      formData.urgencyLevel === 'critical' ? 'text-red-600' :
                      formData.urgencyLevel === 'high' ? 'text-orange-600' :
                      formData.urgencyLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {urgencyLevels.find(u => u.id === formData.urgencyLevel)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{formData.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ETA:</span>
                    <span className="font-medium text-blue-600">
                      {urgencyLevels.find(u => u.id === formData.urgencyLevel)?.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Delivery Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">From:</span>
                    <p className="font-medium">{formData.fromAddress}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">To:</span>
                    <p className="font-medium">{formData.toAddress}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Recipient:</span>
                    <p className="font-medium">{formData.recipientName}</p>
                    <p className="text-gray-600">{formData.recipientPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Estimate */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-blue-900">Estimated Cost:</span>
                <span className="text-2xl font-bold text-blue-700">
                  ${formData.urgencyLevel === 'critical' ? '89' : 
                    formData.urgencyLevel === 'high' ? '67' :
                    formData.urgencyLevel === 'medium' ? '45' : '29'}
                </span>
              </div>
              <p className="text-sm text-blue-700">
                Emergency delivery pricing includes drone dispatch, real-time tracking, and 24/7 support.
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Send Emergency Parcel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendParcel;