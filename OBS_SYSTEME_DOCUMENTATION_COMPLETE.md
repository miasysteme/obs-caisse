# OBS SYSTEME - Documentation Technique Complète
## Système de Point de Vente pour Réseau de Boutiques de Téléphones

**Développé par:** SONUTEC SARL  
**Produit:** OBS SYSTEME
**Client:** La Maison des Téléphones  
**Base de données:** Supabase  
**Date:** 2024  

---

## TABLE DES MATIÈRES

1. [Vue d'ensemble du projet](#1-vue-densemble-du-projet)
2. [Architecture système](#2-architecture-système)
3. [Spécifications fonctionnelles](#3-spécifications-fonctionnelles)
4. [Modèle de données](#4-modèle-de-données)
5. [Interfaces utilisateur](#5-interfaces-utilisateur)
6. [Gestion des abonnements](#6-gestion-des-abonnements)
7. [Système d'authentification](#7-système-dauthentification)
8. [Impression thermique](#8-impression-thermique)
9. [Support dual-screen](#9-support-dual-screen)
10. [Sécurité et permissions](#10-sécurité-et-permissions)
11. [API et intégrations](#11-api-et-intégrations)
12. [Déploiement et maintenance](#12-déploiement-et-maintenance)

---

## 1. VUE D'ENSEMBLE DU PROJET

### 1.1 Contexte
OBS SYSTEME est un système de point de vente web conçu pour gérer un réseau de boutiques de téléphones affiliées à "La Maison des Téléphones". Le système permet une gestion centralisée avec traçabilité complète des téléphones via leurs numéros IMEI.

### 1.2 Objectifs principaux
- Gestion des ventes avec traçabilité IMEI obligatoire pour les téléphones
- Gestion centralisée du réseau de boutiques
- Système d'abonnement mensuel (20 000F par boutique)
- Impression sur imprimantes thermiques (57mm-80mm)
- Support des écrans doubles (caissier/client)
- Gestion flexible des prix de vente

### 1.3 Acteurs du système
- **SONUTEC SARL**: Développeur et propriétaire du logiciel
- **Administrateur maître**: Premier utilisateur créé, gestion technique
- **La Maison des Téléphones**: Entreprise centrale cliente
- **Boutiques affiliées**: Réseau de points de vente
- **Caissiers**: Utilisateurs finaux des boutiques

---

## 2. ARCHITECTURE SYSTÈME

### 2.1 Architecture générale
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend Web  │    │   Backend API   │    │   Supabase DB   │
│   (React/Vue)   │◄──►│   (Node.js)     │◄──►│   PostgreSQL    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Thermal Printer │    │ Payment System  │    │ File Storage    │
│   Integration   │    │   Integration   │    │   (Images)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 2.2 Technologies recommandées
- **Frontend**: React.js avec TypeScript
- **Backend**: Node.js avec Express
- **Base de données**: Supabase (PostgreSQL)
- **Authentification**: Supabase Auth
- **Impression**: Bibliothèque ESC/POS
- **Paiement**: Intégration API locale
- **Déploiement**: Vercel/Netlify + Railway/Heroku

---

## 3. SPÉCIFICATIONS FONCTIONNELLES

### 3.1 Module de Vente

#### 3.1.1 Processus de vente standard
1. **Sélection des produits**
   - Recherche par nom (utilisé comme code-barre)
   - Ajout au panier avec quantité
   - Modification des prix de vente (flexibilité commerciale)

2. **Validation IMEI pour téléphones**
   - Champ IMEI obligatoire pour les téléphones
   - Vérification unicité IMEI dans le réseau
   - Enregistrement pour traçabilité

3. **Finalisation**
   - Calcul total avec taxes
   - Sélection mode de paiement
   - Génération facture/reçu
   - Impression automatique

#### 3.1.2 Gestion des prix flexibles
- Prix d'achat (coût)
- Prix de vente recommandé
- Prix de vente réel (saisi par le caissier)
- Historique des modifications de prix

### 3.2 Module de Stock

#### 3.2.1 Gestion d'inventaire
- **Suivi en temps réel**
  - Stock disponible par boutique
  - Alertes stock faible
  - Mouvements d'entrée/sortie

- **Inventaire physique**
  - Comptage périodique
  - Ajustements d'écarts
  - Rapports de différences

#### 3.2.2 Transferts inter-boutiques
- Demandes de transfert
- Validation par boutique centrale
- Suivi des expéditions
- Réception et confirmation

### 3.3 Module de Retours

#### 3.3.1 Processus de retour
1. Vérification IMEI dans le système
2. Identification boutique d'origine
3. Validation conditions de retour
4. Traitement remboursement/échange
5. Mise à jour stock

#### 3.3.2 Traçabilité
- Historique complet par IMEI
- Boutique de vente originale
- Date et conditions de vente
- Historique des retours

---

## 4. MODÈLE DE DONNÉES

### 4.1 Tables principales

#### 4.1.1 Utilisateurs et authentification
```sql
-- Table des utilisateurs
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'admin_master', 'admin_central', 'manager', 'cashier'
    boutique_id UUID REFERENCES boutiques(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des boutiques
CREATE TABLE boutiques (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    commercial_name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    is_central BOOLEAN DEFAULT false,
    subscription_status VARCHAR(50) DEFAULT 'active', -- 'active', 'suspended', 'expired'
    subscription_start_date DATE,
    subscription_end_date DATE,
    monthly_fee DECIMAL(10,2) DEFAULT 20000,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 4.1.2 Produits et stock
```sql
-- Table des produits
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    brand VARCHAR(100),
    model VARCHAR(100),
    is_phone BOOLEAN DEFAULT false,
    purchase_price DECIMAL(10,2),
    recommended_price DECIMAL(10,2),
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table du stock par boutique
CREATE TABLE stock (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    boutique_id UUID REFERENCES boutiques(id),
    quantity INTEGER DEFAULT 0,
    min_threshold INTEGER DEFAULT 5,
    last_updated TIMESTAMP DEFAULT NOW(),
    UNIQUE(product_id, boutique_id)
);

-- Table des mouvements de stock
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    boutique_id UUID REFERENCES boutiques(id),
    movement_type VARCHAR(50), -- 'in', 'out', 'transfer_out', 'transfer_in', 'adjustment'
    quantity INTEGER,
    reference_id UUID, -- ID de la vente, transfert, etc.
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### 4.1.3 Ventes et IMEI
```sql
-- Table des ventes
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boutique_id UUID REFERENCES boutiques(id),
    cashier_id UUID REFERENCES users(id),
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    subtotal DECIMAL(10,2),
    tax_amount DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    payment_method VARCHAR(50),
    status VARCHAR(50) DEFAULT 'completed',
    receipt_number VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table des articles vendus
CREATE TABLE sale_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID REFERENCES sales(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER,
    unit_price DECIMAL(10,2), -- Prix de vente réel appliqué
    total_price DECIMAL(10,2),
    imei VARCHAR(50), -- Obligatoire si is_phone = true
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table de traçabilité IMEI
CREATE TABLE imei_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    imei VARCHAR(50) UNIQUE NOT NULL,
    product_id UUID REFERENCES products(id),
    current_boutique_id UUID REFERENCES boutiques(id),
    original_sale_id UUID REFERENCES sales(id),
    status VARCHAR(50) DEFAULT 'sold', -- 'in_stock', 'sold', 'returned'
    sale_date TIMESTAMP,
    return_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 4.1.4 Transferts et abonnements
```sql
-- Table des transferts
CREATE TABLE transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_boutique_id UUID REFERENCES boutiques(id),
    to_boutique_id UUID REFERENCES boutiques(id),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'shipped', 'received', 'cancelled'
    requested_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des articles de transfert
CREATE TABLE transfer_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transfer_id UUID REFERENCES transfers(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table des abonnements
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boutique_id UUID REFERENCES boutiques(id),
    amount DECIMAL(10,2),
    period_start DATE,
    period_end DATE,
    status VARCHAR(50), -- 'paid', 'pending', 'overdue'
    payment_date TIMESTAMP,
    invoice_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 5. INTERFACES UTILISATEUR

### 5.1 Interface Caissier (Boutique)

#### 5.1.1 Écran principal de vente
```
┌─────────────────────────────────────────────────────────────────┐
│ OBS SYSTEME - [Nom Boutique]                    [Caissier: John] │
├─────────────────────────────────────────────────────────────────┤
│ Recherche produit: [_________________] [Rechercher]             │
├─────────────────────────────────────────────────────────────────┤
│ PANIER                                                          │
│ ┌─────────────────┬─────┬──────────┬──────────┬───────────────┐ │
│ │ Produit         │ Qté │ P.U.     │ IMEI     │ Total         │ │
│ ├─────────────────┼─────┼──────────┼──────────┼───────────────┤ │
│ │ iPhone 14       │  1  │ 450000F  │[_______] │ 450000F       │ │
│ │ Samsung A54     │  2  │ 180000F  │[_______] │ 360000F       │ │
│ └─────────────────┴─────┴──────────┴──────────┴───────────────┘ │
│                                           TOTAL: 810000F        │
├─────────────────────────────────────────────────────────────────┤
│ [Espèces] [Carte] [Mobile Money] [Crédit]     [VALIDER VENTE]   │
└─────────────────────────────────────────────────────────────────┘
```

#### 5.1.2 Écran de gestion stock
```
┌─────────────────────────────────────────────────────────────────┐
│ GESTION STOCK                                                   │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────┬──────────┬─────────┬─────────┬─────────────┐ │
│ │ Produit         │ Stock    │ Seuil   │ Statut  │ Actions     │ │
│ ├─────────────────┼──────────┼─────────┼─────────┼─────────────┤ │
│ │ iPhone 14       │    5     │    3    │ OK      │ [Ajuster]   │ │
│ │ Samsung A54     │    2     │    5    │ FAIBLE  │ [Commander] │ │
│ │ Redmi Note 12   │    0     │    3    │ RUPTURE │ [Urgent]    │ │
│ └─────────────────┴──────────┴─────────┴─────────┴─────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ [Inventaire] [Transferts] [Mouvements] [Rapports]               │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Interface Administrateur Central

#### 5.2.1 Dashboard principal
```
┌─────────────────────────────────────────────────────────────────┐
│ LA MAISON DES TÉLÉPHONES - Dashboard Central                   │
├─────────────────────────────────────────────────────────────────┤
│ RÉSUMÉ RÉSEAU                                                   │
│ ┌─────────────┬─────────────┬─────────────┬─────────────────────┐ │
│ │ Boutiques   │ Ventes Jour │ CA Mensuel  │ Abonnements         │ │
│ │     12      │   2.5M F    │   45M F     │ 10 OK / 2 Retard    │ │
│ └─────────────┴─────────────┴─────────────┴─────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ BOUTIQUES DU RÉSEAU                                             │
│ ┌─────────────────┬──────────┬─────────┬─────────┬─────────────┐ │
│ │ Boutique        │ CA Jour  │ Stock   │ Abonmt  │ Actions     │ │
│ ├─────────────────┼──────────┼─────────┼─────────┼─────────────┤ │
│ │ Boutique Yaoundé│  180K F  │   OK    │  OK     │ [Voir]      │ │
│ │ Boutique Douala │  220K F  │ FAIBLE  │ RETARD  │ [Gérer]     │ │
│ └─────────────────┴──────────┴─────────┴─────────┴─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Interface SONUTEC (Admin Maître)

#### 5.3.1 Gestion technique
```
┌─────────────────────────────────────────────────────────────────┐
│ SONUTEC SARL - Administration OBS SYSTEME                       │
├─────────────────────────────────────────────────────────────────┤
│ CLIENTS ENTREPRISES                                             │
│ ┌─────────────────┬──────────┬─────────┬─────────┬─────────────┐ │
│ │ Entreprise      │ Boutiques│ Abonmt  │ Statut  │ Actions     │ │
│ ├─────────────────┼──────────┼─────────┼─────────┼─────────────┤ │
│ │ Maison Téléph.  │    12    │ 240K F  │ ACTIF   │ [Gérer]     │ │
│ │ TechMobile SARL │     8    │ 160K F  │ ACTIF   │ [Gérer]     │ │
│ └─────────────────┴──────────┴─────────┴─────────┴─────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ [Nouvelle Entreprise] [Rapports Globaux] [Maintenance Système]  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. GESTION DES ABONNEMENTS

### 6.1 Système de facturation

#### 6.1.1 Cycle de facturation
- **Période**: 30 jours (+/- 5 jours de tolérance)
- **Montant**: 20 000F par boutique
- **Date de référence**: Date de mise en service officielle

#### 6.1.2 Processus automatisé
```javascript
// Pseudo-code du processus de facturation
function processMonthlyBilling() {
    const boutiques = getBoutiquesForBilling();
    
    boutiques.forEach(boutique => {
        if (shouldGenerateInvoice(boutique)) {
            const invoice = generateInvoice(boutique, 20000);
            sendPaymentReminder(boutique, invoice);
            
            if (isPaymentOverdue(boutique)) {
                restrictServices(boutique, ['stock', 'inventory', 'transfers']);
            }
        }
    });
}
```

### 6.2 Restrictions de service

#### 6.2.1 Services maintenus (paiement en retard)
- Ventes en caisse
- Consultation stock (lecture seule)
- Rapports de vente

#### 6.2.2 Services suspendus (paiement en retard)
- Ajustements de stock
- Transferts inter-boutiques
- Inventaires physiques
- Création de nouveaux produits

### 6.3 Notifications et relances

#### 6.3.1 Calendrier de relances
- J-7: Notification de rappel
- J-3: Alerte urgente
- J+0: Suspension services
- J+15: Escalade commerciale

---

## 7. SYSTÈME D'AUTHENTIFICATION

### 7.1 Création des comptes

#### 7.1.1 Processus initial
1. **Premier utilisateur**: Administrateur maître SONUTEC
2. **Suppression bouton inscription**: Après création du premier compte
3. **Création ultérieure**: Uniquement via interface admin

#### 7.1.2 Hiérarchie des rôles
```
Admin Maître (SONUTEC)
    ├── Admin Central (La Maison des Téléphones)
    │   ├── Manager Boutique
    │   │   └── Caissier
    │   └── Manager Boutique
    │       └── Caissier
    └── [Autres entreprises clientes]
```

### 7.2 Permissions par rôle

#### 7.2.1 Admin Maître (SONUTEC)
- Gestion complète du système
- Création/suppression entreprises clientes
- Gestion abonnements et facturation
- Accès aux données techniques
- Maintenance système

#### 7.2.2 Admin Central (Entreprise)
- Gestion de son réseau de boutiques
- Création/gestion utilisateurs boutiques
- Rapports consolidés réseau
- Gestion transferts inter-boutiques
- Pas d'accès aux données SONUTEC

#### 7.2.3 Manager Boutique
- Gestion de sa boutique uniquement
- Création/gestion caissiers
- Gestion stock et inventaires
- Rapports boutique
- Validation transferts

#### 7.2.4 Caissier
- Ventes uniquement
- Consultation stock (lecture)
- Impression reçus
- Pas d'accès gestion

---

## 8. IMPRESSION THERMIQUE

### 8.1 Spécifications techniques

#### 8.1.1 Formats supportés
- **57mm**: Reçus clients compacts
- **58mm**: Reçus standards
- **80mm**: Factures détaillées

#### 8.1.2 Protocoles d'impression
- **ESC/POS**: Standard pour imprimantes thermiques
- **Connexions**: USB, Ethernet, Bluetooth
- **Encodage**: UTF-8 pour caractères spéciaux

### 8.2 Templates de reçus

#### 8.2.1 Reçu de vente standard (58mm)
```
        OBS SYSTEME
    [Nom de la boutique]
    [Adresse boutique]
    Tel: [Téléphone]
    
================================
Date: 15/12/2024    14:30
Caissier: Marie NGONO
Reçu N°: REC-2024-001234
================================

iPhone 14 Pro Max
IMEI: 123456789012345
Qté: 1 x 450,000F    450,000F

Samsung Galaxy A54
IMEI: 987654321098765
Qté: 1 x 180,000F    180,000F

Écouteurs Bluetooth
Qté: 2 x 15,000F      30,000F

================================
SOUS-TOTAL:          660,000F
TVA (19.25%):        127,050F
TOTAL:               787,050F

PAIEMENT: ESPÈCES
RENDU:                13,000F
================================

    Merci de votre visite!
    
Garantie: 12 mois pièces
Service client: +237 XXX XXX XXX

Powered by OBS SYSTEME - SONUTEC
```

#### 8.2.2 Facture détaillée (80mm)
```
                    OBS SYSTEME
              [Nom de la boutique]
              [Adresse complète]
              Tel: [Téléphone]
              Email: [Email]
              
================================================================
FACTURE N°: FAC-2024-001234
Date: 15/12/2024 à 14:30:25
Caissier: Marie NGONO
================================================================

CLIENT:
Nom: [Nom du client]
Tél: [Téléphone client]

================================================================
DÉTAIL DE LA VENTE:

iPhone 14 Pro Max - Noir 128GB
IMEI: 123456789012345
Prix unitaire: 450,000F
Quantité: 1
Total: 450,000F

Samsung Galaxy A54 - Bleu 256GB  
IMEI: 987654321098765
Prix unitaire: 180,000F
Quantité: 1
Total: 180,000F

Écouteurs Bluetooth Premium
Référence: ECO-BT-001
Prix unitaire: 15,000F
Quantité: 2
Total: 30,000F

================================================================
RÉCAPITULATIF:
Sous-total HT:                                      660,000F
TVA (19.25%):                                       127,050F
TOTAL TTC:                                          787,050F

MODE DE PAIEMENT: ESPÈCES
MONTANT REÇU:                                       800,000F
RENDU:                                               13,000F
================================================================

CONDITIONS DE GARANTIE:
- Téléphones: 12 mois pièces et main d'œuvre
- Accessoires: 6 mois
- Présenter cette facture pour toute réclamation

Service client: +237 XXX XXX XXX
Email: support@[boutique].com

================================================================
              Merci de votre confiance!
              
         Powered by OBS SYSTEME - SONUTEC SARL
              www.sonutec.com
```

### 8.3 Configuration d'impression

#### 8.3.1 Paramètres par boutique
```javascript
const printerConfig = {
    boutique_id: "uuid",
    printer_type: "thermal", // thermal, laser, inkjet
    connection_type: "usb", // usb, ethernet, bluetooth
    paper_width: 58, // 57, 58, 80 mm
    encoding: "utf8",
    auto_cut: true,
    cash_drawer: true, // Ouverture tiroir-caisse
    copies: {
        customer: 1,
        merchant: 1,
        archive: 0
    },
    templates: {
        receipt: "standard_58mm",
        invoice: "detailed_80mm",
        return: "return_58mm"
    }
};
```

---

## 9. SUPPORT DUAL-SCREEN

### 9.1 Configuration matérielle

#### 9.1.1 Types d'écrans supportés
- **Écran principal**: Interface caissier (tactile recommandé)
- **Écran client**: Affichage prix et total (lecture seule)
- **Résolutions**: 1024x768 minimum, 1920x1080 recommandé

#### 9.1.2 Disposition physique
```
┌─────────────────┐    ┌─────────────────┐
│  ÉCRAN CAISSIER │    │  ÉCRAN CLIENT   │
│                 │    │                 │
│ [Interface POS] │    │ [Prix/Totaux]   │
│                 │    │                 │
└─────────────────┘    └─────────────────┘
        │                       │
        └───────┬───────────────┘
                │
        ┌───────▼───────┐
        │   ORDINATEUR  │
        │     POS       │
        └───────────────┘
```

### 9.2 Interface écran client

#### 9.2.1 Affichage en temps réel
```
┌─────────────────────────────────────────┐
│           [Logo Boutique]               │
│                                         │
│         BIENVENUE CHEZ NOUS!            │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  iPhone 14 Pro Max                      │
│  1 x 450,000F ............. 450,000F   │
│                                         │
│  Samsung Galaxy A54                     │
│  1 x 180,000F ............. 180,000F   │
│                                         │
│  Écouteurs Bluetooth                    │
│  2 x 15,000F ............... 30,000F   │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  TOTAL: 660,000F                        │
│                                         │
│         Merci de votre visite!          │
│                                         │
└─────────────────────────────────────────┘
```

#### 9.2.2 Messages promotionnels
- Affichage des offres spéciales
- Informations sur les garanties
- Messages de fidélisation
- Publicités produits

### 9.3 Synchronisation des écrans

#### 9.3.1 Communication temps réel
```javascript
// WebSocket pour synchronisation
const clientDisplay = {
    updateCart: (items) => {
        socket.emit('update_client_display', {
            items: items,
            total: calculateTotal(items),
            boutique_id: getCurrentBoutique()
        });
    },
    
    showPromotion: (promo) => {
        socket.emit('show_promotion', promo);
    },
    
    showThankYou: () => {
        socket.emit('show_thank_you');
        setTimeout(() => {
            socket.emit('reset_display');
        }, 5000);
    }
};
```

---

## 10. SÉCURITÉ ET PERMISSIONS

### 10.1 Sécurité des données

#### 10.1.1 Chiffrement
- **Base de données**: Chiffrement au repos (Supabase)
- **Transit**: HTTPS/TLS 1.3 obligatoire
- **Mots de passe**: Hachage bcrypt (coût 12+)
- **Sessions**: JWT avec expiration courte

#### 10.1.2 Audit et logs
```sql
-- Table d'audit
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 10.2 Contrôle d'accès

#### 10.2.1 Politique RLS (Row Level Security)
```sql
-- Exemple: Boutiques ne voient que leurs données
CREATE POLICY boutique_isolation ON sales
    FOR ALL TO authenticated
    USING (
        boutique_id = (
            SELECT boutique_id 
            FROM users 
            WHERE id = auth.uid()
        )
    );
```

#### 10.2.2 Permissions granulaires
```javascript
const permissions = {
    'admin_master': ['*'], // Tous droits
    'admin_central': [
        'boutiques:read',
        '
