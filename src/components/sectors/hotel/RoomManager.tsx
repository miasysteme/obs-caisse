import React, { useState, useEffect } from 'react';
import { HotelServiceClass } from '../../../services/hotelService';
import { Room, Hotel } from '../../../types/hotel';

interface RoomManagerProps {
  hotelId: string;
  hotel: Hotel;
}

const RoomManager: React.FC<RoomManagerProps> = ({ hotelId, hotel }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewRoom, setShowNewRoom] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    loadRooms();
  }, [hotelId]);

  useEffect(() => {
    filterRooms();
  }, [rooms, selectedStatus, selectedType]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await HotelServiceClass.getRooms(hotelId);
      setRooms(data);
    } catch (error) {
      console.error('Erreur lors du chargement des chambres:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRooms = () => {
    let filtered = rooms;

    // Filtrer par statut
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(r => r.status === selectedStatus);
    }

    // Filtrer par type
    if (selectedType !== 'all') {
      filtered = filtered.filter(r => r.room_type === selectedType);
    }

    setFilteredRooms(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'cleaning': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'occupied': return 'Occupée';
      case 'maintenance': return 'Maintenance';
      case 'cleaning': return 'Nettoyage';
      default: return status;
    }
  };

  const getRoomTypeText = (type: string) => {
    switch (type) {
      case 'single': return 'Simple';
      case 'double': return 'Double';
      case 'suite': return 'Suite';
      case 'family': return 'Familiale';
      case 'deluxe': return 'Deluxe';
      default: return type;
    }
  };

  const handleStatusChange = async (roomId: string, newStatus: Room['status']) => {
    try {
      await HotelServiceClass.updateRoomStatus(roomId, newStatus);
      await loadRooms();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const getRoomStats = () => {
    const stats = {
      total: rooms.length,
      available: rooms.filter(r => r.status === 'available').length,
      occupied: rooms.filter(r => r.status === 'occupied').length,
      maintenance: rooms.filter(r => r.status === 'maintenance').length,
      cleaning: rooms.filter(r => r.status === 'cleaning').length,
    };
    return stats;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = getRoomStats();

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Gestion des chambres</h2>
            <p className="text-gray-600">{hotel.name} - {stats.total} chambre(s)</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setShowNewRoom(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
            >
              <span className="mr-2">+</span>
              Nouvelle chambre
            </button>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <div className="text-sm text-gray-600">Disponibles</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{stats.occupied}</div>
            <div className="text-sm text-gray-600">Occupées</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.maintenance}</div>
            <div className="text-sm text-gray-600">Maintenance</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.cleaning}</div>
            <div className="text-sm text-gray-600">Nettoyage</div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <option value="available">Disponibles</option>
              <option value="occupied">Occupées</option>
              <option value="maintenance">Maintenance</option>
              <option value="cleaning">Nettoyage</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de chambre
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les types</option>
              <option value="single">Simple</option>
              <option value="double">Double</option>
              <option value="suite">Suite</option>
              <option value="family">Familiale</option>
              <option value="deluxe">Deluxe</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedStatus('all');
                setSelectedType('all');
              }}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Grille des chambres */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedRoom(room)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className="text-2xl mr-2">🛏️</span>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Chambre {room.room_number}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Étage {room.floor}
                  </p>
                </div>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.status)}`}>
                {getStatusText(room.status)}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{getRoomTypeText(room.room_type)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Capacité:</span>
                <span className="font-medium">{room.capacity} personne(s)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Prix:</span>
                <span className="font-medium text-green-600">
                  {new Intl.NumberFormat('fr-FR').format(room.base_price)} F/nuit
                </span>
              </div>
            </div>

            {room.amenities && Array.isArray(room.amenities) && room.amenities.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-gray-600 mb-1">Équipements:</p>
                <div className="flex flex-wrap gap-1">
                  {room.amenities.slice(0, 3).map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                    >
                      {amenity}
                    </span>
                  ))}
                  {room.amenities.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{room.amenities.length - 3} autres
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Actions rapides */}
            <div className="mt-4 pt-3 border-t">
              <div className="flex space-x-2">
                {room.status === 'occupied' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(room.id, 'cleaning');
                    }}
                    className="flex-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                  >
                    Nettoyage
                  </button>
                )}
                {room.status === 'cleaning' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(room.id, 'available');
                    }}
                    className="flex-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                  >
                    Disponible
                  </button>
                )}
                {room.status === 'available' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(room.id, 'maintenance');
                    }}
                    className="flex-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200"
                  >
                    Maintenance
                  </button>
                )}
                {room.status === 'maintenance' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(room.id, 'available');
                    }}
                    className="flex-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                  >
                    Réparer
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 3h10M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4M9 21h6" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune chambre trouvée</h3>
          <p className="text-gray-500">Modifiez vos filtres ou ajoutez une nouvelle chambre</p>
        </div>
      )}

      {/* Modal nouvelle chambre */}
      {showNewRoom && (
        <NewRoomModal
          hotelId={hotelId}
          onClose={() => setShowNewRoom(false)}
          onSuccess={() => {
            setShowNewRoom(false);
            loadRooms();
          }}
        />
      )}

      {/* Modal détails chambre */}
      {selectedRoom && (
        <RoomDetailsModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onUpdate={loadRooms}
        />
      )}
    </div>
  );
};

// Modal pour nouvelle chambre
const NewRoomModal: React.FC<{
  hotelId: string;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ hotelId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    room_number: '',
    room_type: 'double' as Room['room_type'],
    floor: 1,
    capacity: 2,
    base_price: 0,
    amenities: [] as string[],
    description: ''
  });
  const [amenityInput, setAmenityInput] = useState('');
  const [loading, setLoading] = useState(false);

  const addAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenityInput.trim()]
      });
      setAmenityInput('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter(a => a !== amenity)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const roomData = {
        hotel_id: hotelId,
        room_number: formData.room_number,
        room_type: formData.room_type,
        floor: formData.floor,
        capacity: formData.capacity,
        base_price: formData.base_price,
        amenities: formData.amenities,
        description: formData.description || undefined,
        status: 'available' as const
      };

      await HotelServiceClass.createRoom(roomData);
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la création de la chambre:', error);
      alert('Erreur lors de la création de la chambre');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Nouvelle chambre</h3>
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
                Numéro de chambre *
              </label>
              <input
                type="text"
                required
                value={formData.room_number}
                onChange={(e) => setFormData({...formData, room_number: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de chambre *
              </label>
              <select
                required
                value={formData.room_type}
                onChange={(e) => setFormData({...formData, room_type: e.target.value as Room['room_type']})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="single">Simple</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
                <option value="family">Familiale</option>
                <option value="deluxe">Deluxe</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Étage
              </label>
              <input
                type="number"
                min="1"
                value={formData.floor}
                onChange={(e) => setFormData({...formData, floor: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacité
              </label>
              <input
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix de base (F CFA) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.base_price}
                onChange={(e) => setFormData({...formData, base_price: parseFloat(e.target.value)})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Équipements
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                placeholder="Ajouter un équipement..."
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addAmenity}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Ajouter
              </button>
            </div>
            {formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(amenity)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
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
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer la chambre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal détails chambre
const RoomDetailsModal: React.FC<{
  room: Room;
  onClose: () => void;
  onUpdate: () => void;
}> = ({ room, onClose, onUpdate }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Détails - Chambre {room.room_number}
          </h3>
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
              <label className="block text-sm font-medium text-gray-700">Numéro</label>
              <p className="text-sm text-gray-900">{room.room_number}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <p className="text-sm text-gray-900">{room.room_type}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Étage</label>
              <p className="text-sm text-gray-900">{room.floor}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Capacité</label>
              <p className="text-sm text-gray-900">{room.capacity} personne(s)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prix</label>
              <p className="text-sm text-gray-900">
                {new Intl.NumberFormat('fr-FR').format(room.base_price)} F/nuit
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Statut</label>
            <p className="text-sm text-gray-900">{room.status}</p>
          </div>

          {room.amenities && Array.isArray(room.amenities) && room.amenities.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Équipements</label>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {room.description && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <p className="text-sm text-gray-900">{room.description}</p>
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

export default RoomManager;
