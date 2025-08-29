// Enhanced Authentication API - Registration
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
      email,
      password,
      full_name,
      phone,
      address,
      user_type = 'user',
      medical_id,
      institution_name,
      institution_type,
      license_number,
      department
    } = req.body;

    // Validation
    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and full name are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          user_type
        }
      }
    });

    if (authError) {
      return res.status(400).json({
        success: false,
        error: authError.message
      });
    }

    // Create user profile
    if (authData.user) {
      const profileData = {
        id: authData.user.id,
        email,
        full_name,
        phone: phone || null,
        address: address || null,
        user_type,
        medical_id: medical_id || null,
        institution_name: institution_name || null,
        institution_type: institution_type || null,
        license_number: license_number || null,
        department: department || null,
        auth_provider: 'email',
        is_verified: false
      };

      const { error: profileError } = await supabase
        .from('users')
        .insert([profileData]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Note: Auth user is already created, but profile failed
        return res.status(500).json({
          success: false,
          error: 'Account created but profile setup failed. Please contact support.',
          user_id: authData.user.id
        });
      }

      // Log registration activity
      await supabase
        .from('user_activity')
        .insert([{
          user_id: authData.user.id,
          activity_type: 'registration',
          details: { user_type, institution_type },
          timestamp: new Date().toISOString()
        }])
        .catch(err => console.log('Activity log error:', err));
    }

    return res.status(201).json({
      success: true,
      data: {
        user: authData.user,
        session: authData.session
      },
      message: 'Registration successful. Please check your email for verification.'
    });

  } catch (error) {
    console.error('Registration API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}