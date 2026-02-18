const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Resource = sequelize.define('Resource', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('Video', 'PDF', 'Link', 'Document'),
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  department: {
    type: DataTypes.ENUM(
      'Renewable Energy',
      'Mechatronic',
      'ICT',
      'Electronic and Telecommunication',
      'All'
    ),
    defaultValue: 'All',
  },
  duration: DataTypes.STRING,
  size: DataTypes.STRING,
  thumbnail: DataTypes.STRING,
}, {
  timestamps: true,
});

module.exports = Resource;
