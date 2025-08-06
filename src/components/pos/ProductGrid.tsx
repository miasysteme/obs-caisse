import React from 'react'

const ProductGrid: React.FC = () => {
  return (
    <div style={{ 
      flex: 1, 
      padding: '20px',
      backgroundColor: 'white'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3>📱 Produits</h3>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Rechercher un produit..."
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              width: '200px'
            }}
          />
          <button style={{
            padding: '8px 16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            🔍 Rechercher
          </button>
        </div>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '15px'
      }}>
        {/* Produits d'exemple */}
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '15px',
          backgroundColor: '#f9f9f9'
        }}>
          <h4>📱 iPhone 14</h4>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Smartphone Apple
          </p>
          <p style={{ fontWeight: 'bold', color: '#4CAF50' }}>
            850,000 FCFA
          </p>
          <button style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            marginTop: '10px',
            cursor: 'pointer'
          }}>
            ➕ Ajouter
          </button>
        </div>
        
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '15px',
          backgroundColor: '#f9f9f9'
        }}>
          <h4>📱 Samsung Galaxy</h4>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Smartphone Samsung
          </p>
          <p style={{ fontWeight: 'bold', color: '#4CAF50' }}>
            650,000 FCFA
          </p>
          <button style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            marginTop: '10px',
            cursor: 'pointer'
          }}>
            ➕ Ajouter
          </button>
        </div>
        
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '15px',
          backgroundColor: '#f9f9f9'
        }}>
          <h4>🎧 AirPods Pro</h4>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Écouteurs sans fil
          </p>
          <p style={{ fontWeight: 'bold', color: '#4CAF50' }}>
            180,000 FCFA
          </p>
          <button style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            marginTop: '10px',
            cursor: 'pointer'
          }}>
            ➕ Ajouter
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductGrid
