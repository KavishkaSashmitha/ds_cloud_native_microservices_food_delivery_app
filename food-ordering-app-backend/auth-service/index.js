// auth-service/index.js
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const JWT_SECRET = 'your_jwt_secret_key';
const ROLES = ['CUSTOMER', 'RESTAURANT_OWNER', 'DELIVERY_PERSON', 'ADMIN'];

// Mock user database
const users = [];

app.post('/register', (req, res) => {
  const { username, password, role } = req.body;
  if (!ROLES.includes(role)) return res.status(400).send('Invalid role');
  
  users.push({ username, password, role });
  res.status(201).send('User created');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) return res.status(401).send('Invalid credentials');
  
  const token = jwt.sign(
    { username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  res.json({ token });
});
app.get('/health', (req, res) => res.send('OK'));

app.listen(3000, () => console.log('Auth service running on port 3000'));