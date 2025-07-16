# Dockerfile pour ASSURMINUT CRM
FROM node:18-alpine

WORKDIR /app

# Installer les dépendances système nécessaires
RUN apk add --no-cache python3 make g++ postgresql-client curl

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer toutes les dépendances, y compris devDependencies
RUN npm install

# Copier le code source
COPY . .

# Créer les dossiers nécessaires
RUN mkdir -p uploads dist

# Build l'application (vite et esbuild)
RUN npm run build

# Vérifier que le build a réussi
RUN ls -la dist/

# Exposer le port
EXPOSE 5000

# Variables d'environnement (pour l'exécution seulement)
ENV NODE_ENV=production
ENV PORT=5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Démarrer l'application avec le script de production
CMD ["node", "start-production.js"]
