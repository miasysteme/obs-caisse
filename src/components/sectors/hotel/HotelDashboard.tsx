import React, { useState, useEffect } from 'react';
import { HotelServiceClass } from '../../../services/hotelService';
import { Hotel, HotelStats, Reservation } from '../../../types/hotel';

interface HotelDashboardProps {
  establishmentId: string;
  userId: string;
}

const HotelDashboard: React.FC<HotelDashboardProps> = ({ establishmentId, userId }) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [stats, setStats] = useState<HotelStats | null>(null);
  const [todayArrivals, setTodayArrivals] = useState<Reservation[]>([]);
  const [todayDepartures, setTodayDepartures] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reservations' | 'rooms' | 'services' | 'reports'>('dashboard');

  useEffect(() => {
    loadHotels();
  }, [establishmentId]);

  useEffect(() => {
    if (selectedHotel) {
      loadHotelData();
    }
  }, [selectedHotel]);

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

  const loadHotelData = async () => {
    if (!selectedHotel) return;

    try {
      const [statsData, arrivalsData, departuresData] = await Promise.all([
        HotelServiceClass.getHotelStats(selectedHotel.id),
        HotelServiceClass.getTodayArrivals(selectedHotel.id),
        HotelServiceClass.getTodayDepartures(selectedHotel.id)
      ]);

      setStats(statsData);
      setTodayArrivals(arrivalsData);
      setTodayDepartures(departuresData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
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
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 3h10M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4M9 21h6" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun hôtel configuré</h3>
        <p className="text-gray-500 mb-4">Commencez par ajouter votre premier hôtel</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Ajouter un hôtel
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec sélection d'hôtel */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🏨 Gestion Hôtelière</h1>
            <p className="text-gray-600">Système complet de gestion d'hôtel</p>
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
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              + Nouvel hôtel
            </button>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'dashboard', name: 'Tableau de bord', icon: '📊' },
              { id: 'reservations', name: 'Réservations', icon: '📅' },
              { id: 'rooms', name: 'Chambres', icon: '🛏️' },
              { id: 'services', name: 'Services', icon: '🛎️' },
              { id: 'reports', name: 'Rapports', icon: '📈' }
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
            <DashboardTab 
              stats={stats} 
              todayArrivals={todayArrivals} 
              todayDepartures={todayDepartures}
              selectedHotel={selectedHotel}
            />
          )}
          {activeTab === 'reservations' && (
            <ReservationsTab hotelId={selectedHotel?.id || ''} />
          )}
          {activeTab === 'rooms' && (
            <RoomsTab hotelId={selectedHotel?.id || ''} />
          )}
          {activeTab === 'services' && (
            <ServicesTab hotelId={selectedHotel?.id || ''} />
          )}
          {activeTab === 'reports' && (
            <ReportsTab hotelId={selectedHotel?.id || ''} />
          )}
        </div>
      </div>
    </div>
  );
};

// Composant Dashboard Tab
const DashboardTab: React.FC<{
  stats: HotelStats | null;
  todayArrivals: Reservation[];
  todayDepartures: Reservation[];
  selectedHotel: Hotel | null;
}> = ({ stats, todayArrivals, todayDepartures, selectedHotel }) => {
  if (!stats || !selectedHotel) {
    return <div>Chargement des statistiques...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-bold">🏨</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Taux d'occupation</p>
              <p className="text-2xl font-bold text-blue-900">
                {stats.occupancy_rate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-600 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-bold">💰</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Revenus aujourd'hui</p>
              <p className="text-2xl font-bold text-green-900">
                {new Intl.NumberFormat('fr-FR').format(stats.revenue_today)} F
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-600 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-bold">📅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600">Arrivées aujourd'hui</p>
              <p className="text-2xl font-bold text-yellow-900">
                {stats.checking_in_today}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-bold">🚪</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Départs aujourd'hui</p>
              <p className="text-2xl font-bold text-purple-900">
                {stats.checking_out_today}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* État des chambres */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">État des chambres</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.available_rooms}</div>
            <div className="text-sm text-gray-600">Disponibles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.occupied_rooms}</div>
            <div className="text-sm text-gray-600">Occupées</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.maintenance_rooms}</div>
            <div className="text-sm text-gray-600">Maintenance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total_rooms}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
      </div>

      {/* Arrivées et départs du jour */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Arrivées aujourd'hui ({todayArrivals.length})
          </h3>
          <div className="space-y-3">
            {todayArrivals.slice(0, 5).map(arrival => (
              <div key={arrival.id} className="flex items-center justify-between p-3 bg-green-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">{arrival.guest_name}</p>
                  <p className="text-sm text-gray-600">Chambre {(arrival as any).hotel_rooms?.room_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">{arrival.status}</p>
                  <p className="text-xs text-gray-500">{arrival.adults} adulte(s)</p>
                </div>
              </div>
            ))}
            {todayArrivals.length === 0 && (
              <p className="text-gray-500 text-center py-4">Aucune arrivée prévue</p>
            )}
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Départs aujourd'hui ({todayDepartures.length})
          </h3>
          <div className="space-y-3">
            {todayDepartures.slice(0, 5).map(departure => (
              <div key={departure.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">{departure.guest_name}</p>
                  <p className="text-sm text-gray-600">Chambre {(departure as any).hotel_rooms?.room_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-600">{departure.status}</p>
                  <p className="text-xs text-gray-500">{departure.total_nights} nuit(s)</p>
                </div>
              </div>
            ))}
            {todayDepartures.length === 0 && (
              <p className="text-gray-500 text-center py-4">Aucun départ prévu</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <span className="text-2xl mb-2">📝</span>
            <span className="text-sm font-medium">Nouvelle réservation</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <span className="text-2xl mb-2">✅</span>
            <span className="text-sm font-medium">Check-in</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <span className="text-2xl mb-2">🚪</span>
            <span className="text-sm font-medium">Check-out</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <span className="text-2xl mb-2">🛎️</span>
            <span className="text-sm font-medium">Commander service</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Composants pour les autres onglets (à implémenter)
const ReservationsTab: React.FC<{ hotelId: string }> = ({ hotelId }) => {
  return <div>Gestion des réservations - À implémenter</div>;
};

const RoomsTab: React.FC<{ hotelId: string }> = ({ hotelId }) => {
  return <div>Gestion des chambres - À implémenter</div>;
};

const ServicesTab: React.FC<{ hotelId: string }> = ({ hotelId }) => {
  return <div>Gestion des services - À implémenter</div>;
};

const ReportsTab: React.FC<{ hotelId: string }> = ({ hotelId }) => {
  return <div>Rapports et statistiques - À implémenter</div>;
};

export default HotelDashboard;
