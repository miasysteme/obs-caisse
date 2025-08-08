import React, { useState, useEffect } from 'react';
import { HotelServiceClass } from '../../../services/hotelService';
import { Hotel, HotelStats, OccupancyReport, GuestHistory, HotelService as HotelServiceType } from '../../../types/hotel';
import HotelDashboard from './HotelDashboard';
import ReservationManager from './ReservationManager';
import RoomManager from './RoomManager';
import PassageService from './PassageService';

interface HotelAdminPanelProps {
  establishmentId: string;
  userId: string;
}

const HotelAdminPanel: React.FC<HotelAdminPanelProps> = ({ establishmentId, userId }) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reservations' | 'rooms' | 'passage' | 'services' | 'reports' | 'settings'>('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHotels();
  }, [establishmentId]);

  const loadHotels = async () => {
    try {
      const hotelsData = await HotelServiceClass.getHotels(establishmentId);
      setHotels(hotelsData);
      if (hotelsData.length > 0 && !selectedHotel) {
        setSelectedHotel(hotelsData[0]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des hôtels:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (hotels.length === 0) {
    return <NoHotelsView onHotelCreated={loadHotels} establishmentId={establishmentId} />;
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec sélection d'hôtel */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🏨 Administration Hôtelière</h1>
            <p className="text-gray-600">Système complet de gestion d'hôtel - OBS SYSTEME</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedHotel?.id || ''}
              onChange={(e) => {
                const hotel = hotels.find(h => h.id === e.target.value);
                setSelectedHotel(hotel || null);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {hotels.map(hotel => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name} ({hotel.stars}⭐)
                </option>
              ))}
            </select>
            <button 
              onClick={() => setActiveTab('settings')}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              + Nouvel hôtel
            </button>
          </div>
        </div>
      </div>

      {selectedHotel && (
        <>
          {/* Navigation par onglets */}
          <div className="bg-white shadow rounded-lg">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                {[
                  { id: 'dashboard', name: 'Tableau de bord', icon: '📊' },
                  { id: 'reservations', name: 'Réservations', icon: '📅' },
                  { id: 'rooms', name: 'Chambres', icon: '🛏️' },
                  { id: 'passage', name: 'Passage Rapide', icon: '🚀' },
                  { id: 'services', name: 'Services', icon: '🛎️' },
                  { id: 'reports', name: 'Rapports', icon: '📈' },
                  { id: 'settings', name: 'Configuration', icon: '⚙️' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.icon} {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'dashboard' && (
                <HotelDashboard 
                  establishmentId={establishmentId}
                  userId={userId}
                />
              )}
              {activeTab === 'reservations' && (
                <ReservationManager 
                  hotelId={selectedHotel.id}
                  hotel={selectedHotel}
                />
              )}
              {activeTab === 'rooms' && (
                <RoomManager 
                  hotelId={selectedHotel.id}
                  hotel={selectedHotel}
                />
              )}
              {activeTab === 'passage' && (
                <PassageService 
                  hotel={selectedHotel}
                  userId={userId}
                />
              )}
              {activeTab === 'services' && (
                <ServicesManager 
                  hotelId={selectedHotel.id}
                  hotel={selectedHotel}
                />
              )}
              {activeTab === 'reports' && (
                <ReportsManager 
                  hotelId={selectedHotel.id}
                  hotel={selectedHotel}
                />
              )}
              {activeTab === 'settings' && (
                <SettingsManager 
                  hotels={hotels}
                  selectedHotel={selectedHotel}
                  establishmentId={establishmentId}
                  onHotelUpdated={loadHotels}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Composant pour l'état sans hôtels
const NoHotelsView: React.FC<{
  onHotelCreated: () => void;
  establishmentId: string;
}> = ({ onHotelCreated, establishmentId }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="text-center py-12">
      <div className="text-gray-500 mb-4">
        <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 3h10M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4M9 21h6" />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">Bienvenue dans le module Hôtellerie</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Commencez par configurer votre premier hôtel pour accéder à toutes les fonctionnalités de gestion hôtelière.
      </p>
      <button
        onClick={() => setShowCreateForm(true)}
        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 text-lg"
      >
        🏨 Créer mon premier hôtel
      </button>

      {showCreateForm && (
        <CreateHotelModal
          establishmentId={establishmentId}
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            onHotelCreated();
          }}
        />
      )}
    </div>
  );
};

// Composant de gestion des services
const ServicesManager: React.FC<{
  hotelId: string;
  hotel: Hotel;
}> = ({ hotelId, hotel }) => {
  const [services, setServices] = useState<HotelServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewService, setShowNewService] = useState(false);

  useEffect(() => {
    loadServices();
  }, [hotelId]);

  const loadServices = async () => {
    try {
      const data = await HotelServiceClass.getHotelServices(hotelId);
      setServices(data);
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des services...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Services de l'hôtel</h2>
          <p className="text-gray-600">{hotel.name} - {services.length} service(s)</p>
        </div>
        <button
          onClick={() => setShowNewService(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Nouveau service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <div key={service.id} className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{service.name}</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {service.category}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-3">{service.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-green-600">
                {new Intl.NumberFormat('fr-FR').format(service.price)} F
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                service.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {service.is_active ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun service configuré</p>
        </div>
      )}

      {showNewService && (
        <NewServiceModal
          hotelId={hotelId}
          onClose={() => setShowNewService(false)}
          onSuccess={() => {
            setShowNewService(false);
            loadServices();
          }}
        />
      )}
    </div>
  );
};

// Composant de gestion des rapports
const ReportsManager: React.FC<{
  hotelId: string;
  hotel: Hotel;
}> = ({ hotelId, hotel }) => {
  const [occupancyData, setOccupancyData] = useState<OccupancyReport[]>([]);
  const [guestHistory, setGuestHistory] = useState<GuestHistory[]>([]);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    try {
      const [occupancy, guests] = await Promise.all([
        HotelServiceClass.getOccupancyReport(hotelId, dateRange.start, dateRange.end),
        HotelServiceClass.getGuestHistory(hotelId)
      ]);
      setOccupancyData(occupancy);
      setGuestHistory(guests);
    } catch (error) {
      console.error('Erreur lors du chargement des rapports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [hotelId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Rapports et Statistiques</h2>
          <p className="text-gray-600">{hotel.name}</p>
        </div>
        <div className="flex space-x-4">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <button
            onClick={loadReports}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Chargement...' : 'Actualiser'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rapport d'occupation */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Taux d'occupation</h3>
          {occupancyData.length > 0 ? (
            <div className="space-y-2">
              {occupancyData.slice(-7).map(day => (
                <div key={day.date} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {new Date(day.date).toLocaleDateString('fr-FR')}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${day.occupancy_rate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{day.occupancy_rate}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucune donnée disponible</p>
          )}
        </div>

        {/* Historique des clients */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Clients fidèles</h3>
          {guestHistory.length > 0 ? (
            <div className="space-y-3">
              {guestHistory.slice(0, 5).map((guest, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{guest.guest_name}</p>
                    <p className="text-sm text-gray-600">{guest.guest_phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{guest.total_stays} séjour(s)</p>
                    <p className="text-xs text-gray-500">
                      {new Intl.NumberFormat('fr-FR').format(guest.total_spent)} F
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucun historique disponible</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Composant de configuration
const SettingsManager: React.FC<{
  hotels: Hotel[];
  selectedHotel: Hotel | null;
  establishmentId: string;
  onHotelUpdated: () => void;
}> = ({ hotels, selectedHotel, establishmentId, onHotelUpdated }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Configuration des hôtels</h2>
          <p className="text-gray-600">{hotels.length} hôtel(s) configuré(s)</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Nouvel hôtel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hotels.map(hotel => (
          <div key={hotel.id} className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{hotel.name}</h3>
              <div className="flex">
                {Array.from({ length: hotel.stars }, (_, i) => (
                  <span key={i} className="text-yellow-400">⭐</span>
                ))}
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Adresse:</strong> {hotel.address}</p>
              <p><strong>Téléphone:</strong> {hotel.phone}</p>
              <p><strong>Email:</strong> {hotel.email}</p>
              <p><strong>Chambres:</strong> {hotel.total_rooms}</p>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                Modifier
              </button>
              <button className="text-red-600 hover:text-red-800 text-sm">
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCreateForm && (
        <CreateHotelModal
          establishmentId={establishmentId}
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            onHotelUpdated();
          }}
        />
      )}
    </div>
  );
};

// Modal de création d'hôtel
const CreateHotelModal: React.FC<{
  establishmentId: string;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ establishmentId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    stars: 3,
    total_rooms: 0
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await HotelServiceClass.createHotel({
        ...formData,
        stars: formData.stars as 1|2|3|4|5,
        establishment_id: establishmentId
      });
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la création de l\'hôtel:', error);
      alert('Erreur lors de la création de l\'hôtel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Créer un nouvel hôtel</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'hôtel *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre d'étoiles
              </label>
              <select
                value={formData.stars}
                onChange={(e) => setFormData({...formData, stars: parseInt(e.target.value) as 1|2|3|4|5})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5].map(star => (
                  <option key={star} value={star}>
                    {star} étoile{star > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre total de chambres
              </label>
              <input
                type="number"
                min="1"
                value={formData.total_rooms}
                onChange={(e) => setFormData({...formData, total_rooms: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
              {loading ? 'Création...' : 'Créer l\'hôtel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal de création de service
const NewServiceModal: React.FC<{
  hotelId: string;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ hotelId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'food' as HotelServiceType['category'],
    price: 0,
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await HotelServiceClass.createHotelService({
        hotel_id: hotelId,
        ...formData,
        is_active: true
      });
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la création du service:', error);
      alert('Erreur lors de la création du service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Nouveau service</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du service *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as HotelServiceType['category']})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="food">Restauration</option>
                <option value="laundry">Blanchisserie</option>
                <option value="transport">Transport</option>
                <option value="spa">Spa/Bien-être</option>
                <option value="conference">Conférence</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix (F CFA) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
              {loading ? 'Création...' : 'Créer le service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HotelAdminPanel;
