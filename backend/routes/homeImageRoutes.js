const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { auth, authorize } = require('../middleware/authMiddleware');
const { getHomeImages, getAllImages, uploadImage, deleteImage, toggleStatus } = require('../controllers/homeImageController');

// Multer Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Public: Get images
router.get('/', getHomeImages);

// Admin: Get all including inactive
router.get('/all', auth, authorize(['Admin']), getAllImages);

// Admin: Upload new
router.post('/', auth, authorize(['Admin']), upload.single('image'), uploadImage);

// Admin: Toggle status
router.put('/:id/toggle', auth, authorize(['Admin']), toggleStatus);

// Admin: Delete
router.delete('/:id', auth, authorize(['Admin']), deleteImage);

module.exports = router;
