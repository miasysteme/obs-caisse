
# 🏪 OBS SYSTEME - Application Complète

## 🚀 Démarrage Rapide

### Lancer l'application en mode développement
```bash
npm run start:complete
```

### Construire pour la production
```bash
npm run build:complete
```

### Servir la version de production
```bash
npm run serve:complete
```

## 🔐 Comptes de Test

### Administrateur Système
- **Email:** admin@sonutec.com
- **Mot de passe:** admin123
- **Rôle:** Super Administrateur
- **Accès:** Toutes les fonctionnalités

### Manager Restaurant
- **Email:** manager@restaurant.com
- **Mot de passe:** manager123
- **Rôle:** Manager
- **Accès:** Module Restaurant complet

### Caissier Hôtel
- **Email:** caissier@hotel.com
- **Mot de passe:** caissier123
- **Rôle:** Caissier
- **Accès:** Module Hôtellerie (lecture/vente)

## 🎯 Fonctionnalités Disponibles

### ✅ Système d'Authentification
- Connexion sécurisée avec JWT
- Gestion des sessions
- Rôles et permissions

### ✅ Interface d'Administration
- Gestion des utilisateurs
- Gestion des établissements
- Configuration des rôles
- Statistiques système

### ✅ Module Restaurant
- **Gestion des Commandes**
  - Nouvelles commandes (sur place, à emporter, livraison)
  - Suivi en temps réel
  - Historique des ventes
  
- **Interface Cuisine**
  - Commandes en attente
  - Commandes en préparation
  - Gestion des temps de préparation
  
- **Gestion des Livraisons**
  - Suivi des livraisons
  - Adresses de livraison
  - Statuts de livraison

### ✅ Module Hôtellerie
- **Gestion des Chambres**
  - Disponibilité en temps réel
  - Types de chambres
  - Tarification flexible
  
- **Réservations**
  - Nouvelles réservations
  - Check-in/Check-out
  - Gestion des clients
  
- **Services Additionnels**
  - Blanchisserie
  - Room service
  - Autres prestations

### ✅ Module Bar
- **Gestion du Stock**
  - Inventaire des boissons
  - Alertes de stock
  - Fournisseurs
  
- **Ventes**
  - Point de vente rapide
  - Historique des ventes
  - Statistiques journalières
  
- **Gestion des Événements**
  - Planification d'événements
  - Tarifs spéciaux
  - Prévisions de consommation

## 🏗️ Architecture Technique

### Frontend
- **React 18** avec TypeScript
- **Material-UI v5** pour l'interface
- **Hooks personnalisés** pour la logique métier

### Backend
- **Supabase** (PostgreSQL + API REST)
- **Row Level Security** pour l'isolation des données
- **JWT** pour l'authentification

### Base de Données
- **Architecture Multi-Tenant**
- **30+ tables** spécialisées par secteur
- **Triggers** pour l'automatisation

## 📱 Accès aux Interfaces

### Interface Principale
- **URL:** http://localhost:3000
- **Page de test:** http://localhost:3000/complete.html

### Secteurs Disponibles
1. **🍽️ Restaurant** - Complet et fonctionnel
2. **🏨 Hôtellerie** - Complet et fonctionnel  
3. **🍺 Bar** - Complet et fonctionnel
4. **📱 Téléphonie** - En développement
5. **🛍️ Retail** - En développement
6. **🏥 Santé** - En développement
7. **🎓 Éducation** - En développement
8. **🔧 Services** - En développement

## 🔧 Configuration

### Variables d'Environnement
Créer un fichier `.env.local` avec:
```
REACT_APP_SUPABASE_URL=https://vhahwekekuuntqlkvtoc.supabase.co
REACT_APP_SUPABASE_ANON_KEY=votre_clé_supabase
```

### Base de Données
La base de données est automatiquement configurée avec des données de démonstration.

## 🎨 Personnalisation

### Thèmes
Les couleurs et thèmes peuvent être modifiés dans `src/App.complete.tsx`

### Modules
Chaque secteur a son propre composant dans `src/components/sectors/`

## 📞 Support

**Développé par SONUTEC SARL**
- Email: support@sonutec.com
- Téléphone: +225 XX XX XX XX

---

*OBS SYSTEME v2.0 - Plateforme SaaS Multi-Tenant pour l'Afrique*
