// Real-time Updates API - WebSocket-like functionality
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    switch (req.method) {
      case 'GET':
        return await getRealtimeData(req, res, supabase);
      case 'POST':
        return await updateRealtimeData(req, res, supabase);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Realtime updates API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}

async function getRealtimeData(req, res, supabase) {
  const { type, id } = req.query;

  switch (type) {
    case 'delivery':
      return await getDeliveryUpdates(req, res, supabase, id);
    case 'fleet':
      return await getFleetUpdates(req, res, supabase);
    case 'alerts':
      return await getAlertUpdates(req, res, supabase);
    case 'dashboard':
      return await getDashboardUpdates(req, res, supabase);
    default:
      return res.status(400).json({
        success: false,
        error: 'Invalid update type'
      });
  }
}

async function getDeliveryUpdates(req, res, supabase, deliveryId) {
  if (!deliveryId) {
    return res.status(400).json({
      success: false,
      error: 'delivery_id is required'
    });
  }

  try {
    // Get current delivery status
    const { data: delivery, error: deliveryError } = await supabase
      .from('deliveries')
      .select(`
        *,
        drones (
          id,
          name,
          status,
          battery_level,
          current_location
        )
      `)
      .eq('id', deliveryId)
      .single();

    if (deliveryError) {
      return res.status(404).json({
        success: false,
        error: 'Delivery not found'
      });
    }

    // Get latest tracking updates (last 5)
    const { data: tracking } = await supabase
      .from('delivery_tracking')
      .select('*')
      .eq('delivery_id', deliveryId)
      .order('timestamp', { ascending: false })
      .limit(5);

    // Get active alerts
    const { data: alerts } = await supabase
      .from('emergency_alerts')
      .select('*')
      .eq('delivery_id', deliveryId)
      .eq('status', 'active');

    // Calculate ETA if drone is assigned
    let eta = null;
    if (delivery.drone_id && delivery.status === 'in_transit') {
      eta = calculateETA(delivery, delivery.drones);
    }

    return res.status(200).json({
      success: true,
      data: {
        delivery,
        tracking: tracking || [],
        alerts: alerts || [],
        eta,
        last_updated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Get delivery updates error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get delivery updates'
    });
  }
}

async function getFleetUpdates(req, res, supabase) {
  try {
    // Get all drones with current status
    const { data: drones } = await supabase
      .from('drones')
      .select('*')
      .order('name');

    // Get active deliveries
    const { data: activeDeliveries } = await supabase
      .from('deliveries')
      .select(`
        id,
        drone_id,
        recipient_name,
        priority,
        status,
        estimated_delivery
      `)
      .in('status', ['assigned', 'in_transit']);

    // Calculate fleet statistics
    const fleetStats = calculateFleetStatistics(drones || [], activeDeliveries || []);

    // Get recent fleet activities
    const { data: recentActivities } = await supabase
      .from('delivery_tracking')
      .select(`
        *,
        deliveries (
          id,
          recipient_name,
          priority
        )
      `)
      .order('timestamp', { ascending: false })
      .limit(10);

    return res.status(200).json({
      success: true,
      data: {
        fleet_stats: fleetStats,
        drones: drones || [],
        active_deliveries: activeDeliveries || [],
        recent_activities: recentActivities || [],
        last_updated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Get fleet updates error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get fleet updates'
    });
  }
}

async function getAlertUpdates(req, res, supabase) {
  try {
    // Get active alerts
    const { data: activeAlerts } = await supabase
      .from('emergency_alerts')
      .select(`
        *,
        deliveries (
          id,
          recipient_name,
          priority,
          status,
          users (
            full_name,
            institution_name
          )
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    // Get alert statistics
    const { data: alertStats } = await supabase
      .from('emergency_alerts')
      .select('severity, status, created_at');

    const stats = calculateAlertStatistics(alertStats || []);

    return res.status(200).json({
      success: true,
      data: {
        active_alerts: activeAlerts || [],
        alert_stats: stats,
        last_updated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Get alert updates error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get alert updates'
    });
  }
}

async function getDashboardUpdates(req, res, supabase) {
  try {
    // Get comprehensive dashboard data
    const [
      deliveriesResult,
      dronesResult,
      alertsResult,
      recentActivitiesResult
    ] = await Promise.allSettled([
      supabase.from('deliveries').select('status, priority, created_at'),
      supabase.from('drones').select('status, battery_level'),
      supabase.from('emergency_alerts').select('severity, status, created_at').eq('status', 'active'),
      supabase.from('delivery_tracking').select(`
        *,
        deliveries (recipient_name, priority)
      `).order('timestamp', { ascending: false }).limit(5)
    ]);

    const deliveries = deliveriesResult.status === 'fulfilled' ? deliveriesResult.value.data || [] : [];
    const drones = dronesResult.status === 'fulfilled' ? dronesResult.value.data || [] : [];
    const alerts = alertsResult.status === 'fulfilled' ? alertsResult.value.data || [] : [];
    const recentActivities = recentActivitiesResult.status === 'fulfilled' ? recentActivitiesResult.value.data || [] : [];

    // Calculate dashboard metrics
    const metrics = {
      deliveries: {
        total: deliveries.length,
        pending: deliveries.filter(d => d.status === 'pending').length,
        in_transit: deliveries.filter(d => d.status === 'in_transit').length,
        delivered: deliveries.filter(d => d.status === 'delivered').length,
        emergency: deliveries.filter(d => d.priority === 'emergency').length
      },
      fleet: {
        total: drones.length,
        available: drones.filter(d => d.status === 'available').length,
        in_flight: drones.filter(d => d.status === 'in_flight').length,
        maintenance: drones.filter(d => d.status === 'maintenance').length,
        average_battery: drones.length > 0 ? 
          Math.round(drones.reduce((sum, d) => sum + d.battery_level, 0) / drones.length) : 0
      },
      alerts: {
        total_active: alerts.length,
        critical: alerts.filter(a => a.severity === 'critical').length,
        high: alerts.filter(a => a.severity === 'high').length
      }
    };

    return res.status(200).json({
      success: true,
      data: {
        metrics,
        recent_activities: recentActivities,
        system_status: 'operational',
        last_updated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Get dashboard updates error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get dashboard updates'
    });
  }
}

async function updateRealtimeData(req, res, supabase) {
  const { type, id, data } = req.body;

  switch (type) {
    case 'drone_location':
      return await updateDroneLocation(req, res, supabase, id, data);
    case 'delivery_status':
      return await updateDeliveryStatus(req, res, supabase, id, data);
    case 'tracking':
      return await addTrackingUpdate(req, res, supabase, id, data);
    default:
      return res.status(400).json({
        success: false,
        error: 'Invalid update type'
      });
  }
}

async function updateDroneLocation(req, res, supabase, droneId, locationData) {
  try {
    const { lat, lng, battery_level } = locationData;

    const updateData = {
      current_location: { lat, lng },
      updated_at: new Date().toISOString()
    };

    if (battery_level !== undefined) {
      updateData.battery_level = battery_level;
    }

    const { data, error } = await supabase
      .from('drones')
      .update(updateData)
      .eq('id', droneId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to update drone location'
      });
    }

    return res.status(200).json({
      success: true,
      data,
      message: 'Drone location updated'
    });

  } catch (error) {
    console.error('Update drone location error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update drone location'
    });
  }
}

// Helper functions
function calculateETA(delivery, drone) {
  if (!drone || !drone.current_location) return null;
  
  // Simple ETA calculation based on distance and average speed
  const avgSpeed = 60; // km/h
  // This would need actual distance calculation in a real implementation
  const estimatedMinutes = Math.floor(Math.random() * 30) + 5; // Mock calculation
  
  return {
    minutes: estimatedMinutes,
    estimated_arrival: new Date(Date.now() + estimatedMinutes * 60000).toISOString()
  };
}

function calculateFleetStatistics(drones, activeDeliveries) {
  return {
    total_drones: drones.length,
    available: drones.filter(d => d.status === 'available').length,
    in_flight: drones.filter(d => d.status === 'in_flight').length,
    maintenance: drones.filter(d => d.status === 'maintenance').length,
    average_battery: drones.length > 0 ? 
      Math.round(drones.reduce((sum, d) => sum + d.battery_level, 0) / drones.length) : 0,
    active_deliveries: activeDeliveries.length,
    utilization_rate: drones.length > 0 ? 
      Math.round((activeDeliveries.length / drones.length) * 100) : 0
  };
}

function calculateAlertStatistics(alerts) {
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  return {
    total_active: alerts.filter(a => a.status === 'active').length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    high: alerts.filter(a => a.severity === 'high').length,
    recent: alerts.filter(a => new Date(a.created_at) > last24Hours).length
  };
}