const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const IncubationAsset = sequelize.define('IncubationAsset', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  modelNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  serialNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  assetTag: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  purchaseDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  warrantyExpiry: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  supplier: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  requiresMaintenance: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  allowOvernight: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM('Available', 'In Use', 'Maintenance', 'Inactive'),
    defaultValue: 'Available',
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  available: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  galleryImages: {
    type: DataTypes.JSON, // Stores array of image URLs
    defaultValue: [],
  },
  videoUrls: {
    type: DataTypes.JSON, // Stores array of YouTube/video URLs
    defaultValue: [],
  },
  manualUrl: {
    type: DataTypes.STRING, // Link to PDF manual or documentation
    allowNull: true,
  },
  specifications: {
    type: DataTypes.JSON, 
    defaultValue: {},
  },
  icon: {
    type: DataTypes.STRING, 
    defaultValue: 'Package',
  }
}, {
  timestamps: true,
});

module.exports = IncubationAsset;
