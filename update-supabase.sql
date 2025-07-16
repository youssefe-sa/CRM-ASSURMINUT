-- Script de mise à jour complète pour Supabase - ASSURMINUT CRM
-- Date: 16 juillet 2025
-- Version: 1.0

-- ==================================================
-- ÉTAPE 1: SUPPRESSION ET RECRÉATION DES TABLES
-- ==================================================

-- Supprimer les tables existantes (dans l'ordre des dépendances)
DROP TABLE IF EXISTS appels CASCADE;
DROP TABLE IF EXISTS rappels CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS devis CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ==================================================
-- ÉTAPE 2: CRÉATION DES TABLES
-- ==================================================

-- Table users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'agent',
    actif BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table clients
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    date_naissance DATE NOT NULL,
    numero_secu VARCHAR(15) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    adresse TEXT NOT NULL,
    situation_familiale VARCHAR(50) NOT NULL,
    nombre_ayants_droit INTEGER DEFAULT 0,
    mutuelle_actuelle VARCHAR(255),
    niveau_couverture VARCHAR(50),
    statut VARCHAR(50) DEFAULT 'nouveau',
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id)
);

-- Table devis
CREATE TABLE devis (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    numero_devis VARCHAR(50) UNIQUE NOT NULL,
    date_creation DATE DEFAULT CURRENT_DATE,
    date_validite DATE,
    montant_mensuel DECIMAL(10,2),
    montant_annuel DECIMAL(10,2),
    garanties TEXT,
    statut VARCHAR(50) DEFAULT 'en_cours',
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id)
);

-- Table documents
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    chemin VARCHAR(500) NOT NULL,
    taille INTEGER,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id)
);

-- Table rappels
CREATE TABLE rappels (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    date_rappel TIMESTAMP NOT NULL,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    statut VARCHAR(50) DEFAULT 'en_attente',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id)
);

-- Table appels
CREATE TABLE appels (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    date_appel TIMESTAMP DEFAULT NOW(),
    duree INTEGER,
    notes TEXT,
    statut VARCHAR(50) DEFAULT 'termine',
    prochain_rappel TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id)
);

-- ==================================================
-- ÉTAPE 3: INSERTION DES DONNÉES
-- ==================================================

-- Insertion des utilisateurs
INSERT INTO users (username, email, password_hash, nom, prenom, role, actif) VALUES
('admin', 'admin@crm.com', '$2b$10$8K1p5UjP5.6WRwQz3Q5iZeKlHgzDyEkWOC8oN9xGjI6qzRJJjjhcK', 'Admin', 'Admin', 'admin', true),
('marie.dupont', 'marie.dupont@assurminut.fr', '$2b$10$8K1p5UjP5.6WRwQz3Q5iZeKlHgzDyEkWOC8oN9xGjI6qzRJJjjhcK', 'Dupont', 'Marie', 'agent', true),
('pierre.martin', 'pierre.martin@assurminut.fr', '$2b$10$8K1p5UjP5.6WRwQz3Q5iZeKlHgzDyEkWOC8oN9xGjI6qzRJJjjhcK', 'Martin', 'Pierre', 'agent', true),
('sophie.bernard', 'sophie.bernard@assurminut.fr', '$2b$10$8K1p5UjP5.6WRwQz3Q5iZeKlHgzDyEkWOC8oN9xGjI6qzRJJjjhcK', 'Bernard', 'Sophie', 'agent', true),
('julien.moreau', 'julien.moreau@assurminut.fr', '$2b$10$8K1p5UjP5.6WRwQz3Q5iZeKlHgzDyEkWOC8oN9xGjI6qzRJJjjhcK', 'Moreau', 'Julien', 'agent', true),
('claire.lefebvre', 'claire.lefebvre@assurminut.fr', '$2b$10$8K1p5UjP5.6WRwQz3Q5iZeKlHgzDyEkWOC8oN9xGjI6qzRJJjjhcK', 'Lefebvre', 'Claire', 'agent', true),
('thomas.simon', 'thomas.simon@assurminut.fr', '$2b$10$8K1p5UjP5.6WRwQz3Q5iZeKlHgzDyEkWOC8oN9xGjI6qzRJJjjhcK', 'Simon', 'Thomas', 'agent', true),
('camille.michel', 'camille.michel@assurminut.fr', '$2b$10$8K1p5UjP5.6WRwQz3Q5iZeKlHgzDyEkWOC8oN9xGjI6qzRJJjjhcK', 'Michel', 'Camille', 'agent', true),
('lucas.garcia', 'lucas.garcia@assurminut.fr', '$2b$10$8K1p5UjP5.6WRwQz3Q5iZeKlHgzDyEkWOC8oN9xGjI6qzRJJjjhcK', 'Garcia', 'Lucas', 'agent', true);

-- Insertion des clients
INSERT INTO clients (nom, prenom, date_naissance, numero_secu, telephone, email, adresse, situation_familiale, nombre_ayants_droit, mutuelle_actuelle, niveau_couverture, statut, notes, created_by) VALUES
('Hammada', 'Hakim', '1985-01-15', '1234567890123', '0670629101', 'ogassur@gmail.com', '123 Rue de la République 75001 Paris', 'marie', 2, 'Harmonie Mutuelle', 'standard', 'nouveau', 'Premier client', 1),
('Dupont', 'Jean', '1980-01-15', '1234567890124', '0123456789', 'jean.dupont@email.com', '123 Rue de la Paix 75001 Paris', 'marie', 2, 'Harmonie Mutuelle', 'standard', 'prospect', 'Premier contact', 1),
('Martin', 'Marie', '1985-05-20', '2345678901234', '0987654321', 'marie.martin@email.com', '456 Avenue des Champs 69000 Lyon', 'celibataire', 0, 'MGEN', 'premium', 'client', 'Client fidèle', 1),
('Bernard', 'Pierre', '1975-11-10', '3456789012345', '0567890123', 'pierre.bernard@email.com', '789 Boulevard République 13000 Marseille', 'marie', 3, 'Malakoff Humanis', 'standard', 'prospect', 'À recontacter', 1),
('Moreau', 'Sophie', '1990-03-25', '4567890123456', '0654321098', 'sophie.moreau@email.com', '321 Rue du Commerce 31000 Toulouse', 'marie', 1, 'Mutuelle Générale', 'premium', 'client', 'Contrat renouvelé', 1),
('Lefebvre', 'Thomas', '1982-07-08', '5678901234567', '0789012345', 'thomas.lefebvre@email.com', '654 Avenue de la Liberté 59000 Lille', 'celibataire', 0, 'AG2R La Mondiale', 'standard', 'prospect', 'Devis envoyé', 1),
('Rousseau', 'Claire', '1988-12-03', '6789012345678', '0123456780', 'claire.rousseau@email.com', '987 Place de la Mairie 67000 Strasbourg', 'marie', 2, 'Mutex', 'standard', 'client', 'Nouveau contrat', 1),
('Lambert', 'Antoine', '1983-09-18', '7890123456789', '0234567891', 'antoine.lambert@email.com', '159 Rue Victor Hugo 44000 Nantes', 'celibataire', 0, 'MAIF', 'premium', 'prospect', 'En négociation', 1),
('Girard', 'Isabelle', '1977-04-22', '8901234567890', '0345678902', 'isabelle.girard@email.com', '753 Avenue Montaigne 06000 Nice', 'marie', 3, 'Groupama', 'standard', 'client', 'Contrat familial', 1);

-- Insertion d'un devis exemple
INSERT INTO devis (client_id, numero_devis, date_creation, date_validite, montant_mensuel, montant_annuel, garanties, statut, notes, created_by) VALUES
(1, 'DEV-2025-001', '2025-07-16', '2025-08-16', 85.50, 1026.00, 'Couverture complète famille, Hospitalisation, Soins dentaires, Optique', 'en_cours', 'Devis personnalisé pour famille', 1);

-- Insertion d'un document exemple
INSERT INTO documents (nom, type, chemin, taille, client_id, created_by) VALUES
('contrat_hammada.pdf', 'contrat', '/uploads/contrat_hammada.pdf', 245760, 1, 1);

-- Insertion d'un appel exemple
INSERT INTO appels (client_id, date_appel, duree, notes, statut, prochain_rappel, created_by) VALUES
(1, '2025-07-16 10:00:00', 15, 'Discussion sur les besoins en assurance famille', 'termine', '2025-07-23 10:00:00', 1);

-- ==================================================
-- ÉTAPE 4: CRÉATION DES INDEX POUR LES PERFORMANCES
-- ==================================================

-- Index sur les tables principales
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_actif ON users(actif);

CREATE INDEX idx_clients_nom ON clients(nom);
CREATE INDEX idx_clients_prenom ON clients(prenom);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_telephone ON clients(telephone);
CREATE INDEX idx_clients_statut ON clients(statut);
CREATE INDEX idx_clients_created_by ON clients(created_by);
CREATE INDEX idx_clients_created_at ON clients(created_at);

CREATE INDEX idx_devis_client_id ON devis(client_id);
CREATE INDEX idx_devis_numero ON devis(numero_devis);
CREATE INDEX idx_devis_statut ON devis(statut);
CREATE INDEX idx_devis_created_by ON devis(created_by);
CREATE INDEX idx_devis_date_creation ON devis(date_creation);

CREATE INDEX idx_documents_client_id ON documents(client_id);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_created_by ON documents(created_by);
CREATE INDEX idx_documents_created_at ON documents(created_at);

CREATE INDEX idx_rappels_client_id ON rappels(client_id);
CREATE INDEX idx_rappels_date ON rappels(date_rappel);
CREATE INDEX idx_rappels_statut ON rappels(statut);
CREATE INDEX idx_rappels_created_by ON rappels(created_by);

CREATE INDEX idx_appels_client_id ON appels(client_id);
CREATE INDEX idx_appels_date ON appels(date_appel);
CREATE INDEX idx_appels_statut ON appels(statut);
CREATE INDEX idx_appels_created_by ON appels(created_by);

-- ==================================================
-- ÉTAPE 5: VÉRIFICATION DES DONNÉES
-- ==================================================

-- Vérifier le nombre d'enregistrements
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'clients' as table_name, COUNT(*) as count FROM clients
UNION ALL
SELECT 'devis' as table_name, COUNT(*) as count FROM devis
UNION ALL
SELECT 'documents' as table_name, COUNT(*) as count FROM documents
UNION ALL
SELECT 'rappels' as table_name, COUNT(*) as count FROM rappels
UNION ALL
SELECT 'appels' as table_name, COUNT(*) as count FROM appels;

-- Vérifier les utilisateurs
SELECT id, username, email, nom, prenom, role FROM users ORDER BY id;

-- Vérifier les clients
SELECT id, nom, prenom, email, statut FROM clients ORDER BY id;

-- ==================================================
-- SCRIPT TERMINÉ
-- ==================================================

-- Résumé des données créées:
-- - 9 utilisateurs (1 admin + 8 agents)
-- - 9 clients avec différents statuts
-- - 1 devis exemple
-- - 1 document exemple
-- - 1 appel exemple
-- - 27 index pour optimisation des performances
-- - Toutes les contraintes de clés étrangères

-- IMPORTANT: Tous les mots de passe sont hashés avec bcrypt pour "admin123"
-- Connexion: admin/admin123 ou n'importe quel agent/admin123