import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://vhahwekekuuntqlkvtoc.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoYWh3ZWtla3V1bnRxbGt2dG9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDgzNDUsImV4cCI6MjA2OTUyNDM0NX0.EQtEA-4GqM19vSNEoIF3HgczMEXoelS-o9VyExP2dpw'

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

// Types pour TypeScript basés sur les tables existantes
export type Database = {
  public: {
    Tables: {
      // Utilisation des tables existantes adaptées pour OBS CAISSE
      obs_clients: {
        Row: {
          id: string
          nom: string
          email_contact: string
          created_at: string
          updated_at: string
        }
      }
      obs_stores: {
        Row: {
          id: string
          client_id: string | null
          nom: string
          adresse: string | null
          telephone: string | null
          email: string | null
          created_at: string
          updated_at: string
        }
      }
      obs_products_catalog: {
        Row: {
          id: string
          nom: string
          categorie: 'telephone' | 'accessoire' | 'tablette'
          prix_base: number
          created_at: string
          updated_at: string
        }
      }
      obs_sales: {
        Row: {
          id: string
          store_id: string | null
          cashier_id: string | null
          montant_total: number
          imei: string
          nom_client: string | null
          numero_facture: string | null
          sale_price: number | null
          created_at: string
          updated_at: string
        }
      }
      obs_imei_records: {
        Row: {
          id: string
          imei: string
          product_id: string | null
          store_id: string | null
          statut: 'en_stock' | 'vendu' | 'retourne'
          sale_id: string | null
          created_at: string
          updated_at: string
        }
      }
      obs_subscriptions: {
        Row: {
          id: string
          store_id: string
          date_debut: string
          prochaine_date_paiement: string
          statut: 'active' | 'overdue' | 'locked'
          created_at: string
          updated_at: string
        }
      }
      obs_payments: {
        Row: {
          id: string
          store_id: string
          montant: number
          date_paiement: string
          numero_facture: string
          recu_url: string | null
          created_at: string
          updated_at: string
        }
      }
      obs_notifications: {
        Row: {
          id: string
          store_id: string | null
          message: string
          type: 'payment_reminder' | 'system' | 'warning'
          lu_le: string | null
          created_at: string
        }
      }
      // Tables existantes du système général
      boutiques: {
        Row: {
          id: string
          nom: string
          adresse: string
          telephone: string | null
          email: string | null
          type: 'centrale' | 'boutique'
          statut: 'active' | 'inactive' | 'maintenance'
          manager_id: string | null
          created_at: string
          updated_at: string
        }
      }
      employes: {
        Row: {
          id: string
          nom: string
          prenom: string
          email: string
          telephone: string | null
          poste: 'manager' | 'vendeur' | 'caissier' | 'technicien'
          boutique_id: string | null
          statut: 'actif' | 'inactif' | 'conge'
          salaire: number | null
          date_embauche: string
          created_at: string
          updated_at: string
        }
      }
      produits: {
        Row: {
          id: string
          nom: string
          marque: string
          modele: string
          prix_achat: number
          prix_vente: number
          code_produit: string
          imei: string | null
          categorie_id: string | null
          description: string | null
          couleur: string | null
          stockage: string | null
          etat: 'neuf' | 'reconditionne' | 'occasion'
          created_at: string
          updated_at: string
        }
      }
      stocks: {
        Row: {
          id: string
          produit_id: string | null
          boutique_id: string | null
          quantite: number
          seuil_alerte: number
          emplacement: string | null
          created_at: string
          updated_at: string
        }
      }
      ventes: {
        Row: {
          id: string
          numero_facture: string
          boutique_id: string | null
          employe_id: string | null
          client_nom: string | null
          client_telephone: string | null
          client_email: string | null
          montant_total: number
          montant_tva: number
          mode_paiement: 'especes' | 'carte' | 'cheque' | 'virement'
          statut: 'validee' | 'annulee' | 'remboursee'
          date_vente: string
          client_id: string | null
          created_at: string
          updated_at: string
        }
      }
      categories: {
        Row: {
          id: string
          nom: string
          description: string | null
          created_at: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          employe_id: string | null
          role: 'admin_system' | 'proprietaire' | 'manager' | 'vendeur' | 'caissier'
          pin_code: string | null
          is_active: boolean
          last_login: string | null
          obs_client_id: string | null
          obs_store_id: string | null
          created_at: string
          updated_at: string
        }
      }
    }
  }
}

// Fonctions utilitaires pour adapter les données
export const adaptProductData = (product: any) => ({
  id: product.id,
  name: product.nom,
  brand: product.marque,
  model: product.modele,
  purchase_price: product.prix_achat,
  recommended_price: product.prix_vente,
  sku: product.code_produit,
  imei: product.imei,
  category_id: product.categorie_id,
  description: product.description,
  is_phone: product.imei ? true : false,
  requires_imei: product.imei ? true : false,
  is_active: true,
  created_at: product.created_at,
  updated_at: product.updated_at
})

export const adaptStockData = (stock: any) => ({
  id: stock.id,
  product_id: stock.produit_id,
  boutique_id: stock.boutique_id,
  quantity: stock.quantite,
  min_threshold: stock.seuil_alerte,
  last_updated: stock.updated_at
})

export const adaptBoutiqueData = (boutique: any) => ({
  id: boutique.id,
  name: boutique.nom,
  commercial_name: boutique.nom,
  address: boutique.adresse,
  phone: boutique.telephone,
  email: boutique.email,
  is_central: boutique.type === 'centrale',
  subscription_status: boutique.statut === 'active' ? 'active' : 'suspended',
  created_at: boutique.created_at,
  updated_at: boutique.updated_at
})

export const adaptEmployeData = (employe: any) => ({
  id: employe.id,
  email: employe.email,
  role: employe.poste === 'manager' ? 'manager' : 'cashier',
  boutique_id: employe.boutique_id,
  first_name: employe.prenom,
  last_name: employe.nom,
  phone: employe.telephone,
  is_active: employe.statut === 'actif',
  created_at: employe.created_at,
  updated_at: employe.updated_at
})
