// SkyMed Health Check API Endpoint
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

  try {
    const response = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'SkyMed Emergency Delivery System',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'production',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      features: {
        authentication: true,
        videoBackground: true,
        realTimeTracking: true,
        emergencyAlerts: true,
        droneManagement: true
      }
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response, null, 2)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};