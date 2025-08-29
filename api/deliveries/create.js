// Enhanced Delivery API - Create Delivery
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      user_id,
      recipient_name,
      recipient_phone,
      pickup_address,
      delivery_address,
      package_type,
      weight,
      priority = 'medium',
      special_instructions,
      estimated_delivery_time
    } = req.body;

    // Validation
    const requiredFields = [
      'user_id', 'recipient_name', 'recipient_phone', 
      'pickup_address', 'delivery_address', 'package_type', 'weight'
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          error: `${field} is required`
        });
      }
    }

    if (weight <= 0 || weight > 10) {
      return res.status(400).json({
        success: false,
        error: 'Weight must be between 0.1 and 10 kg'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, user_type')
      .eq('id', user_id)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Calculate cost based on weight, distance, and priority
    const baseCost = 500; // Base cost in rupees
    const weightCost = weight * 200; // 200 per kg
    const priorityMultiplier = {
      'low': 1.0,
      'medium': 1.2,
      'high': 1.5,
      'emergency': 2.0
    };
    
    const totalCost = (baseCost + weightCost) * priorityMultiplier[priority];

    // Estimate delivery time based on priority
    const deliveryTimeMinutes = {
      'emergency': 15,
      'high': 30,
      'medium': 60,
      'low': 120
    };

    const estimatedDelivery = estimated_delivery_time || 
      new Date(Date.now() + deliveryTimeMinutes[priority] * 60000).toISOString();

    // Create delivery
    const { data: delivery, error: deliveryError } = await supabase
      .from('deliveries')
      .insert([{
        user_id,
        recipient_name,
        recipient_phone,
        pickup_address,
        delivery_address,
        package_type,
        weight: parseFloat(weight),
        priority,
        status: 'pending',
        cost: totalCost,
        estimated_delivery: estimatedDelivery,
        special_instructions: special_instructions || null
      }])
      .select()
      .single();

    if (deliveryError) {
      console.error('Delivery creation error:', deliveryError);
      return res.status(500).json({
        success: false,
        error: 'Failed to create delivery'
      });
    }

    // Create initial tracking entry
    await supabase
      .from('delivery_tracking')
      .insert([{
        delivery_id: delivery.id,
        location: JSON.stringify({ lat: 0, lng: 0 }), // Will be updated when drone is assigned
        status: 'Delivery request received and being processed',
        timestamp: new Date().toISOString()
      }]);

    // If emergency priority, create alert
    if (priority === 'emergency') {
      await supabase
        .from('emergency_alerts')
        .insert([{
          delivery_id: delivery.id,
          alert_type: 'medical_emergency',
          severity: 'high',
          message: `Emergency delivery requested: ${package_type} to ${recipient_name}`,
          status: 'active'
        }]);
    }

    // Try to auto-assign drone for high priority deliveries
    if (priority === 'emergency' || priority === 'high') {
      await autoAssignDrone(supabase, delivery.id);
    }

    return res.status(201).json({
      success: true,
      data: delivery,
      message: 'Delivery created successfully',
      estimated_cost: totalCost,
      estimated_delivery: estimatedDelivery
    });

  } catch (error) {
    console.error('Create delivery API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}

// Helper function to auto-assign drone
async function autoAssignDrone(supabase, deliveryId) {
  try {
    // Find available drone with highest battery
    const { data: availableDrone } = await supabase
      .from('drones')
      .select('*')
      .eq('status', 'available')
      .order('battery_level', { ascending: false })
      .limit(1)
      .single();

    if (availableDrone) {
      // Assign drone to delivery
      await supabase
        .from('deliveries')
        .update({
          drone_id: availableDrone.id,
          status: 'assigned'
        })
        .eq('id', deliveryId);

      // Update drone status
      await supabase
        .from('drones')
        .update({ status: 'assigned' })
        .eq('id', availableDrone.id);

      // Add tracking update
      await supabase
        .from('delivery_tracking')
        .insert([{
          delivery_id: deliveryId,
          location: availableDrone.current_location,
          status: `Drone ${availableDrone.name} assigned and preparing for takeoff`,
          timestamp: new Date().toISOString()
        }]);
    }
  } catch (error) {
    console.error('Auto-assign drone error:', error);
  }
}