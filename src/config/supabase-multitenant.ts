// =====================================================
// CONFIGURATION SUPABASE MULTI-TENANT
// OBS BUSINESS SUITE - SONUTEC SARL
// =====================================================

import { supabase } from './supabase'
import type { 
  BusinessSector, 
  Client, 
  Establishment, 
  User, 
  SystemRole,
  Item,
  Transaction,
  Room,
  ItemTracking
} from '../types/multitenant'

// Utilise le client Supabase existant
// Configuration déjà définie dans ./supabase.ts

// =====================================================
// TYPES DE BASE DE DONNÉES MULTI-TENANT
// =====================================================

export type Database = {
  public: {
    Tables: {
      // Tables de configuration système
      business_sectors: {
        Row: BusinessSector
        Insert: Omit<BusinessSector, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<BusinessSector, 'id' | 'created_at'>>
      }
      
      system_modules: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['system_modules']['Row'], 'id' | 'created_at'>
        Update: Partial<Omit<Database['public']['Tables']['system_modules']['Row'], 'id' | 'created_at'>>
      }
      
      // Tables clients et établissements
      clients: {
        Row: Client
        Insert: Omit<Client, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Client, 'id' | 'created_at'>>
      }
      
      establishments: {
        Row: Establishment
        Insert: Omit<Establishment, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Establishment, 'id' | 'created_at'>>
      }
      
      // Tables utilisateurs
      system_roles: {
        Row: SystemRole
        Insert: Omit<SystemRole, 'id' | 'created_at'>
        Update: Partial<Omit<SystemRole, 'id' | 'created_at'>>
      }
      
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id' | 'created_at'>>
      }
      
      // Tables produits/services
      categories: {
        Row: {
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
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>
        Update: Partial<Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>>
      }
      
      items: {
        Row: Item
        Insert: Omit<Item, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Item, 'id' | 'created_at'>>
      }
      
      inventory: {
        Row: {
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
        }
        Insert: Omit<Database['public']['Tables']['inventory']['Row'], 'id' | 'last_updated'>
        Update: Partial<Omit<Database['public']['Tables']['inventory']['Row'], 'id'>>
      }
      
      // Tables transactionnelles
      transactions: {
        Row: Transaction
        Insert: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Transaction, 'id' | 'created_at'>>
      }
      
      transaction_items: {
        Row: {
          id: string
          transaction_id: string
          item_id: string
          quantity: number
          unit_price: number
          total_price: number
          item_data: Record<string, any>
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['transaction_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Omit<Database['public']['Tables']['transaction_items']['Row'], 'id' | 'created_at'>>
      }
      
      // Tables spécifiques secteurs
      rooms: {
        Row: Room
        Insert: Omit<Room, 'id' | 'created_at'>
        Update: Partial<Omit<Room, 'id' | 'created_at'>>
      }
      
      room_occupations: {
        Row: {
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
        }
        Insert: Omit<Database['public']['Tables']['room_occupations']['Row'], 'id' | 'created_at'>
        Update: Partial<Omit<Database['public']['Tables']['room_occupations']['Row'], 'id' | 'created_at'>>
      }
      
      item_tracking: {
        Row: ItemTracking
        Insert: Omit<ItemTracking, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ItemTracking, 'id' | 'created_at'>>
      }
      
      // Tables d'abonnement
      subscriptions: {
        Row: {
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
        }
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'created_at'>
        Update: Partial<Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'created_at'>>
      }
      
      subscription_invoices: {
        Row: {
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
        }
        Insert: Omit<Database['public']['Tables']['subscription_invoices']['Row'], 'id' | 'created_at'>
        Update: Partial<Omit<Database['public']['Tables']['subscription_invoices']['Row'], 'id' | 'created_at'>>
      }
    }
    
    Views: {
      // Vues pour les rapports
      v_establishment_metrics: {
        Row: {
          establishment_id: string
          establishment_name: string
          sector_code: string
          daily_sales: number
          monthly_sales: number
          total_items: number
          low_stock_items: number
          active_users: number
        }
      }
      
      v_sector_performance: {
        Row: {
          sector_code: string
          sector_name: string
          total_establishments: number
          total_revenue: number
          average_revenue_per_establishment: number
        }
      }
    }
    
    Functions: {
      // Fonctions personnalisées
      generate_transaction_number: {
        Args: {
          establishment_id: string
          transaction_type: string
        }
        Returns: string
      }
      
      get_establishment_modules: {
        Args: {
          establishment_id: string
        }
        Returns: {
          module_code: string
          module_name: string
          is_enabled: boolean
          config: Record<string, any>
        }[]
      }
      
      check_subscription_status: {
        Args: {
          establishment_id: string
        }
        Returns: {
          status: string
          days_remaining: number
          is_active: boolean
          restricted_features: string[]
        }
      }
    }
  }
}

// =====================================================
// SERVICES D'ACCÈS AUX DONNÉES
// =====================================================

export class MultiTenantService {
  
  // Service pour les secteurs d'activité
  static async getBusinessSectors() {
    const { data, error } = await supabase
      .from('business_sectors')
      .select('*')
      .eq('is_active', true)
      .order('display_name')
    
    if (error) throw error
    return data
  }
  
  // Service pour les établissements d'un client
  static async getClientEstablishments(clientId: string) {
    const { data, error } = await supabase
      .from('establishments')
      .select(`
        *,
        client:clients(*),
        sector:business_sectors(*)
      `)
      .eq('client_id', clientId)
      .eq('is_active', true)
      .order('name')
    
    if (error) throw error
    return data
  }
  
  // Service pour les modules d'un établissement
  static async getEstablishmentModules(establishmentId: string) {
    const { data, error } = await supabase
      .rpc('get_establishment_modules', { establishment_id: establishmentId })
    
    if (error) throw error
    return data
  }
  
  // Service pour vérifier le statut d'abonnement
  static async checkSubscriptionStatus(establishmentId: string) {
    const { data, error } = await supabase
      .rpc('check_subscription_status', { establishment_id: establishmentId })
    
    if (error) throw error
    return data
  }
  
  // Service pour les items d'un établissement
  static async getEstablishmentItems(establishmentId: string, filters?: {
    category?: string
    search?: string
    type?: string
  }) {
    let query = supabase
      .from('items')
      .select(`
        *,
        category:categories(*),
        inventory:inventory(*)
      `)
      .eq('establishment_id', establishmentId)
      .eq('is_active', true)
    
    if (filters?.category) {
      query = query.eq('category_id', filters.category)
    }
    
    if (filters?.type) {
      query = query.eq('type', filters.type)
    }
    
    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }
    
    const { data, error } = await query.order('name')
    
    if (error) throw error
    return data
  }
  
  // Service pour créer une transaction
  static async createTransaction(transactionData: Database['public']['Tables']['transactions']['Insert']) {
    // Générer le numéro de transaction
    const { data: transactionNumber, error: numberError } = await supabase
      .rpc('generate_transaction_number', {
        establishment_id: transactionData.establishment_id,
        transaction_type: transactionData.type
      })
    
    if (numberError) throw numberError
    
    // Créer la transaction
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        ...transactionData,
        transaction_number: transactionNumber
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }
  
  // Service pour les chambres d'hôtel
  static async getHotelRooms(establishmentId: string) {
    const { data, error } = await supabase
      .from('rooms')
      .select(`
        *,
        current_occupation:room_occupations!inner(
          *,
          transaction:transactions(*)
        )
      `)
      .eq('establishment_id', establishmentId)
      .eq('is_active', true)
      .order('room_number')
    
    if (error) throw error
    return data
  }
  
  // Service pour la traçabilité IMEI
  static async trackIMEI(imei: string) {
    const { data, error } = await supabase
      .from('item_tracking')
      .select(`
        *,
        item:items(*),
        transaction:transactions(*)
      `)
      .eq('tracking_number', imei)
      .single()
    
    if (error) throw error
    return data
  }
}

// =====================================================
// HOOKS PERSONNALISÉS MULTI-TENANT
// =====================================================

export const useSupabaseMultiTenant = () => {
  return {
    supabase,
    MultiTenantService
  }
}

// =====================================================
// UTILITAIRES DE CONFIGURATION
// =====================================================

export const getSectorConfig = (sectorCode: string) => {
  const sectorConfigs = {
    telephony: {
      modules: ['pos', 'inventory', 'item_tracking', 'reports'],
      features: ['imei_tracking', 'warranty_management'],
      theme: { primary: '#2196F3', secondary: '#1976D2' }
    },
    hotel: {
      modules: ['pos', 'hotel_rooms', 'reports', 'customers'],
      features: ['room_management', 'occupancy_tracking', 'housekeeping'],
      theme: { primary: '#FF9800', secondary: '#F57C00' }
    },
    bar: {
      modules: ['pos', 'inventory', 'bar_stock', 'reports'],
      features: ['daily_sheets', 'liquid_inventory', 'customer_credit'],
      theme: { primary: '#9C27B0', secondary: '#7B1FA2' }
    },
    restaurant: {
      modules: ['pos', 'restaurant_orders', 'inventory', 'reports'],
      features: ['table_management', 'kitchen_orders', 'delivery'],
      theme: { primary: '#4CAF50', secondary: '#388E3C' }
    },
    retail: {
      modules: ['pos', 'inventory', 'customers', 'reports'],
      features: ['promotions', 'loyalty_program', 'multi_category'],
      theme: { primary: '#FF5722', secondary: '#D84315' }
    },
    health: {
      modules: ['pos', 'inventory', 'customers', 'reports'],
      features: ['patient_records', 'prescriptions', 'appointments'],
      theme: { primary: '#F44336', secondary: '#D32F2F' }
    },
    education: {
      modules: ['pos', 'customers', 'reports'],
      features: ['student_management', 'fee_collection', 'schedules'],
      theme: { primary: '#3F51B5', secondary: '#303F9F' }
    },
    services: {
      modules: ['pos', 'customers', 'reports'],
      features: ['appointments', 'service_tracking', 'invoicing'],
      theme: { primary: '#607D8B', secondary: '#455A64' }
    }
  }
  
  return sectorConfigs[sectorCode as keyof typeof sectorConfigs] || sectorConfigs.retail
}

export default supabase
