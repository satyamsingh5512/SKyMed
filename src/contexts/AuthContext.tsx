import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (mounted) {
        console.log('Auth loading timeout - setting loading to false');
        setLoading(false);
      }
    }, 5000); // 5 second timeout

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      
      if (error) {
        console.error('Error getting session:', error);
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      clearTimeout(loadingTimeout);
    }).catch((error) => {
      if (!mounted) return;
      console.error('Error in getSession:', error);
      setLoading(false);
      clearTimeout(loadingTimeout);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state change:', event, session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      // Handle Google OAuth profile creation
      if (event === 'SIGNED_IN' && session?.user && session.user.app_metadata?.provider === 'google') {
        try {
          await handleGoogleUserProfile(session.user);
        } catch (error) {
          console.error('Error handling Google user profile:', error);
        }
      }
      
      setLoading(false);
      clearTimeout(loadingTimeout);
    });

    return () => {
      mounted = false;
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const handleGoogleUserProfile = async (user: User) => {
    try {
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
    } catch (error) {
      console.error('Error handling Google user profile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) throw error;

      // Create user profile in our users table
      if (data.user) {
        const profileData = {
          id: data.user.id,
          email: data.user.email,
          full_name: userData.full_name,
          phone: userData.phone || null,
          address: userData.address || null,
          user_type: userData.user_type || 'user',
          medical_id: userData.medical_id || null,
          institution_name: userData.institution_name || null,
          institution_type: userData.institution_type || null,
          license_number: userData.license_number || null,
          department: userData.department || null,
          auth_provider: userData.auth_provider || 'email',
          is_verified: userData.is_verified || false
        };

        const { error: profileError } = await supabase
          .from('users')
          .insert([profileData]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Password reset error:', error);
      return { data: null, error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};