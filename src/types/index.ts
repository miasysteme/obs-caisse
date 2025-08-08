// Types pour l'application OBS SYSTEME

export interface User {
  id: string;
  email: string;
  role: 'admin_master' | 'admin_central' | 'manager' | 'cashier';
  boutique_id?: string;
  boutique_name?: string;
}

export interface Product {
  id: string;
  nom: string;
  categorie: 'telephone' | 'accessoire' | 'tablette';
  prix_base: number;
  created_at?: string;
  updated_at?: string;
}

export interface Store {
  id: string;
  client_id?: string;
  nom: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Sale {
  id: string;
  store_id?: string;
  cashier_id?: string;
  montant_total: number;
  imei: string;
  nom_client?: string;
  numero_facture?: string;
  sale_price?: number;
  created_at?: string;
  updated_at?: string;
}

export interface IMEIRecord {
  id: string;
  imei: string;
  product_id?: string;
  store_id?: string;
  statut: 'en_stock' | 'vendu' | 'retourne';
  sale_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Subscription {
  id: string;
  store_id: string;
  date_debut: string;
  prochaine_date_paiement: string;
  statut: 'active' | 'overdue' | 'locked';
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  imei?: string;
  requires_imei: boolean;
}

export interface Customer {
  name: string;
  phone: string;
}

export interface SaleTotal {
  subtotal: number;
  taxAmount: number;
  total: number;
}
