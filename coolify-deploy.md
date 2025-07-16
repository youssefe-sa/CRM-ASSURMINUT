# Déploiement Rapide - ASSURMINUT CRM sur Coolify

## Étapes simples

### 1. Pusher le code sur GitHub
```bash
git add .
git commit -m "Préparation déploiement Coolify"
git push origin main
```

### 2. Dans Coolify
1. **Nouveau projet** → "assurminut-crm"
2. **Nouvelle application** → Repository GitHub
3. **URL**: https://github.com/votre-username/assurminut-crm
4. **Branche**: main

### 3. Configuration automatique
Coolify détectera automatiquement :
- ✅ `Dockerfile` pour le build
- ✅ `package.json` pour les dépendances
- ✅ Port 5000 pour l'exposition

### 4. Variables d'environnement
```
DATABASE_URL=postgresql://postgres.xxx:password@host:5432/postgres
SESSION_SECRET=your-super-secret-session-key-here
NODE_ENV=production
PORT=5000
```

### 5. Déployement
Cliquez sur **"Deploy"** et Coolify va :
1. Cloner le repo
2. Builder avec Docker
3. Démarrer l'application
4. Configurer le reverse proxy

### 6. Domaine (optionnel)
- Ajoutez votre domaine dans les paramètres
- SSL automatique avec Let's Encrypt

## Commandes utiles après déploiement

```bash
# Logs en temps réel
docker logs -f coolify-assurminut-crm

# Redémarrer l'application
docker restart coolify-assurminut-crm

# Vérifier l'état
docker ps | grep assurminut
```

## Webhook GitHub pour déploiement automatique
1. Copiez l'URL webhook depuis Coolify
2. GitHub → Settings → Webhooks → Add webhook
3. URL webhook + Push events

**C'est tout ! 🎉**

Votre CRM sera accessible sur : https://votre-domaine.com
Login: admin / admin123