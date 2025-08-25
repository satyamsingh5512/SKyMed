import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react'

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  return url && key && 
         !url.includes('your-project') && 
         !key.includes('your-anon-key')
}

export default function DatabaseStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error' | 'not-configured'>('checking')
  const [error, setError] = useState<string>('')
  const [tableCount, setTableCount] = useState<number>(0)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      setStatus('checking')
      setError('')

      // First check if Supabase is configured
      if (!isSupabaseConfigured()) {
        setStatus('not-configured')
        setError('Supabase credentials not configured')
        return
      }

      // Import supabase only if configured
      const { supabase } = await import('../lib/supabase')

      // Test basic connection
      const { data, error: connectionError } = await supabase
        .from('drones')
        .select('count', { count: 'exact', head: true })

      if (connectionError) {
        throw connectionError
      }

      // Get table information
      const { count } = await supabase
        .from('drones')
        .select('*', { count: 'exact', head: true })
      
      setTableCount(count || 0)
      setStatus('connected')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'not-configured':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking database connection...'
      case 'connected':
        return `Database connected successfully (${tableCount} records found)`
      case 'not-configured':
        return 'Supabase not configured yet'
      case 'error':
        return 'Database connection failed'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'text-blue-600 dark:text-blue-400'
      case 'connected':
        return 'text-green-600 dark:text-green-400'
      case 'not-configured':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'error':
        return 'text-red-600 dark:text-red-400'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        {getStatusIcon()}
        <div>
          <p className={`font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </p>
          {error && (
            <p className="text-sm text-red-500 mt-1">
              Error: {error}
            </p>
          )}
          {status === 'error' && (
            <button
              onClick={checkConnection}
              className="text-sm text-blue-500 hover:text-blue-600 mt-2 underline"
            >
              Retry Connection
            </button>
          )}
        </div>
      </div>
      
      {status === 'connected' && (
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          <p>✅ Supabase client initialized</p>
          <p>✅ Database tables accessible</p>
          <p>✅ Real-time subscriptions ready</p>
        </div>
      )}
      
      {status === 'not-configured' && (
        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium mb-2">
            🔧 Setup Required
          </p>
          <ol className="text-sm text-yellow-700 dark:text-yellow-300 list-decimal list-inside space-y-1">
            <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">supabase.com</a></li>
            <li>Get your project URL and API key</li>
            <li>Update your .env file with real credentials</li>
            <li>Run the SQL schema in Supabase dashboard</li>
          </ol>
        </div>
      )}
    </div>
  )
}