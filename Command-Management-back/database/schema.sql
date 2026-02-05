-- Création de la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS Admanagement;
USE Admanagement;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des fournisseurs
CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des produits
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255),
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
);

-- Insérer un utilisateur de test (mot de passe: password123)
INSERT INTO users (username, password, name) 
VALUES ('admin', '$2a$10$rOzJqQjQjQjQjQjQjQjQuOzJqQjQjQjQjQjQjQjQjQuOzJqQjQjQjQjQjQ', 'Administrateur')
ON DUPLICATE KEY UPDATE username = username;

-- Insérer un fournisseur de test
INSERT INTO suppliers (name, email, phone, address) 
VALUES ('Fournisseur Test', 'test@example.com', '+123456789', 'Adresse de test')
ON DUPLICATE KEY UPDATE name = name;

-- Insérer quelques produits de test
INSERT INTO products (supplier_id, name, description, price, stock_quantity) 
VALUES 
(1, 'Produit Test 1', 'Description du produit test 1', 99.99, 50),
(1, 'Produit Test 2', 'Description du produit test 2', 149.99, 30),
(1, 'Produit Test 3', 'Description du produit test 3', 199.99, 20)
ON DUPLICATE KEY UPDATE name = name;
