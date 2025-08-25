import React, { useState } from 'react';
import { AlertTriangle, ExternalLink, CheckCircle, X } from 'lucide-react';

const GoogleOAuthSetup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Google OAuth Setup Required
            </h2>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-yellow-800 dark:text-yellow-200">
              Google OAuth is not enabled in your Supabase project. Follow these steps to enable it:
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Go to Supabase Dashboard</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Open your Supabase project dashboard
                </p>
                <a
                  href="https://shalookoiycpttkatrlr.supabase.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm mt-1"
                >
                  Open Dashboard <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Navigate to Authentication</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Go to <strong>Authentication</strong> → <strong>Providers</strong> in the left sidebar
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Enable Google Provider</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Find <strong>Google</strong> in the list and toggle it <strong>ON</strong>
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Configure Google OAuth (Optional)</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  For production, you'll need to set up Google Cloud Console credentials. 
                  For now, you can use Supabase's default settings for testing.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-green-800 dark:text-green-200">Quick Setup</h3>
            </div>
            <p className="text-green-700 dark:text-green-300 text-sm">
              For development, simply enabling the Google provider in Supabase is enough. 
              The system will use Supabase's default OAuth configuration.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Alternative: Use Email Authentication</h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              You can continue using email/password authentication while setting up Google OAuth. 
              All features work with email authentication.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsVisible(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            I'll set this up later
          </button>
          <a
            href="https://shalookoiycpttkatrlr.supabase.co"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => setIsVisible(false)}
          >
            Open Supabase Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default GoogleOAuthSetup;