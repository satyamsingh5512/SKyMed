import { supabase } from '../lib/supabase';

export const setupDatabase = async () => {
  try {
    console.log('🔄 Setting up database...');

    // Test connection first
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (testError && testError.code === '42P01') {
      console.log('❌ Tables not found. Please run the SQL schema first.');
      return {
        success: false,
        message: 'Database tables not found. Please run the SQL schema in Supabase dashboard.',
        instructions: [
          '1. Go to your Supabase project dashboard',
          '2. Navigate to SQL Editor',
          '3. Copy and paste the contents of supabase-schema.sql',
          '4. Click Run to execute the schema'
        ]
      };
    }

    if (testError) {
      console.error('Database connection error:', testError);
      return {
        success: false,
        message: `Database error: ${testError.message}`,
        error: testError
      };
    }

    console.log('✅ Database connection successful!');
    return {
      success: true,
      message: 'Database is properly configured and accessible.'
    };

  } catch (error) {
    console.error('Setup error:', error);
    return {
      success: false,
      message: 'Failed to connect to database',
      error
    };
  }
};

export const checkDatabaseStatus = async () => {
  try {
    // Check if tables exist and have data
    const checks = await Promise.allSettled([
      supabase.from('users').select('count').limit(1),
      supabase.from('drones').select('count').limit(1),
      supabase.from('deliveries').select('count').limit(1)
    ]);

    const results = checks.map((check, index) => {
      const tables = ['users', 'drones', 'deliveries'];
      return {
        table: tables[index],
        exists: check.status === 'fulfilled',
        error: check.status === 'rejected' ? check.reason : null
      };
    });

    return results;
  } catch (error) {
    console.error('Database status check failed:', error);
    return [];
  }
};