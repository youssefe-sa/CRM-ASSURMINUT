# Configuration Coolify pour ASSURMINUT CRM

## Modifications à effectuer dans l'interface Coolify

### 1. Build Pack
**Changement requis :**
- Actuellement : `Nixpacks`
- **Changer vers : `Dockerfile`**

### 2. Configuration Build

Dans la section **Build** :

**Install Command :** (laisser vide)
```
(vide)
```

**Build Command :** (laisser vide)
```
(vide)
```

**Start Command :**
```
npm start
```

### 3. Configuration Docker

**Dockerfile Location :**
```
./Dockerfile
```

**Base Directory :**
```
/
```

**Publish Directory :**
```
/
```

### 4. Configuration Network

**Ports Exposes :**
```
5000
```

**Ports Mappings :**
```
5000:5000
```

### 5. Variables d'environnement

Assurez-vous d'avoir ces variables définies :

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres.hiyuhkilffabnjwpkdby:Ucef@1984#@aws-0-eu-west-3.pooler.supabase.com:6543/postgres
SESSION_SECRET=your-secure-session-secret-change-this-in-production
```

### 6. Configuration Health Check

**Health Check URL :**
```
/health
```

**Health Check Port :**
```
5000
```

**Interval :** `30` secondes
**Timeout :** `10` secondes
**Retries :** `3`
**Start Period :** `40` secondes

## Étapes d'application

1. **Changez Build Pack** de "Nixpacks" vers "Dockerfile"
2. **Configurez les ports** (5000:5000)
3. **Ajoutez les variables d'environnement**
4. **Configurez le health check**
5. **Sauvegardez** les modifications
6. **Redéployez** l'application

## Résultat attendu

Après ces modifications :
- ✅ L'application utilisera le Dockerfile
- ✅ Le serveur Express démarrera sur le port 5000
- ✅ L'API backend sera accessible
- ✅ Les health checks fonctionneront
- ✅ Status passera à "Healthy"

## URL de test

https://b4ckc8k0c4c8g48cksckggks.31.97.197.34.sslip.io/

Devrait afficher la page de connexion ASSURMINUT avec :
- Formulaire de connexion
- Logo ASSURMINUT
- Possibilité de se connecter avec admin/admin123