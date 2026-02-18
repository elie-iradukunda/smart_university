const Equipment = require('../models/Equipment');

// Get all equipment with filters
exports.getAllEquipment = async (req, res) => {
  try {
    const { category, status, department } = req.query; // Matched with Equipment page filters
    let whereClause = {};

    if (category) whereClause.category = category;
    if (status) whereClause.status = status;
    if (department) whereClause.department = department;

    const equipment = await Equipment.findAll({ where: whereClause });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new equipment (HOD/Admin/StockManager only)
exports.createEquipment = async (req, res) => {
  try {
    const { 
      name, modelNumber, category, department, serialNumber, assetTag, 
      description, purchaseDate, warrantyExpiry, cost, supplier, 
      requiresMaintenance, allowOvernight, image, galleryImages, videoUrls, 
      manualUrl, status, location, stock, available 
    } = req.body;

    const newEquipment = await Equipment.create({
      name,
      modelNumber,
      category,
      department,
      serialNumber,
      assetTag,
      description,
      purchaseDate,
      warrantyExpiry,
      cost,
      supplier,
      requiresMaintenance,
      allowOvernight,
      image,
      galleryImages,
      videoUrls,
      manualUrl,
      status: status || 'Available',
      location,
      stock: stock || 1,
      available: available !== undefined ? available : (stock || 1)
    });

    res.status(201).json(newEquipment);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
};

// Update equipment details
exports.updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Equipment.update(req.body, { where: { id } });

    if (updated) {
      const updatedEquipment = await Equipment.findByPk(id);
      return res.status(200).json(updatedEquipment);
    }
    throw new Error('Equipment not found');
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

// Delete equipment
exports.deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    await Equipment.destroy({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
};
