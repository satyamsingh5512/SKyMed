import { supabase } from '../lib/supabase';

// Demo users to create
const demoUsers = [
  {
    email: 'admin@skymed.com',
    password: 'admin123',
    userData: {
      full_name: 'SkyMed Administrator',
      phone: '+91-9876543210',
      address: 'SkyMed HQ, Mumbai, India',
      user_type: 'admin',
      institution_name: 'SkyMed Emergency Services',
      institution_type: 'emergency_services',
      department: 'Administration'
    }
  },
  {
    email: 'doctor@skymed.com',
    password: 'doctor123',
    userData: {
      full_name: 'Dr. Arjun Patel',
      phone: '+91-9876543211',
      address: 'Apollo Hospital, Mumbai, India',
      user_type: 'user',
      medical_id: 'MED-DOC-001',
      institution_name: 'Apollo Hospital',
      institution_type: 'hospital',
      license_number: 'MH-DOC-12345',
      department: 'Emergency Medicine'
    }
  },
  {
    email: 'nurse@skymed.com',
    password: 'nurse123',
    userData: {
      full_name: 'Nurse Priya Sharma',
      phone: '+91-9876543212',
      address: 'Lilavati Hospital, Mumbai, India',
      user_type: 'user',
      medical_id: 'MED-NUR-001',
      institution_name: 'Lilavati Hospital',
      institution_type: 'hospital',
      license_number: 'MH-NUR-67890',
      department: 'Critical Care'
    }
  }
];

export const createDemoUsers = async () => {
  console.log('🚀 Creating demo users...');
  
  for (const user of demoUsers) {
    try {
      console.log(`Creating user: ${user.email}`);
      
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: user.userData
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log(`✅ User ${user.email} already exists`);
          continue;
        }
        throw authError;
      }

      if (authData.user) {
        // Insert user data into our users table
        const { error: dbError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: user.email,
            ...user.userData,
            auth_provider: 'email',
            is_verified: true
          });

        if (dbError) {
          console.error(`❌ Error inserting user data for ${user.email}:`, dbError);
        } else {
          console.log(`✅ Successfully created user: ${user.email}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error creating user ${user.email}:`, error);
    }
  }
  
  console.log('🎉 Demo user creation completed!');
};

// Function to check if demo users exist
export const checkDemoUsers = async () => {
  console.log('🔍 Checking demo users...');
  
  for (const user of demoUsers) {
    const { data, error } = await supabase
      .from('users')
      .select('email, full_name, user_type')
      .eq('email', user.email)
      .single();
    
    if (data) {
      console.log(`✅ ${user.email} exists: ${data.full_name} (${data.user_type})`);
    } else {
      console.log(`❌ ${user.email} not found`);
    }
  }
};

// Function to delete demo users (for cleanup)
export const deleteDemoUsers = async () => {
  console.log('🗑️ Deleting demo users...');
  
  for (const user of demoUsers) {
    try {
      // Note: This will only delete from our users table
      // Supabase Auth users need to be deleted from the Auth dashboard
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('email', user.email);
      
      if (error) {
        console.error(`❌ Error deleting ${user.email}:`, error);
      } else {
        console.log(`✅ Deleted user data for: ${user.email}`);
      }
    } catch (error) {
      console.error(`❌ Error deleting user ${user.email}:`, error);
    }
  }
  
  console.log('⚠️ Note: Auth users still exist in Supabase Auth - delete them from the dashboard if needed');
};