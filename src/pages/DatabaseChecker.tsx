import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database, Users, Truck, Package, AlertTriangle, RefreshCw } from 'lucide-react';

const DatabaseChecker: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const checkDatabase = async () => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      console.log('🔍 Checking database...');

      // Check each table
      const checks = await Promise.allSettled([
        supabase.from('users').select('*').limit(5),
        supabase.from('drones').select('*').limit(5),
        supabase.from('deliveries').select('*').limit(5),
        supabase.from('delivery_tracking').select('*').limit(5),
        supabase.from('emergency_alerts').select('*').limit(5)
      ]);

      const tableResults = {
        users: checks[0].status === 'fulfilled' ? checks[0].value : { error: checks[0].reason },
        drones: checks[1].status === 'fulfilled' ? checks[1].value : { error: checks[1].reason },
        deliveries: checks[2].status === 'fulfilled' ? checks[2].value : { error: checks[2].reason },
        delivery_tracking: checks[3].status === 'fulfilled' ? checks[3].value : { error: checks[3].reason },
        emergency_alerts: checks[4].status === 'fulfilled' ? checks[4].value : { error: checks[4].reason }
      };

      setResults(tableResults);
      console.log('Database check results:', tableResults);

    } catch (err) {
      console.error('Database check failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const insertSampleData = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('📝 Inserting sample data...');

      // Insert sample users
      const { error: usersError } = await supabase
        .from('users')
        .upsert([
          {
            email: 'user1@example.com',
            full_name: 'Dr. Priya Sharma',
            phone: '+91-9876543212',
            address: 'Apollo Hospital, Bangalore, India',
            user_type: 'user'
          },
          {
            email: 'user2@example.com',
            full_name: 'Dr. Rajesh Kumar',
            phone: '+91-9876543213',
            address: 'AIIMS, New Delhi, India',
            user_type: 'user'
          }
        ], { onConflict: 'email' });

      if (usersError) throw usersError;

      // Insert sample drones
      const { error: dronesError } = await supabase
        .from('drones')
        .upsert([
          {
            name: 'AeroVita-01',
            model: 'MedDrone Pro X1',
            status: 'available',
            battery_level: 95,
            current_location: { lat: 19.0760, lng: 72.8777 },
            max_payload: 5.0,
            flight_time_remaining: 45
          },
          {
            name: 'AeroVita-02',
            model: 'MedDrone Pro X1',
            status: 'in_flight',
            battery_level: 78,
            current_location: { lat: 28.6139, lng: 77.2090 },
            max_payload: 5.0,
            flight_time_remaining: 32
          }
        ], { onConflict: 'name' });

      if (dronesError) throw dronesError;

      // Get user IDs for deliveries
      const { data: users } = await supabase
        .from('users')
        .select('id, email')
        .in('email', ['user1@example.com', 'user2@example.com']);

      if (users && users.length > 0) {
        // Insert sample deliveries
        const { error: deliveriesError } = await supabase
          .from('deliveries')
          .insert([
            {
              user_id: users[0].id,
              recipient_name: 'Emergency Ward',
              recipient_phone: '+91-9876543220',
              pickup_address: 'Central Medical Store, Mumbai',
              delivery_address: 'Emergency Ward, Lilavati Hospital, Mumbai',
              package_type: 'Emergency Medicine Kit',
              weight: 2.5,
              priority: 'emergency',
              status: 'in_transit',
              estimated_delivery: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
              cost: 2410.00
            }
          ]);

        if (deliveriesError) console.warn('Deliveries insert error:', deliveriesError);
      }

      console.log('✅ Sample data inserted successfully');
      await checkDatabase(); // Refresh the data

    } catch (err) {
      console.error('Sample data insertion failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to insert sample data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkDatabase();
  }, []);

  const renderTableData = (tableName: string, data: any, icon: React.ReactNode) => {
    if (data.error) {
      return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center mb-2">
            {icon}
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 ml-2">
              {tableName} - Error
            </h3>
          </div>
          <p className="text-red-600 dark:text-red-400 text-sm">
            {data.error.message || 'Unknown error'}
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            {icon}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white ml-2">
              {tableName}
            </h3>
          </div>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm">
            {data.data?.length || 0} records
          </span>
        </div>
        
        {data.data && data.data.length > 0 ? (
          <div className="space-y-2">
            {data.data.slice(0, 3).map((item: any, index: number) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-sm">
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(item, null, 2)}
                </pre>
              </div>
            ))}
            {data.data.length > 3 && (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                ... and {data.data.length - 3} more records
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No data found</p>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Database Checker
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Check your database tables and insert sample data if needed
        </p>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={checkDatabase}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Check Database
        </button>
        
        <button
          onClick={insertSampleData}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          <Database className="w-4 h-4 mr-2" />
          Insert Sample Data
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderTableData('Users', results.users, <Users className="w-5 h-5 text-blue-500" />)}
          {renderTableData('Drones', results.drones, <Truck className="w-5 h-5 text-green-500" />)}
          {renderTableData('Deliveries', results.deliveries, <Package className="w-5 h-5 text-purple-500" />)}
          {renderTableData('Delivery Tracking', results.delivery_tracking, <Database className="w-5 h-5 text-yellow-500" />)}
          {renderTableData('Emergency Alerts', results.emergency_alerts, <AlertTriangle className="w-5 h-5 text-red-500" />)}
        </div>
      )}
    </div>
  );
};

export default DatabaseChecker;