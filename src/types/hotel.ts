export interface Hotel {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  stars: 1 | 2 | 3 | 4 | 5;
  total_rooms: number;
  establishment_id: string;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  hotel_id: string;
  room_number: string;
  room_type: 'single' | 'double' | 'suite' | 'family' | 'deluxe';
  floor: number;
  capacity: number;
  base_price: number;
  amenities: string[];
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  hotel_id: string;
  room_id: string;
  guest_name: string;
  guest_phone: string;
  guest_email?: string;
  guest_id_number?: string;
  check_in_date: string;
  check_out_date: string;
  adults: number;
  children: number;
  total_nights: number;
  room_rate: number;
  total_amount: number;
  deposit_paid: number;
  balance_due: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
  special_requests?: string;
  payment_method?: 'cash' | 'card' | 'transfer' | 'mobile_money';
  // Nouveaux champs pour les services de passage
  reservation_type: 'overnight' | 'hourly' | 'rest'; // Nuitée, Passage horaire, Repos
  duration_hours?: number; // Durée en heures pour les passages
  hourly_rate?: number; // Tarif horaire
  rest_period?: 'half_day' | 'quarter_day' | 'custom'; // Période de repos
  is_quick_service: boolean; // Service rapide pour caisse
  receipt_printed: boolean; // Reçu imprimé
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CheckIn {
  id: string;
  reservation_id: string;
  actual_check_in: string;
  key_card_number?: string;
  deposit_collected: number;
  id_document_verified: boolean;
  additional_guests?: string[];
  notes?: string;
  checked_in_by: string;
  created_at: string;
}

export interface CheckOut {
  id: string;
  reservation_id: string;
  actual_check_out: string;
  room_condition: 'excellent' | 'good' | 'fair' | 'damaged';
  minibar_charges: number;
  phone_charges: number;
  laundry_charges: number;
  other_charges: number;
  total_additional_charges: number;
  final_bill_amount: number;
  payment_received: number;
  payment_method: 'cash' | 'card' | 'transfer' | 'mobile_money';
  key_card_returned: boolean;
  damage_notes?: string;
  checked_out_by: string;
  created_at: string;
}

export interface HotelService {
  id: string;
  hotel_id: string;
  name: string;
  category: 'food' | 'laundry' | 'transport' | 'spa' | 'conference' | 'other';
  price: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceOrder {
  id: string;
  reservation_id: string;
  service_id: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  order_date: string;
  delivery_date?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  ordered_by: string;
  created_at: string;
}

export interface HotelStats {
  total_rooms: number;
  occupied_rooms: number;
  available_rooms: number;
  maintenance_rooms: number;
  occupancy_rate: number;
  average_daily_rate: number;
  revenue_today: number;
  revenue_month: number;
  pending_reservations: number;
  checking_in_today: number;
  checking_out_today: number;
}

export interface OccupancyReport {
  date: string;
  total_rooms: number;
  occupied_rooms: number;
  occupancy_rate: number;
  revenue: number;
  average_rate: number;
}

export interface GuestHistory {
  guest_name: string;
  guest_phone: string;
  guest_email?: string;
  total_stays: number;
  total_nights: number;
  total_spent: number;
  last_stay: string;
  preferred_room_type?: string;
  loyalty_status: 'new' | 'regular' | 'vip';
}

// Nouveaux types pour les services de passage
export interface PassageRate {
  id: string;
  hotel_id: string;
  room_type: 'single' | 'double' | 'suite' | 'family' | 'deluxe';
  rate_type: 'hourly' | 'rest_period';
  duration_hours: number;
  price: number;
  description: string; // Ex: "1 heure", "Repos 4h", "Demi-journée"
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuickReservation {
  id: string;
  hotel_id: string;
  room_id: string;
  guest_name: string;
  guest_phone: string;
  reservation_type: 'hourly' | 'rest';
  duration_hours: number;
  start_time: string;
  end_time: string;
  rate_applied: number;
  total_amount: number;
  payment_method: 'cash' | 'card' | 'mobile_money';
  payment_received: number;
  receipt_number: string;
  status: 'active' | 'completed' | 'cancelled';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CashierReceipt {
  id: string;
  receipt_number: string;
  hotel_name: string;
  room_number: string;
  guest_name: string;
  guest_phone: string;
  service_type: string; // "Passage 1h", "Repos 4h", etc.
  start_time: string;
  end_time: string;
  amount: number;
  payment_method: string;
  cashier_name: string;
  created_at: string;
}
