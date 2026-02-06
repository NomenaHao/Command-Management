const express = require('express');
const authController = require('../controllers/authController');
const { authMiddleware, authorizeRole } = require('../../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configuration multer pour les avatars
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads/avatars'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadAvatar = multer({ 
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non autorisé'));
    }
  }
});

// Routes publiques
router.post('/login', authController.login);
router.post('/register', authController.register);

// Routes protégées
router.get('/me', authMiddleware, authController.getCurrentUser);
router.get('/all', authMiddleware, authorizeRole(['admin']), authController.getAllUsers);
router.put('/profile', authMiddleware, uploadAvatar.single('avatar'), authController.updateProfile);

module.exports = router;