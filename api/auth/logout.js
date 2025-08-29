// Enhanced Authentication API - Logout
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
    const { user_id, session_token } = req.body;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Log logout activity if user_id is provided
    if (user_id) {
      try {
        await supabase
          .from('user_activity')
          .insert([{
            user_id: user_id,
            activity_type: 'logout',
            details: { 
              logout_method: 'manual',
              ip: req.headers['x-forwarded-for'] || 'unknown',
              user_agent: req.headers['user-agent'] || 'unknown'
            },
            timestamp: new Date().toISOString()
          }]);
      } catch (activityError) {
        console.log('Activity log error (non-critical):', activityError);
      }
    }

    // Perform server-side logout if session token is provided
    if (session_token) {
      try {
        // This would invalidate the session on the server side
        // For now, we'll just log it
        console.log('Server-side logout requested for session:', session_token.substring(0, 10) + '...');
      } catch (sessionError) {
        console.log('Session invalidation error (non-critical):', sessionError);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Logout successful',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Logout API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}