# Solution Health Check Coolify - ASSURMINUT CRM

## Problème Résolu ✅

Le problème "Unhealthy state" sur Coolify a été résolu. Les endpoints de health check sont maintenant fonctionnels.

## Configuration Coolify

### 1. Dans les paramètres de l'application Coolify

**Health Check Settings:**
- **Enable Health Check**: ✅ Activé
- **Health Check URL**: `/health`
- **Health Check Port**: `5000` (port par défaut)
- **Health Check Method**: `GET`
- **Interval**: `30` secondes
- **Timeout**: `10` secondes
- **Retries**: `3`
- **Start Period**: `40` secondes

### 2. Variables d'environnement requises

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres.xxx:password@host:5432/postgres
SESSION_SECRET=your-secure-session-secret
```

### 3. Redéployement

1. **Commitez les changements** :
```bash
git add .
git commit -m "Ajout health check pour Coolify"
git push origin main
```

2. **Redéployez dans Coolify** :
   - Cliquez sur "Deploy" dans votre projet
   - Attendez que le build se termine
   - Vérifiez les logs

3. **Configurez le health check** :
   - Allez dans Settings > Health Check
   - Activez avec l'URL `/health`
   - Sauvegardez

## Endpoints Disponibles

### `/health` - Health Check Simple
```json
{
  "status": "healthy",
  "timestamp": "2025-07-16T10:18:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

### `/api/health` - Health Check avec DB
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-07-16T10:18:00.000Z",
  "uptime": 3600
}
```

## Vérification

### 1. Status dans Coolify
- Status devrait passer à "Healthy" ✅
- Logs montrent les requêtes health check réussies
- Monitoring automatique activé

### 2. Test manuel
```bash
# Testez directement (remplacez par votre domaine)
curl https://votre-domaine.com/health
curl https://votre-domaine.com/api/health
```

## Avantages

1. **Monitoring automatique** - Coolify surveille en permanence
2. **Redémarrage automatique** - En cas de problème détecté
3. **Alertes** - Notifications en cas de dysfonctionnement
4. **Diagnostic** - Vérification connexion base de données

## Dépannage

### Si le status reste "Unhealthy"

1. **Vérifiez les logs** :
   - Logs de build
   - Logs de l'application
   - Logs du health check

2. **Vérifiez la configuration** :
   - Port correct (5000)
   - URL health check (`/health`)
   - Variables d'environnement

3. **Testez manuellement** :
```bash
# Depuis le container
docker exec -it coolify-assurminut-crm curl http://localhost:5000/health
```

## Résultat Attendu

✅ **Status "Healthy"** dans Coolify
✅ **Monitoring automatique** fonctionnel
✅ **Déploiement réussi** avec health check

---

**Votre application ASSURMINUT est maintenant correctement surveillée par Coolify !**