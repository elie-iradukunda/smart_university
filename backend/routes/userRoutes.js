const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, authorize } = require('../middleware/authMiddleware');

// All user management routes are protected: Admin only
router.get('/', auth, authorize(['Admin']), userController.getAllUsers);
router.post('/', auth, authorize(['Admin']), userController.createUser);
router.put('/:id', auth, authorize(['Admin']), userController.updateUser);
router.delete('/:id', auth, authorize(['Admin']), userController.deleteUser);

module.exports = router;
