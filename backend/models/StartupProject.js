const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const StartupProject = sequelize.define('StartupProject', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  projectName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  teamMembers: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  problemStatement: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  proposedSolution: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Under Incubation', 'Completed', 'Rejected'),
    defaultValue: 'Pending',
  },
  filesUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  documentUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  externalLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  programId: {
    type: DataTypes.UUID,
    allowNull: true,
  }
}, {
  timestamps: true,
});

module.exports = StartupProject;
