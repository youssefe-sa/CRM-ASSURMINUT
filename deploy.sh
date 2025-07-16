#!/bin/bash

# Script de déploiement pour ASSURMINUT CRM
# Usage: ./deploy.sh

set -e

echo "🚀 Démarrage du déploiement ASSURMINUT CRM..."

# Vérifier les variables d'environnement
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Erreur: DATABASE_URL n'est pas définie"
    exit 1
fi

echo "📦 Installation des dépendances..."
npm ci --only=production

echo "🏗️ Construction de l'application..."
npm run build

echo "🗄️ Synchronisation de la base de données..."
npm run db:push

echo "📁 Création des dossiers nécessaires..."
mkdir -p uploads
mkdir -p dist

echo "🔧 Configuration des permissions..."
chmod 755 uploads
chmod 755 dist

echo "✅ Déploiement terminé avec succès!"
echo "🌐 Application prête à démarrer sur le port ${PORT:-5000}"

# Vérifier que le build a fonctionné
if [ -f "dist/index.js" ]; then
    echo "✅ Build serveur OK"
else
    echo "❌ Erreur: Build serveur échoué"
    exit 1
fi

if [ -d "dist/client" ]; then
    echo "✅ Build client OK"
else
    echo "❌ Erreur: Build client échoué"
    exit 1
fi

echo "🎉 Prêt à démarrer avec: npm start"