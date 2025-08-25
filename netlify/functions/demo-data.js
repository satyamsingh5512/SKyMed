// SkyMed Demo Data API Endpoint
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const demoData = {
      users: [
        {
          email: 'admin@skymed.com',
          role: 'Administrator',
          name: 'SkyMed Administrator',
          department: 'Administration'
        },
        {
          email: 'doctor@skymed.com',
          role: 'Medical Professional',
          name: 'Dr. Arjun Patel',
          department: 'Emergency Medicine'
        },
        {
          email: 'nurse@skymed.com',
          role: 'Medical Professional',
          name: 'Nurse Priya Sharma',
          department: 'Critical Care'
        }
      ],
      stats: {
        totalDeliveries: 1247,
        successRate: 94.2,
        averageDeliveryTime: 14.5,
        activeDrones: 12,
        emergencyDeliveries: 89
      },
      recentDeliveries: [
        {
          id: 'SP-001',
          type: 'Emergency Medicine Kit',
          status: 'in-transit',
          priority: 'emergency',
          estimatedTime: '8 mins',
          from: 'Central Medical Store',
          to: 'Emergency Ward'
        },
        {
          id: 'SP-002',
          type: 'Blood Samples',
          status: 'delivered',
          priority: 'high',
          deliveredTime: '12 mins',
          from: 'Lab Center',
          to: 'ICU Department'
        },
        {
          id: 'SP-003',
          type: 'Cardiac Medications',
          status: 'pending',
          priority: 'medium',
          estimatedTime: '25 mins',
          from: 'Pharmacy Depot',
          to: 'Cardiology Unit'
        }
      ]
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(demoData, null, 2)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};