const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// Configuration Multer pour les avatars
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../public/uploads/avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format d\'image non supporté'));
    }
  }
});

const router = express.Router();

// Inscription
router.post('/register', [
  body('username').trim().isLength({ min: 3 }).matches(/^[a-zA-Z0-9_]+$/),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Ce nom d\'utilisateur existe déjà' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await User.create({
      username,
      password: hashedPassword
    });

    // Générer le token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + error.message });
  }
});

// Connexion
router.post('/login', [
  body('username').trim().isLength({ min: 3 }),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }

    // Générer le token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + error.message });
  }
});

// Obtenir tous les utilisateurs (admin only)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({
      users: users
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + error.message });
  }
});

// Obtenir le profil utilisateur
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + error.message });
  }
});

// Alias pour /profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + error.message });
  }
});

// Mettre à jour le profil
router.put('/profile', authMiddleware, upload.single('avatar'), [
  body('username').optional().trim().isLength({ min: 3 }).matches(/^[a-zA-Z0-9_]+$/)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username } = req.body;
    const updateData = {};

    if (username) {
      // Vérifier si le username est déjà utilisé
      const existingUser = await User.findByUsername(username);
      if (existingUser && existingUser.id !== req.userId) {
        return res.status(400).json({ message: 'Ce nom d\'utilisateur est déjà utilisé' });
      }
      updateData.username = username;
    }

    // Si un fichier avatar a été uploadé
    if (req.file) {
      updateData.avatar = `/public/uploads/avatars/${req.file.filename}`;
    }

    const user = await User.update(req.userId, updateData);
    res.json({
      message: 'Profil mis à jour avec succès',
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + error.message });
  }
});

// Créer un nouvel utilisateur (admin)
router.post('/create', authMiddleware, upload.single('avatar'), [
  body('username').trim().isLength({ min: 3 }).matches(/^[a-zA-Z0-9_]+$/),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Ce nom d\'utilisateur existe déjà' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const userData = {
      username,
      password: hashedPassword
    };

    // Ajouter l'avatar si fourni
    if (req.file) {
      userData.avatar = `/public/uploads/avatars/${req.file.filename}`;
    }

    const user = await User.create(userData);

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + error.message });
  }
});

// Mettre à jour un utilisateur (admin)
router.put('/:id', authMiddleware, upload.single('avatar'), [
  body('username').optional().trim().isLength({ min: 3 }).matches(/^[a-zA-Z0-9_]+$/)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const userId = req.params.id;
    const updateData = {};

    if (username) {
      // Vérifier si le username est déjà utilisé
      const existingUser = await User.findByUsername(username);
      if (existingUser && existingUser.id !== parseInt(userId)) {
        return res.status(400).json({ message: 'Ce nom d\'utilisateur est déjà utilisé' });
      }
      updateData.username = username;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (req.file) {
      updateData.avatar = `/public/uploads/avatars/${req.file.filename}`;
    }

    const user = await User.update(userId, updateData);
    res.json({
      message: 'Utilisateur mis à jour avec succès',
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + error.message });
  }
});

// Supprimer un utilisateur (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Empêcher de supprimer le propre compte
    if (parseInt(userId) === req.userId) {
      return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    const deleted = await User.delete(userId);
    if (!deleted) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur: ' + error.message });
  }
});

module.exports = router;
