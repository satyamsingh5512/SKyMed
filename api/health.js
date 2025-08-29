// Vercel Serverless Function - Health Check
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
    const startTime = Date.now();
    
    // Initialize Supabase client
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        status: 'error',
        message: 'Supabase configuration missing',
        timestamp: new Date().toISOString()
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Quick health check
    const { error } = await supabase
      .from('users')
      .select('id')
      .limit(1)
      .maybeSingle();

    const responseTime = Date.now() - startTime;
    const isHealthy = !error || error.code === 'PGRST116'; // Empty table is OK

    return res.status(200).json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      service: 'AeroVita Emergency Delivery System',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      database: {
        connected: isHealthy,
        error: error?.message || null
      },
      environment: process.env.VERCEL_ENV || 'development'
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}