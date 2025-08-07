import { supabase } from '../config/supabase';
import { Hotel, Room, Reservation, CheckIn, CheckOut, HotelService as HotelServiceType, ServiceOrder, HotelStats, OccupancyReport, GuestHistory, PassageRate, QuickReservation, CashierReceipt } from '../types/hotel';

export class HotelServiceClass {
  // ==================== GESTION DES HÔTELS ====================
  
  static async createHotel(hotel: Omit<Hotel, 'id' | 'created_at' | 'updated_at'>): Promise<Hotel> {
    const { data, error } = await supabase
      .from('hotels')
      .insert(hotel)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getHotels(establishmentId: string): Promise<Hotel[]> {
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .eq('establishment_id', establishmentId)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  static async updateHotel(id: string, updates: Partial<Hotel>): Promise<Hotel> {
    const { data, error } = await supabase
      .from('hotels')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // ==================== GESTION DES CHAMBRES ====================

  static async createRoom(room: Omit<Room, 'id' | 'created_at' | 'updated_at'>): Promise<Room> {
    const { data, error } = await supabase
      .from('hotel_rooms')
      .insert(room)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getRooms(hotelId: string): Promise<Room[]> {
    const { data, error } = await supabase
      .from('hotel_rooms')
      .select('*')
      .eq('hotel_id', hotelId)
      .order('room_number');

    if (error) throw error;
    return data || [];
  }

  static async updateRoomStatus(roomId: string, status: Room['status']): Promise<Room> {
    const { data, error } = await supabase
      .from('hotel_rooms')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', roomId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAvailableRooms(hotelId: string, checkIn: string, checkOut: string): Promise<Room[]> {
    // Récupérer toutes les chambres de l'hôtel
    const { data: allRooms, error: roomsError } = await supabase
      .from('hotel_rooms')
      .select('*')
      .eq('hotel_id', hotelId)
      .eq('status', 'available');

    if (roomsError) throw roomsError;

    // Récupérer les réservations qui se chevauchent avec les dates demandées
    const { data: conflictingReservations, error: reservationsError } = await supabase
      .from('hotel_reservations')
      .select('room_id')
      .eq('hotel_id', hotelId)
      .in('status', ['confirmed', 'checked_in'])
      .or(`and(check_in_date.lte.${checkOut},check_out_date.gte.${checkIn})`);

    if (reservationsError) throw reservationsError;

    // Filtrer les chambres disponibles
    const occupiedRoomIds = conflictingReservations?.map((r: any) => r.room_id) || [];
    const availableRooms = allRooms?.filter((room: any) => !occupiedRoomIds.includes(room.id)) || [];

    return availableRooms;
  }

  // ==================== GESTION DES RÉSERVATIONS ====================

  static async createReservation(reservation: Omit<Reservation, 'id' | 'created_at' | 'updated_at'>): Promise<Reservation> {
    const { data, error } = await supabase
      .from('hotel_reservations')
      .insert(reservation)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getReservations(hotelId: string, status?: Reservation['status']): Promise<Reservation[]> {
    let query = supabase
      .from('hotel_reservations')
      .select(`
        *,
        hotel_rooms (room_number, room_type)
      `)
      .eq('hotel_id', hotelId)
      .order('check_in_date', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  static async updateReservationStatus(reservationId: string, status: Reservation['status']): Promise<Reservation> {
    const { data, error } = await supabase
      .from('hotel_reservations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', reservationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getTodayArrivals(hotelId: string): Promise<Reservation[]> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('hotel_reservations')
      .select(`
        *,
        hotel_rooms (room_number, room_type)
      `)
      .eq('hotel_id', hotelId)
      .eq('check_in_date', today)
      .in('status', ['confirmed', 'pending']);

    if (error) throw error;
    return data || [];
  }

  static async getTodayDepartures(hotelId: string): Promise<Reservation[]> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('hotel_reservations')
      .select(`
        *,
        hotel_rooms (room_number, room_type)
      `)
      .eq('hotel_id', hotelId)
      .eq('check_out_date', today)
      .eq('status', 'checked_in');

    if (error) throw error;
    return data || [];
  }

  // ==================== CHECK-IN / CHECK-OUT ====================

  static async performCheckIn(checkInData: Omit<CheckIn, 'id' | 'created_at'>): Promise<CheckIn> {
    const { data, error } = await supabase
      .from('hotel_checkins')
      .insert(checkInData)
      .select()
      .single();

    if (error) throw error;

    // Mettre à jour le statut de la réservation
    await this.updateReservationStatus(checkInData.reservation_id, 'checked_in');

    return data;
  }

  static async performCheckOut(checkOutData: Omit<CheckOut, 'id' | 'created_at'>): Promise<CheckOut> {
    const { data, error } = await supabase
      .from('hotel_checkouts')
      .insert(checkOutData)
      .select()
      .single();

    if (error) throw error;

    // Mettre à jour le statut de la réservation
    await this.updateReservationStatus(checkOutData.reservation_id, 'checked_out');

    return data;
  }

  // ==================== SERVICES ADDITIONNELS ====================

  static async createHotelService(service: Omit<HotelServiceType, 'id' | 'created_at' | 'updated_at'>): Promise<HotelServiceType> {
    const { data, error } = await supabase
      .from('hotel_services')
      .insert(service)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getHotelServices(hotelId: string): Promise<HotelServiceType[]> {
    const { data, error } = await supabase
      .from('hotel_services')
      .select('*')
      .eq('hotel_id', hotelId)
      .eq('is_active', true)
      .order('category', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createServiceOrder(order: Omit<ServiceOrder, 'id' | 'created_at'>): Promise<ServiceOrder> {
    const { data, error } = await supabase
      .from('hotel_service_orders')
      .insert(order)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getServiceOrders(reservationId: string): Promise<ServiceOrder[]> {
    const { data, error } = await supabase
      .from('hotel_service_orders')
      .select(`
        *,
        hotel_services (name, category)
      `)
      .eq('reservation_id', reservationId)
      .order('order_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // ==================== STATISTIQUES ET RAPPORTS ====================

  static async getHotelStats(hotelId: string): Promise<HotelStats> {
    // Récupérer les informations de base de l'hôtel
    const { data: hotel, error: hotelError } = await supabase
      .from('hotels')
      .select('total_rooms')
      .eq('id', hotelId)
      .single();

    if (hotelError) throw hotelError;

    // Récupérer les statistiques des chambres
    const { data: roomStats, error: roomStatsError } = await supabase
      .from('hotel_rooms')
      .select('status')
      .eq('hotel_id', hotelId);

    if (roomStatsError) throw roomStatsError;

    const totalRooms = hotel.total_rooms;
    const occupiedRooms = roomStats?.filter((r: any) => r.status === 'occupied').length || 0;
    const availableRooms = roomStats?.filter((r: any) => r.status === 'available').length || 0;
    const maintenanceRooms = roomStats?.filter((r: any) => r.status === 'maintenance').length || 0;

    // Calculer les revenus du jour
    const today = new Date().toISOString().split('T')[0];
    const { data: todayRevenue, error: revenueError } = await supabase
      .from('hotel_checkouts')
      .select('final_bill_amount')
      .gte('created_at', today)
      .lt('created_at', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    if (revenueError) throw revenueError;

    const revenueToday = todayRevenue?.reduce((sum: number, checkout: any) => sum + checkout.final_bill_amount, 0) || 0;

    // Calculer les revenus du mois
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    const { data: monthRevenue, error: monthRevenueError } = await supabase
      .from('hotel_checkouts')
      .select('final_bill_amount')
      .gte('created_at', startOfMonth);

    if (monthRevenueError) throw monthRevenueError;

    const revenueMonth = monthRevenue?.reduce((sum: number, checkout: any) => sum + checkout.final_bill_amount, 0) || 0;

    // Compter les réservations en attente
    const { data: pendingReservations, error: pendingError } = await supabase
      .from('hotel_reservations')
      .select('id')
      .eq('hotel_id', hotelId)
      .eq('status', 'pending');

    if (pendingError) throw pendingError;

    // Compter les arrivées et départs du jour
    const { data: todayArrivals, error: arrivalsError } = await supabase
      .from('hotel_reservations')
      .select('id')
      .eq('hotel_id', hotelId)
      .eq('check_in_date', today)
      .in('status', ['confirmed', 'pending']);

    if (arrivalsError) throw arrivalsError;

    const { data: todayDepartures, error: departuresError } = await supabase
      .from('hotel_reservations')
      .select('id')
      .eq('hotel_id', hotelId)
      .eq('check_out_date', today)
      .eq('status', 'checked_in');

    if (departuresError) throw departuresError;

    return {
      total_rooms: totalRooms,
      occupied_rooms: occupiedRooms,
      available_rooms: availableRooms,
      maintenance_rooms: maintenanceRooms,
      occupancy_rate: totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0,
      average_daily_rate: occupiedRooms > 0 ? revenueToday / occupiedRooms : 0,
      revenue_today: revenueToday,
      revenue_month: revenueMonth,
      pending_reservations: pendingReservations?.length || 0,
      checking_in_today: todayArrivals?.length || 0,
      checking_out_today: todayDepartures?.length || 0,
    };
  }

  static async getOccupancyReport(hotelId: string, startDate: string, endDate: string): Promise<OccupancyReport[]> {
    const { data, error } = await supabase
      .rpc('get_hotel_occupancy_report', {
        hotel_id: hotelId,
        start_date: startDate,
        end_date: endDate
      });

    if (error) throw error;
    return data || [];
  }

  static async getGuestHistory(hotelId: string): Promise<GuestHistory[]> {
    const { data, error } = await supabase
      .rpc('get_guest_history', {
        hotel_id: hotelId
      });

    if (error) throw error;
    return data || [];
  }

  // ==================== RECHERCHE ET FILTRES ====================

  static async searchReservations(hotelId: string, searchTerm: string): Promise<Reservation[]> {
    const { data, error } = await supabase
      .from('hotel_reservations')
      .select(`
        *,
        hotel_rooms (room_number, room_type)
      `)
      .eq('hotel_id', hotelId)
      .or(`guest_name.ilike.%${searchTerm}%,guest_phone.ilike.%${searchTerm}%,guest_email.ilike.%${searchTerm}%`)
      .order('check_in_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getReservationsByDateRange(hotelId: string, startDate: string, endDate: string): Promise<Reservation[]> {
    const { data, error } = await supabase
      .from('hotel_reservations')
      .select(`
        *,
        hotel_rooms (room_number, room_type)
      `)
      .eq('hotel_id', hotelId)
      .gte('check_in_date', startDate)
      .lte('check_out_date', endDate)
      .order('check_in_date');

    if (error) throw error;
    return data || [];
  }

  // ==================== SERVICES DE PASSAGE ====================

  // Méthode pour obtenir les chambres disponibles pour les services de passage (sans vérification de dates)
  static async getAvailableRoomsForPassage(hotelId: string): Promise<Room[]> {
    const { data, error } = await supabase
      .from('hotel_rooms')
      .select('*')
      .eq('hotel_id', hotelId)
      .eq('status', 'available')
      .order('room_number');

    if (error) throw error;
    return data || [];
  }

  static async getPassageRates(hotelId: string): Promise<PassageRate[]> {
    const { data, error } = await supabase
      .from('hotel_passage_rates')
      .select('*')
      .eq('hotel_id', hotelId)
      .eq('is_active', true)
      .order('room_type', { ascending: true })
      .order('duration_hours', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createPassageRate(rate: Omit<PassageRate, 'id' | 'created_at' | 'updated_at'>): Promise<PassageRate> {
    const { data, error } = await supabase
      .from('hotel_passage_rates')
      .insert(rate)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getActivePassageReservations(hotelId: string): Promise<QuickReservation[]> {
    const { data, error } = await supabase
      .from('hotel_quick_reservations')
      .select('*')
      .eq('hotel_id', hotelId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createQuickReservation(reservation: Omit<QuickReservation, 'id' | 'created_at' | 'updated_at'>): Promise<QuickReservation> {
    const { data, error } = await supabase
      .from('hotel_quick_reservations')
      .insert(reservation)
      .select()
      .single();

    if (error) throw error;

    // Mettre à jour le statut de la chambre
    await supabase
      .from('hotel_rooms')
      .update({ status: 'occupied' })
      .eq('id', reservation.room_id);

    return data;
  }

  static async completePassageReservation(reservationId: string): Promise<void> {
    const { data: reservation, error: fetchError } = await supabase
      .from('hotel_quick_reservations')
      .select('room_id')
      .eq('id', reservationId)
      .single();

    if (fetchError) throw fetchError;

    // Marquer la réservation comme terminée
    const { error: updateError } = await supabase
      .from('hotel_quick_reservations')
      .update({ status: 'completed' })
      .eq('id', reservationId);

    if (updateError) throw updateError;

    // Libérer la chambre
    await supabase
      .from('hotel_rooms')
      .update({ status: 'cleaning' })
      .eq('id', reservation.room_id);
  }

  static async createCashierReceipt(receipt: Omit<CashierReceipt, 'id'>): Promise<CashierReceipt> {
    const { data, error } = await supabase
      .from('hotel_cashier_receipts')
      .insert(receipt)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getCashierReceipts(hotelId: string, date?: string): Promise<CashierReceipt[]> {
    let query = supabase
      .from('hotel_cashier_receipts')
      .select('*')
      .order('created_at', { ascending: false });

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      query = query
        .gte('created_at', startDate.toISOString())
        .lt('created_at', endDate.toISOString());
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }
}
