// api-gateway/index.js (updated)
const express = require('express');
const jwt = require('jsonwebtoken');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const JWT_SECRET = 'your_jwt_secret_key';

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Access denied');
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(400).send('Invalid token');
  }
};

// Configure proxy with error handling
const proxyOptions = {
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Service unavailable');
  }
};

app.use('/auth', createProxyMiddleware({ 
  target: 'http://auth-service:3000',
  ...proxyOptions
}));

app.use('/restaurants', authenticate, createProxyMiddleware({ 
  target: 'http://restaurant-service:3001',
  ...proxyOptions,
  on: {
    proxyReq: (proxyReq, req) => {
      if (req.method === 'POST' && req.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
    }
  }
}));

app.listen(8080, () => {
  console.log('API Gateway running on port 8080');
  console.log('Available routes:');
  console.log('  /auth -> auth-service:3000');
  console.log('  /restaurants -> restaurant-service:3001');
});