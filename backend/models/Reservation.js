const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Equipment = require('./Equipment');

const Reservation = sequelize.define('Reservation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  equipmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Equipment,
      key: 'id'
    }
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Borrowed', 'Returned', 'Overdue', 'Cancelled'),
    defaultValue: 'Pending',
  },
  purpose: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  approvedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  returnCondition: {
    type: DataTypes.STRING, // e.g., "Good", "Damaged"
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Reservation;
