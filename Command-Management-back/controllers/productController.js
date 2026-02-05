const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

// Obtenir tous les produits
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Obtenir les produits d'un fournisseur
exports.getProductsBySupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const products = await Product.findBySupplier(supplierId);
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Obtenir un produit par ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Créer un produit
exports.createProduct = async (req, res) => {
  try {
    const { supplierId, name, description, price } = req.body;
    
    if (!supplierId || !name || !price) {
      return res.status(400).json({ message: 'Supplier ID, name and price are required' });
    }
    
    let imagePath = null;
    if (req.file) {
      imagePath = `/public/uploads/${req.file.filename}`;
    }
    
    const newProduct = await Product.create({ 
      supplierId, 
      name, 
      description, 
      price: price, 
      image: imagePath 
    });
    
    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Mettre à jour un produit
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    let imagePath = product.image;
    if (req.file) {
      // Supprimer l'ancienne image
      if (product.image) {
        const filename = product.image.split('/').pop();
        const oldImagePath = path.join(__dirname, '..', 'public', 'uploads', filename);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imagePath = `/public/uploads/${req.file.filename}`;
    }
    
    const updatedProduct = await Product.update(id, { 
      name, 
      description, 
      price: price, 
      image: imagePath 
    });
    
    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Supprimer l'image
    if (product.image) {
      const filename = product.image.split('/').pop();
      const imagePath = path.join(__dirname, '..', 'public', 'uploads', filename);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Product.delete(id);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};
