const bcrypt = require('bcryptjs');
const pool = require('../database/connection');

async function createTestUser() {
  try {
    // Hasher le mot de passe "password123"
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Insérer l'utilisateur admin
    const [result] = await pool.execute(
      'INSERT INTO users (username, password, name) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password = ?',
      ['admin', hashedPassword, 'Administrateur', hashedPassword]
    );
    
    console.log('Utilisateur admin créé avec succès!');
    console.log('Username: admin');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
  } finally {
    process.exit();
  }
}

createTestUser();
