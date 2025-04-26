require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const JWT_SECRET = process.env.JWT_SECRET || 'QNH7W6d8UQHZmHh9jXPqr5V3YTsWeCF2';
const ENV = process.env.NODE_ENV || 'development';
const USE_DOCKER = process.env.USE_DOCKER === 'true';


// Service URLs based on environment
const serviceUrls = {
  auth: USE_DOCKER ? 'http://auth-service:3000' : 'http://localhost:3000',
  restaurant: USE_DOCKER ? 'http://restaurant-service:3001' : 'http://localhost:3001',
  delivery: USE_DOCKER ? 'http://delivery-service:3002' : 'http://localhost:3003'
};

// CORS configuration
const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // During development, allow any localhost origin regardless of port
    if (ENV === 'development' && 
        (origin.startsWith('http://localhost:') || 
         origin.startsWith('http://127.0.0.1:'))) {
      return callback(null, true);
    }
    
    // For production, you'd want a more restrictive list
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3002',
      'http://localhost:3001',
      'http://localhost:8000',
      'http://localhost:8080'
      // Add your production domains here
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token']
};

// Enable CORS for all routes
app.use(cors(corsOptions));

// Add request parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Handle preflight OPTIONS requests
app.options('*', cors(corsOptions));

// Authentication middleware
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Add logging to debug token issues
    console.log('Token received (first 10 chars):', token.substring(0, 10));
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    
    // Log successful verification
    console.log('Token verified, user:', { id: decoded.id, role: decoded.role });
    
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Configure proxy with error handling
const createProxyConfig = (targetUrl, pathRewrite = {}) => ({
  target: targetUrl,
  changeOrigin: true,
  pathRewrite,
  onProxyReq: (proxyReq, req, res) => {
    // Forward the original auth header for services that verify tokens directly
    if (req.headers.authorization) {
      proxyReq.setHeader('Authorization', req.headers.authorization);
    }
    
    // Add user info to the proxied request headers if authenticated
    if (req.user) {
      proxyReq.setHeader('X-User-Id', req.user.id || req.user._id || '');
      proxyReq.setHeader('X-User-Role', req.user.role || '');
      if (req.user.email) {
        proxyReq.setHeader('X-User-Email', req.user.email);
      }
    }
    
    // If there's a JSON body, we need to rewrite it
    if (req.body && Object.keys(req.body).length > 0 && 
        req.headers['content-type']?.includes('application/json')) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      // Write the body to the proxied request
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    // Ensure CORS headers are preserved
    proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin || '*';
    proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ 
      message: 'Service unavailable', 
      error: err.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    environment: ENV,
    services: {
      auth: serviceUrls.auth,
      restaurant: serviceUrls.restaurant,
      delivery: serviceUrls.delivery
    }
  });
});

// Add a debug endpoint in API Gateway too
app.get('/debug/token-info', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(400).json({ message: 'No Authorization header' });
    }
    
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    
    if (!token) {
      return res.status(400).json({ message: 'No token found in Authorization header' });
    }
    
    // First just decode without verification
    const decoded = jwt.decode(token);
    
    // Try to verify
    try {
      const JWT_SECRET = process.env.JWT_SECRET || 'QNH7W6d8UQHZmHh9jXPqr5V3YTsWeCF2';
      const verified = jwt.verify(token, JWT_SECRET);
      
      return res.json({
        message: 'Valid token',
        tokenInfo: {
          header: decoded ? decoded.header : null,
          payload: verified,
          tokenPrefix: token.substring(0, 20) + '...',
          secretPrefix: JWT_SECRET.substring(0, 10) + '...',
        }
      });
    } catch (verifyError) {
      return res.status(401).json({
        message: 'Invalid token',
        error: verifyError.message,
        tokenPrefix: token.substring(0, 20) + '...',
        decoded: decoded,
        secretPrefix: (process.env.JWT_SECRET || 'QNH7W6d8UQHZmHh9jXPqr5V3YTsWeCF2').substring(0, 10) + '...',
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Error processing token',
      error: error.message
    });
  }
});

// Auth service routes (no auth needed)
app.use('/auth', createProxyMiddleware(
  createProxyConfig(serviceUrls.auth, {'^/auth': '/api/auth'})
));

// Health check routes (must come BEFORE authenticated routes)
app.use('/delivery/health', createProxyMiddleware(
  createProxyConfig(serviceUrls.delivery, {'^/delivery/health': '/health'})
));

// Delivery service routes (with authentication)
app.use('/delivery', authenticate, createProxyMiddleware(
  createProxyConfig(serviceUrls.delivery, {'^/delivery': '/api/deliveries'})
));

// Restaurant service routes (auth required)
app.use('/restaurants', authenticate, createProxyMiddleware(
  createProxyConfig(serviceUrls.restaurant)
));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT} in ${ENV} mode`);
  console.log(`Using ${USE_DOCKER ? 'Docker' : 'local'} service URLs`);
  console.log('Available routes:');
  console.log(`  /auth -> ${serviceUrls.auth}`);
  console.log(`  /restaurants -> ${serviceUrls.restaurant}`);
  console.log(`  /delivery -> ${serviceUrls.delivery}`);
  console.log('  /health - API Gateway health check');
});


