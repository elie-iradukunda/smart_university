const sequelize = require('./config/db');

const runMigrations = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    // --- Part 1: Fix Reservations table (ER_FK_COLUMN_NOT_NULL) ---
    console.log('Fixing Reservations table NULLability...');
    try {
      // Ensure equipmentId and incubationAssetId are NULLable so "ON DELETE SET NULL" works
      // Using CHAR(36) BINARY to match Sequelize UUID storage
      await sequelize.query(`ALTER TABLE Reservations MODIFY COLUMN equipmentId CHAR(36) BINARY NULL;`);
      await sequelize.query(`ALTER TABLE Reservations MODIFY COLUMN incubationAssetId CHAR(36) BINARY NULL;`);
      console.log('✅ Reservations columns fixed.');
    } catch (e) {
      console.log('Note: Could not modify Reservations (columns might already be NULLable):', e.message);
    }

    // --- Part 2: SuccessStories Migration ---
    console.log('Checking SuccessStories columns...');
    let existingColumns = [];
    try {
      const [results] = await sequelize.query("SHOW COLUMNS FROM SuccessStories;");
      existingColumns = results.map(row => row.Field || row.column_name);
    } catch (e) {
      console.log('Note: SuccessStories table might not exist yet. Sync will create it.');
    }

    if (existingColumns.length > 0) {
      const columnsToAdd = [
        { name: 'achievements', type: 'TEXT' },
        { name: 'graduationYear', type: 'VARCHAR(255)' },
        { name: 'companyStatus', type: 'VARCHAR(100)' },
        { name: 'tags', type: 'TEXT' },
        { name: 'videoUrl', type: 'VARCHAR(255)' },
        { name: 'gallery', type: 'TEXT' },
        { name: 'socialLinks', type: 'TEXT' }
      ];

      for (const col of columnsToAdd) {
        if (!existingColumns.includes(col.name)) {
          console.log(`Adding column: ${col.name}...`);
          try {
             await sequelize.query(`ALTER TABLE SuccessStories ADD COLUMN ${col.name} ${col.type} NULL;`);
          } catch (err) {
             console.log(`Failed to add ${col.name}:`, err.message);
          }
        }
      }
    }

    console.log('✅ All migrations complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration crashed:', error.message);
    process.exit(1);
  }
};

runMigrations();

