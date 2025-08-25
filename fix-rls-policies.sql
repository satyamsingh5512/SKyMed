-- Temporary fix for RLS policies to allow public access for testing
-- Run this in your Supabase SQL Editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Users can view their own deliveries" ON deliveries;
DROP POLICY IF EXISTS "Users can create deliveries" ON deliveries;

-- Create more permissive policies for testing (you can tighten these later with proper auth)
CREATE POLICY "Allow public read access to users" ON users FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert to users" ON users FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update to users" ON users FOR UPDATE TO public USING (true);

CREATE POLICY "Allow public read access to deliveries" ON deliveries FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert to deliveries" ON deliveries FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update to deliveries" ON deliveries FOR UPDATE TO public USING (true);

CREATE POLICY "Allow public insert to delivery_tracking" ON delivery_tracking FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public insert to emergency_alerts" ON emergency_alerts FOR INSERT TO public WITH CHECK (true);

-- Note: In production, you should implement proper authentication and more restrictive policies