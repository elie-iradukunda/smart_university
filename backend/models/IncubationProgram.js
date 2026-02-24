const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const IncubationProgram = sequelize.define('IncubationProgram', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  applicationDeadline: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Closed', 'Upcoming'),
    defaultValue: 'Active',
  },
  type: {
    type: DataTypes.ENUM('Program', 'Event'),
    defaultValue: 'Program',
  },
  date: {
    type: DataTypes.STRING, // Can be date or string like "Next Friday"
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  speaker: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  benefits: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: true,
});

module.exports = IncubationProgram;
