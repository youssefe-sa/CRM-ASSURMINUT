-- Script SQL pour créer les tables nécessaires pour ASSURMINUT CRM
-- Base de données: PostgreSQL (Supabase)

-- Table des utilisateurs (agents/admin)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'agent', -- agent, admin
    actif BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des clients
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE NOT NULL,
    numero_secu VARCHAR(15) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    adresse TEXT NOT NULL,
    situation_familiale VARCHAR(20) NOT NULL,
    nombre_ayants_droit INTEGER DEFAULT 0,
    mutuelle_actuelle VARCHAR(100),
    niveau_couverture VARCHAR(50),
    statut VARCHAR(20) NOT NULL DEFAULT 'nouveau', -- nouveau, prospect, client, perdu
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id)
);

-- Table des devis
CREATE TABLE IF NOT EXISTS devis (
    id SERIAL PRIMARY KEY,
    numero_devis VARCHAR(50) NOT NULL UNIQUE,
    client_id INTEGER REFERENCES clients(id) NOT NULL,
    type_devis VARCHAR(50) NOT NULL,
    montant_mensuel DECIMAL(10, 2) NOT NULL,
    garanties JSONB,
    statut VARCHAR(20) NOT NULL DEFAULT 'brouillon', -- brouillon, envoye, accepte, refuse
    date_validite DATE NOT NULL,
    observations TEXT,
    pdf_path TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id)
);

-- Table des documents
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL, -- piece_identite, attestation_secu, contrat, autre
    taille INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    chemin_fichier TEXT NOT NULL,
    client_id INTEGER REFERENCES clients(id),
    devis_id INTEGER REFERENCES devis(id),
    created_at TIMESTAMP DEFAULT NOW(),
    uploaded_by INTEGER REFERENCES users(id)
);

-- Table des rappels
CREATE TABLE IF NOT EXISTS rappels (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    date_rappel TIMESTAMP NOT NULL,
    type VARCHAR(50) NOT NULL, -- appel, relance, rdv, renouvellement
    client_id INTEGER REFERENCES clients(id),
    statut VARCHAR(20) NOT NULL DEFAULT 'en_attente', -- en_attente, fait, reporte
    created_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id)
);

-- Table des appels
CREATE TABLE IF NOT EXISTS appels (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) NOT NULL,
    date_appel TIMESTAMP NOT NULL,
    duree INTEGER, -- en minutes
    statut VARCHAR(20) NOT NULL, -- repondu, message_vocal, a_rappeler, occupe
    notes TEXT,
    prochain_rappel TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_clients_nom ON clients(nom);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_statut ON clients(statut);
CREATE INDEX IF NOT EXISTS idx_clients_created_by ON clients(created_by);

CREATE INDEX IF NOT EXISTS idx_devis_client_id ON devis(client_id);
CREATE INDEX IF NOT EXISTS idx_devis_statut ON devis(statut);
CREATE INDEX IF NOT EXISTS idx_devis_created_by ON devis(created_by);

CREATE INDEX IF NOT EXISTS idx_documents_client_id ON documents(client_id);
CREATE INDEX IF NOT EXISTS idx_documents_devis_id ON documents(devis_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);

CREATE INDEX IF NOT EXISTS idx_rappels_date ON rappels(date_rappel);
CREATE INDEX IF NOT EXISTS idx_rappels_client_id ON rappels(client_id);
CREATE INDEX IF NOT EXISTS idx_rappels_statut ON rappels(statut);
CREATE INDEX IF NOT EXISTS idx_rappels_created_by ON rappels(created_by);

CREATE INDEX IF NOT EXISTS idx_appels_client_id ON appels(client_id);
CREATE INDEX IF NOT EXISTS idx_appels_date ON appels(date_appel);
CREATE INDEX IF NOT EXISTS idx_appels_statut ON appels(statut);
CREATE INDEX IF NOT EXISTS idx_appels_created_by ON appels(created_by);

-- Insertion d'un utilisateur admin par défaut
INSERT INTO users (username, email, password, nom, prenom, role) 
VALUES ('admin', 'admin@assurminut.fr', '$2b$10$8K1p/a9/O5k3xdGhTaQEFOWKdDCYQdZGPJ1D5fOITiJRGgZNAGwdC', 'Admin', 'ASSURMINUT', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Commentaires pour documentation
COMMENT ON TABLE users IS 'Table des utilisateurs du système (agents et administrateurs)';
COMMENT ON TABLE clients IS 'Table des clients avec leurs informations personnelles et assurance';
COMMENT ON TABLE devis IS 'Table des devis générés pour les clients';
COMMENT ON TABLE documents IS 'Table des documents uploadés (pièces d''identité, attestations, etc.)';
COMMENT ON TABLE rappels IS 'Table des rappels et rendez-vous programmés';
COMMENT ON TABLE appels IS 'Table du journal des appels effectués';