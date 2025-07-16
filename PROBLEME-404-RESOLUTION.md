# Résolution Erreur 404 - Coolify Nixpacks

## Problème confirmé ❌

L'URL `b4ckc8k0c4c8g48cksckggks.31.97.197.34.sslip.io` retourne une erreur 404, confirmant que Coolify utilise Nixpacks avec une configuration statique au lieu de notre serveur Express.

## Cause racine

Nixpacks détecte automatiquement le projet comme une SPA (Single Page Application) et génère une configuration Caddy statique au lieu de démarrer notre serveur Express backend.

## Solutions appliquées

### 1. Fichier .nixpacks créé
Force la détection comme application Node.js :
```
node
```

### 2. nixpacks.toml mis à jour
Ajout du provider node explicite :
```toml
[providers]
node = true
```

### 3. Alternative : Forcer l'utilisation du Dockerfile

Dans l'interface Coolify :
1. **Application Settings** → **Build**
2. **Build Pack** : Changer de "Nixpacks" vers "Dockerfile"
3. **Dockerfile Location** : `./Dockerfile`
4. **Build Command** : laisser vide
5. **Start Command** : `npm start`

## Actions requises

### Option A : Redéploiement avec Nixpacks corrigé
1. Commitez les nouveaux fichiers :
```bash
git add .nixpacks nixpacks.toml
git commit -m "Force Node.js provider pour Nixpacks"
git push origin main
```

2. Redéployez dans Coolify
3. Vérifiez que les logs montrent "npm start" au lieu de Caddy

### Option B : Utilisation du Dockerfile (Recommandée)
1. Dans Coolify → Settings → Build
2. Changez "Build Pack" vers "Dockerfile"
3. Redéployez

## Vérification après correction

L'URL devrait maintenant afficher :
- ✅ Page de connexion ASSURMINUT
- ✅ Formulaire username/password
- ✅ Logo et branding ASSURMINUT

## Tests à effectuer

1. **Page d'accueil** : https://b4ckc8k0c4c8g48cksckggks.31.97.197.34.sslip.io/
2. **Health check** : https://b4ckc8k0c4c8g48cksckggks.31.97.197.34.sslip.io/health
3. **API health** : https://b4ckc8k0c4c8g48cksckggks.31.97.197.34.sslip.io/api/health
4. **Connexion** : admin / admin123

## Logs attendus après correction

```
Running: npm start
[express] serving on port 5000
Database connected successfully
Health check endpoints registered
```

## Si le problème persiste

1. Vérifiez les logs de build dans Coolify
2. Confirmez que `npm start` est utilisé (pas Caddy)
3. Vérifiez les variables d'environnement
4. Testez les endpoints manuellement

---

**Prochaine étape** : Choisissez l'Option A (Nixpacks corrigé) ou Option B (Dockerfile) et redéployez.