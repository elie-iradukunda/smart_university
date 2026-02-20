const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { auth, authorize } = require('../middleware/authMiddleware');

// Public-safe GET route
router.get('/', (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (authHeader) {
        return auth(req, res, next);
    }
    req.user = null; // Public user
    next();
}, resourceController.getAllResources);
router.post('/', auth, authorize(['Admin', 'HOD', 'Lecturer']), resourceController.uploadResource);

module.exports = router;
