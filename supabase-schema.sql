-- SkyMed Emergency Delivery System Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (linked to Supabase Auth)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  user_type VARCHAR(20) DEFAULT 'user' CHECK (user_type IN ('user', 'operator', 'admin')),
  medical_id VARCHAR(100) UNIQUE,
  institution_name VARCHAR(255),
  institution_type VARCHAR(50) CHECK (institution_type IN ('hospital', 'clinic', 'pharmacy', 'laboratory', 'emergency_services', 'other')),
  license_number VARCHAR(100),
  department VARCHAR(100),
  auth_provider VARCHAR(50) DEFAULT 'email' CHECK (auth_provider IN ('email', 'google', 'medical_id')),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_documents JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drones table
CREATE TABLE drones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'in_flight', 'maintenance', 'offline')),
  battery_level INTEGER DEFAULT 100 CHECK (battery_level >= 0 AND battery_level <= 100),
  current_location JSONB NOT NULL DEFAULT '{"lat": 0, "lng": 0}',
  max_payload DECIMAL(5,2) NOT NULL,
  flight_time_remaining INTEGER DEFAULT 0,
  last_maintenance TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deliveries table
CREATE TABLE deliveries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipient_name VARCHAR(255) NOT NULL,
  recipient_phone VARCHAR(20) NOT NULL,
  pickup_address TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  package_type VARCHAR(100) NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'emergency')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_transit', 'delivered', 'cancelled')),
  drone_id UUID REFERENCES drones(id) ON DELETE SET NULL,
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  actual_delivery TIMESTAMP WITH TIME ZONE,
  cost DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery tracking table
CREATE TABLE delivery_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  delivery_id UUID REFERENCES deliveries(id) ON DELETE CASCADE,
  location JSONB NOT NULL,
  status VARCHAR(100) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Emergency alerts table
CREATE TABLE emergency_alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  delivery_id UUID REFERENCES deliveries(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('medical_emergency', 'drone_malfunction', 'weather', 'other')),
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_deliveries_user_id ON deliveries(user_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);
CREATE INDEX idx_deliveries_priority ON deliveries(priority);
CREATE INDEX idx_delivery_tracking_delivery_id ON delivery_tracking(delivery_id);
CREATE INDEX idx_emergency_alerts_delivery_id ON emergency_alerts(delivery_id);
CREATE INDEX idx_emergency_alerts_status ON emergency_alerts(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_drones_updated_at BEFORE UPDATE ON drones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON deliveries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO users (email, full_name, phone, address, user_type) VALUES
('admin@skymed.com', 'Admin User', '+91-9876543210', 'SkyMed HQ, Mumbai, India', 'admin'),
('operator@skymed.com', 'Operations Manager', '+91-9876543211', 'Control Center, Delhi, India', 'operator'),
('user1@example.com', 'Dr. Priya Sharma', '+91-9876543212', 'Apollo Hospital, Bangalore, India', 'user'),
('user2@example.com', 'Dr. Rajesh Kumar', '+91-9876543213', 'AIIMS, New Delhi, India', 'user');

INSERT INTO drones (name, model, status, battery_level, current_location, max_payload, flight_time_remaining) VALUES
('SkyMed-01', 'MedDrone Pro X1', 'available', 95, '{"lat": 19.0760, "lng": 72.8777}', 5.0, 45),
('SkyMed-02', 'MedDrone Pro X1', 'in_flight', 78, '{"lat": 28.6139, "lng": 77.2090}', 5.0, 32),
('SkyMed-03', 'MedDrone Pro X2', 'available', 100, '{"lat": 12.9716, "lng": 77.5946}', 8.0, 60),
('SkyMed-04', 'MedDrone Pro X1', 'maintenance', 0, '{"lat": 19.0760, "lng": 72.8777}', 5.0, 0),
('SkyMed-05', 'MedDrone Pro X2', 'available', 88, '{"lat": 13.0827, "lng": 80.2707}', 8.0, 55);

INSERT INTO deliveries (user_id, recipient_name, recipient_phone, pickup_address, delivery_address, package_type, weight, priority, status, drone_id, estimated_delivery, cost) VALUES
((SELECT id FROM users WHERE email = 'user1@example.com'), 'Emergency Ward', '+91-9876543220', 'Central Medical Store, Mumbai', 'Emergency Ward, Lilavati Hospital, Mumbai', 'Emergency Medicine Kit', 2.5, 'emergency', 'in_transit', (SELECT id FROM drones WHERE name = 'SkyMed-02'), NOW() + INTERVAL '15 minutes', 2410.00),
((SELECT id FROM users WHERE email = 'user2@example.com'), 'ICU Department', '+91-9876543221', 'Pharma Depot, Delhi', 'ICU, AIIMS Delhi', 'Blood Samples', 1.2, 'high', 'assigned', (SELECT id FROM drones WHERE name = 'SkyMed-01'), NOW() + INTERVAL '20 minutes', 1850.00),
((SELECT id FROM users WHERE email = 'user1@example.com'), 'Cardiology Unit', '+91-9876543222', 'Medical Supply Center, Bangalore', 'Cardiology, Manipal Hospital, Bangalore', 'Cardiac Medications', 0.8, 'medium', 'pending', NULL, NOW() + INTERVAL '30 minutes', 1480.00);

-- Insert sample tracking data
INSERT INTO delivery_tracking (delivery_id, location, status) VALUES
((SELECT id FROM deliveries WHERE recipient_name = 'Emergency Ward'), '{"lat": 19.0760, "lng": 72.8777}', 'Package picked up from depot'),
((SELECT id FROM deliveries WHERE recipient_name = 'Emergency Ward'), '{"lat": 19.0650, "lng": 72.8680}', 'En route to destination'),
((SELECT id FROM deliveries WHERE recipient_name = 'ICU Department'), '{"lat": 28.6139, "lng": 77.2090}', 'Drone assigned and preparing for takeoff');

-- Insert sample emergency alert
INSERT INTO emergency_alerts (delivery_id, alert_type, severity, message) VALUES
((SELECT id FROM deliveries WHERE recipient_name = 'Emergency Ward'), 'medical_emergency', 'critical', 'Critical patient requires immediate medication delivery - ETA 12 minutes');

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic policies - adjust based on your auth requirements)
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own deliveries" ON deliveries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create deliveries" ON deliveries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own deliveries" ON deliveries FOR UPDATE USING (auth.uid() = user_id);

-- Allow public read access to drones for tracking purposes
CREATE POLICY "Public can view drones" ON drones FOR SELECT TO public USING (true);

-- Allow public read access to delivery tracking for transparency
CREATE POLICY "Public can view delivery tracking" ON delivery_tracking FOR SELECT TO public USING (true);

-- Allow public read access to emergency alerts
CREATE POLICY "Public can view emergency alerts" ON emergency_alerts FOR SELECT TO public USING (true);