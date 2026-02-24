const sequelize = require('./config/db');
const { IncubationProgram, IncubationAsset, Reservation } = require('./models');

async function syncTable() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        
        // Sync all models defined in the application
        await sequelize.sync({ alter: true });
        console.log('All tables have been updated successfully.');
        
        process.exit(0);
    } catch (error) {
        console.error('Unable to update the table:', error);
        process.exit(1);
    }
}

syncTable();
