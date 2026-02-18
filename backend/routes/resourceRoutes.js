const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { auth, authorize } = require('../middleware/authMiddleware');

router.get('/', auth, resourceController.getAllResources);
router.post('/', auth, authorize(['Admin', 'HOD', 'StockManager']), resourceController.uploadResource);

module.exports = router;
