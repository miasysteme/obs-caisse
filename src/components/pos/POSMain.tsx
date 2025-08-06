import React from 'react'
import ProductGrid from './ProductGrid'
import CartSidebar from './CartSidebar'

const POSMain: React.FC = () => {
  return (
    <div style={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#2196F3',
        color: 'white',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2>🏪 OBS CAISSE - Point de Vente</h2>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span>👤 Utilisateur</span>
          <button style={{
            padding: '8px 16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            🚪 Déconnexion
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div style={{ 
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
      }}>
        <ProductGrid />
        <CartSidebar />
      </div>
      
      {/* Footer */}
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '10px 20px',
        borderTop: '1px solid #ddd',
        textAlign: 'center',
        color: '#666'
      }}>
        <p>OBS CAISSE v1.0 - La Maison des Téléphones</p>
      </div>
    </div>
  )
}

export default POSMain
