const Reservation = require('../models/Reservation');
const Equipment = require('../models/Equipment');
const User = require('../models/User');

// Create Reservation
exports.createReservation = async (req, res) => {
  try {
    const { equipmentId, startDate, endDate, purpose, moduleCode } = req.body;
    
    // Check if equipment is available
    const equipment = await Equipment.findByPk(equipmentId);
    if (!equipment || equipment.available <= 0) {
      return res.status(400).json({ message: 'Equipment not available' });
    }

    const reservation = await Reservation.create({
      userId: req.user.id,
      equipmentId,
      startDate,
      endDate,
      purpose,
      moduleCode,
      status: 'Pending'
    });

    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Reservation failed', error: error.message });
  }
};

// Get User Reservations
exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({ 
      where: { userId: req.user.id },
      include: [{ 
        model: Equipment, 
        attributes: ['id', 'name', 'category', 'image', 'department', 'serialNumber', 'assetTag', 'description', 'warrantyExpiry', 'requiresMaintenance', 'manualUrl', 'videoUrls', 'galleryImages', 'modelNumber', 'supplier', 'stock', 'location'] 
      }]
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservations' });
  }
};

// Manage Reservation (Approve/Reject - HOD/StockManager/LabStaff)
exports.updateReservationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; 
  
  try {
    const reservation = await Reservation.findByPk(id, {
        include: [{ model: Equipment, attributes: ['id', 'department', 'available'] }]
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Department Security Check: Store Keepers/HODs can only approve their own department's items
    if (req.user.role !== 'Admin' && reservation.Equipment.department !== req.user.department) {
        return res.status(403).json({ message: 'Unauthorized: You can only manage requests for your department.' });
    }

    reservation.status = status;
    if (status === 'Approved') {
        reservation.approvedBy = req.user.id;
        // Decrease stock
        const equipment = reservation.Equipment;
        if(equipment && equipment.available > 0) {
            equipment.available -= 1;
            if(equipment.available === 0) equipment.status = 'In Use'; 
            await equipment.save();
        } else if (equipment && equipment.available <= 0) {
            return res.status(400).json({ message: 'Equipment is no longer available in stock' });
        }
    } else if (status === 'Returned') {
        // Increase stock
        const equipment = reservation.Equipment;
        if(equipment) {
            equipment.available += 1;
            equipment.status = 'Available';
            await equipment.save();
        }
    }

    await reservation.save();
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

// Get All Reservations (Admin/Staff)
exports.getAllReservations = async (req, res) => {
  try {
    const whereClause = {};
    const equipmentWhere = {};

    // For Departmental Staff (HOD, StockManager, Lab Staff), filter by their department
    if (req.user.role !== 'Admin' && req.user.department) {
        equipmentWhere.department = req.user.department;
    }

    const reservations = await Reservation.findAll({
      include: [
        { 
          model: Equipment, 
          attributes: ['id', 'name', 'category', 'image', 'department', 'serialNumber', 'assetTag', 'description', 'warrantyExpiry', 'requiresMaintenance', 'manualUrl', 'videoUrls', 'galleryImages', 'modelNumber', 'supplier', 'stock', 'location'],
          where: Object.keys(equipmentWhere).length > 0 ? equipmentWhere : undefined
        },
        { model: User, attributes: ['id', 'fullName', 'email', 'studentId', 'role', 'department'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all reservations', error: error.message });
  }
};
