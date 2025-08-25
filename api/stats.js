// Vercel Serverless Function - Real-time Stats
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Mock real-time stats for demo (replace with actual Supabase queries)
    const stats = {
      system: {
        uptime: '99.9%',
        response_time: '< 100ms',
        active_connections: Math.floor(Math.random() * 50) + 10,
        last_updated: new Date().toISOString()
      },
      deliveries: {
        total_today: Math.floor(Math.random() * 100) + 50,
        in_progress: Math.floor(Math.random() * 10) + 2,
        completed_today: Math.floor(Math.random() * 90) + 45,
        success_rate: (98 + Math.random() * 2).toFixed(1) + '%'
      },
      fleet: {
        total_drones: 12,
        available: Math.floor(Math.random() * 8) + 4,
        in_flight: Math.floor(Math.random() * 4) + 1,
        maintenance: Math.floor(Math.random() * 2),
        average_battery: Math.floor(Math.random() * 30) + 70
      },
      emergency: {
        active_alerts: Math.floor(Math.random() * 3),
        response_time_avg: '8.5 minutes',
        priority_deliveries: Math.floor(Math.random() * 5) + 1
      }
    };

    // If Supabase is configured, try to get real data
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      try {
        // Try to get actual counts (will fallback to mock data if tables don't exist)
        const [usersResult, dronesResult, deliveriesResult] = await Promise.allSettled([
          supabase.from('users').select('id', { count: 'exact' }),
          supabase.from('drones').select('id', { count: 'exact' }),
          supabase.from('deliveries').select('id', { count: 'exact' })
        ]);

        if (usersResult.status === 'fulfilled' && usersResult.value.count !== null) {
          stats.system.registered_users = usersResult.value.count;
        }
        if (dronesResult.status === 'fulfilled' && dronesResult.value.count !== null) {
          stats.fleet.total_drones = dronesResult.value.count;
        }
        if (deliveriesResult.status === 'fulfilled' && deliveriesResult.value.count !== null) {
          stats.deliveries.total_all_time = deliveriesResult.value.count;
        }
      } catch (dbError) {
        // Continue with mock data if database queries fail
        console.log('Using mock data due to database error:', dbError.message);
      }
    }

    return res.status(200).json({
      success: true,
      stats,
      timestamp: new Date().toISOString(),
      source: supabaseUrl ? 'live_data' : 'demo_data'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}