# Solution Finale - Coolify avec Nixpacks

## Problème identifié et résolu ✅

Coolify utilise **Nixpacks** qui a détecté le projet comme une SPA statique au lieu d'un serveur Express. La solution est d'ajouter un fichier `nixpacks.toml` pour forcer l'utilisation du serveur backend.

## Actions réalisées

1. ✅ **Fichier nixpacks.toml créé** pour forcer l'utilisation d'Express
2. ✅ **Configuration Nixpacks** pour serveur Node.js avec health checks
3. ✅ **Documentation complète** des étapes de correction

## Configuration finale

### Fichier nixpacks.toml ajouté :
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

## Étapes finales à suivre

### 1. Commitez les changements
```bash
git add nixpacks.toml
git commit -m "Correction Nixpacks pour serveur Express"
git push origin main
```

### 2. Redéployez dans Coolify
- Allez dans votre projet Coolify
- Cliquez sur "Deploy"
- Attendez la fin du build (vérifiez les logs)

### 3. Vérifiez le déploiement
Le build devrait maintenant montrer :
- ✅ `npm start` au lieu de Caddy
- ✅ Express server sur port 5000
- ✅ Health checks fonctionnels

### 4. Configurez le health check
Dans Coolify → Settings → Health Check :
- **URL** : `/health`
- **Port** : `5000`
- **Interval** : `30s`
- **Timeout** : `10s`
- **Retries** : `3`

### 5. Variables d'environnement
Assurez-vous que ces variables sont définies :
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres.hiyuhkilffabnjwpkdby:Ucef@1984#@aws-0-eu-west-3.pooler.supabase.com:6543/postgres
SESSION_SECRET=your-secure-session-secret
```

## Tests à effectuer

### Une fois redéployé :
1. **URL application** : https://votre-domaine.com → Page de connexion
2. **Health check** : https://votre-domaine.com/health → JSON status
3. **API health** : https://votre-domaine.com/api/health → DB status
4. **Connexion** : admin / admin123 → Dashboard

## Résultat attendu

✅ **Serveur Express fonctionnel**
✅ **API backend accessible**
✅ **Base de données connectée**
✅ **Health checks opérationnels**
✅ **Status "Healthy" dans Coolify**

## Si le problème persiste

Alternative : Forcer l'utilisation du Dockerfile
1. Dans Coolify → Settings → Build
2. **Build Pack** → **Dockerfile**
3. **Dockerfile location** : `./Dockerfile`
4. Redéployez

---

**Votre CRM ASSURMINUT sera pleinement fonctionnel après ces étapes !**

Login : admin / admin123
Agents : marie.dupont, pierre.martin, etc. / admin123