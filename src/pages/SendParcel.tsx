import React, { useState } from 'react';
import { MapPin, Package, Clock, AlertTriangle, CheckCircle, User, Phone } from 'lucide-react';
import { useDeliveries } from '../hooks/useDeliveries';
import { useAuth } from '../contexts/AuthContext';

const SendParcel: React.FC = () => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const { createDelivery } = useDeliveries();
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

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Test connection first
      const { testSupabaseConnection } = await import('../utils/testConnection');
      const connectionTest = await testSupabaseConnection();
      
      if (!connectionTest.success) {
        throw new Error(`Database connection failed: ${connectionTest.error}`);
      }

      // Import supabase
      const { supabase } = await import('../lib/supabase');

      // Get current authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('You must be logged in to send a parcel');
      }

      // Ensure user profile exists in our users table
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // User profile doesn't exist, create it
        const { error: createProfileError } = await supabase
          .from('users')
          .insert([{
            id: user.id,
            email: user.email || '',
            full_name: formData.senderName || user.user_metadata?.full_name || 'User',
            phone: formData.senderPhone || user.user_metadata?.phone || '',
            address: formData.fromAddress || user.user_metadata?.address || '',
            user_type: 'user'
          }]);

        if (createProfileError) {
          console.error('Failed to create user profile:', createProfileError);
          throw new Error(`Failed to create user profile: ${createProfileError.message}`);
        }
      } else if (profileError) {
        throw new Error(`Profile lookup error: ${profileError.message}`);
      }

      const userId = user.id;

      // Map form data to database format
      const deliveryData = {
        user_id: userId,
        recipient_name: formData.recipientName,
        recipient_phone: formData.recipientPhone,
        pickup_address: formData.fromAddress,
        delivery_address: formData.toAddress,
        package_type: parcelTypes.find(t => t.id === formData.parcelType)?.label || formData.parcelType,
        weight: getWeightValue(formData.weight),
        priority: mapUrgencyToPriority(formData.urgencyLevel),
        status: 'pending' as const,
        estimated_delivery: getEstimatedDelivery(formData.urgencyLevel),
        cost: getCostEstimate(formData.urgencyLevel)
      };

      console.log('Attempting to create delivery:', deliveryData);

      // Create delivery in database
      const newDelivery = await createDelivery(deliveryData);
      
      // Generate tracking ID
      const generatedTrackingId = `SP-${newDelivery.id.slice(-6).toUpperCase()}`;
      setTrackingId(generatedTrackingId);
      
      setStep(4);
    } catch (error) {
      console.error('Failed to create delivery:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to submit delivery request: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getWeightValue = (weightRange: string): number => {
    switch (weightRange) {
      case 'under-1kg': return 0.5;
      case '1-5kg': return 3;
      case '5-10kg': return 7.5;
      case '10-15kg': return 12.5;
      default: return 1;
    }
  };

  const mapUrgencyToPriority = (urgency: string): 'low' | 'medium' | 'high' | 'emergency' => {
    switch (urgency) {
      case 'critical': return 'emergency';
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'standard': return 'low';
      default: return 'medium';
    }
  };

  const getEstimatedDelivery = (urgency: string): string => {
    const now = new Date();
    const minutes = urgency === 'critical' ? 10 : 
                   urgency === 'high' ? 20 : 
                   urgency === 'medium' ? 35 : 60;
    now.setMinutes(now.getMinutes() + minutes);
    return now.toISOString();
  };

  const getCostEstimate = (urgency: string): number => {
    switch (urgency) {
      case 'critical': return 7410;
      case 'high': return 5580;
      case 'medium': return 3750;
      case 'standard': return 2410;
      default: return 2410;
    }
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
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 text-center dark:bg-gray-900 dark:border-gray-800">
          <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 dark:bg-green-900">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3 dark:text-white">Parcel Request Submitted!</h2>
          <p className="text-gray-600 mb-4 text-sm dark:text-gray-300">
            Your emergency delivery request has been received and is being processed.
            A drone will be dispatched shortly.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 dark:bg-blue-900 dark:border-blue-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Tracking ID:</span>
              <span className="text-sm font-mono text-blue-700 dark:text-blue-300">{trackingId}</span>
            </div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Estimated Delivery:</span>
              <span className="text-sm text-blue-700 dark:text-blue-300">
                {urgencyLevels.find(u => u.id === formData.urgencyLevel)?.time || '15-30 mins'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Status:</span>
              <span className="text-sm text-blue-700 dark:text-blue-300">Drone Dispatching</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => window.location.href = '/track'}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Track Your Parcel
            </button>
            <button
              onClick={() => {setStep(1); setFormData({} as any);}}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
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
                step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {stepNum}
              </div>
              {stepNum < 3 && (
                <div className={`w-24 h-1 mx-4 ${
                  step > stepNum ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>Parcel Details</span>
          <span>Delivery Info</span>
          <span>Review & Send</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-4 dark:bg-gray-900 dark:border-gray-800">
        {/* Step 1: Parcel Details */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4 dark:text-white">What are you sending?</h2>
            
            {/* Parcel Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Parcel Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {parcelTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleInputChange('parcelType', type.id)}
                    className={`p-3 border-2 rounded-md text-left transition-colors ${
                      formData.parcelType === type.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400'
                        : 'border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600 dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1.5">
                      <span className="text-xl">{type.icon}</span>
                      <span className="font-medium text-gray-900 text-sm dark:text-white">{type.label}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Urgency Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Urgency Level</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {urgencyLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => handleInputChange('urgencyLevel', level.id)}
                    className={`p-3 border-2 rounded-md text-left transition-colors ${
                      formData.urgencyLevel === level.id
                        ? getUrgencyColor(level.id)
                        : 'border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600 dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-medium text-sm dark:text-white">{level.label}</span>
                      <span className="text-xs font-medium dark:text-white">{level.time}</span>
                    </div>
                    <p className="text-xs dark:text-gray-300">{level.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Description and Weight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Describe what you're sending..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Approximate Weight</label>
                <select
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors dark:bg-blue-700 dark:hover:bg-blue-800 dark:disabled:bg-gray-700"
              >
                Next: Delivery Details
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Delivery Information */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">Where should we deliver?</h2>
            
            {/* Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                  <MapPin className="w-4 h-4 inline mr-1 dark:text-gray-300" />
                  Pickup Address
                </label>
                <textarea
                  value={formData.fromAddress}
                  onChange={(e) => handleInputChange('fromAddress', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Enter pickup address..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                  <MapPin className="w-4 h-4 inline mr-1 dark:text-gray-300" />
                  Delivery Address
                </label>
                <textarea
                  value={formData.toAddress}
                  onChange={(e) => handleInputChange('toAddress', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Enter delivery address..."
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-white">Sender Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Your Name</label>
                  <input
                    type="text"
                    value={formData.senderName}
                    onChange={(e) => handleInputChange('senderName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Your Phone</label>
                  <input
                    type="tel"
                    value={formData.senderPhone}
                    onChange={(e) => handleInputChange('senderPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-white">Recipient Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Recipient Name</label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) => handleInputChange('recipientName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    placeholder="Recipient's full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Recipient Phone</label>
                  <input
                    type="tel"
                    value={formData.recipientPhone}
                    onChange={(e) => handleInputChange('recipientPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    placeholder="+1 (555) 987-6543"
                  />
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Special Instructions (Optional)</label>
              <textarea
                value={formData.specialInstructions}
                onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                rows={3}
                placeholder="Any special handling instructions..."
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.fromAddress || !formData.toAddress || !formData.recipientName || !formData.recipientPhone}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors dark:bg-blue-700 dark:hover:bg-blue-800 dark:disabled:bg-gray-700"
              >
                Review Order
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review and Confirm */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">Review Your Request</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Parcel Details */}
              <div className="bg-gray-50 rounded-lg p-4 dark:bg-gray-900">
                <h3 className="font-medium text-gray-900 mb-3 dark:text-white">Parcel Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Type:</span>
                    <span className="font-medium dark:text-white">
                      {parcelTypes.find(t => t.id === formData.parcelType)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Urgency:</span>
                    <span className={`font-medium ${
                      formData.urgencyLevel === 'critical' ? 'text-red-600 dark:text-red-400' :
                      formData.urgencyLevel === 'high' ? 'text-orange-600 dark:text-orange-400' :
                      formData.urgencyLevel === 'medium' ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'
                    }`}>
                      {urgencyLevels.find(u => u.id === formData.urgencyLevel)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Weight:</span>
                    <span className="font-medium dark:text-white">{formData.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">ETA:</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {urgencyLevels.find(u => u.id === formData.urgencyLevel)?.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-gray-50 rounded-lg p-4 dark:bg-gray-900">
                <h3 className="font-medium text-gray-900 mb-3 dark:text-white">Delivery Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">From:</span>
                    <p className="font-medium dark:text-white">{formData.fromAddress}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">To:</span>
                    <p className="font-medium dark:text-white">{formData.toAddress}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Recipient:</span>
                    <p className="font-medium dark:text-white">{formData.recipientName}</p>
                    <p className="text-gray-600 dark:text-gray-300">{formData.recipientPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Estimate */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900 dark:border-blue-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-blue-900 dark:text-blue-100">Estimated Cost:</span>
                <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  ₹{formData.urgencyLevel === 'critical' ? '7,410' :
                    formData.urgencyLevel === 'high' ? '5,580' :
                    formData.urgencyLevel === 'medium' ? '3,750' : '2,410'}
                </span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Emergency delivery pricing includes drone dispatch, real-time tracking, and 24/7 support.
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold dark:bg-red-700 dark:hover:bg-red-800 dark:disabled:bg-gray-600"
              >
                {submitting ? 'Submitting...' : 'Send Emergency Parcel'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendParcel;