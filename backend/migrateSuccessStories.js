const sequelize = require('./config/db');

const migrateSuccessStories = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    const [results] = await sequelize.query("SHOW COLUMNS FROM SuccessStories;");
    const existingColumns = results.map(row => row.Field || row.column_name);

    const columnsToAdd = [
      { name: 'achievements', type: 'TEXT' },
      { name: 'graduationYear', type: 'VARCHAR(255)' },
      { name: 'companyStatus', type: 'VARCHAR(255)' },
      { name: 'tags', type: 'TEXT' },
      { name: 'videoUrl', type: 'VARCHAR(255)' },
      { name: 'gallery', type: 'TEXT' },
      { name: 'socialLinks', type: 'TEXT' }
    ];

    for (const col of columnsToAdd) {
      if (!existingColumns.includes(col.name)) {
        console.log(`Adding column: ${col.name}...`);
        await sequelize.query(`ALTER TABLE SuccessStories ADD COLUMN ${col.name} ${col.type} NULL;`);
      } else {
        console.log(`Column ${col.name} already exists.`);
      }
    }

    console.log('✅ SuccessStories table migration check complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    // Don't exit with error if it's just "already exists" but log it
    process.exit(1);
  }
};

migrateSuccessStories();
