const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars FIRST
dotenv.config();

// Connect DB
connectDB();

// Init app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const auth = require('./routes/auth');
const students = require('./routes/students');
const ml = require('./routes/ml');
const alerts = require('./routes/alerts');
const dashboardRoutes = require('./routes/api/dashboard');
const attendanceRoutes = require('./routes/attendance');

// Mount routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/students', students);
app.use('/api/v1/ml', ml);
app.use('/api/v1/alerts', alerts);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/v1/attendance', attendanceRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'EduGuard API running 🚀' });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
