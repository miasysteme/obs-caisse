import React, { useState, useEffect } from 'react';
import { Hotel, Room, PassageRate, QuickReservation, CashierReceipt } from '../../../types/hotel';
import { HotelServiceClass } from '../../../services/hotelService';

interface PassageServiceProps {
  hotel: Hotel;
  userId: string;
}

const PassageService: React.FC<PassageServiceProps> = ({ hotel, userId }) => {
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [passageRates, setPassageRates] = useState<PassageRate[]>([]);
  const [activeReservations, setActiveReservations] = useState<QuickReservation[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedRate, setSelectedRate] = useState<PassageRate | null>(null);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile_money'>('cash');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [hotel.id]);

  const loadData = async () => {
    try {
      const [rooms, rates, reservations] = await Promise.all([
        HotelServiceClass.getAvailableRoomsForPassage(hotel.id),
        HotelServiceClass.getPassageRates(hotel.id),
        HotelServiceClass.getActivePassageReservations(hotel.id)
      ]);
      setAvailableRooms(rooms);
      setPassageRates(rates);
      setActiveReservations(reservations);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const handleQuickReservation = async () => {
    if (!selectedRoom || !selectedRate || !guestInfo.name || !guestInfo.phone) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + selectedRate.duration_hours * 60 * 60 * 1000);
      
      const reservation: Omit<QuickReservation, 'id' | 'created_at' | 'updated_at'> = {
        hotel_id: hotel.id,
        room_id: selectedRoom.id,
        guest_name: guestInfo.name,
        guest_phone: guestInfo.phone,
        reservation_type: selectedRate.rate_type === 'hourly' ? 'hourly' : 'rest',
        duration_hours: selectedRate.duration_hours,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        rate_applied: selectedRate.price,
        total_amount: selectedRate.price,
        payment_method: paymentMethod,
        payment_received: selectedRate.price,
        receipt_number: generateReceiptNumber(),
        status: 'active',
        created_by: userId
      };

      const newReservation = await HotelServiceClass.createQuickReservation(reservation);
      
      // Générer et imprimer le reçu
      await generateReceipt(newReservation, selectedRoom, selectedRate);
      
      // Réinitialiser le formulaire
      setSelectedRoom(null);
      setSelectedRate(null);
      setGuestInfo({ name: '', phone: '' });
      
      // Recharger les données
      await loadData();
      
      alert('Réservation créée avec succès ! Reçu généré.');
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      alert('Erreur lors de la création de la réservation');
    } finally {
      setLoading(false);
    }
  };

  const generateReceiptNumber = (): string => {
    const now = new Date();
    const timestamp = now.getTime().toString().slice(-6);
    return `REC${timestamp}`;
  };

  const generateReceipt = async (reservation: QuickReservation, room: Room, rate: PassageRate) => {
    const receipt: Omit<CashierReceipt, 'id'> = {
      receipt_number: reservation.receipt_number,
      hotel_name: hotel.name,
      room_number: room.room_number,
      guest_name: reservation.guest_name,
      guest_phone: reservation.guest_phone,
      service_type: rate.description,
      start_time: reservation.start_time,
      end_time: reservation.end_time,
      amount: reservation.total_amount,
      payment_method: reservation.payment_method,
      cashier_name: userId,
      created_at: new Date().toISOString()
    };

    await HotelServiceClass.createCashierReceipt(receipt);
    
    // Ici vous pouvez ajouter la logique d'impression
    printReceipt(receipt);
  };

  const printReceipt = (receipt: Omit<CashierReceipt, 'id'>) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Reçu - ${receipt.receipt_number}</title>
            <style>
              body { font-family: Arial, sans-serif; font-size: 12px; margin: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .info { margin-bottom: 10px; }
              .total { font-weight: bold; font-size: 14px; margin-top: 20px; }
              .footer { text-align: center; margin-top: 30px; font-size: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>${receipt.hotel_name}</h2>
              <p>Reçu de Caisse - ${receipt.receipt_number}</p>
            </div>
            <div class="info">
              <p><strong>Client:</strong> ${receipt.guest_name}</p>
              <p><strong>Téléphone:</strong> ${receipt.guest_phone}</p>
              <p><strong>Chambre:</strong> ${receipt.room_number}</p>
              <p><strong>Service:</strong> ${receipt.service_type}</p>
              <p><strong>Début:</strong> ${new Date(receipt.start_time).toLocaleString('fr-FR')}</p>
              <p><strong>Fin:</strong> ${new Date(receipt.end_time).toLocaleString('fr-FR')}</p>
              <p><strong>Mode de paiement:</strong> ${receipt.payment_method}</p>
            </div>
            <div class="total">
              <p>MONTANT TOTAL: ${new Intl.NumberFormat('fr-FR').format(receipt.amount)} F CFA</p>
            </div>
            <div class="footer">
              <p>Merci de votre visite !</p>
              <p>Caissier: ${receipt.cashier_name}</p>
              <p>Date: ${new Date(receipt.created_at).toLocaleString('fr-FR')}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const completeReservation = async (reservationId: string) => {
    try {
      await HotelServiceClass.completePassageReservation(reservationId);
      await loadData();
      alert('Réservation terminée avec succès');
    } catch (error) {
      console.error('Erreur lors de la finalisation:', error);
      alert('Erreur lors de la finalisation de la réservation');
    }
  };

  const getRoomsByType = (roomType: string) => {
    return availableRooms.filter(room => room.room_type === roomType);
  };

  const getRatesByRoomType = (roomType: string) => {
    return passageRates.filter(rate => rate.room_type === roomType && rate.is_active);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">🚀 Service de Passage Rapide</h2>
        <p className="text-blue-100">Gestion rapide des passages horaires et repos - {hotel.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire de réservation rapide */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Nouvelle Réservation Passage</h3>
          
          <div className="space-y-4">
            {/* Informations client */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du client *
                </label>
                <input
                  type="text"
                  value={guestInfo.name}
                  onChange={(e) => setGuestInfo({...guestInfo, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom complet"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  value={guestInfo.phone}
                  onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Numéro de téléphone"
                />
              </div>
            </div>

            {/* Sélection de chambre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chambre disponible *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableRooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`p-3 border rounded-md text-center transition-colors ${
                      selectedRoom?.id === room.id
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{room.room_number}</div>
                    <div className="text-xs">{room.room_type}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sélection du tarif */}
            {selectedRoom && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarif de passage *
                </label>
                <div className="space-y-2">
                  {getRatesByRoomType(selectedRoom.room_type).map(rate => (
                    <button
                      key={rate.id}
                      onClick={() => setSelectedRate(rate)}
                      className={`w-full p-3 border rounded-md text-left transition-colors ${
                        selectedRate?.id === rate.id
                          ? 'bg-green-50 border-green-500 text-green-700'
                          : 'bg-white border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{rate.description}</div>
                          <div className="text-sm text-gray-500">{rate.duration_hours}h</div>
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          {new Intl.NumberFormat('fr-FR').format(rate.price)} F
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mode de paiement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode de paiement *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'cash', label: '💵 Espèces' },
                  { value: 'card', label: '💳 Carte' },
                  { value: 'mobile_money', label: '📱 Mobile Money' }
                ].map(method => (
                  <button
                    key={method.value}
                    onClick={() => setPaymentMethod(method.value as any)}
                    className={`p-2 border rounded-md text-center transition-colors ${
                      paymentMethod === method.value
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Résumé et validation */}
            {selectedRoom && selectedRate && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium text-gray-900 mb-2">Résumé de la réservation</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Chambre:</span>
                    <span>{selectedRoom.room_number} ({selectedRoom.room_type})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span>{selectedRate.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Durée:</span>
                    <span>{selectedRate.duration_hours}h</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-green-600">
                      {new Intl.NumberFormat('fr-FR').format(selectedRate.price)} F
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleQuickReservation}
              disabled={loading || !selectedRoom || !selectedRate || !guestInfo.name || !guestInfo.phone}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Traitement...' : '🎫 Créer Réservation & Imprimer Reçu'}
            </button>
          </div>
        </div>

        {/* Réservations actives */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">⏰ Réservations Actives</h3>
          
          <div className="space-y-3">
            {activeReservations.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucune réservation active</p>
            ) : (
              activeReservations.map(reservation => {
                const endTime = new Date(reservation.end_time);
                const now = new Date();
                const isExpired = now > endTime;
                const timeRemaining = Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / (1000 * 60)));

                return (
                  <div
                    key={reservation.id}
                    className={`border rounded-lg p-4 ${
                      isExpired ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{reservation.guest_name}</h4>
                        <p className="text-sm text-gray-600">{reservation.guest_phone}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          Chambre {availableRooms.find(r => r.id === reservation.room_id)?.room_number}
                        </div>
                        <div className="text-xs text-gray-500">
                          {reservation.reservation_type === 'hourly' ? 'Passage' : 'Repos'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <span className="text-gray-600">Fin: </span>
                        <span className="font-medium">
                          {new Date(reservation.end_time).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className={`font-medium ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
                        {isExpired ? 'Expiré' : `${timeRemaining} min restantes`}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <span className="text-lg font-bold text-green-600">
                        {new Intl.NumberFormat('fr-FR').format(reservation.total_amount)} F
                      </span>
                      <button
                        onClick={() => completeReservation(reservation.id)}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          isExpired
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isExpired ? 'Finaliser' : 'Terminer'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassageService;
