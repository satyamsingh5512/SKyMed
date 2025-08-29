-- Enhanced AeroVita Database Schema with Advanced Features
-- Run this after the basic schema to add enhanced functionality

-- User Activity Tracking
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Keys for external integrations
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  key_name VARCHAR(100) NOT NULL,
  key_hash VARCHAR(255) NOT NULL,
  permissions JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  last_used TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Configuration
CREATE TABLE IF NOT EXISTS system_config (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification Templates
CREATE TABLE IF NOT EXISTS notification_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  template_name VARCHAR(100) UNIQUE NOT NULL,
  template_type VARCHAR(50) NOT NULL CHECK (template_type IN ('email', 'sms', 'push', 'webhook')),
  subject VARCHAR(255),
  content TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Notifications
CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  delivery_method VARCHAR(20) DEFAULT 'in_app' CHECK (delivery_method IN ('in_app', 'email', 'sms', 'push')),
  sent_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery Routes (for optimization)
CREATE TABLE IF NOT EXISTS delivery_routes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  route_name VARCHAR(100) NOT NULL,
  waypoints JSONB NOT NULL,
  total_distance DECIMAL(10,2),
  estimated_time INTEGER, -- in minutes
  is_optimized BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drone Maintenance Records
CREATE TABLE IF NOT EXISTS drone_maintenance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  drone_id UUID REFERENCES drones(id) ON DELETE CASCADE,
  maintenance_type VARCHAR(50) NOT NULL CHECK (maintenance_type IN ('routine', 'repair', 'upgrade', 'inspection')),
  description TEXT NOT NULL,
  cost DECIMAL(10,2),
  performed_by VARCHAR(255),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Metrics
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  metric_type VARCHAR(50) NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  metric_value DECIMAL(15,4) NOT NULL,
  unit VARCHAR(20),
  tags JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery Feedback
CREATE TABLE IF NOT EXISTS delivery_feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  delivery_id UUID REFERENCES deliveries(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  delivery_time_rating INTEGER CHECK (delivery_time_rating >= 1 AND delivery_time_rating <= 5),
  drone_performance_rating INTEGER CHECK (drone_performance_rating >= 1 AND drone_performance_rating <= 5),
  overall_satisfaction INTEGER CHECK (overall_satisfaction >= 1 AND overall_satisfaction <= 5),
  would_recommend BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weather Data (for flight planning)
CREATE TABLE IF NOT EXISTS weather_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  location JSONB NOT NULL,
  temperature DECIMAL(5,2),
  humidity INTEGER,
  wind_speed DECIMAL(5,2),
  wind_direction INTEGER,
  visibility DECIMAL(5,2),
  weather_condition VARCHAR(50),
  is_flight_safe BOOLEAN DEFAULT TRUE,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Geofences (restricted areas)
CREATE TABLE IF NOT EXISTS geofences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  fence_type VARCHAR(50) NOT NULL CHECK (fence_type IN ('restricted', 'no_fly', 'priority', 'hospital_zone')),
  coordinates JSONB NOT NULL, -- GeoJSON polygon
  altitude_min INTEGER DEFAULT 0,
  altitude_max INTEGER DEFAULT 500,
  is_active BOOLEAN DEFAULT TRUE,
  description TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Emergency Alerts with more fields
ALTER TABLE emergency_alerts ADD COLUMN IF NOT EXISTS priority_level INTEGER DEFAULT 1 CHECK (priority_level >= 1 AND priority_level <= 5);
ALTER TABLE emergency_alerts ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES users(id);
ALTER TABLE emergency_alerts ADD COLUMN IF NOT EXISTS resolution_notes TEXT;
ALTER TABLE emergency_alerts ADD COLUMN IF NOT EXISTS escalated_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE emergency_alerts ADD COLUMN IF NOT EXISTS response_time_minutes INTEGER;

-- Enhanced Deliveries table
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS special_instructions TEXT;
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS temperature_controlled BOOLEAN DEFAULT FALSE;
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS fragile BOOLEAN DEFAULT FALSE;
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS insurance_value DECIMAL(10,2);
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS pickup_window_start TIMESTAMP WITH TIME ZONE;
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS pickup_window_end TIMESTAMP WITH TIME ZONE;
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS delivery_window_start TIMESTAMP WITH TIME ZONE;
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS delivery_window_end TIMESTAMP WITH TIME ZONE;

-- Enhanced Drones table
ALTER TABLE drones ADD COLUMN IF NOT EXISTS firmware_version VARCHAR(50);
ALTER TABLE drones ADD COLUMN IF NOT EXISTS total_flight_hours DECIMAL(10,2) DEFAULT 0;
ALTER TABLE drones ADD COLUMN IF NOT EXISTS total_deliveries INTEGER DEFAULT 0;
ALTER TABLE drones ADD COLUMN IF NOT EXISTS last_communication TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE drones ADD COLUMN IF NOT EXISTS capabilities JSONB DEFAULT '[]';

-- Create additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_timestamp ON user_activity(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_is_read ON user_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_type ON performance_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_recorded_at ON performance_metrics(recorded_at);
CREATE INDEX IF NOT EXISTS idx_drone_maintenance_drone_id ON drone_maintenance(drone_id);
CREATE INDEX IF NOT EXISTS idx_delivery_feedback_delivery_id ON delivery_feedback(delivery_id);
CREATE INDEX IF NOT EXISTS idx_weather_data_recorded_at ON weather_data(recorded_at);

-- Create updated_at triggers for new tables
CREATE TRIGGER update_notification_templates_updated_at BEFORE UPDATE ON notification_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_config_updated_at BEFORE UPDATE ON system_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default system configuration
INSERT INTO system_config (config_key, config_value, description, is_public) VALUES
('max_delivery_weight', '10.0', 'Maximum delivery weight in kg', true),
('max_delivery_distance', '50.0', 'Maximum delivery distance in km', true),
('emergency_response_time', '15', 'Target emergency response time in minutes', true),
('drone_battery_threshold', '20', 'Minimum battery level for new deliveries', false),
('maintenance_interval_hours', '100', 'Drone maintenance interval in flight hours', false),
('weather_check_interval', '30', 'Weather data refresh interval in minutes', false)
ON CONFLICT (config_key) DO NOTHING;

-- Insert default notification templates
INSERT INTO notification_templates (template_name, template_type, subject, content, variables) VALUES
('delivery_created', 'email', 'Delivery Request Confirmed - {{delivery_id}}', 
 'Your delivery request has been confirmed. Tracking ID: {{delivery_id}}. Estimated delivery: {{estimated_delivery}}.', 
 '["delivery_id", "estimated_delivery", "recipient_name"]'),
('delivery_assigned', 'push', 'Drone Assigned', 
 'Drone {{drone_name}} has been assigned to your delivery. ETA: {{eta}} minutes.', 
 '["drone_name", "eta"]'),
('delivery_completed', 'sms', 'Delivery Completed', 
 'Your delivery to {{recipient_name}} has been completed successfully.', 
 '["recipient_name", "delivery_time"]'),
('emergency_alert', 'email', 'EMERGENCY ALERT - {{alert_type}}', 
 'Emergency alert for delivery {{delivery_id}}: {{message}}. Immediate attention required.', 
 '["alert_type", "delivery_id", "message", "severity"]')
ON CONFLICT (template_name) DO NOTHING;

-- Create RLS policies for new tables
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE drone_maintenance ENABLE ROW LEVEL SECURITY;

-- User activity policies
CREATE POLICY "Users can view their own activity" ON user_activity FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert activity" ON user_activity FOR INSERT WITH CHECK (true);

-- User notifications policies
CREATE POLICY "Users can view their own notifications" ON user_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON user_notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON user_notifications FOR INSERT WITH CHECK (true);

-- Delivery feedback policies
CREATE POLICY "Users can view their own feedback" ON delivery_feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create feedback" ON delivery_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own feedback" ON delivery_feedback FOR UPDATE USING (auth.uid() = user_id);

-- Public read access for operational data
CREATE POLICY "Public can view system config" ON system_config FOR SELECT TO public USING (is_public = true);
CREATE POLICY "Public can view notification templates" ON notification_templates FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Public can view weather data" ON weather_data FOR SELECT TO public USING (true);
CREATE POLICY "Public can view geofences" ON geofences FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Public can view performance metrics" ON performance_metrics FOR SELECT TO public USING (true);

-- Create functions for common operations
CREATE OR REPLACE FUNCTION get_delivery_stats(timeframe_filter TEXT DEFAULT '24h')
RETURNS TABLE (
  total_deliveries BIGINT,
  completed_deliveries BIGINT,
  in_progress_deliveries BIGINT,
  emergency_deliveries BIGINT,
  average_delivery_time DECIMAL,
  success_rate DECIMAL
) AS $
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_deliveries,
    COUNT(*) FILTER (WHERE status = 'delivered') as completed_deliveries,
    COUNT(*) FILTER (WHERE status IN ('assigned', 'in_transit')) as in_progress_deliveries,
    COUNT(*) FILTER (WHERE priority = 'emergency') as emergency_deliveries,
    AVG(EXTRACT(EPOCH FROM (actual_delivery - created_at))/60) FILTER (WHERE actual_delivery IS NOT NULL) as average_delivery_time,
    (COUNT(*) FILTER (WHERE status = 'delivered')::DECIMAL / NULLIF(COUNT(*), 0) * 100) as success_rate
  FROM deliveries
  WHERE 
    CASE 
      WHEN timeframe_filter = '24h' THEN created_at >= NOW() - INTERVAL '24 hours'
      WHEN timeframe_filter = '7d' THEN created_at >= NOW() - INTERVAL '7 days'
      WHEN timeframe_filter = '30d' THEN created_at >= NOW() - INTERVAL '30 days'
      ELSE true
    END;
END;
$ LANGUAGE plpgsql;

-- Function to calculate drone efficiency
CREATE OR REPLACE FUNCTION calculate_drone_efficiency(drone_uuid UUID)
RETURNS DECIMAL AS $
DECLARE
  efficiency DECIMAL := 100;
  battery_level INTEGER;
  days_since_maintenance INTEGER;
  total_flights INTEGER;
BEGIN
  SELECT d.battery_level, 
         EXTRACT(DAY FROM NOW() - d.last_maintenance),
         d.total_deliveries
  INTO battery_level, days_since_maintenance, total_flights
  FROM drones d WHERE d.id = drone_uuid;
  
  -- Battery impact
  IF battery_level < 20 THEN efficiency := efficiency - 30;
  ELSIF battery_level < 50 THEN efficiency := efficiency - 15;
  END IF;
  
  -- Maintenance impact
  IF days_since_maintenance > 30 THEN efficiency := efficiency - 20;
  ELSIF days_since_maintenance > 14 THEN efficiency := efficiency - 10;
  END IF;
  
  -- Usage bonus
  IF total_flights > 100 THEN efficiency := efficiency + 5;
  END IF;
  
  RETURN GREATEST(0, LEAST(100, efficiency));
END;
$ LANGUAGE plpgsql;

-- Function to auto-assign optimal drone
CREATE OR REPLACE FUNCTION auto_assign_drone(delivery_uuid UUID)
RETURNS UUID AS $
DECLARE
  optimal_drone_id UUID;
BEGIN
  SELECT d.id INTO optimal_drone_id
  FROM drones d
  WHERE d.status = 'available' 
    AND d.battery_level >= 30
    AND calculate_drone_efficiency(d.id) >= 70
  ORDER BY 
    d.battery_level DESC,
    calculate_drone_efficiency(d.id) DESC,
    d.total_deliveries ASC
  LIMIT 1;
  
  IF optimal_drone_id IS NOT NULL THEN
    -- Assign drone to delivery
    UPDATE deliveries SET 
      drone_id = optimal_drone_id,
      status = 'assigned',
      updated_at = NOW()
    WHERE id = delivery_uuid;
    
    -- Update drone status
    UPDATE drones SET 
      status = 'assigned',
      updated_at = NOW()
    WHERE id = optimal_drone_id;
    
    -- Add tracking entry
    INSERT INTO delivery_tracking (delivery_id, location, status, timestamp)
    SELECT delivery_uuid, d.current_location, 
           'Drone ' || d.name || ' assigned and preparing for takeoff',
           NOW()
    FROM drones d WHERE d.id = optimal_drone_id;
  END IF;
  
  RETURN optimal_drone_id;
END;
$ LANGUAGE plpgsql;

-- Create a view for delivery dashboard
CREATE OR REPLACE VIEW delivery_dashboard AS
SELECT 
  d.id,
  d.recipient_name,
  d.priority,
  d.status,
  d.created_at,
  d.estimated_delivery,
  u.full_name as sender_name,
  u.institution_name,
  dr.name as drone_name,
  dr.battery_level as drone_battery,
  dr.current_location as drone_location,
  CASE 
    WHEN d.status = 'pending' THEN 10
    WHEN d.status = 'assigned' THEN 25
    WHEN d.status = 'in_transit' THEN 75
    WHEN d.status = 'delivered' THEN 100
    ELSE 0
  END as progress_percentage,
  EXTRACT(EPOCH FROM (d.estimated_delivery - NOW()))/60 as eta_minutes
FROM deliveries d
LEFT JOIN users u ON d.user_id = u.id
LEFT JOIN drones dr ON d.drone_id = dr.id
WHERE d.status != 'cancelled'
ORDER BY 
  CASE d.priority 
    WHEN 'emergency' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
  END,
  d.created_at DESC;

-- Grant necessary permissions
GRANT SELECT ON delivery_dashboard TO public;
GRANT EXECUTE ON FUNCTION get_delivery_stats TO public;
GRANT EXECUTE ON FUNCTION calculate_drone_efficiency TO public;