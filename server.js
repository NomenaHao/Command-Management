const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./users/routes/auth');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

app.use('/api/auth', authRoutes);

// Si aucune route trouvée
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
});