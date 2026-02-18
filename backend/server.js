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
// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/equipment', require('./routes/equipmentRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

const PORT = process.env.PORT || 5000;

// Connect to Database and Sync Models
sequelize.sync({ alter: true }) // alter: true updates table schema if it changes
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database sync failed:', err);
  });
