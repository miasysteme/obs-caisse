import React, { useState, useEffect } from 'react';
import { supabase } from './config/supabase';

interface TestData {
  clients: any[];
  stores: any[];
  products: any[];
  sales: any[];
}

const AppTest: React.FC = () => {
  const [data, setData] = useState<TestData>({
    clients: [],
    stores: [],
    products: [],
    sales: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    loadTestData();
  }, []);

  const loadTestData = async () => {
    try {
      setLoading(true);
      
      // Test de connexion Supabase
      const { data: clients, error: clientsError } = await supabase
        .from('obs_clients')
        .select('*')
        .limit(5);

      if (clientsError) throw clientsError;

      const { data: stores, error: storesError } = await supabase
        .from('obs_stores')
        .select('*')
        .limit(5);

      if (storesError) throw storesError;

      const { data: products, error: productsError } = await supabase
        .from('obs_products_catalog')
        .select('*')
        .limit(5);

      if (productsError) throw productsError;

      const { data: sales, error: salesError } = await supabase
        .from('obs_sales')
        .select('*')
        .limit(5);

      if (salesError) throw salesError;

      setData({
        clients: clients || [],
        stores: stores || [],
        products: products || [],
        sales: sales || []
      });

      setTestResult('✅ Connexion Supabase réussie - Toutes les données chargées');
    } catch (err: any) {
      setError(err.message);
      setTestResult('❌ Erreur de connexion: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTestSale = async () => {
    try {
      const testSale = {
        store_id: data.stores[0]?.id,
        montant_total: 250000,
        imei: 'TEST-REACT-' + Date.now(),
        nom_client: 'Client Test React',
        numero_facture: 'FAC-REACT-' + Date.now(),
        sale_price: 250000
      };

      const { data: newSale, error } = await supabase
        .from('obs_sales')
        .insert([testSale])
        .select()
        .single();

      if (error) throw error;

      setTestResult('✅ Vente créée avec succès: ' + newSale.numero_facture);
      
      // Recharger les données
      loadTestData();
    } catch (err: any) {
      setTestResult('❌ Erreur création vente: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>🔄 OBS CAISSE - Test React</h1>
        <p>Chargement des données...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#1976d2' }}>🚀 OBS CAISSE - Application React</h1>
        <p style={{ color: '#666' }}>Test complet de l'interface React avec Supabase</p>
        <div style={{ 
          padding: '10px', 
          backgroundColor: testResult.includes('✅') ? '#e8f5e8' : '#ffe8e8',
          border: '1px solid ' + (testResult.includes('✅') ? '#4caf50' : '#f44336'),
          borderRadius: '5px',
          margin: '10px 0'
        }}>
          <strong>{testResult}</strong>
        </div>
      </header>

      {error && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#ffebee', 
          border: '1px solid #f44336',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <strong>Erreur:</strong> {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Section Clients */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
          <h3 style={{ color: '#1976d2', marginTop: '0' }}>👥 Clients ({data.clients.length})</h3>
          {data.clients.length > 0 ? (
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {data.clients.map((client, index) => (
                <div key={index} style={{ 
                  padding: '8px', 
                  backgroundColor: '#f5f5f5', 
                  margin: '5px 0',
                  borderRadius: '4px'
                }}>
                  <strong>{client.nom}</strong><br />
                  <small>Email: {client.email}</small>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666' }}>Aucun client trouvé</p>
          )}
        </div>

        {/* Section Boutiques */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
          <h3 style={{ color: '#1976d2', marginTop: '0' }}>🏪 Boutiques ({data.stores.length})</h3>
          {data.stores.length > 0 ? (
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {data.stores.map((store, index) => (
                <div key={index} style={{ 
                  padding: '8px', 
                  backgroundColor: '#f5f5f5', 
                  margin: '5px 0',
                  borderRadius: '4px'
                }}>
                  <strong>{store.nom}</strong><br />
                  <small>Ville: {store.ville}</small>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666' }}>Aucune boutique trouvée</p>
          )}
        </div>

        {/* Section Produits */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
          <h3 style={{ color: '#1976d2', marginTop: '0' }}>📱 Produits ({data.products.length})</h3>
          {data.products.length > 0 ? (
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {data.products.map((product, index) => (
                <div key={index} style={{ 
                  padding: '8px', 
                  backgroundColor: '#f5f5f5', 
                  margin: '5px 0',
                  borderRadius: '4px'
                }}>
                  <strong>{product.nom}</strong><br />
                  <small>Prix: {product.prix?.toLocaleString()} F</small>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666' }}>Aucun produit trouvé</p>
          )}
        </div>

        {/* Section Ventes */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
          <h3 style={{ color: '#1976d2', marginTop: '0' }}>💰 Ventes ({data.sales.length})</h3>
          {data.sales.length > 0 ? (
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {data.sales.map((sale, index) => (
                <div key={index} style={{ 
                  padding: '8px', 
                  backgroundColor: '#f5f5f5', 
                  margin: '5px 0',
                  borderRadius: '4px'
                }}>
                  <strong>{sale.numero_facture}</strong><br />
                  <small>Montant: {sale.montant_total?.toLocaleString()} F</small><br />
                  <small>Client: {sale.nom_client}</small>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666' }}>Aucune vente trouvée</p>
          )}
        </div>
      </div>

      {/* Actions de test */}
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button
          onClick={createTestSale}
          disabled={data.stores.length === 0}
          style={{
            padding: '12px 24px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            marginRight: '10px'
          }}
        >
          🛒 Créer une Vente Test
        </button>
        
        <button
          onClick={loadTestData}
          style={{
            padding: '12px 24px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          🔄 Actualiser les Données
        </button>
      </div>

      {/* Statistiques */}
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#1976d2' }}>📊 Statistiques du Système</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
              {data.clients.length}
            </div>
            <div>Clients</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
              {data.stores.length}
            </div>
            <div>Boutiques</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
              {data.products.length}
            </div>
            <div>Produits</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
              {data.sales.length}
            </div>
            <div>Ventes</div>
          </div>
        </div>
      </div>

      <footer style={{ marginTop: '40px', textAlign: 'center', color: '#666' }}>
        <p>🚀 <strong>OBS CAISSE</strong> - Développé par SONUTEC SARL pour La Maison des Téléphones</p>
        <p>✅ Interface React fonctionnelle - Prête pour production</p>
      </footer>
    </div>
  );
};

export default AppTest;
