const User = require('./User');
const Equipment = require('./Equipment');
const Reservation = require('./Reservation');
const Resource = require('./Resource');
const SuccessStory = require('./SuccessStory');
const StartupProject = require('./StartupProject');
const IncubationProgram = require('./IncubationProgram');
const IncubationAsset = require('./IncubationAsset');

// Relationships
User.hasMany(Reservation, { foreignKey: 'userId' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

Equipment.hasMany(Reservation, { foreignKey: 'equipmentId' });
Reservation.belongsTo(Equipment, { foreignKey: 'equipmentId' });

IncubationAsset.hasMany(Reservation, { foreignKey: 'incubationAssetId' });
Reservation.belongsTo(IncubationAsset, { foreignKey: 'incubationAssetId' });

User.hasMany(StartupProject, { foreignKey: 'userId', as: 'Projects' });
StartupProject.belongsTo(User, { foreignKey: 'userId', as: 'Submitter' });
 
IncubationProgram.hasMany(StartupProject, { foreignKey: 'programId' });
StartupProject.belongsTo(IncubationProgram, { foreignKey: 'programId' });

module.exports = {
  User,
  Equipment,
  Reservation,
  Resource,
  SuccessStory,
  StartupProject,
  IncubationProgram,
  IncubationAsset
};
