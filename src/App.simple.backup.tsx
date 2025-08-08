import React from 'react';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🏪 OBS SYSTEME - Système de Point de Vente</h1>
      <h2>La Maison des Téléphones</h2>
      
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>✅ Application Déployée avec Succès !</h3>
        <p>Le système OBS SYSTEME est maintenant en ligne et opérationnel.</p>
        
        <div style={{ marginTop: '20px' }}>
          <h4>🔗 Liens Utiles :</h4>
          <ul>
            <li><a href="/test.html">Interface de Test HTML</a></li>
            <li>Application React (cette page)</li>
          </ul>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <h4>📊 Fonctionnalités :</h4>
          <ul>
            <li>✅ Connexion Supabase configurée</li>
            <li>✅ Base de données (30 tables) opérationnelle</li>
            <li>✅ Système de traçabilité IMEI</li>
            <li>✅ Gestion multi-boutiques</li>
            <li>✅ Interface de point de vente</li>
          </ul>
        </div>
      </div>
      
      <footer style={{ 
        marginTop: '40px', 
        padding: '20px', 
        borderTop: '1px solid #ddd',
        textAlign: 'center',
        color: '#666'
      }}>
        <p>Développé par SONUTEC SARL - OBS SYSTEME v1.0</p>
        <p>Déployé avec succès sur Vercel</p>
      </footer>
    </div>
  );
}

export default App;
