const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User'); // Assuming reference to submitter

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
    allowNull: true, // A link or placeholder to project files
  }
}, {
  timestamps: true,
});

StartupProject.belongsTo(User, { as: 'Submitter', foreignKey: 'userId' });
User.hasMany(StartupProject, { foreignKey: 'userId' });

module.exports = StartupProject;
