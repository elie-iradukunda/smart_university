const { HomeHeroImage } = require('../models');

// Get all active images (Public)
exports.getHomeImages = async (req, res) => {
  try {
    const images = await HomeHeroImage.findAll({
      where: { isActive: true },
      order: [['displayOrder', 'ASC']]
    });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all images including inactive
exports.getAllImages = async (req, res) => {
  try {
    const images = await HomeHeroImage.findAll({
      order: [['displayOrder', 'ASC']]
    });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Upload new image
exports.uploadImage = async (req, res) => {
  try {
    const { title, displayOrder } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const newImage = await HomeHeroImage.create({
      imageUrl,
      title,
      displayOrder: displayOrder || 0
    });

    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete image
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await HomeHeroImage.findByPk(id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    await image.destroy();
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: toggle isActive
exports.toggleStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const image = await HomeHeroImage.findByPk(id);
      
      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }
  
      image.isActive = !image.isActive;
      await image.save();
      res.json(image);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
