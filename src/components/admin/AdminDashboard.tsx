import React from 'react'

const AdminDashboard: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🏪 Administration OBS CAISSE</h1>
      
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>📊 Tableau de Bord Administrateur</h3>
        <p>Interface d'administration simplifiée pour le déploiement.</p>
        
        <div style={{ marginTop: '20px' }}>
          <h4>🔧 Fonctionnalités Disponibles :</h4>
          <ul>
            <li>✅ Gestion des boutiques</li>
            <li>✅ Gestion des utilisateurs</li>
            <li>✅ Gestion des stocks</li>
            <li>✅ Rapports et statistiques</li>
            <li>✅ Configuration système</li>
          </ul>
        </div>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginTop: '30px'
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h4>🏪 Boutiques</h4>
          <p>Gérer les points de vente</p>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h4>👥 Utilisateurs</h4>
          <p>Gestion des comptes</p>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h4>📦 Stocks</h4>
          <p>Inventaire et produits</p>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h4>📊 Rapports</h4>
          <p>Statistiques et analyses</p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
