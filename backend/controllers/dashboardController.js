const Reservation = require('../models/Reservation');
const Equipment = require('../models/Equipment');
const User = require('../models/User');
const { Op } = require('sequelize');

exports.getStats = async (req, res) => {
    try {
        const stats = {};
        const isAdminOrHod = ['Admin', 'HOD', 'StockManager'].includes(req.user.role);

        if (isAdminOrHod) {
            // Admin Stats
            stats.totalEquipment = await Equipment.count();
            
            // Sum up the 'available' column across all equipment records
            const availableEquipment = await Equipment.sum('available') || 0;
            stats.availableNow = availableEquipment;

            stats.activeLoans = await Reservation.count({
                where: { status: 'Borrowed' }
            });

            stats.totalUsers = await User.count();

            // Recent system activity
            stats.recentActivity = await Reservation.findAll({
                limit: 5,
                order: [['updatedAt', 'DESC']],
                include: [
                    { model: User, attributes: ['name'] },
                    { model: Equipment, attributes: ['name'] }
                ]
            });
            
            // Stock Distribution for Chart
            stats.stockStatus = [
                { name: 'Available', value: availableEquipment, color: '#22c55e' },
                { name: 'Borrowed', value: stats.activeLoans, color: '#f59e0b' }
            ];

        } else {
            // Student Stats
            stats.myBorrowedItems = await Reservation.count({
                where: { userId: req.user.id, status: 'Borrowed' }
            });

            stats.pendingRequests = await Reservation.count({
                where: { userId: req.user.id, status: 'Pending' }
            });

            stats.overdueItems = await Reservation.count({
                where: { userId: req.user.id, status: 'Overdue' }
            });

            // My active items list
            stats.activeLoans = await Reservation.findAll({
                where: { 
                    userId: req.user.id, 
                    status: { [Op.in]: ['Borrowed', 'Approved', 'Pending', 'Overdue'] } 
                },
                include: [{ model: Equipment, attributes: ['name', 'image', 'category'] }],
                limit: 5,
                order: [['updatedAt', 'DESC']]
            });
        }

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};
