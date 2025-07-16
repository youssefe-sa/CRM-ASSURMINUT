# Résolution problème 404 - Configuration Production

## 🔍 Problème identifié
Le projet était configuré pour le développement (Vite dev server) mais pas pour la production (fichiers statiques).

## 🛠️ Solution appliquée

### 1. Script de production personnalisé
- **Créé** : `start-production.js`
- **Fonction** : Servir les fichiers statiques du répertoire `dist`
- **Avantages** : Gestion complète des routes API + fichiers statiques

### 2. Configuration Dockerfile adaptée
```dockerfile
# Build l'application
RUN npm run build

# Vérifier que le build a réussi
RUN ls -la dist/

# Démarrer avec le script de production
CMD ["node", "start-production.js"]
```

### 3. Configuration nixpacks.toml
```toml
[start]
cmd = "node start-production.js"
```

## 🏗️ Architecture de production

### Structure après build :
```
/app/
├── dist/              # Fichiers frontend buildés (vite build)
├── dist/index.js      # Serveur backend bundlé (esbuild)
├── uploads/           # Fichiers uploadés
├── start-production.js # Script de démarrage production
└── server/            # Code source serveur
```

### Flux de requêtes :
1. **API routes** (`/api/*`) → Serveur Express
2. **Static files** → Dossier `dist/`
3. **File uploads** → Dossier `uploads/`
4. **Client routing** → `index.html` (SPA)

## 🔧 Configuration Coolify finale

**Recommandations :**
- **Build Pack** : Dockerfile ou Nixpacks
- **Start Command** : `node start-production.js`
- **Port** : `5000`
- **Health Check** : `/health`

**Variables d'environnement :**
```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres.hiyuhkilffabnjwpkdby:Ucef@1984#@aws-0-eu-west-3.pooler.supabase.com:6543/postgres
SESSION_SECRET=assurminut-crm-secret-key-2025-production
```

## 🎯 Résultat attendu

✅ **Frontend** : React app servie depuis `/dist`
✅ **Backend** : Express API sur `/api/*`
✅ **Uploads** : Documents accessibles via `/uploads`
✅ **Routing** : Client-side routing géré par `index.html`
✅ **Database** : Connexion Supabase PostgreSQL
✅ **Auth** : Sessions et authentification fonctionnelles

## 🚀 Déploiement

1. **Build local** : `npm run build`
2. **Vérification** : `ls -la dist/`
3. **Test local** : `node start-production.js`
4. **Commit** : Nouvelles configurations
5. **Deploy** : Coolify avec Dockerfile/Nixpacks

---

**Cette configuration résout définitivement les problèmes 404 et de déploiement !**