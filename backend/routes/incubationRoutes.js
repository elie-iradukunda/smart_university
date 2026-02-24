const express = require('express');
const router = express.Router();
const incubationController = require('../controllers/incubationController');
const { auth, authorize } = require('../middleware/authMiddleware');

// Public Routes (For guests and students)
router.get('/stories', incubationController.getSuccessStories);
router.get('/programs', incubationController.getPrograms);
router.get('/assets', incubationController.getAssets);

// Student/User Routes
router.post('/projects', auth, incubationController.submitProject);
router.get('/projects/my', auth, incubationController.getMyProjects);

// Manager Routes
router.post('/stories', auth, authorize(['Incubation Manager', 'Admin']), incubationController.createSuccessStory);
router.put('/stories/:id', auth, authorize(['Incubation Manager', 'Admin']), incubationController.updateSuccessStory);
router.delete('/stories/:id', auth, authorize(['Incubation Manager', 'Admin']), incubationController.deleteSuccessStory);

router.post('/programs', auth, authorize(['Incubation Manager', 'Admin']), incubationController.createProgram);
router.put('/programs/:id', auth, authorize(['Incubation Manager', 'Admin']), incubationController.updateProgram);
router.delete('/programs/:id', auth, authorize(['Incubation Manager', 'Admin']), incubationController.deleteProgram);

router.post('/assets', auth, authorize(['Incubation Manager', 'Admin']), incubationController.createAsset);
router.put('/assets/:id', auth, authorize(['Incubation Manager', 'Admin']), incubationController.updateAsset);
router.delete('/assets/:id', auth, authorize(['Incubation Manager', 'Admin']), incubationController.deleteAsset);

router.get('/projects', auth, authorize(['Incubation Manager', 'Admin']), incubationController.getAllProjects);
router.put('/projects/:id/status', auth, authorize(['Incubation Manager', 'Admin']), incubationController.updateProjectStatus);

module.exports = router;
