const express = require('express');
const router = express.Router();
const { getAllEquipment, createEquipment, updateEquipment, deleteEquipment } = require('../controllers/equipmentController');
const { auth, authorize } = require('../middleware/authMiddleware');

router.get('/',  getAllEquipment);
router.post('/', auth, authorize(['Admin', 'HOD', 'StockManager']), createEquipment);
router.put('/:id', auth, authorize(['Admin', 'HOD', 'StockManager']), updateEquipment);
router.delete('/:id', auth, authorize(['Admin']), deleteEquipment);

module.exports = router;
