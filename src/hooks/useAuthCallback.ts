import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export const useAuthCallback = () => {
  const { user } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (user && user.app_metadata?.provider === 'google') {
        // Check if user profile exists
        const { data: existingProfile, error } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single();

        if (error && error.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const { error: createError } = await supabase
            .from('users')
            .insert([
              {
                id: user.id,
                email: user.email || '',
                full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'Google User',
                phone: user.user_metadata?.phone || null,
                address: null,
                user_type: 'user',
                auth_provider: 'google',
                is_verified: true // Google users are pre-verified
              }
            ]);

          if (createError) {
            console.error('Failed to create Google user profile:', createError);
          } else {
            console.log('Google user profile created successfully');
          }
        }
      }
    };

    if (user) {
      handleAuthCallback();
    }
  }, [user]);
};