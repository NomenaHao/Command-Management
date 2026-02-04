const pool = require('../database/connection');

class Supplier {
  // Créer un fournisseur
  static async create({ name, phone, address, description }) {
    try {
      const query = `
        INSERT INTO suppliers (name, phone, address, description)
        VALUES (?, ?, ?, ?);
      `;
      
      const [result] = await pool.execute(query, [name, phone || '', address || '', description || '']);
      
      return {
        id: result.insertId,
        name,
        phone,
        address,
        description,
        created_at: new Date()
      };
    } catch (err) {
      throw new Error(`Error creating supplier: ${err.message}`);
    }
  }

  // Trouver tous les fournisseurs
  static async findAll() {
    try {
      const query = 'SELECT * FROM suppliers ORDER BY created_at DESC;';
      const [rows] = await pool.execute(query);
      return rows;
    } catch (err) {
      throw new Error(`Error fetching suppliers: ${err.message}`);
    }
  }

  // Trouver par ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM suppliers WHERE id = ?;';
      const [rows] = await pool.execute(query, [id]);
      return rows[0];
    } catch (err) {
      throw new Error(`Error finding supplier: ${err.message}`);
    }
  }

  // Mettre à jour un fournisseur
  static async update(id, { name, phone, address, description }) {
    try {
      const query = `
        UPDATE suppliers 
        SET name = ?, phone = ?, address = ?, description = ?, updated_at = NOW()
        WHERE id = ?;
      `;
      
      await pool.execute(query, [name, phone, address, description, id]);
      
      return { id, name, phone, address, description };
    } catch (err) {
      throw new Error(`Error updating supplier: ${err.message}`);
    }
  }

  // Supprimer un fournisseur
  static async delete(id) {
    try {
      const query = 'DELETE FROM suppliers WHERE id = ?;';
      await pool.execute(query, [id]);
      return { id };
    } catch (err) {
      throw new Error(`Error deleting supplier: ${err.message}`);
    }
  }
}

module.exports = Supplier;
