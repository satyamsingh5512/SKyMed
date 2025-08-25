import { useState, useEffect } from 'react'
import { supabase, type EmergencyAlert } from '../lib/supabase'

export function useEmergencyAlerts() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAlerts()
    
    // Subscribe to real-time changes
    const subscription = supabase
      .channel('emergency_alerts')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'emergency_alerts' },
        () => {
          fetchAlerts()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('emergency_alerts')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAlerts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createAlert = async (alertData: Omit<EmergencyAlert, 'id' | 'created_at' | 'resolved_at'>) => {
    try {
      const { data, error } = await supabase
        .from('emergency_alerts')
        .insert([alertData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create alert')
      throw err
    }
  }

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('emergency_alerts')
        .update({ 
          status: 'resolved', 
          resolved_at: new Date().toISOString() 
        })
        .eq('id', alertId)

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve alert')
      throw err
    }
  }

  return {
    alerts,
    loading,
    error,
    createAlert,
    resolveAlert,
    refetch: fetchAlerts
  }
}