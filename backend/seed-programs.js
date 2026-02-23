const sequelize = require('./config/db');
const IncubationProgram = require('./models/IncubationProgram');

const seedPrograms = [
  {
    name: 'Pre-Incubation Kickstart',
    description: 'Transform your raw idea into a validated business model. Includes weekly mentorship, market research training, and pitch practice.',
    duration: '8 Weeks',
    status: 'Upcoming',
    applicationDeadline: new Date('2026-04-30'),
    benefits: '1-on-1 Mentorship, Pitch Perfection, Market Validation',
    requirements: 'A raw idea.'
  },
  {
    name: 'Scale-Up Accelerator',
    description: 'For startups with an MVP. Get intensive support to secure funding, scale operations, and access the university investor network.',
    duration: '6 Months',
    status: 'Active',
    applicationDeadline: new Date('2026-07-15'),
    benefits: 'Seed Funding Access, Office Space, Legal Support',
    requirements: 'Must have an MVP.'
  }
];

async function runSeed() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB...');
        await IncubationProgram.sync();
        for (const prog of seedPrograms) {
            await IncubationProgram.create(prog);
        }
        console.log('Successfully seeded programs!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
}
runSeed();
