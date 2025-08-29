// Enhanced Authentication API - Login
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
    const { email, password, loginType = 'email' } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Authenticate user
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(401).json({
        success: false,
        error: authError.message,
        code: authError.status
      });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
    }

    // Log login activity
    await supabase
      .from('user_activity')
      .insert([{
        user_id: authData.user.id,
        activity_type: 'login',
        details: { login_type: loginType, ip: req.headers['x-forwarded-for'] || 'unknown' },
        timestamp: new Date().toISOString()
      }])
      .catch(err => console.log('Activity log error:', err));

    return res.status(200).json({
      success: true,
      data: {
        user: authData.user,
        session: authData.session,
        profile: profile || null
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}