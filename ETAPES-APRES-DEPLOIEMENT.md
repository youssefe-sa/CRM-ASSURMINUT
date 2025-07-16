# Étapes après déploiement Coolify - ASSURMINUT CRM

## Déploiement terminé avec succès ✅

Le déploiement s'est terminé avec succès le 16 juillet 2025 à 10:22:54.

## Étapes suivantes à faire dans Coolify

### 1. Configurer le Health Check

Dans l'interface Coolify :

1. **Allez dans votre application** → CRM-ASSURMINUT
2. **Cliquez sur "Settings"** ou "Configuration"
3. **Trouvez la section "Health Check"**
4. **Activez le health check** avec ces paramètres :

```
✅ Enable Health Check: ON
📍 Health Check URL: /health
🔌 Health Check Port: 5000
🔄 Health Check Method: GET
⏱️ Interval: 30 seconds
⏰ Timeout: 10 seconds
🔁 Retries: 3
🚀 Start Period: 40 seconds
```

5. **Sauvegardez** la configuration

### 2. Configurer les variables d'environnement

Assurez-vous que ces variables sont définies :

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres.hiyuhkilffabnjwpkdby:Ucef@1984#@aws-0-eu-west-3.pooler.supabase.com:6543/postgres
SESSION_SECRET=your-secure-random-session-secret-here
```

### 3. Tester l'application

1. **Trouvez l'URL de votre application** dans Coolify
2. **Testez les endpoints** :
   - `https://votre-domaine.com/health` → Doit retourner JSON avec status "healthy"
   - `https://votre-domaine.com` → Doit afficher l'interface de connexion ASSURMINUT

### 4. Connexion à l'application

**Compte administrateur :**
- Username: `admin`
- Password: `admin123`

**Comptes agents (8 disponibles) :**
- Username: `marie.dupont`, `pierre.martin`, `sophie.bernard`, etc.
- Password: `admin123` (pour tous)

### 5. Vérifier les fonctionnalités

Une fois connecté, vérifiez :
- ✅ Dashboard avec statistiques
- ✅ Liste des clients (9 clients importés)
- ✅ Création de nouveaux clients
- ✅ Import de fichiers Excel/CSV
- ✅ Génération de devis PDF
- ✅ Gestion des documents
- ✅ Agenda et rappels
- ✅ Logs d'appels

### 6. Monitoring

Dans Coolify, surveillez :
- **Status** : Doit passer à "Healthy" ✅
- **Logs** : Vérifiez les logs d'application
- **Metrics** : CPU, RAM, uptime
- **Alerts** : Configurez les notifications

## Résolution des problèmes

### Si le status reste "Unhealthy"

1. **Vérifiez les logs** dans Coolify
2. **Testez manuellement** : `curl https://votre-domaine.com/health`
3. **Vérifiez la configuration** du health check
4. **Attendez 40 secondes** (start period)

### Si l'application ne s'ouvre pas

1. **Vérifiez l'URL** générée par Coolify
2. **Vérifiez le port** (5000 par défaut)
3. **Vérifiez les variables d'environnement**
4. **Consultez les logs** de l'application

### Si la base de données ne fonctionne pas

1. **Vérifiez DATABASE_URL** dans les variables d'environnement
2. **Testez la connexion** : `https://votre-domaine.com/api/health`
3. **Vérifiez les permissions** Supabase
4. **Exécutez le script SQL** de mise à jour si nécessaire

## Prochaines étapes

1. **Configurez un domaine personnalisé** (optionnel)
2. **Activez les sauvegardes** automatiques
3. **Configurez les alertes** par email/Discord
4. **Testez toutes les fonctionnalités** du CRM
5. **Formez les utilisateurs** sur le système

---

**Félicitations ! Votre CRM ASSURMINUT est maintenant en production !** 🎉

URL de l'application : https://[votre-domaine-coolify].com
Login : admin / admin123