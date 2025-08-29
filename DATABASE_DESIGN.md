# eroVita Database Design

## Recommended Stack: PostgreSQL + Redis

### Primary Database: PostgreSQL with PostGIS

#### Core Tables

```sql
-- Users and Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'user', -- 'user', 'operator', 'admin'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Medical Facilities
CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- 'hospital', 'clinic', 'pharmacy', 'lab'
    address TEXT NOT NULL,
    location GEOMETRY(POINT, 4326) NOT NULL, -- PostGIS for geospatial
    contact_info JSONB,
    operating_hours JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Drone Fleet
CREATE TABLE drones (
    id VARCHAR(50) PRIMARY KEY, -- e.g., 'SKY-D001'
    model VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'available', -- 'available', 'in-flight', 'maintenance', 'charging'
    battery_level INTEGER CHECK (battery_level >= 0 AND battery_level <= 100),
    current_location GEOMETRY(POINT, 4326),
    max_payload_kg DECIMAL(5,2),
    max_range_km DECIMAL(6,2),
    last_maintenance TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Delivery Requests
CREATE TABLE deliveries (
    id VARCHAR(50) PRIMARY KEY, -- e.g., 'SP-123456'
    user_id UUID REFERENCES users(id),
    from_facility_id UUID REFERENCES facilities(id),
    to_facility_id UUID REFERENCES facilities(id),
    drone_id VARCHAR(50) REFERENCES drones(id),
    
    -- Parcel Information
    parcel_type VARCHAR(100) NOT NULL, -- 'blood_sample', 'medication', 'medical_supplies'
    urgency_level VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    weight_kg DECIMAL(5,2),
    special_requirements JSONB, -- temperature, handling instructions
    
    -- Status and Tracking
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'assigned', 'in-transit', 'delivered', 'cancelled'
    estimated_delivery_time TIMESTAMP,
    actual_delivery_time TIMESTAMP,
    
    -- Locations
    pickup_location GEOMETRY(POINT, 4326) NOT NULL,
    delivery_location GEOMETRY(POINT, 4326) NOT NULL,
    
    -- Pricing
    cost_inr DECIMAL(10,2),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Real-time Tracking
CREATE TABLE delivery_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_id VARCHAR(50) REFERENCES deliveries(id),
    drone_id VARCHAR(50) REFERENCES drones(id),
    location GEOMETRY(POINT, 4326) NOT NULL,
    altitude_m DECIMAL(8,2),
    speed_kmh DECIMAL(6,2),
    battery_level INTEGER,
    status VARCHAR(100),
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Route Optimization
CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_id VARCHAR(50) REFERENCES deliveries(id),
    route_path GEOMETRY(LINESTRING, 4326),
    distance_km DECIMAL(8,2),
    estimated_duration_minutes INTEGER,
    weather_conditions JSONB,
    traffic_level VARCHAR(20),
    airspace_restrictions JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Emergency Alerts
CREATE TABLE emergency_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_id VARCHAR(50) REFERENCES deliveries(id),
    alert_type VARCHAR(100) NOT NULL, -- 'battery_low', 'weather_warning', 'route_blocked'
    severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    message TEXT NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP
);

-- Analytics and Metrics
CREATE TABLE delivery_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_id VARCHAR(50) REFERENCES deliveries(id),
    actual_duration_minutes INTEGER,
    fuel_efficiency DECIMAL(8,4),
    success_rate DECIMAL(5,4),
    customer_rating INTEGER CHECK (customer_rating >= 1 AND customer_rating <= 5),
    recorded_at TIMESTAMP DEFAULT NOW()
);
```

#### Indexes for Performance

```sql
-- Geospatial indexes
CREATE INDEX idx_facilities_location ON facilities USING GIST (location);
CREATE INDEX idx_drones_location ON drones USING GIST (current_location);
CREATE INDEX idx_deliveries_pickup ON deliveries USING GIST (pickup_location);
CREATE INDEX idx_deliveries_delivery ON deliveries USING GIST (delivery_location);
CREATE INDEX idx_tracking_location ON delivery_tracking USING GIST (location);

-- Status and time-based indexes
CREATE INDEX idx_deliveries_status ON deliveries (status);
CREATE INDEX idx_deliveries_urgency ON deliveries (urgency_level);
CREATE INDEX idx_deliveries_created ON deliveries (created_at);
CREATE INDEX idx_drones_status ON drones (status);
CREATE INDEX idx_tracking_timestamp ON delivery_tracking (timestamp);

-- User and facility indexes
CREATE INDEX idx_deliveries_user ON deliveries (user_id);
CREATE INDEX idx_deliveries_drone ON deliveries (drone_id);
```

### Redis Cache Structure

```redis
# Real-time drone positions
drone:position:SKY-D001 -> {"lat": 28.6139, "lng": 77.2090, "altitude": 150, "battery": 85, "timestamp": "2024-01-15T14:30:00Z"}

# Active delivery tracking
delivery:active:SP-123456 -> {"status": "in-transit", "eta": "2024-01-15T14:45:00Z", "drone": "SKY-D001"}

# User sessions
session:user:uuid -> {"user_id": "uuid", "role": "user", "preferences": {...}}

# Real-time notifications
notifications:user:uuid -> [{"type": "delivery_update", "message": "Your parcel is 5 minutes away"}]

# Route cache
route:cache:from:to -> {"distance": 3.2, "duration": 12, "path": [...]}

# System metrics (updated every minute)
metrics:system -> {"active_deliveries": 15, "available_drones": 8, "avg_delivery_time": 11.2}
```

## Alternative Database Options

### 1. **MongoDB + Redis** (NoSQL Option)
**Good for rapid development**
- ✅ Flexible schema for evolving requirements
- ✅ Built-in geospatial queries
- ✅ JSON-native storage
- ❌ Less ACID compliance than PostgreSQL
- ❌ More complex for relational queries

### 2. **MySQL + Redis** (Traditional SQL)
**Familiar but limited**
- ✅ Widely known and supported
- ✅ Good performance for simple queries
- ❌ Limited geospatial capabilities
- ❌ Less advanced JSON support

### 3. **Cloud-Native Options**

#### **AWS Stack**
- **Amazon RDS (PostgreSQL)** + **ElastiCache (Redis)**
- **Amazon DynamoDB** for high-scale NoSQL
- **Amazon Location Service** for geospatial features

#### **Google Cloud Stack**
- **Cloud SQL (PostgreSQL)** + **Memorystore (Redis)**
- **Firestore** for real-time updates
- **BigQuery** for analytics

#### **Supabase** (Recommended for Startups)
- PostgreSQL with real-time subscriptions
- Built-in authentication and APIs
- Geospatial support with PostGIS
- Real-time updates without Redis

## Recommended Implementation Plan

### Phase 1: MVP (PostgreSQL + Redis)
```bash
# Local development
docker-compose up -d postgres redis

# Production
# Use managed services:
# - AWS RDS (PostgreSQL) + ElastiCache
# - Google Cloud SQL + Memorystore
# - DigitalOcean Managed Databases
```

### Phase 2: Scale (Add Read Replicas)
- Read replicas for analytics queries
- Connection pooling (PgBouncer)
- Database partitioning by date/region

### Phase 3: Global Scale (Multi-Region)
- Regional database clusters
- Global Redis cache
- CDN for static assets

## Key Benefits for eroVita

1. **Medical Data Integrity** - PostgreSQL ACID compliance
2. **Real-time Tracking** - Redis pub/sub for live updates
3. **Geospatial Queries** - PostGIS for route optimization
4. **Scalability** - Proven at enterprise scale
5. **Compliance Ready** - HIPAA/medical data standards
6. **Cost Effective** - Open source with managed options

## Sample Queries

```sql
-- Find nearest available drone to pickup location
SELECT d.id, d.battery_level, 
       ST_Distance(d.current_location, ST_Point(77.2090, 28.6139)) as distance_m
FROM drones d 
WHERE d.status = 'available' 
  AND d.battery_level > 30
ORDER BY distance_m 
LIMIT 1;

-- Get active deliveries in a region
SELECT del.id, del.status, del.urgency_level,
       ST_AsGeoJSON(del.pickup_location) as pickup,
       ST_AsGeoJSON(del.delivery_location) as delivery
FROM deliveries del
WHERE del.status IN ('assigned', 'in-transit')
  AND ST_DWithin(del.pickup_location, ST_Point(77.2090, 28.6139), 5000); -- 5km radius

-- Analytics: Average delivery time by urgency
SELECT urgency_level, 
       AVG(EXTRACT(EPOCH FROM (actual_delivery_time - created_at))/60) as avg_minutes
FROM deliveries 
WHERE status = 'delivered' 
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY urgency_level;
```

This database design provides the foundation for a robust, scalable emergency medical delivery system with real-time tracking, geospatial capabilities, and strong data integrity.