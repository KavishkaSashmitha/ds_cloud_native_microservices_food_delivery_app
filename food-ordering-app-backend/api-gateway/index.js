// api-gateway/index.js
const express = require('express');
const jwt = require('jsonwebtoken');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const JWT_SECRET = 'your_jwt_secret_key';

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Access denied');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send('Invalid token');
  }
};

// Route configuration
app.use('/auth', createProxyMiddleware({ target: 'http://auth-service:3000', changeOrigin: true }));
app.use('/restaurants', authenticate, createProxyMiddleware({ 
  target: 'http://restaurant-service:3001',
  on: {
    proxyReq: (proxyReq, req) => {
      if (req.method === 'POST' && req.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
    }
  }
}));

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
});

app.listen(8080, () => console.log('API Gateway running on port 8080'));