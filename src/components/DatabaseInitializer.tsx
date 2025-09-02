import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle, AlertCircle, Loader, Database, Play } from 'lucide-react';

const DatabaseInitializer: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'ready' | 'needs-setup' | 'error'>('checking');
  const [setupProgress, setSetupProgress] = useState<string[]>([]);
  const [isSettingUp, setIsSettingUp] = useState(false);

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    try {
      setStatus('checking');
      
      // Check if basic tables exist
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id')
        .limit(1);
      
      const { data: dronesData, error: dronesError } = await supabase
        .from('drones')
        .select('id')
        .limit(1);
      
      const { data: deliveriesData, error: deliveriesError } = await supabase
        .from('deliveries')
        .select('id')
        .limit(1);

      // Check if tables exist (error code 42P01 means table doesn't exist)
      const tablesExist = !usersError?.code?.includes('42P01') && 
                         !dronesError?.code?.includes('42P01') && 
                         !deliveriesError?.code?.includes('42P01');

      if (tablesExist) {
        setStatus('ready');
      } else {
        setStatus('needs-setup');
      }
      
    } catch (error) {
      console.error('Database status check failed:', error);
      setStatus('error');
    }
  };

  const initializeDatabase = async () => {
    setIsSettingUp(true);
    setSetupProgress([]);
    
    try {
      // Step 1: Create sample users
      setSetupProgress(prev => [...prev, 'Creating sample users...']);
      
      const sampleUsers = [
        {
          id: '00000000-0000-0000-0000-000000000001',
          email: 'admin@skymed.com',
          full_name: 'SkyMed Administrator',
          phone: '+91-9876543210',
          address: 'SkyMed HQ, Mumbai, India',
          user_type: 'admin'
        },
        {
          id: '00000000-0000-0000-0000-000000000002',
          email: 'operator@skymed.com',
          full_name: 'Operations Manager',
          phone: '+91-9876543211',
          address: 'Control Center, Delhi, India',
          user_type: 'operator'
        }
      ];

      for (const user of sampleUsers) {
        await supabase.from('users').upsert(user);
      }
      
      // Step 2: Create sample drones
      setSetupProgress(prev => [...prev, 'Creating sample drones...']);
      
      const sampleDrones = [
        {
          name: 'SkyMed-01',
          model: 'MedDrone Pro X1',
          status: 'available',
          battery_level: 95,
          current_location: { lat: 19.0760, lng: 72.8777 },
          max_payload: 5.0,
          flight_time_remaining: 45
        },
        {
          name: 'SkyMed-02',
          model: 'MedDrone Pro X1',
          status: 'in_flight',
          battery_level: 78,
          current_location: { lat: 28.6139, lng: 77.2090 },
          max_payload: 5.0,
          flight_time_remaining: 32
        }
      ];

      for (const drone of sampleDrones) {
        await supabase.from('drones').upsert(drone);
      }
      
      // Step 3: Create sample deliveries
      setSetupProgress(prev => [...prev, 'Creating sample deliveries...']);
      
      const { data: droneData } = await supabase.from('drones').select('id, name').limit(2);
      
      if (droneData && droneData.length > 0) {
        const sampleDeliveries = [
          {
            user_id: sampleUsers[0].id,
            recipient_name: 'Emergency Ward',
            recipient_phone: '+91-9876543220',
            pickup_address: 'Medical Supply Center, Mumbai',
            delivery_address: 'Emergency Ward, KEM Hospital, Mumbai',
            package_type: 'Emergency Medicine Kit',
            weight: 2.5,
            priority: 'emergency',
            status: 'in_transit',
            drone_id: droneData[0].id,
            estimated_delivery: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
            cost: 2410.00
          }
        ];

        for (const delivery of sampleDeliveries) {
          await supabase.from('deliveries').upsert(delivery);
        }
      }
      
      setSetupProgress(prev => [...prev, 'Database initialization complete!']);
      setStatus('ready');
      
    } catch (error) {
      console.error('Database initialization failed:', error);
      setSetupProgress(prev => [...prev, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
      setStatus('error');
    } finally {
      setIsSettingUp(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'needs-setup':
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Loader className="w-6 h-6 animate-spin text-blue-600" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'ready':
        return 'Database is ready and contains sample data';
      case 'needs-setup':
        return 'Database tables exist but need sample data';
      case 'error':
        return 'Database connection or setup failed';
      default:
        return 'Checking database status...';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Database className="w-6 h-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Database Status
          </h3>
        </div>
        <button
          onClick={checkDatabaseStatus}
          className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="flex items-center mb-4">
        {getStatusIcon()}
        <span className="ml-2 text-gray-900 dark:text-white">{getStatusMessage()}</span>
      </div>

      {status === 'needs-setup' && (
        <div className="mb-4">
          <button
            onClick={initializeDatabase}
            disabled={isSettingUp}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Play className="w-4 h-4 mr-2" />
            {isSettingUp ? 'Setting up...' : 'Initialize Sample Data'}
          </button>
        </div>
      )}

      {setupProgress.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 dark:bg-gray-800">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Setup Progress:</h4>
          <div className="space-y-1">
            {setupProgress.map((step, index) => (
              <div key={index} className="text-sm text-gray-600 dark:text-gray-300">
                {index + 1}. {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900 dark:border-red-800">
          <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">Setup Instructions:</h4>
          <ol className="text-sm text-red-700 dark:text-red-200 space-y-1">
            <li>1. Go to your Supabase project dashboard</li>
            <li>2. Navigate to SQL Editor</li>
            <li>3. Copy and paste the contents of supabase-schema.sql</li>
            <li>4. Click Run to execute the schema</li>
            <li>5. Refresh this page</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default DatabaseInitializer;