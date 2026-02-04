const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./users/routes/auth');
const supplierRoutes = require('./routes/suppliers');
const productRoutes = require('./routes/products');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (images)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/products', productRoutes);

// Si aucune route trouvée
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
});