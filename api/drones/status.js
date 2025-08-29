// Enhanced Drone API - Fleet Status
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
    const { drone_id, include_deliveries = 'false' } = req.query;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (drone_id) {
      // Get specific drone details
      const { data: drone, error: droneError } = await supabase
        .from('drones')
        .select('*')
        .eq('id', drone_id)
        .single();

      if (droneError || !drone) {
        return res.status(404).json({
          success: false,
          error: 'Drone not found'
        });
      }

      let currentDelivery = null;
      if (include_deliveries === 'true') {
        // Get current delivery if drone is assigned
        const { data: delivery } = await supabase
          .from('deliveries')
          .select(`
            *,
            users (full_name, phone)
          `)
          .eq('drone_id', drone_id)
          .in('status', ['assigned', 'in_transit'])
          .single();

        currentDelivery = delivery;
      }

      // Calculate flight efficiency
      const efficiency = calculateDroneEfficiency(drone);

      return res.status(200).json({
        success: true,
        data: {
          drone: {
            ...drone,
            efficiency,
            current_delivery: currentDelivery
          }
        }
      });
    } else {
      // Get all drones with fleet overview
      const { data: drones, error: dronesError } = await supabase
        .from('drones')
        .select('*')
        .order('name');

      if (dronesError) {
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch drone fleet'
        });
      }

      // Get active deliveries count per drone
      const { data: activeDeliveries } = await supabase
        .from('deliveries')
        .select('drone_id')
        .in('status', ['assigned', 'in_transit']);

      // Calculate fleet statistics
      const fleetStats = calculateFleetStats(drones, activeDeliveries || []);

      // Get drones with current deliveries if requested
      let dronesWithDeliveries = drones;
      if (include_deliveries === 'true') {
        const droneIds = drones.map(d => d.id);
        const { data: deliveries } = await supabase
          .from('deliveries')
          .select(`
            id,
            drone_id,
            recipient_name,
            priority,
            status,
            estimated_delivery
          `)
          .in('drone_id', droneIds)
          .in('status', ['assigned', 'in_transit']);

        dronesWithDeliveries = drones.map(drone => ({
          ...drone,
          current_delivery: deliveries?.find(d => d.drone_id === drone.id) || null,
          efficiency: calculateDroneEfficiency(drone)
        }));
      }

      return res.status(200).json({
        success: true,
        data: {
          fleet_stats: fleetStats,
          drones: dronesWithDeliveries,
          last_updated: new Date().toISOString()
        }
      });
    }

  } catch (error) {
    console.error('Drone status API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}

function calculateFleetStats(drones, activeDeliveries) {
  const total = drones.length;
  const available = drones.filter(d => d.status === 'available').length;
  const inFlight = drones.filter(d => d.status === 'in_flight').length;
  const maintenance = drones.filter(d => d.status === 'maintenance').length;
  const offline = drones.filter(d => d.status === 'offline').length;
  
  const totalBattery = drones.reduce((sum, d) => sum + d.battery_level, 0);
  const averageBattery = total > 0 ? Math.round(totalBattery / total) : 0;
  
  const activeDeliveryCount = activeDeliveries.length;
  const utilizationRate = total > 0 ? Math.round(((inFlight + activeDeliveryCount) / total) * 100) : 0;

  return {
    total_drones: total,
    available: available,
    in_flight: inFlight,
    maintenance: maintenance,
    offline: offline,
    average_battery: averageBattery,
    active_deliveries: activeDeliveryCount,
    utilization_rate: utilizationRate,
    operational_drones: available + inFlight
  };
}

function calculateDroneEfficiency(drone) {
  // Simple efficiency calculation based on battery level, maintenance, and status
  let efficiency = 100;
  
  // Battery impact
  if (drone.battery_level < 20) efficiency -= 30;
  else if (drone.battery_level < 50) efficiency -= 15;
  
  // Status impact
  if (drone.status === 'maintenance') efficiency = 0;
  else if (drone.status === 'offline') efficiency = 0;
  else if (drone.status === 'in_flight') efficiency += 10; // Bonus for active use
  
  // Maintenance impact (days since last maintenance)
  const daysSinceMaintenance = Math.floor(
    (Date.now() - new Date(drone.last_maintenance).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysSinceMaintenance > 30) efficiency -= 20;
  else if (daysSinceMaintenance > 14) efficiency -= 10;
  
  return Math.max(0, Math.min(100, efficiency));
}