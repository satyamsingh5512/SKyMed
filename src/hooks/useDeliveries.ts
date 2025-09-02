import { useState, useEffect } from 'react'
import { supabase, type Delivery } from '../lib/supabase'

export function useDeliveries(userId?: string) {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    
    const loadDeliveries = async () => {
      if (mounted) {
        await fetchDeliveries()
      }
    }
    
    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.log('Deliveries loading timeout - setting loading to false')
        setLoading(false)
        setError('Loading timeout - please refresh the page')
      }
    }, 10000) // 10 second timeout
    
    loadDeliveries()
    
    // Subscribe to real-time changes
    const subscription = supabase
      .channel('deliveries')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'deliveries' },
        () => {
          if (mounted) {
            fetchDeliveries()
          }
        }
      )
      .subscribe()

    return () => {
      mounted = false
      clearTimeout(loadingTimeout)
      subscription.unsubscribe()
    }
  }, [userId])

  const fetchDeliveries = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let query = supabase
        .from('deliveries')
        .select('*')
        .order('created_at', { ascending: false })

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Deliveries fetch error:', error)
        throw error
      }
      
      console.log('Deliveries fetched successfully:', data?.length || 0, 'records')
      setDeliveries(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      console.error('fetchDeliveries error:', err)
      setError(errorMessage)
      // Set empty array on error to prevent crashes
      setDeliveries([])
    } finally {
      setLoading(false)
    }
  }

  const createDelivery = async (deliveryData: Omit<Delivery, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Creating delivery with data:', deliveryData);
      
      const { data, error } = await supabase
        .from('deliveries')
        .insert([deliveryData])
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message} (Code: ${error.code})`);
      }
      
      console.log('Delivery created successfully:', data);
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create delivery';
      setError(errorMessage);
      console.error('Create delivery error:', err);
      throw err;
    }
  }

  const updateDeliveryStatus = async (deliveryId: string, status: Delivery['status']) => {
    try {
      const { error } = await supabase
        .from('deliveries')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', deliveryId)

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update delivery')
      throw err
    }
  }

  return {
    deliveries,
    loading,
    error,
    createDelivery,
    updateDeliveryStatus,
    refetch: fetchDeliveries
  }
}