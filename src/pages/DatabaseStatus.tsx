import React from 'react';
import DatabaseConnectionTest from '../components/DatabaseConnectionTest';
import DatabaseInitializer from '../components/DatabaseInitializer';
import { Database, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const DatabaseStatus: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="text-center mb-8">
          <Database className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Database Status & Setup
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Check your database connection and initialize sample data if needed
          </p>
        </div>

        <div className="space-y-6">
          <DatabaseConnectionTest />
          <DatabaseInitializer />
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 dark:bg-blue-900 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              Database Setup Instructions
            </h3>
            <div className="space-y-4 text-blue-800 dark:text-blue-200">
              <div>
                <h4 className="font-medium mb-2">1. Initial Schema Setup</h4>
                <p className="text-sm">
                  If you haven't set up your database yet, go to your Supabase project dashboard, 
                  navigate to the SQL Editor, and run the contents of <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">supabase-schema.sql</code>.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">2. Enhanced Features (Optional)</h4>
                <p className="text-sm">
                  For advanced features like analytics and notifications, also run 
                  <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">supabase-enhanced-schema.sql</code>.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">3. Sample Data</h4>
                <p className="text-sm">
                  Use the "Initialize Sample Data" button above to populate your database with 
                  sample users, drones, and deliveries for testing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseStatus;