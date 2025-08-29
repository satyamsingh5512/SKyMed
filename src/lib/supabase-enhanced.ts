// Enhanced Supabase Client with Real-time Features
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create enhanced client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Enhanced Database Service Class
export class DatabaseService {
  private client: SupabaseClient;
  private channels: Map<string, RealtimeChannel> = new Map();

  constructor() {
    this.client = supabase;
  }

  // Enhanced User Operations
  async createUserProfile(userData: any) {
    try {
      const { data, error } = await this.client
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Create user profile error:', error);
      return { success: false, error };
    }
  }

  async getUserProfile(userId: string) {
    try {
      const { data, error } = await this.client
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get user profile error:', error);
      return { success: false, error };
    }
  }

  // Enhanced Delivery Operations
  async createDelivery(deliveryData: any) {
    try {
      const { data, error } = await this.client
        .from('deliveries')
        .insert([deliveryData])
        .select(`
          *,
          users (full_name, phone),
          drones (name, model)
        `)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Create delivery error:', error);
      return { success: false, error };
    }
  }

  async getDeliveryWithDetails(deliveryId: string) {
    try {
      const { data, error } = await this.client
        .from('deliveries')
        .select(`
          *,
          users (
            id,
            full_name,
            phone,
            email,
            institution_name
          ),
          drones (
            id,
            name,
            model,
            status,
            battery_level,
            current_location
          )
        `)
        .eq('id', deliveryId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get delivery details error:', error);
      return { success: false, error };
    }
  }

  async getUserDeliveries(userId: string, limit = 20) {
    try {
      const { data, error } = await this.client
        .from('deliveries')
        .select(`
          *,
          drones (name, status, battery_level)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Get user deliveries error:', error);
      return { success: false, error };
    }
  }

  // Enhanced Drone Operations
  async getDroneFleetStatus() {
    try {
      const { data, error } = await this.client
        .from('drones')
        .select('*')
        .order('name');

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Get drone fleet error:', error);
      return { success: false, error };
    }
  }

  async updateDroneLocation(droneId: string, location: { lat: number; lng: number }) {
    try {
      const { data, error } = await this.client
        .from('drones')
        .update({ 
          current_location: location,
          updated_at: new Date().toISOString()
        })
        .eq('id', droneId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Update drone location error:', error);
      return { success: false, error };
    }
  }

  // Enhanced Tracking Operations
  async addTrackingUpdate(deliveryId: string, trackingData: any) {
    try {
      const { data, error } = await this.client
        .from('delivery_tracking')
        .insert([{
          delivery_id: deliveryId,
          ...trackingData,
          timestamp: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Add tracking update error:', error);
      return { success: false, error };
    }
  }

  async getDeliveryTracking(deliveryId: string) {
    try {
      const { data, error } = await this.client
        .from('delivery_tracking')
        .select('*')
        .eq('delivery_id', deliveryId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Get delivery tracking error:', error);
      return { success: false, error };
    }
  }

  // Real-time Subscriptions
  subscribeToDeliveryUpdates(deliveryId: string, callback: (payload: any) => void) {
    const channelName = `delivery-${deliveryId}`;
    
    if (this.channels.has(channelName)) {
      this.channels.get(channelName)?.unsubscribe();
    }

    const channel = this.client
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deliveries',
          filter: `id=eq.${deliveryId}`
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'delivery_tracking',
          filter: `delivery_id=eq.${deliveryId}`
        },
        callback
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  subscribeToFleetUpdates(callback: (payload: any) => void) {
    const channelName = 'fleet-updates';
    
    if (this.channels.has(channelName)) {
      this.channels.get(channelName)?.unsubscribe();
    }

    const channel = this.client
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'drones'
        },
        callback
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  subscribeToEmergencyAlerts(callback: (payload: any) => void) {
    const channelName = 'emergency-alerts';
    
    if (this.channels.has(channelName)) {
      this.channels.get(channelName)?.unsubscribe();
    }

    const channel = this.client
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'emergency_alerts'
        },
        callback
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // Cleanup subscriptions
  unsubscribeAll() {
    this.channels.forEach((channel) => {
      channel.unsubscribe();
    });
    this.channels.clear();
  }

  unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName);
    if (channel) {
      channel.unsubscribe();
      this.channels.delete(channelName);
    }
  }

  // Analytics and Statistics
  async getDeliveryStats(timeframe = '24h') {
    try {
      const timeframeSql = timeframe === '24h' ? 
        "created_at >= NOW() - INTERVAL '24 hours'" :
        timeframe === '7d' ?
        "created_at >= NOW() - INTERVAL '7 days'" :
        "created_at >= NOW() - INTERVAL '30 days'";

      const { data, error } = await this.client
        .rpc('get_delivery_stats', { timeframe_filter: timeframeSql });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get delivery stats error:', error);
      return { success: false, error };
    }
  }

  async getSystemHealth() {
    try {
      const [deliveries, drones, alerts] = await Promise.all([
        this.client.from('deliveries').select('status', { count: 'exact' }),
        this.client.from('drones').select('status', { count: 'exact' }),
        this.client.from('emergency_alerts').select('status', { count: 'exact' }).eq('status', 'active')
      ]);

      return {
        success: true,
        data: {
          total_deliveries: deliveries.count || 0,
          total_drones: drones.count || 0,
          active_alerts: alerts.count || 0,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Get system health error:', error);
      return { success: false, error };
    }
  }
}

// Export singleton instance
export const dbService = new DatabaseService();

// Export types for better TypeScript support
export interface DeliveryWithDetails {
  id: string;
  user_id: string;
  recipient_name: string;
  recipient_phone: string;
  pickup_address: string;
  delivery_address: string;
  package_type: string;
  weight: number;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';
  drone_id?: string;
  estimated_delivery: string;
  actual_delivery?: string;
  cost: number;
  created_at: string;
  updated_at: string;
  users?: {
    id: string;
    full_name: string;
    phone: string;
    email: string;
    institution_name?: string;
  };
  drones?: {
    id: string;
    name: string;
    model: string;
    status: string;
    battery_level: number;
    current_location: { lat: number; lng: number };
  };
}

export interface TrackingUpdate {
  id: string;
  delivery_id: string;
  location: { lat: number; lng: number };
  status: string;
  timestamp: string;
  notes?: string;
}