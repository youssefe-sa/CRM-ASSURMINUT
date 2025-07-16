# Correction Coolify - Problème Nixpacks

## Problème Identifié ⚠️

Coolify a détecté votre projet comme une **application statique (SPA)** au lieu d'un **serveur Express**. Il utilise Nixpacks pour build une version statique avec Caddy au lieu de votre serveur backend.

## Symptômes observés :

1. **Build avec Caddy** : Coolify utilise un serveur Caddy statique
2. **Pas de serveur Express** : Votre API backend n'est pas démarrée
3. **Health checks échouent** : Les endpoints `/health` et `/api/health` n'existent pas
4. **Pas de base de données** : Connexion PostgreSQL non disponible

## Solution 1 : Forcer l'utilisation du serveur Express

### Étape 1 : Ajouter nixpacks.toml

Un fichier `nixpacks.toml` a été créé pour forcer l'utilisation du serveur Express :

```toml
[variables]
NODE_ENV = "production"
PORT = "5000"

[phases.build]
dependsOn = ["install"]
cmds = ["npm run build"]

[phases.install]
dependsOn = ["setup"]
cmds = ["npm ci"]

[phases.setup]
nixPkgs = ["nodejs_18", "npm-9_x", "openssl", "curl", "wget"]

[start]
cmd = "npm start"
```

### Étape 2 : Commitez et redéployez

```bash
git add nixpacks.toml
git commit -m "Force Express server avec nixpacks.toml"
git push origin main
```

### Étape 3 : Redéployez dans Coolify

1. Allez dans votre projet Coolify
2. Cliquez sur "Deploy"
3. Vérifiez que le build utilise `npm start` au lieu de Caddy

## Solution 2 : Configuration Dockerfile (Recommandée)

### Étape 1 : Forcer l'utilisation du Dockerfile

Dans les paramètres de votre application Coolify :

1. **Build Settings** → **Build Pack** → **Dockerfile**
2. **Docker file location** : `./Dockerfile`
3. **Build command** : laisser vide
4. **Start command** : `npm start`

### Étape 2 : Variables d'environnement

Assurez-vous que ces variables sont définies :

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres.hiyuhkilffabnjwpkdby:Ucef@1984#@aws-0-eu-west-3.pooler.supabase.com:6543/postgres
SESSION_SECRET=your-secure-session-secret
```

## Solution 3 : Correction du package.json

Modifier le package.json pour que Nixpacks comprenne qu'il s'agit d'un serveur :

```json
{
  "engines": {
    "node": ">=18.0.0"
  },
  "main": "dist/index.js",
  "scripts": {
    "start": "NODE_ENV=production node dist/index.js",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
  }
}
```

## Vérification après correction

### 1. Logs de build

Les logs devraient montrer :
```
Running: npm start
[express] serving on port 5000
```

### 2. Health checks

Les endpoints doivent répondre :
```bash
curl https://votre-domaine.com/health
# → {"status": "healthy", ...}

curl https://votre-domaine.com/api/health  
# → {"status": "healthy", "database": "connected", ...}
```

### 3. Application fonctionnelle

- Page de connexion visible
- API backend accessible
- Base de données connectée

## Étapes recommandées

1. **Priorité 1** : Utilisez le Dockerfile (Solution 2)
2. **Alternative** : Utilisez nixpacks.toml (Solution 1)
3. **Configurez** les variables d'environnement
4. **Testez** les health checks
5. **Activez** le monitoring Coolify

## Prochaines actions

1. Choisissez la solution (Dockerfile recommandé)
2. Commitez les changements
3. Redéployez dans Coolify
4. Configurez le health check avec `/health`
5. Vérifiez le fonctionnement

---

**Résultat attendu** : Serveur Express fonctionnel avec API backend et health checks opérationnels sur Coolify.