const pool = require('../database/connection');

class Product {
  // Créer un produit
  static async create({ supplierId, name, description, price, image }) {
    try {
      const query = `
        INSERT INTO products (supplier_id, name, description, price, image)
        VALUES (?, ?, ?, ?, ?);
      `;
      
      const [result] = await pool.execute(query, [supplierId, name, description, price, image || null]);
      
      return {
        id: result.insertId,
        supplier_id: supplierId,
        name,
        description,
        price,
        image,
        created_at: new Date()
      };
    } catch (err) {
      throw new Error(`Error creating product: ${err.message}`);
    }
  }

  // Trouver tous les produits d'un fournisseur
  static async findBySupplier(supplierId) {
    try {
      const query = 'SELECT * FROM products WHERE supplier_id = ? ORDER BY created_at DESC;';
      const [rows] = await pool.execute(query, [supplierId]);
      return rows;
    } catch (err) {
      throw new Error(`Error fetching products: ${err.message}`);
    }
  }

  // Trouver tous les produits
  static async findAll() {
    try {
      const query = `
        SELECT p.*, s.name as supplier_name 
        FROM products p 
        LEFT JOIN suppliers s ON p.supplier_id = s.id 
        ORDER BY p.created_at DESC;
      `;
      const [rows] = await pool.execute(query);
      return rows;
    } catch (err) {
      throw new Error(`Error fetching products: ${err.message}`);
    }
  }

  // Trouver par ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM products WHERE id = ?;';
      const [rows] = await pool.execute(query, [id]);
      return rows[0];
    } catch (err) {
      throw new Error(`Error finding product: ${err.message}`);
    }
  }

  // Mettre à jour un produit
  static async update(id, { name, description, price, image }) {
    try {
      let query = `UPDATE products SET name = ?, description = ?, price = ?, updated_at = NOW()`;
      let params = [name, description, price];
      
      if (image) {
        query += `, image = ?`;
        params.push(image);
      }
      
      query += ` WHERE id = ?;`;
      params.push(id);
      
      await pool.execute(query, params);
      
      return { id, name, description, price, image };
    } catch (err) {
      throw new Error(`Error updating product: ${err.message}`);
    }
  }

  // Supprimer un produit
  static async delete(id) {
    try {
      const query = 'DELETE FROM products WHERE id = ?;';
      await pool.execute(query, [id]);
      return { id };
    } catch (err) {
      throw new Error(`Error deleting product: ${err.message}`);
    }
  }
}

module.exports = Product;
