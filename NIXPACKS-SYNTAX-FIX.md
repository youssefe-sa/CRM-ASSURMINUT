# Nixpacks - Correction finale pour erreur "Not a directory"

## 🔍 Problème identifié
```
Error: Writing Dockerfile
Caused by:
0: Creating Dockerfile file
1: Not a directory (os error 20)
```

## 🛠️ Solution appliquée

### 1. Correction nixpacks.toml
```toml
providers = ["node", "environment"]

[variables]
NODE_ENV = "production"
PORT = "5000"
NPM_CONFIG_PRODUCTION = "false"

[phases.build]
cmd = "npm run build"

[start]
cmd = "node dist/index.js"
```

### 2. Changements effectués
- ✅ Ajout provider "environment" 
- ✅ Définition explicite du PORT=5000
- ✅ NPM_CONFIG_PRODUCTION=false pour inclure devDependencies
- ✅ Commande start directe: node dist/index.js

## 🔧 Configuration Coolify finale

**Dans l'interface Coolify :**
1. **Build Pack** : Nixpacks (par défaut)
2. **Start Command** : `node dist/index.js`
3. **Ports** : `5000:5000`
4. **Variables d'environnement** :
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=postgresql://postgres.hiyuhkilffabnjwpkdby:Ucef@1984#@aws-0-eu-west-3.pooler.supabase.com:6543/postgres
   SESSION_SECRET=assurminut-crm-secret-key-2025-production
   ```

## 📋 Alternative si Nixpacks échoue encore

**Passez au Dockerfile manuellement :**
1. Dans Coolify, changez Build Pack vers **"Dockerfile"**
2. Start Command : `npm start`
3. Gardez les mêmes ports et variables

## 🎯 Résultat attendu

Le build devrait maintenant :
- ✅ Installer les dépendances avec `npm ci`
- ✅ Builder avec `npm run build` (vite + esbuild)
- ✅ Démarrer avec `node dist/index.js`
- ✅ Servir l'application Express complète
- ✅ Connecter à la base Supabase

## 🚀 Actions immédiates

1. **Commitez les changements** nixpacks.toml
2. **Redéployez** dans Coolify
3. **Testez** l'application sur l'URL
4. **Vérifiez** les health checks

---

**Cette correction devrait résoudre définitivement l'erreur "Not a directory" !**