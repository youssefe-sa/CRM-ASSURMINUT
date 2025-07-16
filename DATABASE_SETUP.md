# Configuration Base de Données Supabase - ASSURMINUT CRM

## Configuration Actuelle

**Base de données:** PostgreSQL (Supabase)
**URL de connexion:** `postgresql://postgres.hiyuhkilffabnjwpkdby:Ucef@1984#@aws-0-eu-west-3.pooler.supabase.com:6543/postgres`

## Tables Créées

Le CRM utilise les tables suivantes :

### 1. `users` - Utilisateurs du système
- **id** (SERIAL PRIMARY KEY) - Identifiant unique
- **username** (VARCHAR(50)) - Nom d'utilisateur unique
- **email** (VARCHAR(100)) - Email unique
- **password** (TEXT) - Mot de passe hashé avec bcrypt
- **nom** (VARCHAR(100)) - Nom de famille
- **prenom** (VARCHAR(100)) - Prénom
- **role** (VARCHAR(20)) - Rôle (agent, admin)
- **actif** (BOOLEAN) - Compte actif ou non
- **created_at** (TIMESTAMP) - Date de création
- **updated_at** (TIMESTAMP) - Date de mise à jour

### 2. `clients` - Clients
- **id** (SERIAL PRIMARY KEY) - Identifiant unique
- **nom** (VARCHAR(100)) - Nom du client
- **prenom** (VARCHAR(100)) - Prénom du client
- **date_naissance** (DATE) - Date de naissance
- **numero_secu** (VARCHAR(15)) - Numéro de sécurité sociale
- **telephone** (VARCHAR(20)) - Numéro de téléphone
- **email** (VARCHAR(100)) - Email du client
- **adresse** (TEXT) - Adresse complète
- **situation_familiale** (VARCHAR(20)) - Situation familiale
- **nombre_ayants_droit** (INTEGER) - Nombre d'ayants droit
- **mutuelle_actuelle** (VARCHAR(100)) - Mutuelle actuelle
- **niveau_couverture** (VARCHAR(50)) - Niveau de couverture
- **statut** (VARCHAR(20)) - Statut (nouveau, prospect, client, perdu)
- **notes** (TEXT) - Notes libres
- **created_at** (TIMESTAMP) - Date de création
- **updated_at** (TIMESTAMP) - Date de mise à jour
- **created_by** (INTEGER) - Référence vers users.id

### 3. `devis` - Devis
- **id** (SERIAL PRIMARY KEY) - Identifiant unique
- **numero_devis** (VARCHAR(50)) - Numéro de devis unique
- **client_id** (INTEGER) - Référence vers clients.id
- **type_devis** (VARCHAR(50)) - Type de devis
- **montant_mensuel** (DECIMAL(10,2)) - Montant mensuel
- **garanties** (JSONB) - Garanties en JSON
- **statut** (VARCHAR(20)) - Statut (brouillon, envoye, accepte, refuse)
- **date_validite** (DATE) - Date de validité
- **observations** (TEXT) - Observations
- **pdf_path** (TEXT) - Chemin vers le PDF
- **created_at** (TIMESTAMP) - Date de création
- **updated_at** (TIMESTAMP) - Date de mise à jour
- **created_by** (INTEGER) - Référence vers users.id

### 4. `documents` - Documents
- **id** (SERIAL PRIMARY KEY) - Identifiant unique
- **nom** (VARCHAR(200)) - Nom du document
- **type** (VARCHAR(50)) - Type (piece_identite, attestation_secu, contrat, autre)
- **taille** (INTEGER) - Taille en octets
- **mime_type** (VARCHAR(100)) - Type MIME
- **chemin_fichier** (TEXT) - Chemin vers le fichier
- **client_id** (INTEGER) - Référence vers clients.id
- **devis_id** (INTEGER) - Référence vers devis.id
- **created_at** (TIMESTAMP) - Date de création
- **uploaded_by** (INTEGER) - Référence vers users.id

### 5. `rappels` - Rappels et rendez-vous
- **id** (SERIAL PRIMARY KEY) - Identifiant unique
- **titre** (VARCHAR(200)) - Titre du rappel
- **description** (TEXT) - Description
- **date_rappel** (TIMESTAMP) - Date du rappel
- **type** (VARCHAR(50)) - Type (appel, relance, rdv, renouvellement)
- **client_id** (INTEGER) - Référence vers clients.id
- **statut** (VARCHAR(20)) - Statut (en_attente, fait, reporte)
- **created_at** (TIMESTAMP) - Date de création
- **created_by** (INTEGER) - Référence vers users.id

### 6. `appels` - Journal des appels
- **id** (SERIAL PRIMARY KEY) - Identifiant unique
- **client_id** (INTEGER) - Référence vers clients.id
- **date_appel** (TIMESTAMP) - Date de l'appel
- **duree** (INTEGER) - Durée en minutes
- **statut** (VARCHAR(20)) - Statut (repondu, message_vocal, a_rappeler, occupe)
- **notes** (TEXT) - Notes de l'appel
- **prochain_rappel** (TIMESTAMP) - Date du prochain rappel
- **created_at** (TIMESTAMP) - Date de création
- **created_by** (INTEGER) - Référence vers users.id

## Compte Admin par Défaut

**Nom d'utilisateur:** admin
**Mot de passe:** admin123
**Email:** admin@crm.com

## Index Créés

Pour optimiser les performances :
- `idx_clients_nom` - Index sur le nom des clients
- `idx_clients_email` - Index sur l'email des clients
- `idx_clients_statut` - Index sur le statut des clients
- `idx_clients_created_by` - Index sur created_by dans clients
- `idx_devis_client_id` - Index sur client_id dans devis
- `idx_devis_statut` - Index sur le statut des devis
- `idx_devis_created_by` - Index sur created_by dans devis
- `idx_documents_client_id` - Index sur client_id dans documents
- `idx_documents_devis_id` - Index sur devis_id dans documents
- `idx_documents_type` - Index sur le type de document
- `idx_rappels_date` - Index sur date_rappel
- `idx_rappels_client_id` - Index sur client_id dans rappels
- `idx_rappels_statut` - Index sur le statut des rappels
- `idx_rappels_created_by` - Index sur created_by dans rappels
- `idx_appels_client_id` - Index sur client_id dans appels
- `idx_appels_date` - Index sur date_appel
- `idx_appels_statut` - Index sur le statut des appels
- `idx_appels_created_by` - Index sur created_by dans appels

## Statistiques Actuelles

- **Utilisateurs:** 9 (1 admin + 8 agents)
- **Clients:** 9 (1 client initial + 8 clients importés)
- **Devis:** 1
- **Documents:** 1
- **Rappels:** 0
- **Appels:** 1

### Répartition des clients par statut
- **Prospects:** 6 clients
- **Clients actifs:** 2 clients  
- **Nouveaux:** 1 client

## Fonctionnalités d'Import

### Import de Portefeuille Client
- **Formats supportés:** Excel (.xlsx, .xls), CSV (.csv)
- **Taille maximale:** 10MB par fichier
- **Validation automatique:** Schéma Zod avec gestion d'erreurs
- **Mapping intelligent:** Reconnaissance automatique des colonnes
- **Résultats détaillés:** Statistiques d'import et rapport d'erreurs

### Colonnes Reconnues pour l'Import
- `nom`, `Nom`, `NOM`, `lastname`, `last_name`
- `prenom`, `Prenom`, `PRENOM`, `firstname`, `first_name`
- `email`, `Email`, `EMAIL`, `mail`
- `telephone`, `Telephone`, `TELEPHONE`, `phone`, `tel`
- `date_naissance`, `dateNaissance`, `birth_date`, `naissance`
- `numero_secu`, `numeroSecu`, `secu`, `social_security`
- `adresse`, `Adresse`, `ADRESSE`, `address`
- `situation_familiale`, `situationFamiliale`, `marital_status`
- `nombre_ayants_droit`, `ayants_droit`, `dependents`
- `mutuelle_actuelle`, `mutuelleActuelle`, `current_insurance`
- `niveau_couverture`, `niveauCouverture`, `coverage_level`
- `statut`, `Statut`, `STATUS`, `status`
- `notes`, `Notes`, `NOTES`, `comments`

## Commandes Utiles

```bash
# Pousser les modifications du schéma
npm run db:push

# Générer les migrations
npm run db:generate

# Vérifier la structure de la base
npm run db:introspect

# Tester l'import avec le fichier exemple
# Utiliser exemple_import.csv dans l'interface
```

## Sécurité

- Mots de passe hashés avec bcrypt
- Connexion sécurisée via TLS
- Authentification par session
- Validation des données avec Zod
- Protection contre les injections SQL via Drizzle ORM