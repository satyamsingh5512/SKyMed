// Enhanced Delivery API - Track Delivery
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { delivery_id } = req.query;

    if (!delivery_id) {
      return res.status(400).json({
        success: false,
        error: 'delivery_id is required'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get delivery details with drone information
    const { data: delivery, error: deliveryError } = await supabase
      .from('deliveries')
      .select(`
        *,
        drones (
          id,
          name,
          model,
          status,
          battery_level,
          current_location
        ),
        users (
          id,
          full_name,
          email,
          phone
        )
      `)
      .eq('id', delivery_id)
      .single();

    if (deliveryError || !delivery) {
      return res.status(404).json({
        success: false,
        error: 'Delivery not found'
      });
    }

    // Get tracking history
    const { data: trackingHistory, error: trackingError } = await supabase
      .from('delivery_tracking')
      .select('*')
      .eq('delivery_id', delivery_id)
      .order('timestamp', { ascending: true });

    if (trackingError) {
      console.error('Tracking history error:', trackingError);
    }

    // Get emergency alerts if any
    const { data: alerts, error: alertsError } = await supabase
      .from('emergency_alerts')
      .select('*')
      .eq('delivery_id', delivery_id)
      .eq('status', 'active');

    if (alertsError) {
      console.error('Alerts error:', alertsError);
    }

    // Calculate delivery progress
    const progress = calculateDeliveryProgress(delivery.status);
    
    // Estimate remaining time
    const remainingTime = estimateRemainingTime(delivery);

    // Get real-time drone location if in transit
    let currentLocation = null;
    if (delivery.drone_id && delivery.status === 'in_transit') {
      const { data: droneLocation } = await supabase
        .from('drones')
        .select('current_location, battery_level')
        .eq('id', delivery.drone_id)
        .single();
      
      currentLocation = droneLocation;
    }

    return res.status(200).json({
      success: true,
      data: {
        delivery: {
          ...delivery,
          progress,
          remaining_time: remainingTime,
          current_drone_location: currentLocation
        },
        tracking_history: trackingHistory || [],
        active_alerts: alerts || [],
        last_updated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Track delivery API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}

function calculateDeliveryProgress(status) {
  const progressMap = {
    'pending': 10,
    'assigned': 25,
    'in_transit': 75,
    'delivered': 100,
    'cancelled': 0
  };
  return progressMap[status] || 0;
}

function estimateRemainingTime(delivery) {
  if (delivery.status === 'delivered') return 0;
  if (delivery.status === 'cancelled') return null;
  
  const now = new Date();
  const estimatedDelivery = new Date(delivery.estimated_delivery);
  const remainingMs = estimatedDelivery.getTime() - now.getTime();
  
  if (remainingMs <= 0) return 0;
  
  return Math.ceil(remainingMs / (1000 * 60)); // Return minutes
}