import React, { useState, useEffect } from 'react';
import { HotelServiceClass } from '../../../services/hotelService';
import { Reservation, Room, Hotel } from '../../../types/hotel';

interface ReservationManagerProps {
  hotelId: string;
  hotel: Hotel;
}

const ReservationManager: React.FC<ReservationManagerProps> = ({ hotelId, hotel }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewReservation, setShowNewReservation] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    loadReservations();
  }, [hotelId]);

  useEffect(() => {
    filterReservations();
  }, [reservations, selectedStatus, searchTerm]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await HotelServiceClass.getReservations(hotelId);
      setReservations(data);
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReservations = () => {
    let filtered = reservations;

    // Filtrer par statut
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(r => r.status === selectedStatus);
    }

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.guest_phone.includes(searchTerm) ||
        (r.guest_email && r.guest_email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredReservations(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'checked_in': return 'bg-green-100 text-green-800';
      case 'checked_out': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'checked_in': return 'Arrivé';
      case 'checked_out': return 'Parti';
      case 'cancelled': return 'Annulée';
      case 'no_show': return 'No-show';
      default: return status;
    }
  };

  const handleStatusChange = async (reservationId: string, newStatus: Reservation['status']) => {
    try {
      await HotelServiceClass.updateReservationStatus(reservationId, newStatus);
      await loadReservations();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Gestion des réservations</h2>
          <p className="text-gray-600">{hotel.name} - {filteredReservations.length} réservation(s)</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowNewReservation(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <span className="mr-2">+</span>
            Nouvelle réservation
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rechercher
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nom, téléphone, email..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmées</option>
              <option value="checked_in">Arrivées</option>
              <option value="checked_out">Parties</option>
              <option value="cancelled">Annulées</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('all');
              }}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Liste des réservations */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {filteredReservations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réservation trouvée</h3>
            <p className="text-gray-500">Modifiez vos filtres ou créez une nouvelle réservation</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chambre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.guest_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.guest_phone}
                        </div>
                        {reservation.guest_email && (
                          <div className="text-sm text-gray-500">
                            {reservation.guest_email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Chambre {(reservation as any).hotel_rooms?.room_number || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {(reservation as any).hotel_rooms?.room_type || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(reservation.check_in_date).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-sm text-gray-500">
                        au {new Date(reservation.check_out_date).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-xs text-gray-400">
                        {reservation.total_nights} nuit(s)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {new Intl.NumberFormat('fr-FR').format(reservation.total_amount)} F
                      </div>
                      {reservation.deposit_paid > 0 && (
                        <div className="text-xs text-green-600">
                          Acompte: {new Intl.NumberFormat('fr-FR').format(reservation.deposit_paid)} F
                        </div>
                      )}
                      {reservation.balance_due > 0 && (
                        <div className="text-xs text-red-600">
                          Reste: {new Intl.NumberFormat('fr-FR').format(reservation.balance_due)} F
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                        {getStatusText(reservation.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedReservation(reservation)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Voir
                        </button>
                        {reservation.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(reservation.id, 'checked_in')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Check-in
                          </button>
                        )}
                        {reservation.status === 'checked_in' && (
                          <button
                            onClick={() => handleStatusChange(reservation.id, 'checked_out')}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            Check-out
                          </button>
                        )}
                        {['pending', 'confirmed'].includes(reservation.status) && (
                          <button
                            onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Annuler
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal nouvelle réservation */}
      {showNewReservation && (
        <NewReservationModal
          hotelId={hotelId}
          onClose={() => setShowNewReservation(false)}
          onSuccess={() => {
            setShowNewReservation(false);
            loadReservations();
          }}
        />
      )}

      {/* Modal détails réservation */}
      {selectedReservation && (
        <ReservationDetailsModal
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
          onUpdate={loadReservations}
        />
      )}
    </div>
  );
};

// Modal pour nouvelle réservation
const NewReservationModal: React.FC<{
  hotelId: string;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ hotelId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_phone: '',
    guest_email: '',
    check_in_date: '',
    check_out_date: '',
    adults: 1,
    children: 0,
    room_id: '',
    special_requests: ''
  });
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.check_in_date && formData.check_out_date) {
      loadAvailableRooms();
    }
  }, [formData.check_in_date, formData.check_out_date]);

  const loadAvailableRooms = async () => {
    try {
      const rooms = await HotelServiceClass.getAvailableRooms(
        hotelId,
        formData.check_in_date,
        formData.check_out_date
      );
      setAvailableRooms(rooms);
    } catch (error) {
      console.error('Erreur lors du chargement des chambres:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedRoom = availableRooms.find(r => r.id === formData.room_id);
      if (!selectedRoom) {
        throw new Error('Chambre non sélectionnée');
      }

      const checkIn = new Date(formData.check_in_date);
      const checkOut = new Date(formData.check_out_date);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      const totalAmount = nights * selectedRoom.base_price;

      const reservationData = {
        hotel_id: hotelId,
        room_id: formData.room_id,
        guest_name: formData.guest_name,
        guest_phone: formData.guest_phone,
        guest_email: formData.guest_email || undefined,
        check_in_date: formData.check_in_date,
        check_out_date: formData.check_out_date,
        adults: formData.adults,
        children: formData.children,
        room_rate: selectedRoom.base_price,
        total_amount: totalAmount,
        total_nights: nights,
        deposit_paid: 0,
        balance_due: totalAmount, // Le solde dû est égal au montant total moins l'acompte
        status: 'pending' as const,
        reservation_type: 'overnight' as const,
        is_quick_service: false,
        receipt_printed: false,
        special_requests: formData.special_requests || undefined,
        created_by: 'current-user-id' // À remplacer par l'ID utilisateur réel
      };

      await HotelServiceClass.createReservation(reservationData);
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      alert('Erreur lors de la création de la réservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Nouvelle réservation</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="sr-only">Fermer</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du client *
              </label>
              <input
                type="text"
                required
                value={formData.guest_name}
                onChange={(e) => setFormData({...formData, guest_name: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone *
              </label>
              <input
                type="tel"
                required
                value={formData.guest_phone}
                onChange={(e) => setFormData({...formData, guest_phone: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.guest_email}
              onChange={(e) => setFormData({...formData, guest_email: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date d'arrivée *
              </label>
              <input
                type="date"
                required
                value={formData.check_in_date}
                onChange={(e) => setFormData({...formData, check_in_date: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de départ *
              </label>
              <input
                type="date"
                required
                value={formData.check_out_date}
                onChange={(e) => setFormData({...formData, check_out_date: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adultes
              </label>
              <input
                type="number"
                min="1"
                value={formData.adults}
                onChange={(e) => setFormData({...formData, adults: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enfants
              </label>
              <input
                type="number"
                min="0"
                value={formData.children}
                onChange={(e) => setFormData({...formData, children: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {availableRooms.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chambre disponible *
              </label>
              <select
                required
                value={formData.room_id}
                onChange={(e) => setFormData({...formData, room_id: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner une chambre</option>
                {availableRooms.map(room => (
                  <option key={room.id} value={room.id}>
                    Chambre {room.room_number} - {room.room_type} - {new Intl.NumberFormat('fr-FR').format(room.base_price)} F/nuit
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Demandes spéciales
            </label>
            <textarea
              value={formData.special_requests}
              onChange={(e) => setFormData({...formData, special_requests: e.target.value})}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || availableRooms.length === 0}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer la réservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal détails réservation
const ReservationDetailsModal: React.FC<{
  reservation: Reservation;
  onClose: () => void;
  onUpdate: () => void;
}> = ({ reservation, onClose, onUpdate }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Détails de la réservation</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="sr-only">Fermer</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Client</label>
              <p className="text-sm text-gray-900">{reservation.guest_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone</label>
              <p className="text-sm text-gray-900">{reservation.guest_phone}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Arrivée</label>
              <p className="text-sm text-gray-900">
                {new Date(reservation.check_in_date).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Départ</label>
              <p className="text-sm text-gray-900">
                {new Date(reservation.check_out_date).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Montant total</label>
              <p className="text-sm text-gray-900">
                {new Intl.NumberFormat('fr-FR').format(reservation.total_amount)} F
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Statut</label>
              <p className="text-sm text-gray-900">{reservation.status}</p>
            </div>
          </div>

          {reservation.special_requests && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Demandes spéciales</label>
              <p className="text-sm text-gray-900">{reservation.special_requests}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationManager;
