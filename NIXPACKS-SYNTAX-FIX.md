# Correction Syntaxe Nixpacks - Erreur Résolue

## Erreur identifiée ❌
```
Failed to parse Nixpacks config file `nixpacks.toml`
invalid type: map, expected a sequence for key `providers` at line 23 column 1
```

## Problème
La syntaxe `[providers]` était incorrecte. Nixpacks attend une liste de providers, pas un objet.

## Correction appliquée ✅

### Avant (incorrect) :
```toml
[providers]
node = true
```

### Après (correct) :
```toml
providers = ["node"]
```

## Fichier nixpacks.toml corrigé

```toml
# Configuration Nixpacks pour ASSURMINUT CRM
# Force l'utilisation du serveur Express au lieu de build statique

providers = ["node"]

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

## Prochaines actions

1. **Commitez la correction** :
```bash
git add nixpacks.toml
git commit -m "Fix nixpacks.toml syntax error"
git push origin main
```

2. **Redéployez dans Coolify**
   - Le build devrait maintenant réussir
   - Nixpacks utilisera le provider Node.js
   - L'application démarrera avec `npm start`

3. **Vérifiez le résultat**
   - URL : https://b4ckc8k0c4c8g48cksckggks.31.97.197.34.sslip.io/
   - Devrait afficher la page de connexion ASSURMINUT

## Alternative si problème persiste

Utilisez le Dockerfile dans les paramètres Coolify :
1. Settings → Build → Build Pack → "Dockerfile"
2. Dockerfile location : `./Dockerfile`
3. Redéployez

---

**Le déploiement devrait maintenant réussir avec la syntaxe corrigée !**