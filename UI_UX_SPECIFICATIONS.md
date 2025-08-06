# OBS CAISSE - Spécifications UI/UX

## DESIGN SYSTEM ET INTERFACE UTILISATEUR

### 1. CHARTE GRAPHIQUE

#### 1.1 Palette de couleurs
```css
:root {
  /* Couleurs principales */
  --primary-color: #2563eb;      /* Bleu principal */
  --primary-dark: #1d4ed8;       /* Bleu foncé */
  --primary-light: #3b82f6;      /* Bleu clair */
  
  /* Couleurs secondaires */
  --secondary-color: #64748b;    /* Gris bleu */
  --accent-color: #f59e0b;       /* Orange/Ambre */
  --success-color: #10b981;      /* Vert succès */
  --warning-color: #f59e0b;      /* Orange warning */
  --error-color: #ef4444;        /* Rouge erreur */
  
  /* Couleurs neutres */
  --gray-50: #f8fafc;
  --gray-100: #f1f5f9;
  --gray-200: #e2e8f0;
  --gray-300: #cbd5e1;
  --gray-400: #94a3b8;
  --gray-500: #64748b;
  --gray-600: #475569;
  --gray-700: #334155;
  --gray-800: #1e293b;
  --gray-900: #0f172a;
  
  /* Couleurs de fond */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  
  /* Couleurs de texte */
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #64748b;
}
```

#### 1.2 Typographie
```css
/* Polices */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  
  /* Tailles de police */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  
  /* Poids de police */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

#### 1.3 Espacements et dimensions
```css
:root {
  /* Espacements */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  
  /* Rayons de bordure */
  --radius-sm: 0.25rem;  /* 4px */
  --radius-md: 0.375rem; /* 6px */
  --radius-lg: 0.5rem;   /* 8px */
  --radius-xl: 0.75rem;  /* 12px */
  --radius-2xl: 1rem;    /* 16px */
  
  /* Ombres */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
```

### 2. COMPOSANTS DE BASE

#### 2.1 Boutons
```css
/* Bouton principal */
.btn-primary {
  background-color: var(--primary-color);
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  background-color: var(--primary-dark);
  box-shadow: var(--shadow-md);
}

.btn-primary:disabled {
  background-color: var(--gray-300);
  cursor: not-allowed;
  box-shadow: none;
}

/* Bouton secondaire */
.btn-secondary {
  background-color: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: var(--primary-color);
  color: white;
}

/* Bouton de danger */
.btn-danger {
  background-color: var(--error-color);
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Bouton large pour POS */
.btn-pos {
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  min-height: 60px;
  border-radius: var(--radius-lg);
}
```

#### 2.2 Champs de saisie
```css
.input-field {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-family: var(--font-family);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.1);
}

.input-field:disabled {
  background-color: var(--gray-100);
  color: var(--gray-500);
  cursor: not-allowed;
}

.input-field.error {
  border-color: var(--error-color);
}

.input-field.error:focus {
  box-shadow: 0 0 0 3px rgb(239 68 68 / 0.1);
}

/* Champ de recherche */
.search-input {
  position: relative;
}

.search-input input {
  padding-left: var(--space-10);
}

.search-input::before {
  content: "🔍";
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-400);
}
```

#### 2.3 Cartes et conteneurs
```css
.card {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-6);
  border: 1px solid var(--gray-200);
}

.card-header {
  border-bottom: 1px solid var(--gray-200);
  padding-bottom: var(--space-4);
  margin-bottom: var(--space-4);
}

.card-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

.card-subtitle {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: var(--space-1) 0 0 0;
}
```

### 3. LAYOUTS SPÉCIFIQUES

#### 3.1 Layout POS (Point de Vente)
```css
.pos-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  grid-template-rows: 60px 1fr;
  height: 100vh;
  gap: 0;
}

.pos-header {
  grid-column: 1 / -1;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-6);
  box-shadow: var(--shadow-md);
}

.pos-main {
  background-color: var(--bg-secondary);
  padding: var(--space-6);
  overflow-y: auto;
}

.pos-sidebar {
  background-color: var(--bg-primary);
  border-left: 1px solid var(--gray-200);
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-lg);
}

/* Grille de produits */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-4);
  padding: var(--space-4);
}

.product-card {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.product-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.product-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: var(--radius-md);
  margin-bottom: var(--space-3);
}

.product-name {
  font-weight: var(--font-medium);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.product-price {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--primary-color);
}
```

#### 3.2 Panier de vente
```css
.cart-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.cart-header {
  padding: var(--space-4);
  border-bottom: 1px solid var(--gray-200);
  background-color: var(--gray-50);
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4);
}

.cart-item {
  display: flex;
  align-items: center;
  padding: var(--space-3);
  border-bottom: 1px solid var(--gray-100);
  gap: var(--space-3);
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-info {
  flex: 1;
}

.cart-item-name {
  font-weight: var(--font-medium);
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}

.cart-item-details {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.cart-item-price {
  font-weight: var(--font-semibold);
  color: var(--primary-color);
}

.cart-item-actions {
  display: flex;
  gap: var(--space-2);
}

/* Champ IMEI dans le panier */
.imei-input {
  width: 100%;
  margin-top: var(--space-2);
  padding: var(--space-2);
  border: 1px solid var(--warning-color);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

.imei-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgb(37 99 235 / 0.1);
}

/* Total du panier */
.cart-total {
  padding: var(--space-4);
  border-top: 2px solid var(--gray-200);
  background-color: var(--gray-50);
}

.cart-total-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-2);
}

.cart-total-line.final {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--primary-color);
  border-top: 1px solid var(--gray-300);
  padding-top: var(--space-2);
  margin-top: var(--space-2);
}
```

#### 3.3 Méthodes de paiement
```css
.payment-methods {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
  margin: var(--space-4) 0;
}

.payment-method {
  padding: var(--space-4);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: white;
}

.payment-method:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.payment-method.selected {
  border-color: var(--primary-color);
  background-color: rgb(37 99 235 / 0.05);
}

.payment-method-icon {
  font-size: var(--text-2xl);
  margin-bottom: var(--space-2);
}

.payment-method-name {
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

/* Champ montant reçu */
.amount-received {
  margin: var(--space-4) 0;
}

.amount-input {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  text-align: center;
  padding: var(--space-4);
  border: 2px solid var(--primary-color);
  border-radius: var(--radius-lg);
}

.change-amount {
  text-align: center;
  margin-top: var(--space-2);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--success-color);
}
```

### 4. ÉCRAN CLIENT (DUAL-SCREEN)

#### 4.1 Layout écran client
```css
.customer-display {
  height: 100vh;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  display: flex;
  flex-direction: column;
  font-family: var(--font-family);
}

.customer-header {
  text-align: center;
  padding: var(--space-8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.customer-logo {
  max-height: 80px;
  margin-bottom: var(--space-4);
}

.customer-welcome {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-2);
}

.customer-subtitle {
  font-size: var(--text-lg);
  opacity: 0.8;
}

.customer-content {
  flex: 1;
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Liste des articles côté client */
.customer-items {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  margin-bottom: var(--space-6);
  backdrop-filter: blur(10px);
}

.customer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4) 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  font-size: var(--text-lg);
}

.customer-item:last-child {
  border-bottom: none;
}

.customer-item-name {
  font-weight: var(--font-medium);
}

.customer-item-price {
  font-weight: var(--font-semibold);
  font-size: var(--text-xl);
}

/* Total côté client */
.customer-total {
  text-align: center;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  backdrop-filter: blur(10px);
}

.customer-total-label {
  font-size: var(--text-xl);
  margin-bottom: var(--space-2);
  opacity: 0.9;
}

.customer-total-amount {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--accent-color);
}

/* Messages promotionnels */
.customer-promotion {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--accent-color), #f97316);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-8);
}

.customer-promotion-text {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* Message de remerciement */
.customer-thank-you {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--success-color), #059669);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-8);
}

.customer-thank-you-icon {
  font-size: 120px;
  margin-bottom: var(--space-6);
}

.customer-thank-you-text {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-4);
}

.customer-thank-you-subtitle {
  font-size: var(--text-xl);
  opacity: 0.9;
}
```

### 5. INTERFACES D'ADMINISTRATION

#### 5.1 Dashboard administrateur
```css
.admin-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr;
  height: 100vh;
}

.admin-header {
  grid-column: 1 / -1;
  background-color: var(--gray-800);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-6);
}

.admin-sidebar {
  background-color: var(--gray-100);
  border-right: 1px solid var(--gray-200);
  padding: var(--space-4);
}

.admin-main {
  background-color: var(--bg-secondary);
  padding: var(--space-6);
  overflow-y: auto;
}

/* Navigation sidebar */
.admin-nav {
  list-style: none;
  padding: 0;
  margin: 0;
}

.admin-nav-item {
  margin-bottom: var(--space-2);
}

.admin-nav-link {
  display: flex;
  align-items: center;
  padding: var(--space-3);
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  gap: var(--space-3);
}

.admin-nav-link:hover,
.admin-nav-link.active {
  background-color: var(--primary-color);
  color: white;
}

/* Cartes de statistiques */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.stat-card {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
  border-left: 4px solid var(--primary-color);
}

.stat-card.success {
  border-left-color: var(--success-color);
}

.stat-card.warning {
  border-left-color: var(--warning-color);
}

.stat-card.error {
  border-left-color: var(--error-color);
}

.stat-value {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-change {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  margin-top: var(--space-2);
}

.stat-change.positive {
  color: var(--success-color);
}

.stat-change.negative {
  color: var(--error-color);
}
```

#### 5.2 Tableaux de données
```css
.data-table {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.data-table-header {
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.data-table-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.data-table-actions {
  display: flex;
  gap: var(--space-3);
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  background-color: var(--gray-50);
  padding: var(--space-3) var(--space-4);
  text-align: left;
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--gray-200);
}

.table td {
  padding: var(--space-4);
  border-bottom: 1px solid var(--gray-100);
  color: var(--text-primary);
}

.table tr:hover {
  background-color: var(--gray-50);
}

/* Badges de statut */
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-xl);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge.success {
  background-color: rgb(16 185 129 / 0.1);
  color: var(--success-color);
}

.badge.warning {
  background-color: rgb(245 158 11 / 0.1);
  color: var(--warning-color);
}

.badge.error {
  background-color: rgb(239 68 68 / 0.1);
  color: var(--error-color);
}

.badge.info {
  background-color: rgb(37 99 235 / 0.1);
  color: var(--primary-color);
}
```

### 6. COMPOSANTS SPÉCIALISÉS

#### 6.1 Sélecteur de produits avec recherche
```css
.product-selector {
  position: relative;
}

.product-search {
  position: relative;
  margin-bottom: var(--space-4);
}

.product-search-input {
  width: 100%;
  padding: var(--space-4);
  font-size: var(--text-lg);
  border: 2px solid var(--gray-300);
  border-radius: var(--radius-lg);
  padding-left: var(--space-12);
}

.product-search-icon {
  position: absolute;
  left: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-400);
  font-size: var(--text-xl);
}

.product-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
}

.product-suggestion {
  padding: var(--space-3) var(--space-4);
  cursor: pointer;
  border-bottom: 1px solid var(--gray-100);
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.product-suggestion:hover {
  background-color: var(--gray-50);
}

.product-suggestion:last-child {
  border-bottom: none;
}

.product-suggestion-image {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  object-fit: cover;
}

.product-suggestion-info {
  flex: 1;
}

.product-suggestion-name {
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

.product-suggestion-price {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
```

#### 6.2 Indicateur de stock
```css
.stock-indicator {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.stock-indicator.high {
  background-color: rgb(16 185 129 / 0.1);
  color: var(--success-color);
}

.stock-indicator.medium {
  background-color: rgb(245 158 11 / 0.1);
  color: var(--warning-color);
}

.stock-indicator.low {
  background-color: rgb(239 68 68 / 0.1);
  color: var(--error-color);
}

.stock-indicator.out {
  background-color: var(--gray-100);
  color: var(--gray-500);
}

.stock-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: currentColor;
}
```

#### 6.3 Notifications d'abonnement
```css
.subscription-alert {
  background: linear-gradient(90deg, var(--warning-color), #f97316);
  color: white;
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  box-shadow: var(--shadow-md);
}

.subscription-alert.critical {
  background: linear-gradient(90deg
