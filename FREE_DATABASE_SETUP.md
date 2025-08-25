# Free Database Solutions for SkyMed

## 🏆 Recommended: Supabase (Free Tier)

### Why Supabase is Perfect for SkyMed:
- **100% FREE** up to 500MB database
- **PostgreSQL** with geospatial support
- **Real-time updates** built-in
- **Authentication** included
- **Auto-generated APIs**
- **No credit card required**

### Setup Instructions:

#### 1. Create Supabase Account
```bash
# Visit: https://supabase.com
# Sign up with GitHub/Google (free)
# Create new project
```

#### 2. Database Schema for SkyMed
```sql
-- Enable PostGIS for geospatial features
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Deliveries table
CREATE TABLE deliveries (
    id VARCHAR(50) PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    parcel_type VARCHAR(100) NOT NULL,
    urgency_level VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    pickup_location GEOGRAPHY(POINT) NOT NULL,
    delivery_location GEOGRAPHY(POINT) NOT NULL,
    estimated_time VARCHAR(20),
    cost_inr DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Drones table
CREATE TABLE drones (
    id VARCHAR(50) PRIMARY KEY,
    status VARCHAR(50) DEFAULT 'available',
    battery_level INTEGER,
    current_location GEOGRAPHY(POINT),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Real-time tracking
CREATE TABLE tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    delivery_id VARCHAR(50) REFERENCES deliveries(id),
    location GEOGRAPHY(POINT) NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW()
);
```

#### 3. Environment Variables
```env
# Add to your .env file
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

#### 4. Install Supabase Client
```bash
npm install @supabase/supabase-js
```

#### 5. Integration Code
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Real-time delivery tracking
export const subscribeToDeliveries = (callback: (payload: any) => void) => {
  return supabase
    .channel('deliveries')
    .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'deliveries' }, 
        callback)
    .subscribe()
}
```

### Free Tier Limits:
- **Database**: 500MB storage
- **Bandwidth**: 2GB/month
- **API requests**: 50,000/month
- **Real-time connections**: 200 concurrent
- **Authentication**: Unlimited users

---

## 🥈 Alternative Free Options

### 1. **PlanetScale (Free Tier)**
- **MySQL-compatible** serverless database
- **1 database** with 1GB storage
- **1 billion row reads/month**
- **10 million row writes/month**
- Built-in branching and schema changes

```bash
# Setup
npm install @planetscale/database
```

### 2. **Neon (Free Tier)**
- **PostgreSQL** serverless
- **3GB storage** free
- **Branching** for development
- **Auto-scaling** to zero

### 3. **Firebase Firestore (Free Tier)**
- **NoSQL** document database
- **1GB storage** free
- **50K reads, 20K writes** per day
- **Real-time updates** built-in
- **Google Cloud** infrastructure

```bash
# Setup
npm install firebase
```

### 4. **MongoDB Atlas (Free Tier)**
- **512MB storage** free
- **Shared clusters**
- **Built-in geospatial** queries
- **Real-time change streams**

---

## 🚀 Quick Start with Supabase

### Step 1: Create Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up (free, no credit card)
3. Create new project
4. Wait 2 minutes for setup

### Step 2: Get Credentials
```javascript
// From Supabase Dashboard > Settings > API
const SUPABASE_URL = "https://xxxxx.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Step 3: Create Tables
```sql
-- Run in Supabase SQL Editor
CREATE TABLE deliveries (
    id VARCHAR(50) PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    parcel_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    from_location VARCHAR(255) NOT NULL,
    to_location VARCHAR(255) NOT NULL,
    estimated_time VARCHAR(20),
    cost_inr DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data
INSERT INTO deliveries (id, user_name, parcel_type, status, from_location, to_location, estimated_time, cost_inr) VALUES
('SP-001', 'John Smith', 'Blood Sample', 'in-transit', 'AIIMS Delhi', 'Safdarjung Hospital', '8 mins', 7410),
('SP-002', 'Sarah Johnson', 'Emergency Medication', 'pending', 'Apollo Pharmacy', 'Max Hospital', '12 mins', 5580);
```

### Step 4: Connect to React
```typescript
// src/hooks/useDeliveries.ts
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useDeliveries = () => {
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeliveries()
    
    // Real-time subscription
    const subscription = supabase
      .channel('deliveries')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'deliveries' }, 
          () => fetchDeliveries())
      .subscribe()

    return () => subscription.unsubscribe()
  }, [])

  const fetchDeliveries = async () => {
    const { data, error } = await supabase
      .from('deliveries')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error) setDeliveries(data || [])
    setLoading(false)
  }

  return { deliveries, loading }
}
```

---

## 💡 Why Supabase Wins for SkyMed:

### ✅ **Perfect for Emergency Systems:**
- **PostgreSQL reliability** for medical data
- **Real-time updates** for live tracking
- **Geospatial queries** for drone routing
- **Row-level security** for data protection
- **Auto-scaling** handles traffic spikes

### ✅ **Developer Experience:**
- **Instant APIs** - no backend coding needed
- **Real-time subscriptions** - live updates out of the box
- **Authentication** - user management included
- **Dashboard** - visual database management
- **TypeScript support** - type-safe queries

### ✅ **Cost Effective:**
- **Free forever** for small projects
- **No surprise bills** - clear pricing
- **Generous limits** for MVP development
- **Easy upgrade path** when you scale

### 🎯 **Perfect for SkyMed MVP:**
The free tier gives you everything needed to build and demo your emergency delivery system with real-time tracking, user management, and geospatial features - all without spending a penny!

Start with Supabase, and you can always migrate or upgrade later as your system grows.