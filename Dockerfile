# Dockerfile pour ASSURMINUT CRM
FROM node:18-alpine

# Installer les dépendances système
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    postgresql-client

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .

# Créer les dossiers nécessaires
RUN mkdir -p uploads dist

# Builder l'application client
RUN npm run build

# Exposer le port
EXPOSE 5000

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=5000

# Changer les permissions pour les uploads
RUN chown -R node:node /app/uploads

# Utiliser l'utilisateur node pour la sécurité
USER node

# Commande de démarrage
CMD ["npm", "start"]