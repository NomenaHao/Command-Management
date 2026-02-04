const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || !password) {
            return res.status(400).json({message: 'Username and password are required'});
        }
        // si l'utilisateur existe
        const foundUser = await User.findByUsername(username);
        if(!foundUser) {
            return res.status(401).json({message: 'Invalid username'});
        }

        const isPasswordValid = await User.verifyPassword(password, foundUser.password);
        if(!isPasswordValid) {
            return res.status(401).json({message: 'Invalid password'});
        }
        // Générer un token JWT
        const token = jwt.sign(
            { id: foundUser.id, username: foundUser.username, role: foundUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: foundUser.id,
                username: foundUser.username,
                role: foundUser.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

// Register
exports.register = async (req, res) => {
    try {
        const { username, password, role = 'fournisseur' } = req.body;
        
        if(!username || !password) {
            return res.status(400).json({message: 'Username and password are required'});
        }
        
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findByUsername(username);
        if(existingUser) {
            return res.status(409).json({message: 'Username already taken'});
        }
        
        // Créer un nouvel utilisateur
        const newUser = await User.create({ username, password, role });
        
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                username: newUser.username,
                role: newUser.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

// Get current user profile
exports.getCurrentUser = async (req, res) => { 
    try {
        const foundUser = await User.findById(req.user.id);
        res.json({user: foundUser});
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.json({users});
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};