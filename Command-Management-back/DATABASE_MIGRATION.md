# Instructions pour corriger la table users

Votre table `users` doit être mise à jour avec les nouvelles colonnes (`avatar` et `role`).

## Option 1 : Réinitialiser la table (recommandé)

Si vous n'avez pas de données importantes, vous pouvez supprimer et recréer la table :

```bash
# Ouvrez MySQL
mysql -u root -p

# Dans MySQL, exécutez :
USE Admanagement;
DROP TABLE IF EXISTS users;
```

Puis exécutez le script `schema.sql` pour recréer la table.

## Option 2 : Ajouter les colonnes manquantes (si vous avez des données)

Exécutez le script `migrate-users.sql` :

```bash
mysql -u root -p Admanagement < database/migrate-users.sql
```

Ou exécutez ces commandes dans MySQL :

```sql
USE Admanagement;

-- Ajouter la colonne avatar
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(255);

-- Ajouter la colonne role
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'admin';

-- Afficher la structure de la table
DESCRIBE users;
```

## Structure finale attendue

La table `users` doit avoir ces colonnes :

```
id          INT AUTO_INCREMENT PRIMARY KEY
username    VARCHAR(50) UNIQUE NOT NULL
password    VARCHAR(255) NOT NULL
role        VARCHAR(50) DEFAULT 'admin'
avatar      VARCHAR(255)
created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

Après correction, redémarrez le serveur backend et rechargez la page frontend.
