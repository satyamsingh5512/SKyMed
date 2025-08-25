import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface TrackingData {
  id: string
  delivery_id: string
  location: { lat: number; lng: number }
  status: string
  timestamp: string
  notes?: string
}

interface DeliveryWithTracking {
  id: string
  recipient_name: string
  recipient_phone: string
  pickup_address: string
  delivery_address: string
  package_type: string
  weight: number
  priority: string
  status: string
  estimated_delivery: string
  actual_delivery?: string
  cost: number
  created_at: string
  tracking: TrackingData[]
}

export function useTracking() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const trackDelivery = async (trackingId: string): Promise<DeliveryWithTracking | null> => {
    try {
      setLoading(true)
      setError(null)

      // Extract delivery ID from tracking ID (remove SP- prefix and convert to lowercase)
      const deliveryIdPart = trackingId.replace('SP-', '').toLowerCase()
      
      // Search for delivery by ID ending with the tracking ID part
      const { data: deliveries, error: deliveryError } = await supabase
        .from('deliveries')
        .select('*')
        .ilike('id', `%${deliveryIdPart}%`)
        .limit(1)

      if (deliveryError) throw deliveryError
      if (!deliveries || deliveries.length === 0) {
        throw new Error('Tracking ID not found')
      }

      const delivery = deliveries[0]

      // Get tracking data for this delivery
      const { data: tracking, error: trackingError } = await supabase
        .from('delivery_tracking')
        .select('*')
        .eq('delivery_id', delivery.id)
        .order('timestamp', { ascending: true })

      if (trackingError) throw trackingError

      return {
        ...delivery,
        tracking: tracking || []
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to track delivery')
      return null
    } finally {
      setLoading(false)
    }
  }

  const addTrackingUpdate = async (deliveryId: string, location: { lat: number; lng: number }, status: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('delivery_tracking')
        .insert([{
          delivery_id: deliveryId,
          location,
          status,
          notes,
          timestamp: new Date().toISOString()
        }])

      if (error) throw error
    } catch (err) {
      console.error('Failed to add tracking update:', err)
      throw err
    }
  }

  return {
    trackDelivery,
    addTrackingUpdate,
    loading,
    error
  }
}