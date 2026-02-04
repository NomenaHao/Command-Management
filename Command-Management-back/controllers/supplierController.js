const Supplier = require('../models/Supplier');

// Obtenir tous les fournisseurs
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll();
    res.json({ suppliers });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Obtenir un fournisseur par ID
exports.getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findById(id);
    
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    res.json({ supplier });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Créer un fournisseur
exports.createSupplier = async (req, res) => {
  try {
    const { name, phone, address, description } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }
    
    const newSupplier = await Supplier.create({ name, phone, address, description });
    
    res.status(201).json({
      message: 'Supplier created successfully',
      supplier: newSupplier
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Mettre à jour un fournisseur
exports.updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address, description } = req.body;
    
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    const updatedSupplier = await Supplier.update(id, { name, phone, address, description });
    
    res.json({
      message: 'Supplier updated successfully',
      supplier: updatedSupplier
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// Supprimer un fournisseur
exports.deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    
    await Supplier.delete(id);
    
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};
