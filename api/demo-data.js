// Vercel Serverless Function - Demo Data
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const demoData = {
      users: [
        {
          id: 'sample-user-1',
          email: 'user@example.com',
          name: 'Sample User',
          role: 'user',
          created_at: new Date().toISOString()
        },
        {
          id: 'sample-admin-1',
          email: 'admin@example.com',
          name: 'Sample Admin',
          role: 'admin',
          created_at: new Date().toISOString()
        }
      ],
      drones: [
        {
          id: 'drone-001',
          name: 'SkyMed Alpha',
          status: 'available',
          battery_level: 85,
          location: { lat: 40.7128, lng: -74.0060 },
          last_maintenance: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'drone-002',
          name: 'SkyMed Beta',
          status: 'in_flight',
          battery_level: 72,
          location: { lat: 40.7589, lng: -73.9851 },
          last_maintenance: new Date(Date.now() - 172800000).toISOString()
        }
      ],
      deliveries: [
        {
          id: 'delivery-001',
          user_id: 'demo-user-1',
          drone_id: 'drone-002',
          status: 'in_transit',
          priority: 'high',
          pickup_location: { lat: 40.7128, lng: -74.0060 },
          delivery_location: { lat: 40.7589, lng: -73.9851 },
          estimated_delivery: new Date(Date.now() + 900000).toISOString(),
          created_at: new Date(Date.now() - 300000).toISOString()
        }
      ],
      stats: {
        total_deliveries: 1247,
        successful_deliveries: 1221,
        success_rate: 98.1,
        average_delivery_time: 12.5,
        active_drones: 2,
        available_drones: 1
      }
    };

    return res.status(200).json({
      success: true,
      data: demoData,
      message: 'Demo data for SkyMed Emergency Delivery System',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}