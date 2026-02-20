const express = require('express');
const router = express.Router();
const { getAllEquipment, createEquipment, updateEquipment, deleteEquipment } = require('../controllers/equipmentController');
const { auth, authorize } = require('../middleware/authMiddleware');

router.get('/', (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (authHeader) {
        return auth(req, res, next);
    }
    req.user = null; // Public user
    next();
}, getAllEquipment);
router.post('/', auth, authorize(['Admin', 'HOD', 'StockManager', 'Lab Staff']), createEquipment);
router.put('/:id', auth, authorize(['Admin', 'HOD', 'StockManager', 'Lab Staff']), updateEquipment);
router.delete('/:id', auth, authorize(['Admin']), deleteEquipment);

module.exports = router;
