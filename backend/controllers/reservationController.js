const Reservation = require('../models/Reservation');
const Equipment = require('../models/Equipment');

// Create Reservation
exports.createReservation = async (req, res) => {
  try {
    const { equipmentId, startDate, endDate, purpose } = req.body;
    
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
      include: [{ model: Equipment, attributes: ['name', 'category', 'image'] }]
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservations' });
  }
};

// Manage Reservation (Approve/Reject - HOD/StockManager)
exports.updateReservationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'Approved', 'Cancelled', 'Returned'
  
  try {
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    reservation.status = status;
    if (status === 'Approved') {
        reservation.approvedBy = req.user.id;
        // Decrease stock
        const equipment = await Equipment.findByPk(reservation.equipmentId);
        if(equipment) {
            equipment.available -= 1;
            if(equipment.available === 0) equipment.status = 'In Use'; // Simple logic
            await equipment.save();
        }
    } else if (status === 'Returned') {
        // Increase stock
        const equipment = await Equipment.findByPk(reservation.equipmentId);
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
    const reservations = await Reservation.findAll({
      include: [
        { model: Equipment, attributes: ['id', 'name', 'category', 'image', 'department'] },
        { model: User, attributes: ['id', 'name', 'email', 'studentId', 'role'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all reservations', error: error.message });
  }
};
