import React from 'react'

const PaymentDialog: React.FC = () => {
  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        width: '400px',
        maxWidth: '90vw'
      }}>
        <h3>💳 Finaliser le Paiement</h3>
        
        <div style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Montant Total:
            </label>
            <div style={{ 
              padding: '10px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#4CAF50'
            }}>
              0 FCFA
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Mode de Paiement:
            </label>
            <select style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}>
              <option value="cash">💵 Espèces</option>
              <option value="card">💳 Carte</option>
              <option value="mobile">📱 Mobile Money</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Montant Reçu:
            </label>
            <input 
              type="number" 
              placeholder="Entrez le montant reçu"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '10px',
          justifyContent: 'flex-end'
        }}>
          <button style={{
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            ❌ Annuler
          </button>
          
          <button style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            ✅ Confirmer
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentDialog
