# OBS SYSTEME - Guide de Déploiement

## GUIDE COMPLET DE DÉPLOIEMENT ET MAINTENANCE

### 1. ARCHITECTURE DE DÉPLOIEMENT

#### 1.1 Vue d'ensemble
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Supabase      │
│   (Vercel)      │◄──►│   (Railway)     │◄──►│   (Cloud)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN Assets    │    │   File Storage  │    │   Monitoring    │
│   (Vercel)      │    │   (Supabase)    │    │   (Sentry)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### 1.2 Environnements
- **Production**: Application live pour les clients
- **Staging**: Tests avant mise en production
- **Development**: Développement local

### 2. CONFIGURATION SUPABASE

#### 2.1 Création du projet Supabase
```bash
# Installation de la CLI Supabase
npm install -g supabase

# Connexion à Supabase
supabase login

# Initialisation du projet
supabase init

# Démarrage local pour développement
supabase start
```

#### 2.2 Configuration de la base de données
```sql
-- Exécuter dans l'éditeur SQL de Supabase
-- 1. Créer les tables (voir DATABASE_SCHEMA_COMPLETE.md)
-- 2. Configurer RLS (Row Level Security)
-- 3. Créer les fonctions et triggers
-- 4. Insérer les données de base

-- Exemple de configuration RLS
ALTER TABLE boutiques ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Boutiques access policy" ON boutiques
    FOR ALL TO authenticated
    USING (
        id = (SELECT boutique_id FROM users WHERE id = auth.uid())
        OR 
        company_id = (SELECT company_id FROM users WHERE id = auth.uid())
        OR
        (SELECT role FROM users WHERE id = auth.uid()) = 'admin_master'
    );
```

#### 2.3 Configuration de l'authentification
```javascript
// Dans le dashboard Supabase > Authentication > Settings
{
  "site_url": "https://obs-systeme.vercel.app",
  "redirect_urls": [
    "https://obs-systeme.vercel.app/auth/callback",
    "http://localhost:3000/auth/callback"
  ],
  "jwt_expiry": 3600,
  "refresh_token_rotation": true,
  "security": {
    "captcha_enabled": true,
    "email_confirm_required": true
  }
}
```

#### 2.4 Variables d'environnement Supabase
```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

# Database
DATABASE_URL=postgresql://postgres:[password]@db.your-project-id.supabase.co:5432/postgres
```

### 3. DÉPLOIEMENT FRONTEND (VERCEL)

#### 3.1 Configuration Vercel
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/customer-display",
      "dest": "/customer-display.html"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_SUPABASE_URL": "@supabase-url",
    "REACT_APP_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "REACT_APP_API_URL": "@api-url"
  }
}
```

#### 3.2 Scripts de déploiement
```json
// package.json
{
  "scripts": {
    "build": "react-scripts build",
    "build:staging": "REACT_APP_ENV=staging npm run build",
    "build:production": "REACT_APP_ENV=production npm run build",
    "deploy:staging": "vercel --target staging",
    "deploy:production": "vercel --prod"
  }
}
```

#### 3.3 Variables d'environnement Vercel
```bash
# Configuration via CLI Vercel
vercel env add REACT_APP_SUPABASE_URL production
vercel env add REACT_APP_SUPABASE_ANON_KEY production
vercel env add REACT_APP_API_URL production

# Ou via le dashboard Vercel
# Settings > Environment Variables
```

### 4. DÉPLOIEMENT BACKEND (RAILWAY)

#### 4.1 Configuration Railway
```toml
# railway.toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm start"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[environments.production]
variables = { NODE_ENV = "production" }

[environments.staging]
variables = { NODE_ENV = "staging" }
```

#### 4.2 Dockerfile (optionnel)
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 3001

# Commande de démarrage
CMD ["npm", "start"]
```

#### 4.3 Variables d'environnement Backend
```env
# Production Environment Variables
NODE_ENV=production
PORT=3001

# Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

# CORS
CORS_ORIGIN=https://obs-systeme.vercel.app

# Monitoring
SENTRY_DSN=your-sentry-dsn

# Email (pour notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 5. CONFIGURATION DOMAINE ET SSL

#### 5.1 Configuration DNS
```
# Enregistrements DNS
Type    Name                Value                           TTL
A       obs-systeme         76.76.19.123 (IP Vercel)       300
CNAME   api                railway-production-url          300
CNAME   www                obs-systeme.com                  300
```

#### 5.2 Certificats SSL
```bash
# Vercel gère automatiquement SSL avec Let's Encrypt
# Railway aussi pour les domaines personnalisés

# Vérification SSL
curl -I https://obs-systeme.com
curl -I https://api.obs-systeme.com/health
```

### 6. MONITORING ET LOGGING

#### 6.1 Configuration Sentry
```javascript
// src/utils/sentry.js
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [
    new BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
  environment: process.env.REACT_APP_ENV || 'development',
  beforeSend(event) {
    // Filtrer les erreurs sensibles
    if (event.exception) {
      const error = event.exception.values[0];
      if (error.value && error.value.includes('password')) {
        return null;
      }
    }
    return event;
  }
});
```

#### 6.2 Logging Backend
```javascript
// src/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'obs-systeme-api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

#### 6.3 Health Checks
```javascript
// src/routes/health.js
const express = require('express');
const { supabase } = require('../config/supabase');
const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    // Vérifier la connexion à la base de données
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) throw error;

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        api: 'running'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

module.exports = router;
```

### 7. SAUVEGARDE ET RÉCUPÉRATION

#### 7.1 Sauvegarde automatique Supabase
```sql
-- Configuration des sauvegardes automatiques
-- Dans le dashboard Supabase > Settings > Database
-- Activer les sauvegardes automatiques quotidiennes

-- Script de sauvegarde manuelle
pg_dump "postgresql://postgres:[password]@db.your-project-id.supabase.co:5432/postgres" > backup_$(date +%Y%m%d_%H%M%S).sql
```

#### 7.2 Script de sauvegarde des données critiques
```javascript
// scripts/backup.js
const { supabase } = require('../src/config/supabase');
const fs = require('fs');

async function backupCriticalData() {
  try {
    // Sauvegarder les données IMEI
    const { data: imeiData } = await supabase
      .from('imei_tracking')
      .select('*');

    // Sauvegarder les ventes
    const { data: salesData } = await supabase
      .from('sales')
      .select('*, sale_items(*)')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    const backup = {
      timestamp: new Date().toISOString(),
      imei_tracking: imeiData,
      recent_sales: salesData
    };

    fs.writeFileSync(
      `backups/critical_data_${Date.now()}.json`,
      JSON.stringify(backup, null, 2)
    );

    console.log('Sauvegarde critique terminée');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  backupCriticalData();
}

module.exports = { backupCriticalData };
```

### 8. SÉCURITÉ EN PRODUCTION

#### 8.1 Configuration de sécurité
```javascript
// src/middleware/security.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// Configuration CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par windowMs
  message: 'Trop de requêtes depuis cette IP'
});

// Rate limiting pour l'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 tentatives de connexion par 15 minutes
  skipSuccessfulRequests: true
});

module.exports = {
  helmet: helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", process.env.SUPABASE_URL]
      }
    }
  }),
  cors: cors(corsOptions),
  limiter,
  authLimiter
};
```

#### 8.2 Validation des données
```javascript
// src/middleware/validation.js
const Joi = require('joi');

const schemas = {
  sale: Joi.object({
    customer_name: Joi.string().max(255),
    customer_phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
    items: Joi.array().items(
      Joi.object({
        product_id: Joi.string().uuid().required(),
        quantity: Joi.number().integer().min(1).required(),
        unit_price: Joi.number().min(0).required(),
        imei: Joi.string().pattern(/^\d{15}$/).when('requires_imei', {
          is: true,
          then: Joi.required()
        })
      })
    ).min(1).required(),
    payment_method: Joi.string().valid('cash', 'card', 'mobile_money', 'credit').required()
  }),

  imei: Joi.object({
    imei: Joi.string().pattern(/^\d{15}$/).required(),
    product_id: Joi.string().uuid().required()
  })
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schemas[schema].validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Données invalides',
        details: error.details.map(d => d.message)
      });
    }
    next();
  };
};

module.exports = { validate };
```

### 9. PERFORMANCE ET OPTIMISATION

#### 9.1 Configuration de cache
```javascript
// src/middleware/cache.js
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

const cache = (duration = 300) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;
    
    try {
      const cached = await client.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    } catch (error) {
      console.error('Erreur cache:', error);
    }

    // Intercepter la réponse pour la mettre en cache
    const originalSend = res.json;
    res.json = function(data) {
      try {
        client.setex(key, duration, JSON.stringify(data));
      } catch (error) {
        console.error('Erreur mise en cache:', error);
      }
      originalSend.call(this, data);
    };

    next();
  };
};

module.exports = { cache };
```

#### 9.2 Optimisation des requêtes
```javascript
// src/services/optimizedQueries.js
const { supabase } = require('../config/supabase');

class OptimizedQueries {
  // Requête optimisée pour le dashboard
  static async getDashboardData(boutiqueId) {
    const today = new Date().toISOString().split('T')[0];
    
    const [salesData, stockData, imeiData] = await Promise.all([
      // Ventes du jour
      supabase
        .from('sales')
        .select('total_amount, created_at')
        .eq('boutique_id', boutiqueId)
        .gte('created_at', today)
        .eq('status', 'completed'),
      
      // Stock critique
      supabase
        .from('stock')
        .select('quantity, min_threshold, product:products(name)')
        .eq('boutique_id', boutiqueId)
        .lte('quantity', 'min_threshold'),
      
      // IMEI récents
      supabase
        .from('imei_tracking')
        .select('imei, product:products(name), sale_date')
        .eq('current_boutique_id', boutiqueId)
        .eq('current_status', 'sold')
        .order('sale_date', { ascending: false })
        .limit(10)
    ]);

    return {
      sales: salesData.data || [],
      criticalStock: stockData.data || [],
      recentIMEI: imeiData.data || []
    };
  }

  // Requête optimisée pour les rapports
  static async getSalesReport(boutiqueId, startDate, endDate) {
    const { data, error } = await supabase
      .rpc('get_sales_report', {
        p_boutique_id: boutiqueId,
        p_start_date: startDate,
        p_end_date: endDate
      });

    if (error) throw error;
    return data;
  }
}

module.exports = OptimizedQueries;
```

### 10. MAINTENANCE ET MISES À JOUR

#### 10.1 Script de maintenance
```javascript
// scripts/maintenance.js
const { supabase } = require('../src/config/supabase');

async function runMaintenance() {
  console.log('Début de la maintenance...');

  try {
    // Nettoyer les sessions expirées
    await supabase
      .from('user_sessions')
      .delete()
      .lt('expires_at', new Date().toISOString());

    // Nettoyer les logs anciens (> 90 jours)
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    await supabase
      .from('audit_logs')
      .delete()
      .lt('created_at', ninetyDaysAgo.toISOString());

    // Mettre à jour les statistiques
    await supabase.rpc('refresh_materialized_views');

    console.log('Maintenance terminée avec succès');
  } catch (error) {
    console.error('Erreur lors de la maintenance:', error);
    process.exit(1);
  }
}

// Planifier la maintenance quotidienne
if (require.main === module) {
  runMaintenance();
}

module.exports = { runMaintenance };
```

#### 10.2 Déploiement avec zéro downtime
```bash
#!/bin/bash
# scripts/deploy.sh

set -e

echo "🚀 Déploiement OBS SYSTEME"

# Vérifier les tests
echo "📋 Exécution des tests..."
npm test

# Build de production
echo "🔨 Build de production..."
npm run build:production

# Déploiement frontend
echo "🌐 Déploiement frontend..."
vercel --prod --confirm

# Déploiement backend avec health check
echo "🔧 Déploiement backend..."
railway up --detach

# Attendre que le service soit prêt
echo "⏳ Vérification du service..."
sleep 30

# Health check
HEALTH_URL="https://api.obs-systeme.com/health"
if curl -f $HEALTH_URL; then
  echo "✅ Déploiement réussi!"
else
  echo "❌ Échec du health check"
  exit 1
fi

echo "🎉 Déploiement terminé avec succès!"
```

### 11. MONITORING EN PRODUCTION

#### 11.1 Alertes automatiques
```javascript
// src/utils/alerts.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

class AlertSystem {
  static async sendAlert(type, message, details = {}) {
    const alerts = {
      'system_error': {
        subject: '🚨 Erreur Système OBS SYSTEME',
        priority: 'high'
      },
      'subscription_expired': {
        subject: '⚠️ Abonnement Expiré',
        priority: 'medium'
      },
      'stock_critical': {
        subject: '📦 Stock Critique',
        priority: 'low'
      }
    };

    const alert = alerts[type];
    if (!alert) return;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: 'admin@sonutec.com',
      subject: alert.subject,
      html: `
        <h2>${alert.subject}</h2>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <pre>${JSON.stringify(details, null, 2)}</pre>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Alerte envoyée: ${type}`);
    } catch (error) {
      console.error('Erreur envoi alerte:', error);
    }
  }
}

module.exports = AlertSystem;
```

#### 11.2 Métriques personnalisées
```javascript
// src/utils/metrics.js
const prometheus = require('prom-client');

// Créer un registre pour les métriques
const register = new prometheus.Register();

// Métriques personnalisées
const salesCounter = new prometheus.Counter({
  name: 'obs_systeme_sales_total',
  help: 'Nombre total de ventes',
  labelNames: ['boutique_id', 'payment_method']
});

const imeiValidationHistogram = new prometheus.Histogram({
  name: 'obs_systeme_imei_validation_duration_seconds',
  help: 'Durée de validation IMEI',
  buckets: [0.1, 0.5, 1, 2, 5]
});

const stockGauge = new prometheus.Gauge({
  name: 'obs_systeme_stock_level',
  help: 'Niveau de stock par produit',
  labelNames: ['boutique_id', 'product_id']
});

register.registerMetric(salesCounter);
register.registerMetric(imeiValidationHistogram);
register.registerMetric(stockGauge);

module.exports = {
  register,
  salesCounter,
  imeiValidationHistogram,
  stockGauge
};
```

### 12. CHECKLIST DE DÉPLOIEMENT

#### 12.1 Pré-déploiement
- [ ] Tests unitaires passent
- [ ] Tests d'intégration passent
- [ ] Variables d'environnement configurées
- [ ] Certificats SSL valides
- [ ] Sauvegardes récentes disponibles
