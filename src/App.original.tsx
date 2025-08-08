import React from 'react';

function App() {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <header style={{
        textAlign: 'center',
        marginBottom: '40px',
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#2196F3', marginBottom: '10px' }}>
          🏪 OBS SYSTEME - Système de Point de Vente
        </h1>
        <h2 style={{ color: '#666', fontWeight: 'normal' }}>
          La Maison des Téléphones - SONUTEC SARL
        </h2>
        <p style={{ color: '#4CAF50', fontWeight: 'bold', fontSize: '18px' }}>
          ✅ Application Déployée avec Succès !
        </p>
        <p style={{ color: '#666' }}>
          Le système OBS SYSTEME est maintenant en ligne et opérationnel.
        </p>
      </header>

      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h3 style={{ color: '#333', marginBottom: '20px' }}>🔗 Liens Utiles :</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '15px' }}>
            <a 
              href="/test.html" 
              style={{
                display: 'inline-block',
                padding: '12px 20px',
                backgroundColor: '#2196F3',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: 'bold'
              }}
            >
              🧪 Interface de Test HTML
            </a>
            <span style={{ marginLeft: '10px', color: '#666' }}>
              - Test de connexion Supabase
            </span>
          </li>
          <li style={{ marginBottom: '15px' }}>
            <a 
              href="/multitenant.html" 
              style={{
                display: 'inline-block',
                padding: '12px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: 'bold'
              }}
            >
              🏢 Interface Multi-Tenant
            </a>
            <span style={{ marginLeft: '10px', color: '#666' }}>
              - Sélecteur de secteurs d'activité
            </span>
          </li>
          <li>
            <span style={{
              display: 'inline-block',
              padding: '12px 20px',
              backgroundColor: '#ff9800',
              color: 'white',
              borderRadius: '5px',
              fontWeight: 'bold'
            }}>
              ⚛️ Application React (cette page)
            </span>
            <span style={{ marginLeft: '10px', color: '#666' }}>
              - Interface principale
            </span>
          </li>
        </ul>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h3 style={{ color: '#333', marginBottom: '20px' }}>📋 Fonctionnalités :</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <strong style={{ color: '#4CAF50' }}>✅ Connexion Supabase configurée</strong>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <strong style={{ color: '#4CAF50' }}>✅ Base de données (30 tables) opérationnelle</strong>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <strong style={{ color: '#4CAF50' }}>✅ Système de traçabilité IMEI</strong>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <strong style={{ color: '#4CAF50' }}>✅ Gestion multi-boutiques</strong>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <strong style={{ color: '#4CAF50' }}>✅ Interface de point de vente</strong>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <strong style={{ color: '#2196F3' }}>🆕 Architecture Multi-Tenant</strong>
          </div>
        </div>
      </div>

      <footer style={{
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#333',
        color: 'white',
        borderRadius: '10px'
      }}>
        <p style={{ margin: '5px 0' }}>
          Développé par <strong>SONUTEC SARL</strong> - OBS SYSTEME v2.0
        </p>
        <p style={{ margin: '5px 0', fontSize: '14px', opacity: 0.8 }}>
          Déployé avec succès sur Vercel | Base de données Supabase
        </p>
        <p style={{ margin: '5px 0', fontSize: '14px', opacity: 0.8 }}>
          🚀 Architecture Multi-Tenant | 🔒 Sécurité RLS | ⚡ Performance Optimisée
        </p>
      </footer>
    </div>
  );
}

export default App;
