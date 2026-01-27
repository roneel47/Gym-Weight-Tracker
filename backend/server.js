/**
 * Gym Progress Tracker - Express Server
 * Main entry point for backend API
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// ==================== MIDDLEWARE ====================

// CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ==================== ROUTES ====================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'Gym Progress Tracker API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Authentication routes
app.use('/api/auth', require('./routes/auth'));

// Daily log routes (requires authentication)
app.use('/api/daily-logs', require('./routes/dailyLogs'));

// Workout log routes (requires authentication)
app.use('/api/workout-logs', require('./routes/workoutLogs'));

// Analytics routes (requires authentication)
app.use('/api/analytics', require('./routes/analytics'));

// Settings routes (requires authentication)
app.use('/api/settings', require('./routes/settings'));

// ==================== ERROR HANDLING ====================

// 404 Not Found handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      message: `${field} already exists`,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expired',
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    message: err.message || 'Server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ==================== SERVER STARTUP ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('🚀 Gym Progress Tracker API');
  console.log('========================================');
  console.log(`📡 Server running on port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`📚 Database: ${process.env.MONGO_URI?.split('@')[1]?.split('/')[0] || 'connecting...'}`);
  console.log('========================================\n');

  console.log('📍 Available Endpoints:');
  console.log('   GET  /api/health');
  console.log('   POST /api/auth/register');
  console.log('   POST /api/auth/login');
  console.log('   GET  /api/auth/me');
  console.log('   POST /api/daily-logs');
  console.log('   GET  /api/daily-logs');
  console.log('   GET  /api/daily-logs/:id');
  console.log('   GET  /api/daily-logs/stats/weekly');
  console.log('   PUT  /api/daily-logs/:id');
  console.log('   DELETE /api/daily-logs/:id');
  console.log('   POST /api/workout-logs');
  console.log('   GET  /api/workout-logs');
  console.log('   GET  /api/workout-logs/:id');
  console.log('   GET  /api/workout-logs/stats/prs');
  console.log('   GET  /api/workout-logs/stats/volume');
  console.log('   PUT  /api/workout-logs/:id');
  console.log('   DELETE /api/workout-logs/:id');
  console.log('========================================\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err);
  process.exit(1);
});

module.exports = app;
