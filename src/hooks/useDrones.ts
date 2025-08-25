import { useState, useEffect } from 'react'
import { supabase, type Drone } from '../lib/supabase'

export function useDrones() {
  const [drones, setDrones] = useState<Drone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDrones()
    
    // Subscribe to real-time changes
    const subscription = supabase
      .channel('drones')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'drones' },
        () => {
          fetchDrones()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchDrones = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('drones')
        .select('*')
        .order('name')

      if (error) throw error
      setDrones(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const updateDroneStatus = async (droneId: string, status: Drone['status']) => {
    try {
      const { error } = await supabase
        .from('drones')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', droneId)

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update drone status')
      throw err
    }
  }

  const updateDroneBattery = async (droneId: string, batteryLevel: number) => {
    try {
      const { error } = await supabase
        .from('drones')
        .update({ battery_level: batteryLevel, updated_at: new Date().toISOString() })
        .eq('id', droneId)

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update drone battery')
      throw err
    }
  }

  const updateDroneLocation = async (droneId: string, location: { lat: number; lng: number }) => {
    try {
      const { error } = await supabase
        .from('drones')
        .update({ current_location: location, updated_at: new Date().toISOString() })
        .eq('id', droneId)

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update drone location')
      throw err
    }
  }

  return {
    drones,
    loading,
    error,
    updateDroneStatus,
    updateDroneBattery,
    updateDroneLocation,
    refetch: fetchDrones
  }
}