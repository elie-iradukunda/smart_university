const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');

// Import Models for Sync
const models = require('./models');

// Load environment variables
dotenv.config();

const app = express();

const path = require('path');

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',  // Vite dev server
  'http://localhost:3000',
  process.env.FRONTEND_URL, // Set this on Render to your Vercel URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // Allow if origin matches allowed list or is a vercel.app domain
    if (
      allowedOrigins.some(allowed => origin.startsWith(allowed)) ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }
    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Smart University API is running' });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/equipment', require('./routes/equipmentRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

const PORT = process.env.PORT || 5000;

// Connect to Database and Sync Models
sequelize.sync()
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database sync failed:', err);
  });
