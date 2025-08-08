# OBS SYSTEME - Guide d'Implémentation Technique

## ARCHITECTURE TECHNIQUE DÉTAILLÉE

### 1. STACK TECHNOLOGIQUE RECOMMANDÉE

#### 1.1 Frontend
```json
{
  "framework": "React 18+ avec TypeScript",
  "ui_library": "Material-UI ou Ant Design",
  "state_management": "Redux Toolkit + RTK Query",
  "routing": "React Router v6",
  "forms": "React Hook Form + Yup validation",
  "charts": "Chart.js ou Recharts",
  "printing": "react-to-print + ESC/POS commands",
  "dual_screen": "Custom hook + Window API"
}
```

#### 1.2 Backend
```json
{
  "runtime": "Node.js 18+",
  "framework": "Express.js",
  "database": "Supabase (PostgreSQL)",
  "auth": "Supabase Auth + JWT",
  "file_storage": "Supabase Storage",
  "real_time": "Supabase Realtime",
  "cron_jobs": "node-cron",
  "pdf_generation": "puppeteer",
  "email": "Nodemailer + SMTP"
}
```

### 2. STRUCTURE DU PROJET

```
obs-systeme/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── pos/
│   │   │   ├── inventory/
│   │   │   ├── reports/
│   │   │   └── admin/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── usePrinter.ts
│   │   │   ├── useDualScreen.ts
│   │   │   └── useSubscription.ts
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── supabase.ts
│   │   │   └── printer.ts
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   └── api/
│   │   ├── types/
│   │   ├── utils/
│   │   └── App.tsx
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.ts
│   ├── database/
│   │   ├── migrations/
│   │   └── seeds/
│   └── package.json
└── docs/
```

### 3. CONFIGURATION SUPABASE

#### 3.1 Variables d'environnement
```env
# Frontend (.env)
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
REACT_APP_API_URL=http://localhost:3001

# Backend (.env)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-jwt-secret
PORT=3001
```

#### 3.2 Configuration client Supabase
```typescript
// src/services/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Types pour TypeScript
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'admin_master' | 'admin_central' | 'manager' | 'cashier'
          boutique_id: string | null
          // ... autres champs
        }
        Insert: {
          // ... champs pour insertion
        }
        Update: {
          // ... champs pour mise à jour
        }
      }
      // ... autres tables
    }
  }
}
```

### 4. GESTION DE L'AUTHENTIFICATION

#### 4.1 Hook d'authentification
```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthUser extends User {
  role: string
  boutique_id: string | null
  boutique_name: string | null
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          boutique:boutiques(name)
        `)
        .eq('id', userId)
        .single()

      if (error) throw error

      setUser({
        ...data,
        boutique_name: data.boutique?.name || null
      })
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin_master',
    isCentral: user?.role === 'admin_central',
    isManager: user?.role === 'manager',
    isCashier: user?.role === 'cashier'
  }
}
```

### 5. GESTION DU POINT DE VENTE

#### 5.1 Hook POS principal
```typescript
// src/hooks/usePOS.ts
import { useState, useCallback } from 'react'
import { supabase } from '../services/supabase'

interface CartItem {
  id: string
  product_id: string
  name: string
  quantity: number
  unit_price: number
  total_price: number
  imei?: string
  requires_imei: boolean
}

export const usePOS = (boutiqueId: string) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [customer, setCustomer] = useState({ name: '', phone: '' })
  const [loading, setLoading] = useState(false)

  const addToCart = useCallback((product: any, quantity: number = 1) => {
    const existingItem = cart.find(item => item.product_id === product.id)
    
    if (existingItem && !product.requires_imei) {
      // Augmenter la quantité si pas d'IMEI requis
      setCart(prev => prev.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + quantity, total_price: (item.quantity + quantity) * item.unit_price }
          : item
      ))
    } else {
      // Ajouter nouvel item
      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        product_id: product.id,
        name: product.name,
        quantity,
        unit_price: product.recommended_price,
        total_price: product.recommended_price * quantity,
        requires_imei: product.requires_imei
      }
      setCart(prev => [...prev, newItem])
    }
  }, [cart])

  const updateItemPrice = useCallback((itemId: string, newPrice: number) => {
    setCart(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, unit_price: newPrice, total_price: newPrice * item.quantity }
        : item
    ))
  }, [])

  const updateItemIMEI = useCallback((itemId: string, imei: string) => {
    setCart(prev => prev.map(item =>
      item.id === itemId ? { ...item, imei } : item
    ))
  }, [])

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId))
  }, [])

  const calculateTotal = useCallback(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.total_price, 0)
    const taxRate = 0.1925 // 19.25% TVA Cameroun
    const taxAmount = subtotal * taxRate
    const total = subtotal + taxAmount

    return { subtotal, taxAmount, total }
  }, [cart])

  const validateSale = useCallback(() => {
    const errors: string[] = []

    // Vérifier que le panier n'est pas vide
    if (cart.length === 0) {
      errors.push('Le panier est vide')
    }

    // Vérifier les IMEI requis
    cart.forEach(item => {
      if (item.requires_imei && !item.imei) {
        errors.push(`IMEI requis pour ${item.name}`)
      }
    })

    return errors
  }, [cart])

  const processSale = useCallback(async (paymentMethod: string, amountReceived?: number) => {
    setLoading(true)
    try {
      const errors = validateSale()
      if (errors.length > 0) {
        throw new Error(errors.join(', '))
      }

      const { subtotal, taxAmount, total } = calculateTotal()

      // Créer la vente
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert({
          boutique_id: boutiqueId,
          customer_name: customer.name,
          customer_phone: customer.phone,
          subtotal,
          tax_amount: taxAmount,
          total_amount: total,
          payment_method: paymentMethod,
          amount_received: amountReceived,
          change_amount: amountReceived ? Math.max(0, amountReceived - total) : 0
        })
        .select()
        .single()

      if (saleError) throw saleError

      // Ajouter les articles de vente
      const saleItems = cart.map(item => ({
        sale_id: sale.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        imei: item.imei
      }))

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems)

      if (itemsError) throw itemsError

      // Mettre à jour le tracking IMEI pour les téléphones
      for (const item of cart) {
        if (item.imei) {
          await supabase
            .from('imei_tracking')
            .upsert({
              imei: item.imei,
              product_id: item.product_id,
              current_boutique_id: boutiqueId,
              original_sale_id: sale.id,
              current_status: 'sold',
              sale_date: new Date().toISOString().split('T')[0]
            })
        }
      }

      // Réinitialiser le panier
      setCart([])
      setCustomer({ name: '', phone: '' })

      return { success: true, sale }
    } catch (error) {
      console.error('Erreur lors de la vente:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }, [cart, customer, boutiqueId, calculateTotal, validateSale])

  return {
    cart,
    customer,
    setCustomer,
    loading,
    addToCart,
    updateItemPrice,
    updateItemIMEI,
    removeFromCart,
    calculateTotal,
    processSale,
    validateSale
  }
}
```

### 6. GESTION DE L'IMPRESSION

#### 6.1 Service d'impression
```typescript
// src/services/printer.ts
interface PrinterConfig {
  type: 'thermal' | 'laser'
  width: 57 | 58 | 80
  connection: 'usb' | 'ethernet' | 'bluetooth'
  encoding: string
}

interface ReceiptData {
  sale: any
  items: any[]
  boutique: any
  total: { subtotal: number; taxAmount: number; total: number }
}

export class PrinterService {
  private config: PrinterConfig

  constructor(config: PrinterConfig) {
    this.config = config
  }

  // Commandes ESC/POS de base
  private ESC = '\x1B'
  private GS = '\x1D'
  
  private commands = {
    INIT: '\x1B\x40',
    ALIGN_CENTER: '\x1B\x61\x01',
    ALIGN_LEFT: '\x1B\x61\x00',
    ALIGN_RIGHT: '\x1B\x61\x02',
    BOLD_ON: '\x1B\x45\x01',
    BOLD_OFF: '\x1B\x45\x00',
    UNDERLINE_ON: '\x1B\x2D\x01',
    UNDERLINE_OFF: '\x1B\x2D\x00',
    SIZE_NORMAL: '\x1D\x21\x00',
    SIZE_DOUBLE: '\x1D\x21\x11',
    CUT_PAPER: '\x1D\x56\x00',
    OPEN_DRAWER: '\x1B\x70\x00\x19\xFA'
  }

  private formatLine(text: string, width: number = 32): string {
    if (text.length <= width) {
      return text.padEnd(width)
    }
    return text.substring(0, width)
  }

  private formatPrice(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount).replace('XAF', 'F')
  }

  private generateReceiptContent(data: ReceiptData): string {
    const { sale, items, boutique, total } = data
    const width = this.config.width === 80 ? 48 : 32
    
    let content = ''
    
    // En-tête
    content += this.commands.INIT
    content += this.commands.ALIGN_CENTER
    content += this.commands.BOLD_ON
    content += this.commands.SIZE_DOUBLE
    content += 'OBS SYSTEME\n'
    content += this.commands.SIZE_NORMAL
    content += this.commands.BOLD_OFF
    content += `${boutique.commercial_name}\n`
    content += `${boutique.address || ''}\n`
    content += `Tel: ${boutique.phone || ''}\n`
    content += '\n'
    
    // Ligne de séparation
    content += this.commands.ALIGN_LEFT
    content += '='.repeat(width) + '\n'
    
    // Informations de vente
    content += `Date: ${new Date(sale.created_at).toLocaleString('fr-FR')}\n`
    content += `Caissier: ${sale.cashier_name || ''}\n`
    content += `Recu N°: ${sale.sale_number}\n`
    content += '='.repeat(width) + '\n'
    content += '\n'
    
    // Articles
    items.forEach(item => {
      content += this.commands.BOLD_ON
      content += this.formatLine(item.product_name, width) + '\n'
      content += this.commands.BOLD_OFF
      
      if (item.imei) {
        content += `IMEI: ${item.imei}\n`
      }
      
      const qtyPrice = `${item.quantity} x ${this.formatPrice(item.unit_price)}`
      const total = this.formatPrice(item.total_price)
      const line = qtyPrice.padEnd(width - total.length) + total
      content += line + '\n'
      content += '\n'
    })
    
    // Total
    content += '='.repeat(width) + '\n'
    content += this.commands.BOLD_ON
    const subtotalLine = 'SOUS-TOTAL:'.padEnd(width - this.formatPrice(total.subtotal).length) + this.formatPrice(total.subtotal)
    content += subtotalLine + '\n'
    
    const taxLine = `TVA (19.25%):`.padEnd(width - this.formatPrice(total.taxAmount).length) + this.formatPrice(total.taxAmount)
    content += taxLine + '\n'
    
    const totalLine = 'TOTAL:'.padEnd(width - this.formatPrice(total.total).length) + this.formatPrice(total.total)
    content += totalLine + '\n'
    content += this.commands.BOLD_OFF
    content += '\n'
    
    // Paiement
    content += `PAIEMENT: ${sale.payment_method.toUpperCase()}\n`
    if (sale.amount_received && sale.change_amount > 0) {
      content += `RENDU: ${this.formatPrice(sale.change_amount)}\n`
    }
    content += '='.repeat(width) + '\n'
    content += '\n'
    
    // Pied de page
    content += this.commands.ALIGN_CENTER
    content += 'Merci de votre visite!\n'
    content += '\n'
    content += 'Garantie: 12 mois pieces\n'
    content += `Service client: ${boutique.phone || ''}\n`
    content += '\n'
    content += this.commands.SIZE_NORMAL
    content += 'Powered by OBS SYSTEME - SONUTEC\n'
    
    // Coupe du papier
    content += '\n\n\n'
    content += this.commands.CUT_PAPER
    
    return content
  }

  async printReceipt(data: ReceiptData): Promise<boolean> {
    try {
      const content = this.generateReceiptContent(data)
      
      // Pour le web, utiliser l'API Web Serial ou une solution de pont
      if ('serial' in navigator) {
        // Utilisation de l'API Web Serial pour connexion USB
        const port = await (navigator as any).serial.requestPort()
        await port.open({ baudRate: 9600 })
        
        const writer = port.writable.getWriter()
        const encoder = new TextEncoder()
        await writer.write(encoder.encode(content))
        writer.releaseLock()
        await port.close()
        
        return true
      } else {
        // Fallback: ouvrir une nouvelle fenêtre pour impression
        const printWindow = window.open('', '_blank')
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Reçu de vente</title>
                <style>
                  body { font-family: monospace; font-size: 12px; margin: 0; padding: 10px; }
                  pre { white-space: pre-wrap; }
                </style>
              </head>
              <body>
                <pre>${content.replace(/[\x00-\x1F\x7F]/g, '')}</pre>
                <script>window.print(); window.close();</script>
              </body>
            </html>
          `)
          printWindow.document.close()
        }
        return true
      }
    } catch (error) {
      console.error('Erreur d\'impression:', error)
      return false
    }
  }

  async openCashDrawer(): Promise<boolean> {
    try {
      // Envoyer la commande d'ouverture du tiroir-caisse
      if ('serial' in navigator) {
        const port = await (navigator as any).serial.requestPort()
        await port.open({ baudRate: 9600 })
        
        const writer = port.writable.getWriter()
        const encoder = new TextEncoder()
        await writer.write(encoder.encode(this.commands.OPEN_DRAWER))
        writer.releaseLock()
        await port.close()
        
        return true
      }
      return false
    } catch (error) {
      console.error('Erreur ouverture tiroir:', error)
      return false
    }
  }
}

// Hook pour utiliser l'imprimante
export const usePrinter = (boutiqueId: string) => {
  const [config, setConfig] = useState<PrinterConfig | null>(null)
  const [printer, setPrinter] = useState<PrinterService | null>(null)

  useEffect(() => {
    // Charger la configuration de l'imprimante depuis la base
    const loadPrinterConfig = async () => {
      const { data } = await supabase
        .from('boutiques')
        .select('printer_config')
        .eq('id', boutiqueId)
        .single()

      if (data?.printer_config) {
        const printerConfig = data.printer_config as PrinterConfig
        setConfig(printerConfig)
        setPrinter(new PrinterService(printerConfig))
      }
    }

    loadPrinterConfig()
  }, [boutiqueId])

  return {
    printer,
    config,
    isConfigured: !!printer
  }
}
```

### 7. GESTION DUAL-SCREEN

#### 7.1 Hook pour écrans doubles
```typescript
// src/hooks/useDualScreen.ts
import { useState, useEffect, useCallback } from 'react'

interface CustomerDisplayData {
  items: Array<{
    name: string
    quantity: number
    unit_price: number
    total_price: number
  }>
  subtotal: number
  tax_amount: number
  total: number
  boutique_name: string
  logo_url?: string
}

export const useDualScreen = () => {
  const [customerWindow, setCustomerWindow] = useState<Window | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const openCustomerDisplay = useCallback(() => {
    // Ouvrir une nouvelle fenêtre pour l'écran client
    const newWindow = window.open(
      '/customer-display',
      'customerDisplay',
      'width=800,height=600,fullscreen=yes,toolbar=no,menubar=no,scrollbars=no'
    )

    if (newWindow) {
      setCustomerWindow(newWindow)
      setIsConnected(true)

      // Écouter la fermeture de la fenêtre
      const checkClosed = setInterval(() => {
        if (newWindow.closed) {
          setCustomerWindow(null)
          setIsConnected(false)
          clearInterval(checkClosed)
        }
      }, 1000)
    }
  }, [])

  const closeCustomerDisplay = useCallback(() => {
    if (customerWindow) {
      customerWindow.close()
      setCustomerWindow(null)
      setIsConnected(false)
    }
  }, [customerWindow])

  const updateCustomerDisplay = useCallback((data: CustomerDisplayData) => {
    if (customerWindow && !customerWindow.closed) {
      customerWindow.postMessage({
        type: 'UPDATE_DISPLAY',
        data
      }, '*')
    }
  }, [customerWindow])

  const showPromotion = useCallback((promotion: string) => {
    if (customerWindow && !customerWindow.closed) {
      customerWindow.postMessage({
        type: 'SHOW_PROMOTION',
        data: { message: promotion }
      }, '*')
    }
  }, [customerWindow])

  const showThankYou = useCallback(() => {
    if (customerWindow && !customerWindow.closed) {
      customerWindow.postMessage({
        type: 'SHOW_THANK_YOU'
      }, '*')
      
      // Retour à l'écran normal après 5 secondes
      setTimeout(() => {
        if (customerWindow && !customerWindow.closed) {
          customerWindow.postMessage({
            type: 'RESET_DISPLAY'
          }, '*')
        }
      }, 5000)
    }
  }, [customerWindow])

  useEffect(() => {
    return () => {
      if (customerWindow) {
        customerWindow.close()
      }
    }
  }, [customerWindow])

  return {
    isConnected,
    openCustomerDisplay,
    closeCustomerDisplay,
    updateCustomerDisplay,
    showPromotion,
    showThankYou
  }
}
```

### 8. GESTION DES ABONNEMENTS

#### 8.1 Service de vérification d'abonnement
```typescript
// src/services/subscription.ts
export class SubscriptionService {
  static async checkBoutiqueSubscription(boutiqueId: string) {
    const { data: boutique, error } = await supabase
      .from('boutiques')
      .select('subscription_status, subscription_end_date, grace_period_end')
      .eq('id', boutiqueId)
      .single()

    if (error) throw error

    const now = new Date()
    const endDate = new Date(boutique.subscription_end_date)
    const graceEnd = boutique.grace_period_end ? new Date(boutique.grace_period_end) : null

    return {
      status: boutique.subscription_status,
      isActive: boutique.subscription_status === 'active',
      isExpired: now > endDate,
      isInGracePeriod: graceEnd ? now <= graceEnd : false,
      daysUntilExpiry: Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      restrictedServices: boutique.subscription_status !== 'active' ? ['stock', 'inventory', 'transfers'] : []
    }
  }

  static async getRestrictedFeatures(boutiqueId: string): Promise<string[]> {
    const subscription = await this.checkBoutiqueSubscription(boutiqueId)
    return subscription.restrictedServices
  }
}

// Hook pour gérer les restrictions d'abonnement
export const useSubscription = (boutiqueId: string) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const status = await SubscriptionService.checkBoutiqueSubscription(boutiqueId)
        setSubscriptionStatus(status)
      } catch (error) {
        console.error('Erreur vérification abonnement:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSubscription()
    
    // Vérifier toutes les heures
    const interval = setInterval(checkSubscription, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [boutiqueId])

  const isFeatureRestricted = useCallback((feature: string) => {
    return subscriptionStatus?.restrictedServices.includes(feature) || false
  }, [subscriptionStatus])

  return {
    subscriptionStatus,
    loading,
    isFeatureRestricted,
    isActive: subscriptionStatus?.isActive || false,
    isExpired: subscriptionStatus?.isExpired || false,
    daysUntilExpiry: subscriptionStatus?.daysUntilExpiry || 0
  }
}
```

### 9. COMPOSANTS PRINCIPAUX

#### 9.1 Composant POS principal
```typescript
// src/components/pos/POSMain.tsx
import React, { useState } from 'react'
import { usePOS } from '../../hooks/usePOS'
import { usePrinter } from '../../services/printer'
import { useDualScreen } from '../../hooks/useDualScreen'
import { useAuth } from '../../hooks/useAuth'

export const POSMain: React.FC = () => {
  const { user } = useAuth()
  const { 
    cart, 
    customer, 
    setCustomer, 
    addToCart, 
    updateItemPrice, 
    updateItemIMEI, 
    removeFromCart, 
    calculateTotal, 
    processSale 
  } = usePOS(user?.boutique_id!)
  
  const { printer } = usePrinter(user?.boutique_id!)
  const { 
    isConnected, 
    openCustomerDisplay, 
    updateCustomerDisplay, 
    showThankYou 
  } = useDualScreen()

  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [amountReceived, setAmountReceived] = useState<number>(0)

  const { subtotal, taxAmount, total } = calculateTotal()

  // Mettre à jour l'écran client quand le panier change
  React.useEffect(() => {
    if (isConnected) {
      updateCustomerDisplay({
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price
        })),
        subtotal,
        tax_amount: taxAmount,
        total,
        boutique_name: user?.boutique_name || ''
      })
    }
  }, [cart, subtotal, taxAmount, total, isConnected, updateCustomerDisplay, user])

  const handleCompleteSale = async () => {
    const result = await processSale(paymentMethod, amountReceived)
    
    if (result.success && result.sale) {
      // Imprimer le reçu
      if (printer) {
        await printer.printReceipt({
          sale: result.sale,
