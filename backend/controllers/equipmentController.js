const Equipment = require('../models/Equipment');

// Get all equipment with filters & pagination
exports.getAllEquipment = async (req, res) => {
  try {
    const { category, status, department, page = 1, limit = 8 } = req.query; 
    let whereClause = {};
    const offset = (page - 1) * limit;

    // Access Control Logic:
    // - Authenticated Dept Staff (HOD, StockManager, etc): Locked to their department
    // - Authenticated Admin/Student/Public: Can see everything, can filter by query
    const isDeptStaff = req.user && ['HOD', 'StockManager', 'Appointed Staff', 'Lab Staff'].includes(req.user.role);
    
    if (isDeptStaff && req.user.department) {
      whereClause.department = req.user.department;
    } else if (department) {
      // Allow filtering by shorthand or full name
      const deptMap = {
        'RE': 'Renewable Energy',
        'MECH': 'Mechatronics',
        'ICT': 'ICT',
        'ELEC': 'Electronics'
      };
      whereClause.department = deptMap[department] || department;
    }

    if (category) whereClause.category = category;
    if (status) whereClause.status = status;

    const { count, rows } = await Equipment.findAndCountAll({ 
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      equipment: rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new equipment (HOD/Admin/StockManager/Lab Staff only)
exports.createEquipment = async (req, res) => {
  try {
    const equipmentData = { ...req.body };

    // Force department to match user's department for non-admins
    if (req.user.role !== 'Admin' && req.user.department) {
      equipmentData.department = req.user.department;
    }

    const newEquipment = await Equipment.create(equipmentData);
    res.status(201).json(newEquipment);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
};

// Update equipment details
exports.updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await Equipment.findByPk(id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // Protection: Non-admins can't update items from other departments
    if (req.user.role !== 'Admin' && equipment.department !== req.user.department) {
      return res.status(403).json({ message: 'Unauthorized: You can only manage equipment in your department' });
    }

    const equipmentData = { ...req.body };
    // Prevent non-admins from moving items to other departments
    if (req.user.role !== 'Admin' && req.user.department) {
      equipmentData.department = req.user.department;
    }

    await equipment.update(equipmentData);
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

// Delete equipment
exports.deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await Equipment.findByPk(id);

    if (!equipment) {
        return res.status(404).json({ message: 'Equipment not found' });
    }

    // Protection: Only Admins can delete, but even if we allowed others later, 
    // we would add department checks here too.
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Only admins can delete equipment' });
    }

    await equipment.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
};
