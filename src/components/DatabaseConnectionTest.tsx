import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';

const DatabaseConnectionTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any[]>([]);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus('testing');
      setError(null);
      
      // Test 1: Basic connection
      console.log('Testing Supabase connection...');
      const { data: connectionTest, error: connectionError } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      if (connectionError) {
        throw new Error(`Connection failed: ${connectionError.message}`);
      }
      
      // Test 2: Check if tables exist
      const { data: tablesTest, error: tablesError } = await supabase
        .rpc('get_table_names')
        .catch(() => {
          // If RPC doesn't exist, try a simple query
          return supabase.from('users').select('id').limit(1);
        });
      
      // Test 3: Try to fetch some data
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(5);
      
      const { data: dronesData, error: dronesError } = await supabase
        .from('drones')
        .select('*')
        .limit(5);
      
      const { data: deliveriesData, error: deliveriesError } = await supabase
        .from('deliveries')
        .select('*')
        .limit(5);
      
      setTestResults([
        {
          name: 'Database Connection',
          status: connectionError ? 'error' : 'success',
          error: connectionError?.message,
          data: connectionTest
        },
        {
          name: 'Users Table',
          status: usersError ? 'error' : 'success',
          error: usersError?.message,
          data: usersData,
          count: usersData?.length || 0
        },
        {
          name: 'Drones Table',
          status: dronesError ? 'error' : 'success',
          error: dronesError?.message,
          data: dronesData,
          count: dronesData?.length || 0
        },
        {
          name: 'Deliveries Table',
          status: deliveriesError ? 'error' : 'success',
          error: deliveriesError?.message,
          data: deliveriesData,
          count: deliveriesData?.length || 0
        }
      ]);
      
      setConnectionStatus('connected');
      
    } catch (err) {
      console.error('Database test error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setConnectionStatus('error');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Database Connection Status
        </h3>
        <button
          onClick={testConnection}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
        >
          Retest
        </button>
      </div>

      {connectionStatus === 'testing' && (
        <div className="flex items-center justify-center py-8">
          <Loader className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600 dark:text-gray-300">Testing database connection...</span>
        </div>
      )}

      {connectionStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900 dark:border-red-800">
          <div className="flex items-center mb-2">
            <XCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="font-medium text-red-900 dark:text-red-100">Connection Failed</span>
          </div>
          <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {testResults.length > 0 && (
        <div className="space-y-3">
          {testResults.map((result, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
              <div className="flex items-center">
                {getStatusIcon(result.status)}
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {result.name}
                </span>
                {result.count !== undefined && (
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                    ({result.count} records)
                  </span>
                )}
              </div>
              {result.error && (
                <span className="text-sm text-red-600 dark:text-red-400">
                  {result.error}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg dark:bg-blue-900">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Environment:</strong> {import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'Missing URL'}
        </p>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>API Key:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configured' : 'Missing Key'}
        </p>
      </div>
    </div>
  );
};

export default DatabaseConnectionTest;