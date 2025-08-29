// Enhanced Emergency API - Alert Management
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    switch (req.method) {
      case 'GET':
        return await getAlerts(req, res, supabase);
      case 'POST':
        return await createAlert(req, res, supabase);
      case 'PUT':
        return await updateAlert(req, res, supabase);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Emergency alerts API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}

async function getAlerts(req, res, supabase) {
  const { 
    status = 'active', 
    severity, 
    limit = 50,
    delivery_id 
  } = req.query;

  let query = supabase
    .from('emergency_alerts')
    .select(`
      *,
      deliveries (
        id,
        recipient_name,
        priority,
        status,
        package_type,
        users (
          full_name,
          phone,
          institution_name
        )
      )
    `)
    .order('created_at', { ascending: false })
    .limit(parseInt(limit));

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  if (severity) {
    query = query.eq('severity', severity);
  }

  if (delivery_id) {
    query = query.eq('delivery_id', delivery_id);
  }

  const { data: alerts, error } = await query;

  if (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch alerts'
    });
  }

  // Calculate alert statistics
  const stats = await calculateAlertStats(supabase);

  return res.status(200).json({
    success: true,
    data: {
      alerts: alerts || [],
      stats,
      total_count: alerts?.length || 0,
      last_updated: new Date().toISOString()
    }
  });
}

async function createAlert(req, res, supabase) {
  const {
    delivery_id,
    alert_type,
    severity,
    message,
    auto_escalate = false
  } = req.body;

  // Validation
  if (!delivery_id || !alert_type || !severity || !message) {
    return res.status(400).json({
      success: false,
      error: 'delivery_id, alert_type, severity, and message are required'
    });
  }

  const validAlertTypes = ['medical_emergency', 'drone_malfunction', 'weather', 'other'];
  const validSeverities = ['low', 'medium', 'high', 'critical'];

  if (!validAlertTypes.includes(alert_type)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid alert_type'
    });
  }

  if (!validSeverities.includes(severity)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid severity level'
    });
  }

  // Verify delivery exists
  const { data: delivery, error: deliveryError } = await supabase
    .from('deliveries')
    .select('id, status, priority')
    .eq('id', delivery_id)
    .single();

  if (deliveryError || !delivery) {
    return res.status(404).json({
      success: false,
      error: 'Delivery not found'
    });
  }

  // Create alert
  const { data: alert, error: alertError } = await supabase
    .from('emergency_alerts')
    .insert([{
      delivery_id,
      alert_type,
      severity,
      message,
      status: 'active'
    }])
    .select()
    .single();

  if (alertError) {
    return res.status(500).json({
      success: false,
      error: 'Failed to create alert'
    });
  }

  // Auto-escalate if critical or if requested
  if (severity === 'critical' || auto_escalate) {
    await escalateAlert(supabase, alert.id, delivery_id);
  }

  // Update delivery priority if alert is critical
  if (severity === 'critical' && delivery.priority !== 'emergency') {
    await supabase
      .from('deliveries')
      .update({ priority: 'emergency' })
      .eq('id', delivery_id);
  }

  return res.status(201).json({
    success: true,
    data: alert,
    message: 'Emergency alert created successfully'
  });
}

async function updateAlert(req, res, supabase) {
  const { alert_id, status, resolution_notes } = req.body;

  if (!alert_id || !status) {
    return res.status(400).json({
      success: false,
      error: 'alert_id and status are required'
    });
  }

  const validStatuses = ['active', 'resolved', 'dismissed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid status'
    });
  }

  const updateData = { status };
  if (status === 'resolved') {
    updateData.resolved_at = new Date().toISOString();
    if (resolution_notes) {
      updateData.resolution_notes = resolution_notes;
    }
  }

  const { data: alert, error } = await supabase
    .from('emergency_alerts')
    .update(updateData)
    .eq('id', alert_id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to update alert'
    });
  }

  return res.status(200).json({
    success: true,
    data: alert,
    message: 'Alert updated successfully'
  });
}

async function calculateAlertStats(supabase) {
  const { data: allAlerts } = await supabase
    .from('emergency_alerts')
    .select('status, severity, created_at');

  if (!allAlerts) return {};

  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const stats = {
    total_active: allAlerts.filter(a => a.status === 'active').length,
    total_resolved: allAlerts.filter(a => a.status === 'resolved').length,
    critical_active: allAlerts.filter(a => a.status === 'active' && a.severity === 'critical').length,
    alerts_last_24h: allAlerts.filter(a => new Date(a.created_at) > last24Hours).length,
    by_severity: {
      critical: allAlerts.filter(a => a.severity === 'critical').length,
      high: allAlerts.filter(a => a.severity === 'high').length,
      medium: allAlerts.filter(a => a.severity === 'medium').length,
      low: allAlerts.filter(a => a.severity === 'low').length
    }
  };

  return stats;
}

async function escalateAlert(supabase, alertId, deliveryId) {
  try {
    // Add escalation tracking
    await supabase
      .from('delivery_tracking')
      .insert([{
        delivery_id: deliveryId,
        location: JSON.stringify({ lat: 0, lng: 0 }),
        status: 'EMERGENCY ALERT ESCALATED - Priority response initiated',
        timestamp: new Date().toISOString(),
        notes: `Alert ${alertId} escalated to emergency response team`
      }]);

    // Here you could add additional escalation logic:
    // - Send notifications to emergency response team
    // - Trigger automated drone reassignment
    // - Alert nearby medical facilities
    
    console.log(`Alert ${alertId} escalated for delivery ${deliveryId}`);
  } catch (error) {
    console.error('Alert escalation error:', error);
  }
}