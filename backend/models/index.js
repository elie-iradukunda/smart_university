const User = require('./User');
const Equipment = require('./Equipment');
const Reservation = require('./Reservation');
const Resource = require('./Resource');
const SuccessStory = require('./SuccessStory');
const StartupProject = require('./StartupProject');
const IncubationProgram = require('./IncubationProgram');
const IncubationAsset = require('./IncubationAsset');
const EquipmentRequest = require('./EquipmentRequest');
const EquipmentRequestItem = require('./EquipmentRequestItem');
const LabAssignment = require('./LabAssignment');
const HomeHeroImage = require('./HomeHeroImage');

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

User.hasMany(EquipmentRequest, { foreignKey: 'requesterId' });
EquipmentRequest.belongsTo(User, { foreignKey: 'requesterId', as: 'Requester' });
EquipmentRequest.belongsTo(User, { foreignKey: 'approvedBy', as: 'Approver' });

EquipmentRequest.hasMany(EquipmentRequestItem, { foreignKey: 'requestId', as: 'Items' });
EquipmentRequestItem.belongsTo(EquipmentRequest, { foreignKey: 'requestId' });

module.exports = {
  User,
  Equipment,
  Reservation,
  Resource,
  SuccessStory,
  StartupProject,
  IncubationProgram,
  IncubationAsset,
  EquipmentRequest,
  EquipmentRequestItem,
  LabAssignment,
  HomeHeroImage
};
