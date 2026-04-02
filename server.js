const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ CORRECTED ROUTE IMPORTS
const tailorRoutes = require('./routes/tailors');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');

// Use routes
app.use('/api/tailors', tailorRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'TailorHub Backend API is running!',
    timestamp: new Date().toISOString(),
    status: 'Active'
  });
});

// Test database connection route
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working! Database connection will be tested next.',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// MongoDB Connection (with fallback)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tailorhub';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => {
    console.log('❌ MongoDB Connection Error:', err.message);
    console.log('📝 Using mock data for now. Database features will be disabled.');
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 TailorHub Server running on port ${PORT}`);
  console.log(`📍 Access the API: http://localhost:${PORT}`);
  console.log(`📚 Available endpoints:`);
  console.log(`   GET  /api/tailors - Get all tailors`);
  console.log(`   GET  /api/test - Test API connection`);
  console.log(`   GET  / - Basic API status`);
});