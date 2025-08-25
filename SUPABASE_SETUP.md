# Supabase Setup Guide for SkyMed

This guide will help you set up Supabase as the database backend for the SkyMed emergency delivery system.

## Prerequisites

- A Supabase account (free tier available)
- Node.js and npm installed
- SkyMed project cloned locally

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: SkyMed Emergency Delivery
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (2-3 minutes)

## Step 2: Get Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **Project API Key** (anon/public key)

## Step 3: Configure Environment Variables

1. Open your `.env` file in the project root
2. Replace the placeholder values:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

## Step 4: Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql` from your project
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

This will create:
- All necessary tables (users, deliveries, drones, etc.)
- Sample data for testing
- Indexes for performance
- Row Level Security policies
- Real-time subscriptions

## Step 5: Verify Setup

1. Go to **Table Editor** in Supabase dashboard
2. You should see these tables:
   - `users` (4 sample users)
   - `drones` (5 sample drones)
   - `deliveries` (3 sample deliveries)
   - `delivery_tracking`
   - `emergency_alerts`

## Step 6: Test the Connection

1. Start your development server:
```bash
npm run dev
```

2. Open the application in your browser
3. Check the browser console for any connection errors
4. Navigate to different pages to see if data loads correctly

## Features Enabled

✅ **Real-time Updates**: Changes in the database automatically update the UI
✅ **User Management**: Complete user system with different roles
✅ **Delivery Tracking**: Full delivery lifecycle management
✅ **Drone Fleet**: Real-time drone status and location tracking
✅ **Emergency Alerts**: Critical alert system with severity levels
✅ **Analytics Data**: Sample data for dashboard metrics

## Sample Data Included

- **4 Users**: Admin, operator, and 2 medical professionals
- **5 Drones**: Various models with different statuses
- **3 Deliveries**: Different priority levels and statuses
- **Emergency Alert**: One active critical alert
- **Tracking Data**: Sample location tracking

## Security Features

- Row Level Security (RLS) enabled
- User-specific data access policies
- Public read access for tracking transparency
- Secure API key authentication

## Troubleshooting

### Connection Issues
- Verify your environment variables are correct
- Check that your Supabase project is active
- Ensure you're using the correct API key (anon/public, not service role)

### Schema Issues
- Make sure the SQL schema ran without errors
- Check the Supabase logs for any constraint violations
- Verify all tables were created successfully

### Real-time Issues
- Ensure your Supabase project has real-time enabled (default)
- Check browser console for subscription errors
- Verify your API key has the correct permissions

## Next Steps

1. Customize the sample data for your needs
2. Set up authentication if required
3. Configure additional RLS policies as needed
4. Add more sample data for testing
5. Set up production environment variables

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Community](https://github.com/supabase/supabase/discussions)
- Check the browser console for detailed error messages