const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { auth } = require('../middleware/authMiddleware');

router.get('/stats', (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (authHeader) {
        return auth(req, res, next);
    }
    req.user = null; // Public user
    next();
}, dashboardController.getStats);

router.get('/reports', auth, dashboardController.getReports);

module.exports = router;
