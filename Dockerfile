# Étape 1 : Build
FROM node:18-alpine AS builder

WORKDIR /app

# Installer les dépendances système nécessaires au build
RUN apk add --no-cache python3 make g++ postgresql-client curl

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer TOUTES les dépendances (y compris devDependencies) pour le build
ENV NODE_ENV=development
RUN npm install

# Copier le code source complet
COPY . .

# Créer les dossiers nécessaires (si besoin au build)
RUN mkdir -p uploads dist

# Lancer le build (vite + esbuild)
RUN npm run build

# Vérifier que le build a réussi (optionnel)
RUN ls -la dist/

# Étape 2 : Image finale
FROM node:18-alpine

WORKDIR /app

# Installer uniquement les dépendances nécessaires à la production
RUN apk add --no-cache postgresql-client curl

# Copier les fichiers de build et package.json/package-lock.json depuis le builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/uploads ./uploads
COPY --from=builder /app/start-production.js ./

# Variables d'environnement pour la production
ENV NODE_ENV=production
ENV PORT=5000

# Exposer le port
EXPOSE 5000

# Health check (optionnel)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Démarrer l’application
CMD ["node", "start-production.js"]
