# Étape 1 : Build
FROM node:18-alpine AS builder

# Dossier de travail
WORKDIR /app

# Installer dépendances système nécessaires au build
RUN apk add --no-cache python3 make g++ postgresql-client curl

# Copier package.json + package-lock.json
COPY package*.json ./

# Forcer NODE_ENV=development pour installer devDependencies
ENV NODE_ENV=development
RUN npm install

# Copier tout le code source
COPY . .

# Créer dossiers uploads et dist
RUN mkdir -p uploads dist

# Lancer le build (vite + esbuild)
RUN npm run build

# Étape 2 : Image finale
FROM node:18-alpine

WORKDIR /app

# Installer postgresql-client et curl (si besoin en prod, sinon à adapter)
RUN apk add --no-cache postgresql-client curl

# Copier uniquement les fichiers buildés + package.json + node_modules prod
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Installer uniquement les dépendances de production
ENV NODE_ENV=production
RUN npm install --omit=dev

# Copier autres fichiers nécessaires à l'exécution (uploads, config, etc.)
COPY --from=builder /app/uploads ./uploads

# Exposer le port (adapter selon ton app)
EXPOSE 3000

# Commande par défaut
CMD ["node", "dist/server.js"]
