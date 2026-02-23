const User = require('./User');
const Equipment = require('./Equipment');
const Reservation = require('./Reservation');
const Resource = require('./Resource');
const SuccessStory = require('./SuccessStory');
const StartupProject = require('./StartupProject');
const IncubationProgram = require('./IncubationProgram');

// Relationships
User.hasMany(Reservation, { foreignKey: 'userId' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

Equipment.hasMany(Reservation, { foreignKey: 'equipmentId' });
Reservation.belongsTo(Equipment, { foreignKey: 'equipmentId' });

module.exports = {
  User,
  Equipment,
  Reservation,
  Resource,
  SuccessStory,
  StartupProject,
  IncubationProgram
};
