const pool = require('../../database/connection');
const bcrypt = require('bcryptjs');

class User {
  // Créer un utilisateur
  static async create({ username, password, role = 'fournisseur' }) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const query = `
        INSERT INTO users (username, password, role)
        VALUES (?, ?, ?);
      `;
      
      const [result] = await pool.execute(query, [username, hashedPassword, role]);
      
      return {
        id: result.insertId,
        username,
        role,
        created_at: new Date()
      };
    } catch (err) {
      throw new Error(`Error creating user: ${err.message}`);
    }
  }

  // Trouver par username
  static async findByUsername(username) {
    try {
      const query = 'SELECT * FROM users WHERE username = ?;';
      const [rows] = await pool.execute(query, [username]);
      return rows[0];
    } catch (err) {
      throw new Error(`Error finding user: ${err.message}`);
    }
  }

  // Trouver par ID
  static async findById(id) {
    try {
      const query = 'SELECT id, username, role, avatar, created_at FROM users WHERE id = ?;';
      const [rows] = await pool.execute(query, [id]);
      return rows[0];
    } catch (err) {
      throw new Error(`Error finding user: ${err.message}`);
    }
  }

  // Obtenir tous les utilisateurs
  static async getAll() {
    try {
      const query = 'SELECT id, username, role, avatar, created_at FROM users;';
      const [rows] = await pool.execute(query);
      return rows;
    } catch (err) {
      throw new Error(`Error fetching users: ${err.message}`);
    }
  }

  // Vérifier le mot de passe
  static async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  // Supprimer un utilisateur
  static async delete(id) {
    try {
      const query = 'DELETE FROM users WHERE id = ?;';
      const [result] = await pool.execute(query, [id]);
      return { id };
    } catch (err) {
      throw new Error(`Error deleting user: ${err.message}`);
    }
  }

  // Mettre à jour le profil
  static async updateProfile(id, { username, avatar }) {
    try {
      let query = 'UPDATE users SET ';
      const params = [];
      
      if (username) {
        query += 'username = ?';
        params.push(username);
      }
      
      if (avatar) {
        if (params.length > 0) query += ', ';
        query += 'avatar = ?';
        params.push(avatar);
      }
      
      query += ' WHERE id = ?;';
      params.push(id);
      
      await pool.execute(query, params);
      
      return await this.findById(id);
    } catch (err) {
      throw new Error(`Error updating profile: ${err.message}`);
    }
  }
}

module.exports = User;