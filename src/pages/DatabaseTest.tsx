import { useState, useEffect } from 'react'
import DatabaseStatus from '../components/DatabaseStatus'
import SupabaseSetupGuide from '../components/SupabaseSetupGuide'
import { Database, Users, Truck, AlertTriangle, MapPin } from 'lucide-react'

interface TableStats {
  users: number
  drones: number
  deliveries: number
  emergency_alerts: number
  delivery_tracking: number
}

export default function DatabaseTest() {
  const [stats, setStats] = useState<TableStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetchTableStats()
  }, [])

  const fetchTableStats = async () => {
    try {
      setLoading(true)
      setError('')

      // Check if Supabase is configured
      const url = import.meta.env.VITE_SUPABASE_URL
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      console.log('Environment check:', { url, keyExists: !!key });
      
      if (!url || !key || url.includes('your-project') || key.includes('your-anon-key')) {
        setError('Supabase not configured. Please update your .env file.')
        return
      }

      const { supabase } = await import('../lib/supabase')
      console.log('Supabase client created successfully');

      const results = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('drones').select('*', { count: 'exact', head: true }),
        supabase.from('deliveries').select('*', { count: 'exact', head: true }),
        supabase.from('emergency_alerts').select('*', { count: 'exact', head: true }),
        supabase.from('delivery_tracking').select('*', { count: 'exact', head: true })
      ])

      setStats({
        users: results[0].count || 0,
        drones: results[1].count || 0,
        deliveries: results[2].count || 0,
        emergency_alerts: results[3].count || 0,
        delivery_tracking: results[4].count || 0
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Database Connection Test
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Verify your Supabase database connection and check table statistics
        </p>
      </div>

      <div className="space-y-6">
        <DatabaseStatus />

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Table Statistics
            </h2>
          </div>
          
          <div className="p-4">
            {loading ? (
              <p className="text-gray-600 dark:text-gray-400">Loading table statistics...</p>
            ) : error ? (
              <div className="text-red-600 dark:text-red-400">
                <p>Error: {error}</p>
                <button
                  onClick={fetchTableStats}
                  className="mt-2 text-blue-500 hover:text-blue-600 underline"
                >
                  Retry
                </button>
              </div>
            ) : stats ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.users}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Users</p>
                </div>
                
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Truck className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.drones}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Drones</p>
                </div>
                
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Database className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.deliveries}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Deliveries</p>
                </div>
                
                <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.emergency_alerts}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Alerts</p>
                </div>
                
                <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <MapPin className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.delivery_tracking}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tracking</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Environment Configuration
            </h2>
          </div>
          
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Supabase URL:</span>
              <span className="text-sm font-mono text-gray-900 dark:text-white">
                {import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('your-project') ? '✅ Configured' : '❌ Missing'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Supabase Key:</span>
              <span className="text-sm font-mono text-gray-900 dark:text-white">
                {import.meta.env.VITE_SUPABASE_ANON_KEY && !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('your-anon-key') ? '✅ Configured' : '❌ Missing'}
              </span>
            </div>
          </div>
        </div>

        {/* Database Schema Setup Instructions */}
        {error && error.includes('relation') && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-yellow-500 mt-0.5 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  Database Schema Not Found
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                  The database tables haven't been created yet. Follow these steps to set up your database:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-yellow-700 dark:text-yellow-300 mb-4">
                  <li>Go to your <a href="https://shalookoiycpttkatrlr.supabase.co" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-800 dark:hover:text-yellow-200">Supabase Dashboard</a></li>
                  <li>Click on "SQL Editor" in the left sidebar</li>
                  <li>Copy the contents of <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">supabase-schema.sql</code> file</li>
                  <li>Paste it into the SQL Editor and click "Run"</li>
                  <li>Refresh this page to verify the setup</li>
                </ol>
                <button
                  onClick={fetchTableStats}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Check Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Show setup guide if not configured */}
        {(!import.meta.env.VITE_SUPABASE_URL || 
          !import.meta.env.VITE_SUPABASE_ANON_KEY || 
          import.meta.env.VITE_SUPABASE_URL.includes('your-project') || 
          import.meta.env.VITE_SUPABASE_ANON_KEY.includes('your-anon-key')) && (
          <SupabaseSetupGuide />
        )}
      </div>
    </div>
  )
}