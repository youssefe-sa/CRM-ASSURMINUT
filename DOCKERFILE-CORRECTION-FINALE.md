# Correction Dockerfile - Erreur Vite résolue

## Problème identifié ❌
```
sh: vite: not found
ERROR: process "/bin/sh -c npm run build" did not complete successfully: exit code: 127
```

## Cause racine
Le Dockerfile utilisait `npm ci --only=production` qui n'installait que les dépendances de production, mais `vite` et `esbuild` sont dans les devDependencies et sont nécessaires pour le build.

## Correction appliquée ✅

### Avant (incorrect) :
```dockerfile
RUN npm ci --only=production
RUN npm run build
```

### Après (correct) :
```dockerfile
RUN npm ci
RUN npm run build
RUN npm prune --production
```

## Dockerfile corrigé complet

```dockerfile
FROM node:18-alpine

# Installer les dépendances système
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    postgresql-client \
    curl

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package
COPY package*.json ./

# Installer toutes les dépendances (dev + prod pour le build)
RUN npm ci

# Copier le code source
COPY . .

# Créer les dossiers nécessaires
RUN mkdir -p uploads dist

# Builder l'application client
RUN npm run build

# Nettoyer les dépendances dev après le build
RUN npm prune --production

# Exposer le port
EXPOSE 5000

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=5000

# Changer les permissions pour les uploads
RUN chown -R node:node /app/uploads

# Utiliser l'utilisateur node pour la sécurité
USER node

# Health check pour Coolify
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Commande de démarrage
CMD ["npm", "start"]
```

## Prochaines actions

1. **Commitez la correction** :
```bash
git add Dockerfile
git commit -m "Fix Dockerfile: install all deps for build, then prune"
git push origin main
```

2. **Redéployez dans Coolify**
   - Le build devrait maintenant réussir
   - Vite et esbuild seront disponibles pour le build
   - Les dépendances dev seront supprimées après le build

3. **Vérifiez le résultat**
   - Build réussi sans erreur vite
   - Application accessible sur l'URL
   - Health checks fonctionnels

---

**Le déploiement devrait maintenant réussir sans erreur !**