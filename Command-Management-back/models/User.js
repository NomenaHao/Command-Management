const pool = require('../database/connection');
const bcrypt = require('bcryptjs');

class User {
  // Créer un utilisateur
  static async create({ username, password }) {
    try {
      const query = `
        INSERT INTO users (username, password)
        VALUES (?, ?);
      `;
      const [result] = await pool.execute(query, [username, password]);
      return { id: result.insertId, username };
    } catch (error) {
      throw error;
    }
  }

  // Trouver un utilisateur par username
  static async findByUsername(username) {
    try {
      const query = 'SELECT * FROM users WHERE username = ?';
      const [rows] = await pool.execute(query, [username]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Trouver un utilisateur par ID
  static async findById(id) {
    try {
      const query = 'SELECT id, username, created_at FROM users WHERE id = ?';
      const [rows] = await pool.execute(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour un utilisateur
  static async update(id, updateData) {
    try {
      const fields = [];
      const values = [];
      
      if (updateData.username) {
        fields.push('username = ?');
        values.push(updateData.username);
      }
      
      if (updateData.password) {
        fields.push('password = ?');
        values.push(updateData.password);
      }
      
      if (fields.length === 0) {
        throw new Error('No fields to update');
      }
      
      values.push(id);
      
      const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
      await pool.execute(query, values);
      
      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Supprimer un utilisateur
  static async delete(id) {
    try {
      const query = 'DELETE FROM users WHERE id = ?';
      const [result] = await pool.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Obtenir tous les utilisateurs
  static async findAll() {
    try {
      const query = 'SELECT id, username, created_at FROM users ORDER BY created_at DESC';
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
