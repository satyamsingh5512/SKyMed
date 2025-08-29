import { supabase } from '../lib/supabase';
import { dbService } from '../lib/supabase-enhanced';

export const setupDatabase = async () => {
  try {
    console.log('🔄 Setting up database...');

    // Test connection first - optimized for Vercel serverless
    const { error: testError } = await supabase
      .from('users')
      .select('id')
      .limit(1)
      .single();

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

    // Handle case where table exists but is empty (not an error for Vercel)
    if (testError && testError.code === 'PGRST116') {
      console.log('✅ Database tables exist (empty tables are OK)');
      return {
        success: true,
        message: 'Database is properly configured. Tables exist and are ready for data.'
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
    // Optimized for Vercel - check table existence efficiently
    const tables = ['users', 'drones', 'deliveries'];
    const checks = await Promise.allSettled(
      tables.map(table =>
        supabase.from(table).select('id').limit(1).maybeSingle()
      )
    );

    const results = checks.map((check, index) => {
      const isTableMissing = check.status === 'rejected' &&
        check.reason?.code === '42P01';

      return {
        table: tables[index],
        exists: !isTableMissing,
        hasData: check.status === 'fulfilled' && check.value.data !== null,
        error: check.status === 'rejected' ? check.reason : null
      };
    });

    return results;
  } catch (error) {
    console.error('Database status check failed:', error);
    return [];
  }
};

// Vercel-optimized health check for API routes
export const quickHealthCheck = async () => {
  try {
    const { error } = await supabase
      .from('users')
      .select('id')
      .limit(1)
      .maybeSingle();

    return {
      healthy: !error || error.code === 'PGRST116', // Empty table is OK
      timestamp: new Date().toISOString(),
      error: error?.message || null
    };
  } catch (error) {
    return {
      healthy: false,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Enhanced system health check
export const comprehensiveHealthCheck = async () => {
  try {
    const systemHealth = await dbService.getSystemHealth();
    
    if (!systemHealth.success) {
      return {
        healthy: false,
        timestamp: new Date().toISOString(),
        error: 'System health check failed',
        details: systemHealth.error
      };
    }

    return {
      healthy: true,
      timestamp: new Date().toISOString(),
      system_stats: systemHealth.data,
      backend_version: '2.0.0-enhanced'
    };
  } catch (error) {
    return {
      healthy: false,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Initialize enhanced backend features
export const initializeEnhancedBackend = async () => {
  try {
    console.log('🚀 Initializing enhanced backend features...');

    // Check if enhanced tables exist
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['user_activity', 'performance_metrics', 'notification_templates']);

    if (error) {
      return {
        success: false,
        message: 'Failed to check enhanced tables',
        error
      };
    }

    const enhancedTablesExist = tables && tables.length >= 3;

    return {
      success: true,
      enhanced_features_available: enhancedTablesExist,
      message: enhancedTablesExist ? 
        'Enhanced backend features are available' : 
        'Run supabase-enhanced-schema.sql to enable enhanced features',
      recommendations: enhancedTablesExist ? [] : [
        '1. Go to your Supabase project dashboard',
        '2. Navigate to SQL Editor',
        '3. Copy and paste the contents of supabase-enhanced-schema.sql',
        '4. Click Run to execute the enhanced schema'
      ]
    };

  } catch (error) {
    console.error('Enhanced backend initialization error:', error);
    return {
      success: false,
      message: 'Failed to initialize enhanced backend',
      error
    };
  }
};