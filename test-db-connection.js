// Simple Node.js script to test Supabase connection
// Run with: node test-db-connection.js

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase Database Connection...\n')

// Check environment variables
console.log('Environment Variables:')
console.log(`VITE_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`)
console.log(`VITE_SUPABASE_ANON_KEY: ${supabaseKey ? '✅ Set' : '❌ Missing'}\n`)

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing environment variables. Please check your .env file.')
  process.exit(1)
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('🔌 Testing basic connection...')
    
    // Test basic connection by querying drones table
    const { data, error, count } = await supabase
      .from('drones')
      .select('*', { count: 'exact' })
      .limit(1)

    if (error) {
      throw error
    }

    console.log('✅ Connection successful!')
    console.log(`📊 Found ${count} drones in database`)
    
    if (data && data.length > 0) {
      console.log(`🚁 Sample drone: ${data[0].name} (${data[0].status})`)
    }

    // Test other tables
    console.log('\n📋 Testing all tables...')
    
    const tables = ['users', 'deliveries', 'emergency_alerts', 'delivery_tracking']
    
    for (const table of tables) {
      try {
        const { count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
        
        console.log(`✅ ${table}: ${count} records`)
      } catch (err) {
        console.log(`❌ ${table}: Error - ${err.message}`)
      }
    }

    console.log('\n🎉 Database connection test completed successfully!')
    
  } catch (error) {
    console.log('❌ Connection failed!')
    console.log('Error:', error.message)
    
    if (error.message.includes('Invalid API key')) {
      console.log('\n💡 Tip: Check that your VITE_SUPABASE_ANON_KEY is correct')
    } else if (error.message.includes('Invalid URL')) {
      console.log('\n💡 Tip: Check that your VITE_SUPABASE_URL is correct')
    } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
      console.log('\n💡 Tip: Run the SQL schema in your Supabase dashboard first')
    }
    
    process.exit(1)
  }
}

testConnection()