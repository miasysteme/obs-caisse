// =====================================================
// TYPES TYPESCRIPT MULTI-TENANT MULTI-SECTORIEL
// OBS BUSINESS SUITE - SONUTEC SARL
// =====================================================

// Type pour les composants React
type ComponentType = any

// =====================================================
// 1. TYPES DE BASE SYSTÈME
// =====================================================

export interface BusinessSector {
  id: string
  code: 'telephony' | 'hotel' | 'bar' | 'restaurant' | 'retail' | 'health' | 'education' | 'services'
  name: string
  display_name: string
  description?: string
  icon?: string
  color?: string
  modules: string[]
  default_config: Record<string, any>
  pricing_model: Record<string, any>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SystemModule {
  id: string
  code: string
  name: string
  description?: string
  component_path?: string
  permissions: string[]
  dependencies: string[]
  pricing: Record<string, any>
  is_core: boolean
  created_at: string
}

export interface SectorModule {
  id: string
  sector_id: string
  module_id: string
  is_default: boolean
  config: Record<string, any>
}

// =====================================================
// 2. TYPES CLIENTS ET ÉTABLISSEMENTS
// =====================================================

export interface Client {
  id: string
  company_name: string
  legal_name?: string
  registration_number?: string
  tax_number?: string
  contact_info: {
    email?: string
    phone?: string
    address?: string
    website?: string
  }
  sectors: string[] // IDs des secteurs d'activité
  subscription_plan: 'basic' | 'standard' | 'premium'
  billing_cycle: 'monthly' | 'quarterly' | 'yearly'
  is_active: boolean
  trial_ends_at?: string
  created_at: string
  updated_at: string
}

export interface Establishment {
  id: string
  client_id: string
  sector_id: string
  name: string
  commercial_name?: string
  type?: string
  address?: string
  phone?: string
  email?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  config: Record<string, any>
  modules_enabled: string[]
  subscription_status: 'active' | 'suspended' | 'cancelled'
  subscription_start_date: string
  subscription_end_date?: string
  monthly_fee: number
  is_active: boolean
  created_at: string
  updated_at: string
  
  // Relations
  client?: Client
  sector?: BusinessSector
}

// =====================================================
// 3. TYPES UTILISATEURS ET AUTHENTIFICATION
// =====================================================

export interface SystemRole {
  id: string
  code: 'super_admin' | 'client_admin' | 'manager' | 'cashier' | 'staff'
  name: string
  description?: string
  level: number
  permissions: string[]
  is_system: boolean
  created_at: string
}

export interface User {
  id: string
  email: string
  role_id: string
  client_id?: string
  establishment_id?: string
  first_name?: string
  last_name?: string
  phone?: string
  avatar_url?: string
  preferences: Record<string, any>
  is_active: boolean
  email_verified: boolean
  last_login?: string
  failed_login_attempts: number
  locked_until?: string
  created_at: string
  updated_at: string
  
  // Relations
  role?: SystemRole
  client?: Client
  establishment?: Establishment
}

export interface UserSession {
  id: string
  user_id: string
  establishment_id?: string
  session_token: string
  ip_address?: string
  user_agent?: string
  expires_at: string
  is_active: boolean
  created_at: string
}

// =====================================================
// 4. TYPES PRODUITS/SERVICES GÉNÉRIQUES
// =====================================================

export interface Category {
  id: string
  establishment_id: string
  sector_id: string
  name: string
  description?: string
  parent_id?: string
  icon?: string
  color?: string
  sort_order: number
  is_active: boolean
  created_at: string
  
  // Relations
  parent?: Category
  children?: Category[]
}

export interface Item {
  id: string
  establishment_id: string
  category_id?: string
  code?: string
  name: string
  description?: string
  type: 'product' | 'service' | 'room' | 'drink' | 'food'
  unit?: string
  purchase_price?: number
  selling_price?: number
  min_price?: number
  max_price?: number
  tax_rate: number
  specifications: Record<string, any>
  images: string[]
  is_active: boolean
  requires_tracking: boolean
  created_by?: string
  created_at: string
  updated_at: string
  
  // Relations
  category?: Category
  inventory?: Inventory
}

export interface Inventory {
  id: string
  establishment_id: string
  item_id: string
  quantity: number
  reserved_quantity: number
  min_threshold: number
  max_threshold: number
  unit_cost?: number
  location?: string
  last_inventory_date?: string
  last_updated: string
  
  // Relations
  item?: Item
}

export interface InventoryMovement {
  id: string
  establishment_id: string
  item_id: string
  movement_type: 'in' | 'out' | 'adjustment' | 'transfer'
  quantity: number
  unit_cost?: number
  reference_type?: string
  reference_id?: string
  notes?: string
  created_by?: string
  created_at: string
  
  // Relations
  item?: Item
  created_by_user?: User
}

// =====================================================
// 5. TYPES TRANSACTIONNELS
// =====================================================

export interface Transaction {
  id: string
  establishment_id: string
  transaction_number: string
  type: 'sale' | 'reservation' | 'service' | 'rental'
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  customer_name?: string
  customer_phone?: string
  customer_email?: string
  customer_data: Record<string, any>
  subtotal: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  payment_method?: string
  payment_status: 'pending' | 'partial' | 'paid' | 'refunded'
  amount_paid: number
  amount_due: number
  transaction_data: Record<string, any>
  processed_by?: string
  processed_at: string
  created_at: string
  updated_at: string
  
  // Relations
  items?: TransactionItem[]
  processed_by_user?: User
}

export interface TransactionItem {
  id: string
  transaction_id: string
  item_id: string
  quantity: number
  unit_price: number
  total_price: number
  item_data: Record<string, any>
  created_at: string
  
  // Relations
  item?: Item
}

// =====================================================
// 6. TYPES SPÉCIFIQUES SECTEURS
// =====================================================

// Traçabilité (téléphonie, électronique)
export interface ItemTracking {
  id: string
  establishment_id: string
  item_id: string
  tracking_number: string // IMEI, numéro série
  current_status: 'in_stock' | 'sold' | 'returned' | 'defective'
  purchase_date?: string
  sale_date?: string
  warranty_start_date?: string
  warranty_end_date?: string
  transaction_id?: string
  history: TrackingHistoryEntry[]
  created_at: string
  updated_at: string
  
  // Relations
  item?: Item
  transaction?: Transaction
}

export interface TrackingHistoryEntry {
  date: string
  status: string
  notes?: string
  user_id?: string
}

// Hôtellerie
export interface Room {
  id: string
  establishment_id: string
  room_number: string
  room_type?: string
  floor?: number
  capacity: number
  amenities: string[]
  base_price?: number
  hourly_price?: number
  status: 'available' | 'occupied' | 'cleaning' | 'maintenance'
  last_cleaned?: string
  coordinates?: {
    x: number
    y: number
  }
  is_active: boolean
  created_at: string
  
  // Relations
  current_occupation?: RoomOccupation
}

export interface RoomOccupation {
  id: string
  room_id: string
  transaction_id: string
  occupation_type: 'sejour' | 'nuitee' | 'repos' | 'passage'
  check_in: string
  check_out?: string
  planned_checkout: string
  guest_count: number
  rate_per_unit: number
  total_amount: number
  status: 'active' | 'completed' | 'cancelled'
  notes?: string
  created_at: string
  
  // Relations
  room?: Room
  transaction?: Transaction
}

// =====================================================
// 7. TYPES ABONNEMENTS ET FACTURATION
// =====================================================

export interface Subscription {
  id: string
  establishment_id: string
  plan_name: string
  modules_included: string[]
  monthly_fee: number
  setup_fee: number
  period_start: string
  period_end: string
  status: 'active' | 'suspended' | 'cancelled'
  auto_renew: boolean
  created_at: string
  
  // Relations
  establishment?: Establishment
}

export interface SubscriptionInvoice {
  id: string
  subscription_id: string
  establishment_id: string
  invoice_number: string
  amount: number
  tax_amount: number
  total_amount: number
  period_start?: string
  period_end?: string
  due_date: string
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  payment_date?: string
  payment_method?: string
  payment_reference?: string
  created_at: string
  
  // Relations
  subscription?: Subscription
  establishment?: Establishment
}

// =====================================================
// 8. TYPES INTERFACE UTILISATEUR
// =====================================================

export interface ModuleConfig {
  id: string
  name: string
  icon: string
  path: string
  component: ComponentType
  permissions: string[]
  isActive: boolean
}

export interface DashboardMetrics {
  totalSales: number
  dailyRevenue: number
  monthlyRevenue: number
  activeCustomers: number
  lowStockItems: number
  pendingTransactions: number
  sectorSpecific: Record<string, any>
}

export interface NavigationItem {
  id: string
  label: string
  icon: string
  path: string
  children?: NavigationItem[]
  permissions?: string[]
  badge?: string | number
}

// =====================================================
// 9. TYPES CONTEXTE ET HOOKS
// =====================================================

export interface AuthContextType {
  user: User | null
  establishment: Establishment | null
  availableEstablishments: Establishment[]
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  switchEstablishment: (establishmentId: string) => Promise<void>
  hasPermission: (permission: string) => boolean
  isRole: (role: string) => boolean
}

export interface EstablishmentContextType {
  establishment: Establishment | null
  sector: BusinessSector | null
  availableModules: SystemModule[]
  activeModules: SystemModule[]
  config: Record<string, any>
  updateConfig: (config: Record<string, any>) => Promise<void>
}

// =====================================================
// 10. TYPES API ET REQUÊTES
// =====================================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface QueryFilters {
  search?: string
  category?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  establishment?: string
  sector?: string
  [key: string]: any
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

// =====================================================
// 11. TYPES SPÉCIFIQUES SECTEURS (DÉTAILLÉS)
// =====================================================

// Bar - Fiche journalière
export interface BarDailySheet {
  id: string
  establishment_id: string
  date: string
  items: BarDailyItem[]
  total_sales: number
  total_cost: number
  gross_margin: number
  created_by: string
  created_at: string
  
  // Relations
  establishment?: Establishment
}

export interface BarDailyItem {
  item_id: string
  item_name: string
  stock_yesterday: number
  entries_today: number
  sales_today: number
  theoretical_remaining: number
  actual_remaining: number
  difference: number
  unit_cost: number
  unit_price: number
  total_value: number
  
  // Relations
  item?: Item
}

// Hôtel - Dashboard temps réel
export interface HotelDashboard {
  total_rooms: number
  occupied_rooms: number
  available_rooms: number
  cleaning_rooms: number
  maintenance_rooms: number
  occupancy_rate: number
  daily_revenue: number
  average_rate: number
  check_ins_today: number
  check_outs_today: number
  room_status_summary: RoomStatusSummary[]
}

export interface RoomStatusSummary {
  status: string
  count: number
  percentage: number
}

// Restaurant - Commandes
export interface RestaurantOrder {
  id: string
  establishment_id: string
  order_number: string
  table_number?: string
  order_type: 'dine_in' | 'takeaway' | 'delivery'
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled'
  items: RestaurantOrderItem[]
  subtotal: number
  tax_amount: number
  total_amount: number
  customer_name?: string
  customer_phone?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface RestaurantOrderItem {
  id: string
  order_id: string
  item_id: string
  quantity: number
  unit_price: number
  total_price: number
  special_instructions?: string
  status: 'pending' | 'preparing' | 'ready'
  
  // Relations
  item?: Item
}

// =====================================================
// 12. TYPES UTILITAIRES
// =====================================================

export type SectorCode = BusinessSector['code']
export type UserRole = SystemRole['code']
export type TransactionType = Transaction['type']
export type TransactionStatus = Transaction['status']
export type PaymentStatus = Transaction['payment_status']
export type SubscriptionStatus = Subscription['status']
export type RoomStatus = Room['status']
export type OccupationType = RoomOccupation['occupation_type']

// Helpers pour les types conditionnels
export type SectorSpecificData<T extends SectorCode> = 
  T extends 'hotel' ? { rooms: Room[]; occupations: RoomOccupation[] } :
  T extends 'bar' ? { daily_sheets: BarDailySheet[] } :
  T extends 'restaurant' ? { orders: RestaurantOrder[] } :
  T extends 'telephony' ? { tracking: ItemTracking[] } :
  Record<string, any>

// Types pour les formulaires
export interface CreateEstablishmentForm {
  name: string
  commercial_name?: string
  sector_id: string
  type?: string
  address?: string
  phone?: string
  email?: string
  modules_enabled: string[]
}

export interface CreateUserForm {
  email: string
  password: string
  role_id: string
  establishment_id?: string
  first_name: string
  last_name: string
  phone?: string
}

export interface CreateItemForm {
  name: string
  description?: string
  category_id?: string
  type: Item['type']
  code?: string
  purchase_price?: number
  selling_price?: number
  min_price?: number
  max_price?: number
  requires_tracking: boolean
  specifications: Record<string, any>
}

// Types pour les rapports
export interface SalesReport {
  period: {
    start: string
    end: string
  }
  total_sales: number
  total_revenue: number
  average_sale: number
  top_items: Array<{
    item_id: string
    item_name: string
    quantity_sold: number
    revenue: number
  }>
  daily_breakdown: Array<{
    date: string
    sales: number
    revenue: number
  }>
}

export interface InventoryReport {
  total_items: number
  total_value: number
  low_stock_items: number
  out_of_stock_items: number
  items_by_category: Array<{
    category_name: string
    item_count: number
    total_value: number
  }>
}
