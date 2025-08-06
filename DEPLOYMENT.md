# Guide de Déploiement - OBS CAISSE Frontend

## 📋 Prérequis

- Node.js 18+
- Compte Supabase configuré
- Serveur web (Nginx, Apache) ou plateforme cloud (Vercel, Netlify)

## 🔧 Configuration Supabase

### 1. Créer le projet Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter l'URL et la clé anonyme du projet

### 2. Configurer la base de données

Exécuter les scripts SQL dans l'ordre suivant dans l'éditeur SQL de Supabase :

1. **Tables principales** (voir `DATABASE_SCHEMA_COMPLETE.md`)
2. **Fonctions et triggers**
3. **Politiques RLS (Row Level Security)**
4. **Données de test** (optionnel)

### 3. Configurer l'authentification

Dans Supabase Dashboard > Authentication > Settings :

```json
{
  "site_url": "https://your-domain.com",
  "redirect_urls": [
    "https://your-domain.com/auth/callback",
    "http://localhost:3000/auth/callback"
  ],
  "jwt_expiry": 3600,
  "refresh_token_rotation": true
}
```

## 🚀 Déploiement Local

### 1. Installation

```bash
git clone <repository-url>
cd obs-caisse-frontend
npm install
```

### 2. Configuration

Copier `.env.example` vers `.env` et configurer :

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Démarrage

```bash
npm start
```

Application accessible sur `http://localhost:3000`

## 🌐 Déploiement Production

### Option 1: Vercel (Recommandé)

1. **Connecter le repository**
```bash
npm install -g vercel
vercel login
vercel
```

2. **Configurer les variables d'environnement**
```bash
vercel env add REACT_APP_SUPABASE_URL
vercel env add REACT_APP_SUPABASE_ANON_KEY
```

3. **Déployer**
```bash
vercel --prod
```

### Option 2: Netlify

1. **Build local**
```bash
npm run build
```

2. **Déployer via CLI**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=build
```

3. **Variables d'environnement**
Dans Netlify Dashboard > Site Settings > Environment Variables

### Option 3: Serveur traditionnel

1. **Build de production**
```bash
npm run build
```

2. **Configuration Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/obs-caisse-frontend/build;
    index index.html;

    # Gestion des routes React
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache des assets statiques
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Sécurité
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
}
```

3. **HTTPS avec Let's Encrypt**
```bash
sudo certbot --nginx -d your-domain.com
```

## 🔒 Configuration de Sécurité

### 1. Variables d'environnement

**Production uniquement :**
```env
REACT_APP_SUPABASE_URL=https://prod-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=prod-anon-key
REACT_APP_ENV=production
REACT_APP_DEBUG=false
```

### 2. Politiques RLS Supabase

Vérifier que toutes les tables ont RLS activé :
```sql
ALTER TABLE boutiques ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;
-- etc.
```

### 3. CORS et domaines autorisés

Dans Supabase > Settings > API :
- Ajouter votre domaine de production
- Configurer les CORS si nécessaire

## 📊 Monitoring et Logs

### 1. Supabase Dashboard
- Surveiller les requêtes API
- Vérifier les logs d'authentification
- Monitorer l'utilisation de la base

### 2. Application Logs
```javascript
// En production, utiliser un service de logging
if (process.env.REACT_APP_ENV === 'production') {
  // Sentry, LogRocket, etc.
}
```

### 3. Performance
- Utiliser React DevTools Profiler
- Monitorer les Core Web Vitals
- Optimiser les images et assets

## 🔄 Mises à jour

### 1. Déploiement continu

**GitHub Actions exemple :**
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### 2. Rollback
```bash
# Vercel
vercel rollback

# Netlify
netlify rollback
```

## 🧪 Tests avant déploiement

### 1. Tests automatisés
```bash
npm test
npm run test:coverage
```

### 2. Tests manuels
- [ ] Connexion/déconnexion
- [ ] Interface POS complète
- [ ] Gestion IMEI
- [ ] Impression (si configurée)
- [ ] Dual-screen (si configuré)
- [ ] Responsive design

### 3. Tests de performance
```bash
npm run build
npx serve -s build
# Tester avec Lighthouse
```

## 🚨 Dépannage

### Erreurs courantes

1. **Build failed**
```bash
# Nettoyer le cache
rm -rf node_modules package-lock.json
npm install
```

2. **Erreur Supabase connection**
- Vérifier les variables d'environnement
- Contrôler les politiques RLS
- Vérifier les CORS

3. **Routes 404**
- Configurer le serveur pour les SPA
- Vérifier la configuration Nginx/Apache

### Logs de débogage
```bash
# Activer les logs détaillés
REACT_APP_DEBUG=true npm start
```

## 📱 Configuration Mobile/Tablette

### 1. PWA (Progressive Web App)
```json
// public/manifest.json
{
  "name": "OBS CAISSE",
  "short_name": "OBS CAISSE",
  "display": "standalone",
  "orientation": "landscape"
}
```

### 2. Optimisations tactiles
- Tailles de boutons adaptées (44px minimum)
- Gestes tactiles pour le POS
- Mode plein écran pour tablettes

## 🔧 Maintenance

### 1. Sauvegardes
- Sauvegardes automatiques Supabase
- Export régulier des données critiques
- Versioning du code

### 2. Monitoring
- Uptime monitoring
- Performance monitoring
- Error tracking

### 3. Mises à jour de sécurité
```bash
npm audit
npm audit fix
```

## 📞 Support

En cas de problème :
- **Email** : support@sonutec.com
- **Documentation** : Voir fichiers `*_SPECIFICATIONS.md`
- **Logs** : Consulter Supabase Dashboard

---

**Développé par SONUTEC SARL - Tous droits réservés**
