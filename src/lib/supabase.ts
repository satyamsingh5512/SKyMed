import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface User {
  id: string
  email: string
  full_name: string
  phone: string
  address: string
  user_type: 'user' | 'operator' | 'admin'
  created_at: string
  updated_at: string
}

export interface Delivery {
  id: string
  user_id: string
  recipient_name: string
  recipient_phone: string
  pickup_address: string
  delivery_address: string
  package_type: string
  weight: number
  priority: 'low' | 'medium' | 'high' | 'emergency'
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled'
  drone_id?: string
  estimated_delivery: string
  actual_delivery?: string
  cost: number
  created_at: string
  updated_at: string
}

export interface Drone {
  id: string
  name: string
  model: string
  status: 'available' | 'in_flight' | 'maintenance' | 'offline'
  battery_level: number
  current_location: {
    lat: number
    lng: number
  }
  max_payload: number
  flight_time_remaining: number
  last_maintenance: string
  created_at: string
  updated_at: string
}

export interface DeliveryTracking {
  id: string
  delivery_id: string
  location: {
    lat: number
    lng: number
  }
  status: string
  timestamp: string
  notes?: string
}

export interface EmergencyAlert {
  id: string
  delivery_id: string
  alert_type: 'medical_emergency' | 'drone_malfunction' | 'weather' | 'other'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  status: 'active' | 'resolved' | 'dismissed'
  created_at: string
  resolved_at?: string
}