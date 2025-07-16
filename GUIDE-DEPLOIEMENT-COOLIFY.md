# Guide de Déploiement Coolify - ASSURMINUT CRM

## Prérequis

### 1. Serveur Coolify
- Serveur Ubuntu/Debian avec Coolify installé
- Docker et Docker Compose fonctionnels
- Accès SSH au serveur
- Domaine configuré (optionnel)

### 2. Repository GitHub
- Code source ASSURMINUT CRM poussé sur GitHub
- Accès au repository (public ou privé avec token)

### 3. Base de données
- PostgreSQL (Supabase ou serveur dédié)
- Variables d'environnement de connexion

## Étape 1: Préparation du Repository GitHub

### 1.1 Structure du projet
Assurez-vous que votre repository contient :
```
├── package.json
├── package-lock.json
├── Dockerfile (optionnel)
├── docker-compose.yml (optionnel)
├── .env.example
├── client/
├── server/
├── shared/
└── uploads/
```

### 1.2 Créer le Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers package
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .

# Créer le dossier uploads
RUN mkdir -p uploads

# Build de l'application
RUN npm run build

# Exposer le port
EXPOSE 5000

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=5000

# Commande de démarrage
CMD ["npm", "start"]
```

### 1.3 Créer le script de build
Ajoutez dans `package.json` :
```json
{
  "scripts": {
    "build": "npm run build:client && npm run build:server",
    "build:client": "cd client && npm run build",
    "build:server": "tsc server/index.ts --outDir dist",
    "start": "node dist/server/index.js",
    "dev": "NODE_ENV=development tsx server/index.ts"
  }
}
```

### 1.4 Fichier .env.example
```env
# Base de données
DATABASE_URL=postgresql://user:password@host:port/database
PGHOST=localhost
PGPORT=5432
PGDATABASE=assurminut
PGUSER=postgres
PGPASSWORD=password

# Session
SESSION_SECRET=your-session-secret-here

# Application
NODE_ENV=production
PORT=5000
```

## Étape 2: Configuration Coolify

### 2.1 Créer un nouveau projet
1. Connectez-vous à votre interface Coolify
2. Cliquez sur "New Project"
3. Donnez un nom : "assurminut-crm"
4. Sélectionnez votre serveur

### 2.2 Ajouter une application
1. Dans le projet, cliquez "New Resource"
2. Sélectionnez "Application"
3. Choisissez "Public Repository" ou "Private Repository"
4. Renseignez l'URL GitHub : `https://github.com/votre-username/assurminut-crm`

### 2.3 Configuration du déploiement
```yaml
# Configuration Coolify
name: assurminut-crm
source:
  type: git
  repository: https://github.com/votre-username/assurminut-crm
  branch: main
  
build:
  dockerfile: Dockerfile
  context: .
  
runtime:
  port: 5000
  
domains:
  - assurminut.votre-domaine.com
  
environment:
  NODE_ENV: production
  PORT: 5000
```

## Étape 3: Variables d'environnement

### 3.1 Dans Coolify
Allez dans "Environment Variables" et ajoutez :

```
DATABASE_URL=postgresql://postgres.xxx:password@host:5432/postgres
PGHOST=aws-0-eu-west-3.pooler.supabase.com
PGPORT=6543
PGDATABASE=postgres
PGUSER=postgres.xxx
PGPASSWORD=votre-mot-de-passe
SESSION_SECRET=votre-secret-session-aleatoire
NODE_ENV=production
PORT=5000
```

### 3.2 Secrets (si nécessaire)
Pour des données sensibles :
- Utilisez les "Secrets" dans Coolify
- Référencez-les dans les variables d'environnement

## Étape 4: Configuration du domaine

### 4.1 DNS
Pointez votre domaine vers l'IP de votre serveur Coolify :
```
A record: assurminut.votre-domaine.com → IP_SERVEUR
```

### 4.2 SSL/TLS
Coolify gère automatiquement Let's Encrypt :
1. Activez "Generate SSL Certificate"
2. Coolify créera automatiquement le certificat

## Étape 5: Déploiement

### 5.1 Premier déploiement
1. Cliquez sur "Deploy"
2. Coolify va :
   - Cloner le repository
   - Installer les dépendances
   - Builder l'application
   - Créer le container Docker
   - Démarrer l'application

### 5.2 Surveillez les logs
```bash
# Logs de build
docker logs coolify-assurminut-crm-build

# Logs de l'application
docker logs coolify-assurminut-crm
```

## Étape 6: Configuration post-déploiement

### 6.1 Vérifier la base de données
```bash
# Se connecter au container
docker exec -it coolify-assurminut-crm bash

# Tester la connexion DB
npm run db:push
```

### 6.2 Uploads et volumes
Configurez un volume persistant pour les uploads :
```yaml
volumes:
  - ./uploads:/app/uploads
```

### 6.3 Backup automatique
Configurez les sauvegardes dans Coolify :
1. Allez dans "Backups"
2. Configurez la fréquence
3. Définissez la destination

## Étape 7: Déploiement automatique

### 7.1 Webhook GitHub
1. Dans Coolify, copiez l'URL webhook
2. Dans GitHub, allez dans Settings > Webhooks
3. Ajoutez l'URL Coolify
4. Sélectionnez "Push events"

### 7.2 Déploiement continu
À chaque push sur la branche main :
1. GitHub enverra un webhook
2. Coolify déclenchera automatiquement le déploiement
3. L'application sera mise à jour

## Étape 8: Monitoring et maintenance

### 8.1 Monitoring
Coolify fournit :
- Métriques CPU/RAM
- Logs en temps réel
- Alertes par email
- Uptime monitoring

### 8.2 Mise à jour
```bash
# Redéployer manuellement
# Via l'interface Coolify ou :
curl -X POST https://coolify.votre-domaine.com/webhook/deploy/assurminut-crm
```

## Étape 9: Sécurité

### 9.1 Firewall
```bash
# Configurer le firewall
ufw allow 80
ufw allow 443
ufw allow 22
ufw enable
```

### 9.2 Backup base de données
```bash
# Script de backup quotidien
#!/bin/bash
pg_dump $DATABASE_URL > /backups/assurminut-$(date +%Y%m%d).sql
```

## Dépannage

### Problèmes courants

#### 1. Erreur de build
```bash
# Vérifier les logs
docker logs coolify-assurminut-crm-build
```

#### 2. Connexion base de données
```bash
# Tester la connexion
docker exec -it coolify-assurminut-crm npm run db:test
```

#### 3. Problème de domaine
```bash
# Vérifier DNS
nslookup assurminut.votre-domaine.com
```

#### 4. Certificat SSL
```bash
# Régénérer le certificat
# Via interface Coolify > SSL > Regenerate
```

## Commandes utiles

```bash
# Voir les containers
docker ps

# Logs en temps réel
docker logs -f coolify-assurminut-crm

# Redémarrer l'application
docker restart coolify-assurminut-crm

# Accéder au container
docker exec -it coolify-assurminut-crm bash

# Voir l'utilisation des ressources
docker stats coolify-assurminut-crm
```

## Checklist finale

- [ ] Repository GitHub configuré
- [ ] Dockerfile créé
- [ ] Variables d'environnement configurées
- [ ] Domaine pointé vers le serveur
- [ ] SSL activé
- [ ] Base de données connectée
- [ ] Volumes persistants configurés
- [ ] Webhook GitHub activé
- [ ] Monitoring configuré
- [ ] Backup automatique activé

## Support

Pour des problèmes :
1. Consultez les logs Coolify
2. Vérifiez la documentation Coolify
3. Contactez le support technique
4. Community Discord Coolify

---

**Votre application ASSURMINUT CRM est maintenant déployée sur Coolify !**

URL: https://assurminut.votre-domaine.com
Admin: admin / admin123