// Constantes de l'application OBS CAISSE

export const APP_CONFIG = {
  name: 'OBS CAISSE',
  version: '1.0.0',
  developer: 'SONUTEC SARL',
  client: 'La Maison des Téléphones'
}

export const ROLES = {
  ADMIN_MASTER: 'admin_master',
  ADMIN_CENTRAL: 'admin_central', 
  MANAGER: 'manager',
  CASHIER: 'cashier'
} as const

export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  MOBILE_MONEY: 'mobile_money',
  BANK_TRANSFER: 'bank_transfer',
  CREDIT: 'credit'
} as const

export const SALE_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
} as const

export const STOCK_STATUS = {
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock'
} as const

export const IMEI_STATUS = {
  IN_STOCK: 'in_stock',
  SOLD: 'sold',
  RETURNED: 'returned',
  TRANSFERRED: 'transferred',
  DEFECTIVE: 'defective'
} as const

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  EXPIRED: 'expired',
  PENDING: 'pending'
} as const

export const TAX_RATE = 0.1925 // 19.25% TVA Cameroun

export const CURRENCY = {
  symbol: 'F',
  code: 'XAF',
  name: 'Franc CFA'
}

export const PRINTER_CONFIG = {
  WIDTHS: [57, 58, 80],
  CONNECTIONS: ['usb', 'ethernet', 'bluetooth'],
  ENCODINGS: ['utf8', 'ascii']
}

export const ROUTES = {
  LOGIN: '/login',
  HOME: '/',
  POS: '/pos',
  ADMIN: '/admin',
  CUSTOMER_DISPLAY: '/customer-display',
  UNAUTHORIZED: '/unauthorized'
}

export const LOCAL_STORAGE_KEYS = {
  CART: 'obs_caisse_cart',
  CUSTOMER: 'obs_caisse_customer',
  PRINTER_CONFIG: 'obs_caisse_printer_config',
  USER_PREFERENCES: 'obs_caisse_user_preferences'
}

export const API_ENDPOINTS = {
  SALES: '/api/sales',
  PRODUCTS: '/api/products',
  STOCK: '/api/stock',
  IMEI: '/api/imei',
  TRANSFERS: '/api/transfers',
  SUBSCRIPTIONS: '/api/subscriptions',
  REPORTS: '/api/reports'
}

export const VALIDATION_RULES = {
  IMEI: {
    pattern: /^\d{15}$/,
    message: 'IMEI doit contenir exactement 15 chiffres'
  },
  PHONE: {
    pattern: /^\+?[1-9]\d{1,14}$/,
    message: 'Numéro de téléphone invalide'
  },
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Adresse email invalide'
  },
  PRICE: {
    min: 0,
    message: 'Le prix doit être positif'
  }
}

export const NOTIFICATIONS = {
  TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
  },
  DURATION: {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 8000
  }
}

export const PERMISSIONS = {
  [ROLES.ADMIN_MASTER]: [
    'system:manage',
    'companies:manage',
    'boutiques:manage',
    'users:manage',
    'subscriptions:manage',
    'reports:view_all'
  ],
  [ROLES.ADMIN_CENTRAL]: [
    'boutiques:manage_own',
    'users:manage_own',
    'products:manage',
    'transfers:manage',
    'reports:view_own'
  ],
  [ROLES.MANAGER]: [
    'boutique:manage_own',
    'users:manage_boutique',
    'stock:manage',
    'sales:view',
    'reports:view_boutique'
  ],
  [ROLES.CASHIER]: [
    'sales:create',
    'stock:view',
    'products:view'
  ]
}

export const SUBSCRIPTION_CONFIG = {
  MONTHLY_FEE: 20000, // 20,000 F CFA
  GRACE_PERIOD_DAYS: 5,
  REMINDER_DAYS: [7, 3, 1], // Jours avant expiration
  RESTRICTED_FEATURES: ['stock:manage', 'transfers:create', 'inventory:manage']
}

export const RECEIPT_TEMPLATES = {
  STANDARD_58MM: 'standard_58mm',
  DETAILED_80MM: 'detailed_80mm',
  RETURN_58MM: 'return_58mm'
}

export const DUAL_SCREEN_CONFIG = {
  CUSTOMER_DISPLAY_URL: '/customer-display',
  WINDOW_OPTIONS: 'width=800,height=600,fullscreen=yes,toolbar=no,menubar=no,scrollbars=no',
  MESSAGE_TYPES: {
    UPDATE_DISPLAY: 'UPDATE_DISPLAY',
    SHOW_PROMOTION: 'SHOW_PROMOTION',
    SHOW_THANK_YOU: 'SHOW_THANK_YOU',
    RESET_DISPLAY: 'RESET_DISPLAY'
  }
}

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion réseau',
  UNAUTHORIZED: 'Accès non autorisé',
  FORBIDDEN: 'Action non autorisée',
  NOT_FOUND: 'Ressource non trouvée',
  VALIDATION_ERROR: 'Données invalides',
  SERVER_ERROR: 'Erreur serveur interne',
  IMEI_DUPLICATE: 'IMEI déjà utilisé',
  INSUFFICIENT_STOCK: 'Stock insuffisant',
  SUBSCRIPTION_EXPIRED: 'Abonnement expiré'
}

export const SUCCESS_MESSAGES = {
  SALE_COMPLETED: 'Vente enregistrée avec succès',
  PRODUCT_ADDED: 'Produit ajouté au panier',
  STOCK_UPDATED: 'Stock mis à jour',
  USER_CREATED: 'Utilisateur créé avec succès',
  SETTINGS_SAVED: 'Paramètres sauvegardés'
}

export const THEME_CONFIG = {
  PRIMARY_COLOR: '#2563eb',
  SECONDARY_COLOR: '#64748b',
  SUCCESS_COLOR: '#10b981',
  WARNING_COLOR: '#f59e0b',
  ERROR_COLOR: '#ef4444',
  FONT_FAMILY: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
}
