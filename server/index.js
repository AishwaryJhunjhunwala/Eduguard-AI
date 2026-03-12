const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB(); 

// Route files
const auth = require('./routes/auth');
const students = require('./routes/students');
const ml = require('./routes/ml');
const alerts = require('./routes/alerts');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/students', students);
app.use('/api/v1/ml', ml);
app.use('/api/v1/alerts', alerts);

// Basic Route
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome to EduGuard AI API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
