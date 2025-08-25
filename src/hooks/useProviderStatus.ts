import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ProviderStatus {
  google: boolean;
  loading: boolean;
}

export const useProviderStatus = (): ProviderStatus => {
  const [status, setStatus] = useState<ProviderStatus>({
    google: false,
    loading: true
  });

  useEffect(() => {
    const checkProviders = async () => {
      try {
        // Try to get the auth configuration
        // This is a simple way to check if providers are enabled
        const { data, error } = await supabase.auth.getSession();
        
        // For now, we'll assume Google is available and let the error handling in login deal with it
        // In a real app, you might want to check the Supabase settings or make a test call
        setStatus({
          google: true, // We'll let the login component handle the actual availability
          loading: false
        });
      } catch (error) {
        setStatus({
          google: false,
          loading: false
        });
      }
    };

    checkProviders();
  }, []);

  return status;
};