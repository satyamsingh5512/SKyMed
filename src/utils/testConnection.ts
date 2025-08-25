import { supabase } from '../lib/supabase';

export const testSupabaseConnection = async () => {
  try {
    // Simple connection test
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Connection test failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
    
    console.log('✅ Supabase connection successful');
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Connection test error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown connection error'
    };
  }
};