const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SuccessStory = sequelize.define('SuccessStory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  projectName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  studentName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  achievements: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  graduationYear: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  companyStatus: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tags: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gallery: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  socialLinks: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  timestamps: true,
});

module.exports = SuccessStory;
