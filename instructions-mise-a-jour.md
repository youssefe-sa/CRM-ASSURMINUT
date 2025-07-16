# Instructions de Mise à Jour Supabase - ASSURMINUT CRM

## Étape 1: Accéder à Supabase

1. Connectez-vous à votre [Dashboard Supabase](https://supabase.com/dashboard)
2. Sélectionnez votre projet ASSURMINUT
3. Cliquez sur "SQL Editor" dans le menu de gauche

## Étape 2: Exécuter le Script

1. Copiez tout le contenu du fichier `update-supabase.sql`
2. Collez-le dans l'éditeur SQL de Supabase
3. Cliquez sur "Run" pour exécuter le script

⚠️ **ATTENTION**: Ce script va supprimer et recréer toutes les tables existantes.

## Étape 3: Vérifier les Résultats

Après l'exécution, vous devriez voir :

```
table_name | count
-----------|------
users      | 9
clients    | 9
devis      | 1
documents  | 1
rappels    | 0
appels     | 1
```

## Étape 4: Vérifier les Tables

1. Allez dans "Table Editor"
2. Vérifiez que toutes les tables sont créées :
   - ✅ users (9 enregistrements)
   - ✅ clients (9 enregistrements)
   - ✅ devis (1 enregistrement)
   - ✅ documents (1 enregistrement)
   - ✅ rappels (0 enregistrements)
   - ✅ appels (1 enregistrement)

## Comptes Créés

### Administrateur
- **Username**: admin
- **Password**: admin123
- **Email**: admin@crm.com

### Agents (8 comptes)
Tous utilisent le mot de passe: **admin123**

1. marie.dupont@assurminut.fr
2. pierre.martin@assurminut.fr
3. sophie.bernard@assurminut.fr
4. julien.moreau@assurminut.fr
5. claire.lefebvre@assurminut.fr
6. thomas.simon@assurminut.fr
7. camille.michel@assurminut.fr
8. lucas.garcia@assurminut.fr

## Clients Créés

9 clients avec différents statuts :
- **Prospects**: 5 clients
- **Clients actifs**: 3 clients
- **Nouveaux**: 1 client

## Dépannage

### Si vous ne voyez pas les données :
1. Actualisez la page (F5)
2. Vérifiez que vous êtes dans le bon projet
3. Vérifiez le schéma "public"
4. Utilisez l'éditeur SQL pour vérifier

### Si l'exécution échoue :
1. Exécutez le script par sections
2. Vérifiez les permissions
3. Contactez le support Supabase

## Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans l'éditeur SQL
2. Assurez-vous d'avoir les permissions d'écriture
3. Contactez le support technique si nécessaire

## Prochaines Étapes

Après la mise à jour :
1. Testez la connexion avec admin/admin123
2. Vérifiez l'import de clients
3. Testez toutes les fonctionnalités du CRM