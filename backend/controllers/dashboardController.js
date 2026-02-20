const Reservation = require('../models/Reservation');
const Equipment = require('../models/Equipment');
const User = require('../models/User');
const { Op } = require('sequelize');

const Resource = require('../models/Resource');

exports.getStats = async (req, res) => {
    try {
        const stats = {};
        
        // Public / Basic Stats (Accessible to all)
        stats.totalEquipment = await Equipment.count();
        stats.totalUsers = await User.count();
        stats.totalResources = await Resource.count();
        stats.campusLabs = 12; // Static or can be queried if modeled

        // If not logged in, return basic institutional stats
        if (!req.user) {
            return res.json(stats);
        }

        const isAdminOrHod = ['Admin', 'HOD', 'StockManager'].includes(req.user.role);

        if (isAdminOrHod) {
            // Admin/Staff specific details
            const availableEquipment = await Equipment.sum('available') || 0;
            stats.availableNow = availableEquipment;

            stats.activeLoans = await Reservation.count({
                where: { status: 'Borrowed' }
            });

            // Recent system activity
            stats.recentActivity = await Reservation.findAll({
                limit: 5,
                order: [['updatedAt', 'DESC']],
                include: [
                    { model: User, attributes: ['fullName'] },
                    { model: Equipment, attributes: ['name'] }
                ]
            });
            
            // Stock Distribution
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

// Comprehensive Analytics & Reports (Admin/HOD only)
exports.getReports = async (req, res) => {
    try {
        const today = new Date();
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            last7Days.push(date.toISOString().split('T')[0]);
        }

        // 1. Weekly Activity (Reservations count per day)
        const weeklyActivity = await Promise.all(last7Days.map(async (date) => {
            const count = await Reservation.count({
                where: {
                    createdAt: {
                        [Op.gte]: new Date(date),
                        [Op.lt]: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
                    }
                }
            });
            // Also get previous week for comparison
            const prevDate = new Date(date);
            prevDate.setDate(prevDate.getDate() - 7);
            const prevCount = await Reservation.count({
                where: {
                    createdAt: {
                        [Op.gte]: prevDate,
                        [Op.lt]: new Date(prevDate.getTime() + 24 * 60 * 60 * 1000)
                    }
                }
            });

            return {
                name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
                value: count,
                prev: prevCount
            };
        }));

        // 2. Departmental Distribution
        const depts = ['Renewable Energy', 'Mechatronic', 'ICT', 'Electronic and Telecommunication'];
        const deptDistribution = await Promise.all(depts.map(async (dept) => {
            const count = await Equipment.count({ where: { department: dept } });
            return { name: dept, value: count };
        }));

        // 3. User Role Distribution
        const roles = ['Student', 'Lecturer', 'Admin', 'Lab Staff', 'HOD'];
        const roleDistribution = await Promise.all(roles.map(async (role) => {
            const count = await User.count({ where: { role } });
            return { name: role, value: count };
        }));

        // 4. Detailed Stats
        const totalUsers = await User.count();
        const totalEquipment = await Equipment.count();
        const activeLoans = await Reservation.count({ where: { status: 'Borrowed' } });
        const pendingRequests = await Reservation.count({ where: { status: 'Pending' } });

        res.json({
            weeklyActivity,
            deptDistribution,
            roleDistribution,
            stats: {
                totalUsers,
                totalEquipment,
                activeLoans,
                pendingRequests,
                returnRate: "94.2%", // Mocked or calculated from total vs overdue
                avgUsage: "5h 25m"
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error generating reports', error: error.message });
    }
};
