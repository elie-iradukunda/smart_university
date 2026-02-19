const Resource = require('../models/Resource');

exports.getAllResources = async (req, res) => {
  try {
    const { category, type } = req.query; // Matched with frontend filters
    let whereClause = {};
    if (category) whereClause.category = category;
    if (type) whereClause.type = type;

    const resources = await Resource.findAll({ where: whereClause });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resources', error: error.message });
  }
};

exports.uploadResource = async (req, res) => {
  try {
    const { title, type, url, category, duration, size, thumbnail, isEssential } = req.body; 
    
    const resource = await Resource.create({
      title,
      type,
      url,
      category,
      duration,
      size,
      thumbnail,
      isEssential
    });
    
    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({ message: 'Upload failed', error: error.message });
  }
};
