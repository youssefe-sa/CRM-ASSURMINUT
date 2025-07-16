# Configuration Health Check pour Coolify - ASSURMINUT CRM

## Problème Résolu ✅

Le problème "Unhealthy state" sur Coolify a été résolu en ajoutant des endpoints de health check.

## Endpoints Health Check Ajoutés

### 1. Endpoint Simple `/health`
```
GET /health
```
Réponse :
```json
{
  "status": "healthy",
  "timestamp": "2025-07-16T10:05:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

### 2. Endpoint avec Vérification DB `/api/health`
```
GET /api/health
```
Réponse (sain) :
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-07-16T10:05:00.000Z",
  "uptime": 3600
}
```

Réponse (problème) :
```json
{
  "status": "unhealthy",
  "database": "disconnected",
  "error": "Connection failed",
  "timestamp": "2025-07-16T10:05:00.000Z"
}
```

## Configuration Coolify

### 1. Health Check URL
Dans les paramètres de votre application Coolify :
- **Health Check URL** : `/health`
- **Interval** : 30 secondes
- **Timeout** : 10 secondes  
- **Retries** : 3
- **Start Period** : 40 secondes

### 2. Configuration Automatique
Le `Dockerfile` inclut maintenant un health check automatique :
```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1
```

### 3. Docker Compose
Le `docker-compose.yml` inclut également le health check :
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## Résolution dans Coolify

### Étape 1 : Redéployer l'application
1. Poussez les modifications sur GitHub
2. Redéployez dans Coolify
3. Attendez que l'application démarre (40 secondes)

### Étape 2 : Vérifier le Health Check
1. Allez dans les paramètres de l'application
2. Section "Health Check"
3. Activez le health check avec l'URL `/health`

### Étape 3 : Monitoring
- Status devrait passer à "Healthy" 
- Logs montreront les health checks réussis
- Alertes automatiques si problème

## Tests Manuels

### Test Local
```bash
# Test endpoint simple
curl http://localhost:5000/health

# Test endpoint avec DB
curl http://localhost:5000/api/health

# Test avec authentification
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### Test Production
```bash
# Remplacez par votre domaine
curl https://assurminut.votre-domaine.com/health
curl https://assurminut.votre-domaine.com/api/health
```

## Avantages

### 1. Monitoring Automatique
- Coolify surveille l'état de l'application
- Redémarrage automatique si problème
- Alertes par email/Discord/Slack

### 2. Diagnostic Rapide
- Vérification connexion base de données
- Métriques d'uptime
- Logs détaillés des erreurs

### 3. Haute Disponibilité
- Détection rapide des problèmes
- Recovery automatique
- Zero downtime deployments

## Dépannage

### Si le health check échoue encore :

1. **Vérifiez les logs** :
```bash
docker logs coolify-assurminut-crm
```

2. **Vérifiez la connexion DB** :
```bash
docker exec -it coolify-assurminut-crm npm run db:push
```

3. **Testez manuellement** :
```bash
docker exec -it coolify-assurminut-crm curl http://localhost:5000/health
```

### Codes d'erreur courants :

- **503** : Base de données non connectée
- **500** : Erreur serveur interne
- **404** : Endpoint non trouvé (ancienne version)

## Prochaines Étapes

1. Redéployez avec les nouveaux endpoints
2. Configurez le health check dans Coolify
3. Surveillez les métriques
4. Configurez les alertes

---

**Résultat attendu** : Status "Healthy" ✅ dans Coolify avec monitoring automatique fonctionnel.