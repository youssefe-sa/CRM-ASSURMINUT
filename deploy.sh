#!/bin/bash

echo "🚀 Déploiement CRM ASSURMINUT"
echo "=================================="

# Vérifier si nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé"
    exit 1
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm ci

# Build l'application
echo "🔨 Build de l'application..."
npm run build

# Créer les dossiers nécessaires
echo "📁 Création des dossiers..."
mkdir -p uploads dist

# Vérifier que le build a réussi
if [ ! -d "dist" ]; then
    echo "❌ Erreur: le build a échoué"
    exit 1
fi

echo "✅ Build réussi!"
echo "🎯 Prêt pour le déploiement"
echo "=================================="

# Démarrer l'application en mode production
echo "🚀 Démarrage de l'application..."
NODE_ENV=production PORT=5000 npm start