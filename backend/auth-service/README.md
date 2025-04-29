# Auth Service

## Overview
The Auth Service manages user authentication, registration, and profile management for the Food Delivery application. It handles user accounts for customers, restaurant owners, and delivery personnel.

## Features
- User registration and account creation
- Authentication and JWT token generation
- Password reset functionality
- User profile management
- Role-based access control

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and get token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### User Management
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/account` - Delete user account

## Tech Stack
- Node.js
- Express.js
- MongoDB
- JSON Web Tokens (JWT)

## Environment Variables
```
NODE_ENV=development
PORT=3001
MONGO_URI=mongodb://mongo:27017/auth-service
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=user@example.com
EMAIL_PASS=password
```

## Local Development
```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## Docker
```bash
# Build image
docker build -t auth-service .

# Run container
docker run -p 3001:3001 --env-file .env auth-service
```

## Kubernetes
See the `k8s` directory for Kubernetes deployment configurations.