-- Script de migration pour la table users
-- À exécuter pour mettre à jour la structure de la table users

USE Admanagement;

-- Vérifier et ajouter la colonne avatar si elle n'existe pas
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(255);

-- Vérifier et ajouter la colonne role si elle n'existe pas
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'admin';

-- Si la colonne 'name' existe, vous pouvez la supprimer (optionnel)
-- ALTER TABLE users DROP COLUMN IF EXISTS name;

-- Vérifier la structure finale
DESCRIBE users;
