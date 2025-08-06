import React from 'react'

const CartSidebar: React.FC = () => {
  return (
    <div style={{ 
      width: '300px', 
      backgroundColor: '#f5f5f5', 
      padding: '20px',
      borderLeft: '1px solid #ddd'
    }}>
      <h3>🛒 Panier</h3>
      
      <div style={{ marginTop: '20px' }}>
        <p>Panier vide</p>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Ajoutez des produits pour commencer une vente
        </p>
      </div>
      
      <div style={{ 
        marginTop: '30px',
        padding: '15px',
        backgroundColor: 'white',
        borderRadius: '8px'
      }}>
        <h4>💰 Total: 0 FCFA</h4>
        
        <button style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          marginTop: '10px',
          cursor: 'pointer'
        }}>
          Finaliser la vente
        </button>
      </div>
    </div>
  )
}

export default CartSidebar
