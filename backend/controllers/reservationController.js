const Reservation = require('../models/Reservation');
const Equipment = require('../models/Equipment');
const User = require('../models/User');
const IncubationAsset = require('../models/IncubationAsset');

// Create Reservation
exports.createReservation = async (req, res) => {
  try {
    const { 
      equipmentId, 
      incubationAssetId, 
      startDate, 
      endDate, 
      purpose, 
      moduleCode,
      studentRegNumber,
      studentIdNumber,
      studentIdImage,
      phoneNumber,
      level,
      department,
      additionalInfo
    } = req.body;
    
    // Check if equipment or incubation asset is available
    let item;
    if (equipmentId) {
      item = await Equipment.findByPk(equipmentId);
    } else if (incubationAssetId) {
      item = await IncubationAsset.findByPk(incubationAssetId);
    }

    if (!item || item.available <= 0) {
      return res.status(400).json({ message: 'Item not available' });
    }

    const reservation = await Reservation.create({
      userId: req.user.id,
      equipmentId: equipmentId || null,
      incubationAssetId: incubationAssetId || null,
      startDate,
      endDate,
      purpose,
      moduleCode,
      studentRegNumber,
      studentIdNumber,
      studentIdImage,
      phoneNumber,
      level,
      department,
      additionalInfo,
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
        include: [
          { model: Equipment, attributes: ['id', 'department', 'available'] },
          { model: IncubationAsset, attributes: ['id', 'department', 'available'] }
        ]
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Department Security Check: Store Keepers/HODs can only approve their own department's items
    const itemDept = (reservation.Equipment?.department || reservation.IncubationAsset?.department);
    if (req.user.role !== 'Admin' && req.user.role !== 'Incubation Manager' && itemDept !== req.user.department) {
        return res.status(403).json({ message: 'Unauthorized: You can only manage requests for your department.' });
    }

    reservation.status = status;
    if (status === 'Approved') {
        reservation.approvedBy = req.user.id;
        // Decrease stock
        const item = reservation.Equipment || reservation.IncubationAsset;
        if(item && item.available > 0) {
            item.available -= 1;
            if(item.available === 0) item.status = 'In Use'; 
            await item.save();
        } else if (item && item.available <= 0) {
            return res.status(400).json({ message: 'Item is no longer available in stock' });
        }
    } else if (status === 'Returned') {
        // Increase stock
        const item = reservation.Equipment || reservation.IncubationAsset;
        if(item) {
            item.available += 1;
            item.status = 'Available';
            await item.save();
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
          where: Object.keys(equipmentWhere).length > 0 ? equipmentWhere : undefined,
          required: false
        },
        {
          model: IncubationAsset,
          attributes: ['id', 'name', 'category', 'image', 'department', 'serialNumber', 'assetTag', 'description', 'modelNumber', 'location'],
          required: false
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
