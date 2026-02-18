const sequelize = require('./config/db');
const Resource = require('./models/Resource');

const seedResources = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    const resourceData = [
      {
        title: "Introduction to Solar Photovoltaics",
        type: "Video",
        url: "https://www.youtube.com/watch?v=0eXidshP2vI",
        category: "Renewable Energy",
        department: "Renewable Energy",
        duration: "15:30",
        thumbnail: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "TIA Portal V17: PLC Programming Basics",
        type: "Video",
        url: "https://www.youtube.com/watch?v=Pb--Xm8qOq4",
        category: "Automation",
        department: "Mechatronic",
        duration: "25:10",
        thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Cisco ISR 4000 Series Installation Guide",
        type: "PDF",
        url: "https://www.cisco.com/c/en/us/td/docs/routers/access/4400/hardware/installation/guide4400-4300/c4400_isg.pdf",
        category: "Networking",
        department: "ICT",
        size: "3.5 MB",
        thumbnail: "https://images.unsplash.com/photo-1558494949-ef2bb6db8744?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Digital Oscilloscope Troubleshooting Guide",
        type: "Document",
        url: "https://download.tek.com/manual/TBS1000B-Digital-Storage-Oscilloscope-User-Manual-077088601.pdf",
        category: "Electronics",
        department: "Electronic and Telecommunication",
        size: "1.2 MB",
        thumbnail: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Lab Safety & Equipment Handling Policy",
        type: "PDF",
        url: "#",
        category: "Safety",
        department: "All",
        size: "0.8 MB",
        thumbnail: "https://images.unsplash.com/photo-1582719471327-59325da747ec?q=80&w=600&auto=format&fit=crop"
      }
    ];

    for (const item of resourceData) {
      await Resource.create(item);
      console.log(`Created: ${item.title}`);
    }

    console.log('Resource seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedResources();
