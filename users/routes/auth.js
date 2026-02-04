const express = require('express');
const authController = require('../controllers/authController');
const { authMiddleware, authorizeRole } = require('../../middleware/auth');

const router = express.Router();

// Routes publiques
router.post('/login', authController.login);
router.post('/register', authController.register);

// Routes protégées
router.get('/me', authMiddleware, authController.getCurrentUser);
router.get('/all', authMiddleware, authorizeRole(['admin']), authController.getAllUsers);

module.exports = router;