-- Sample data for SkyMed Emergency Delivery System
-- Run this if your tables exist but are empty

-- Insert sample users (only if they don't exist)
INSERT INTO users (email, full_name, phone, address, user_type) 
SELECT * FROM (VALUES
  ('admin@skymed.com', 'Admin User', '+91-9876543210', 'SkyMed HQ, Mumbai, India', 'admin'),
  ('operator@skymed.com', 'Operations Manager', '+91-9876543211', 'Control Center, Delhi, India', 'operator'),
  ('user1@example.com', 'Dr. Priya Sharma', '+91-9876543212', 'Apollo Hospital, Bangalore, India', 'user'),
  ('user2@example.com', 'Dr. Rajesh Kumar', '+91-9876543213', 'AIIMS, New Delhi, India', 'user')
) AS v(email, full_name, phone, address, user_type)
WHERE NOT EXISTS (SELECT 1 FROM users WHERE users.email = v.email);

-- Insert sample drones (only if they don't exist)
INSERT INTO drones (name, model, status, battery_level, current_location, max_payload, flight_time_remaining) 
SELECT * FROM (VALUES
  ('SkyMed-01', 'MedDrone Pro X1', 'available', 95, '{"lat": 19.0760, "lng": 72.8777}', 5.0, 45),
  ('SkyMed-02', 'MedDrone Pro X1', 'in_flight', 78, '{"lat": 28.6139, "lng": 77.2090}', 5.0, 32),
  ('SkyMed-03', 'MedDrone Pro X2', 'available', 100, '{"lat": 12.9716, "lng": 77.5946}', 8.0, 60),
  ('SkyMed-04', 'MedDrone Pro X1', 'maintenance', 0, '{"lat": 19.0760, "lng": 72.8777}', 5.0, 0),
  ('SkyMed-05', 'MedDrone Pro X2', 'available', 88, '{"lat": 13.0827, "lng": 80.2707}', 8.0, 55)
) AS v(name, model, status, battery_level, current_location, max_payload, flight_time_remaining)
WHERE NOT EXISTS (SELECT 1 FROM drones WHERE drones.name = v.name);

-- Insert sample deliveries (only if they don't exist)
INSERT INTO deliveries (user_id, recipient_name, recipient_phone, pickup_address, delivery_address, package_type, weight, priority, status, drone_id, estimated_delivery, cost)
SELECT 
  u.id,
  v.recipient_name,
  v.recipient_phone,
  v.pickup_address,
  v.delivery_address,
  v.package_type,
  v.weight,
  v.priority,
  v.status,
  d.id,
  NOW() + v.eta_interval,
  v.cost
FROM (VALUES
  ('user1@example.com', 'Emergency Ward', '+91-9876543220', 'Central Medical Store, Mumbai', 'Emergency Ward, Lilavati Hospital, Mumbai', 'Emergency Medicine Kit', 2.5, 'emergency', 'in_transit', 'SkyMed-02', INTERVAL '15 minutes', 2410.00),
  ('user2@example.com', 'ICU Department', '+91-9876543221', 'Pharma Depot, Delhi', 'ICU, AIIMS Delhi', 'Blood Samples', 1.2, 'high', 'assigned', 'SkyMed-01', INTERVAL '20 minutes', 1850.00),
  ('user1@example.com', 'Cardiology Unit', '+91-9876543222', 'Medical Supply Center, Bangalore', 'Cardiology, Manipal Hospital, Bangalore', 'Cardiac Medications', 0.8, 'medium', 'pending', NULL, INTERVAL '30 minutes', 1480.00)
) AS v(user_email, recipient_name, recipient_phone, pickup_address, delivery_address, package_type, weight, priority, status, drone_name, eta_interval, cost)
JOIN users u ON u.email = v.user_email
LEFT JOIN drones d ON d.name = v.drone_name
WHERE NOT EXISTS (
  SELECT 1 FROM deliveries 
  WHERE deliveries.recipient_name = v.recipient_name 
  AND deliveries.user_id = u.id
);

-- Insert sample tracking data
INSERT INTO delivery_tracking (delivery_id, location, status)
SELECT 
  d.id,
  v.location::jsonb,
  v.status
FROM (VALUES
  ('Emergency Ward', '{"lat": 19.0760, "lng": 72.8777}', 'Package picked up from depot'),
  ('Emergency Ward', '{"lat": 19.0650, "lng": 72.8680}', 'En route to destination'),
  ('ICU Department', '{"lat": 28.6139, "lng": 77.2090}', 'Drone assigned and preparing for takeoff')
) AS v(recipient_name, location, status)
JOIN deliveries d ON d.recipient_name = v.recipient_name
WHERE NOT EXISTS (
  SELECT 1 FROM delivery_tracking 
  WHERE delivery_tracking.delivery_id = d.id 
  AND delivery_tracking.status = v.status
);

-- Insert sample emergency alert
INSERT INTO emergency_alerts (delivery_id, alert_type, severity, message)
SELECT 
  d.id,
  'medical_emergency',
  'critical',
  'Critical patient requires immediate medication delivery - ETA 12 minutes'
FROM deliveries d
WHERE d.recipient_name = 'Emergency Ward'
AND NOT EXISTS (
  SELECT 1 FROM emergency_alerts 
  WHERE emergency_alerts.delivery_id = d.id
);