const sequelize = require('./config/db');
const models = require('./models');

const fixDatabase = async () => {
    try {
        console.log('Syncing SuccessStory model with alter: true...');
        await models.SuccessStory.sync({ alter: true });
        console.log('SuccessStory table updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Failed to sync SuccessStory:', error);
        process.exit(1);
    }
};

fixDatabase();
