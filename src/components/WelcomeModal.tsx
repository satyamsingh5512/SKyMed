import React, { useState, useEffect } from 'react';
import { CheckCircle, X, Package, Shield, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const WelcomeModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Show welcome modal for new Google users
    if (user && user.app_metadata?.provider === 'google' && !hasShown) {
      const hasSeenWelcome = localStorage.getItem(`welcome_shown_${user.id}`);
      if (!hasSeenWelcome) {
        setIsVisible(true);
        setHasShown(true);
      }
    }
  }, [user, hasShown]);

  const handleClose = () => {
    setIsVisible(false);
    if (user) {
      localStorage.setItem(`welcome_shown_${user.id}`, 'true');
    }
  };

  if (!isVisible || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Welcome to SkyMed!
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Account Created Successfully!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Welcome {user.user_metadata?.full_name || user.user_metadata?.name || 'User'}! 
              Your Google account has been linked and you're ready to use SkyMed.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Send Emergency Parcels</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">Fast medical supply delivery</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <h4 className="font-medium text-green-900 dark:text-green-100">Real-time Tracking</h4>
                <p className="text-sm text-green-700 dark:text-green-300">Monitor your deliveries live</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <div>
                <h4 className="font-medium text-purple-900 dark:text-purple-100">Verified Account</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">Google-verified for security</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Medical Professional?</strong> If you're a healthcare provider, 
              you can upgrade to a medical account for priority access and extended features.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;