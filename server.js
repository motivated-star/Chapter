require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const chapterRoutes = require('./routes/chapter');
const rateLimiter = require('./middleware/rateLimitter');
const redisClient = require('./clients/redisClient');

const app = express();

// Middleware to parse JSON bodies for POST/PUT if needed
app.use(express.json());

// Apply rate limiting globally (all routes)
app.use(rateLimiter);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Test Redis connection on startup
redisClient.ping()
  .then(() => console.log('Redis connected'))
  .catch((err) => {
    console.error('Redis connection error:', err);
    process.exit(1);
  });

// Mount chapter routes with base path /api/v1/chapters
app.use('/api/v1/chapters', chapterRoutes);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Generic error handler middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
