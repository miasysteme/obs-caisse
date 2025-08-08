import React, { useState, useEffect } from 'react'
import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material'

interface CustomerDisplayItem {
  name: string
  quantity: number
  unit_price: number
  total_price: number
}

interface CustomerDisplayData {
  items: CustomerDisplayItem[]
  subtotal: number
  tax_amount: number
  total: number
  boutique_name: string
  logo_url?: string
}

export const CustomerDisplay: React.FC = () => {
  const [displayData, setDisplayData] = useState<CustomerDisplayData | null>(null)
  const [showPromotion, setShowPromotion] = useState<string | null>(null)
  const [showThankYou, setShowThankYou] = useState(false)

  useEffect(() => {
    // Écouter les messages du POS principal
    const handleMessage = (event: MessageEvent) => {
      const { type, data } = event.data

      switch (type) {
        case 'UPDATE_DISPLAY':
          setDisplayData(data)
          setShowPromotion(null)
          setShowThankYou(false)
          break
        case 'SHOW_PROMOTION':
          setShowPromotion(data.message)
          break
        case 'SHOW_THANK_YOU':
          setShowThankYou(true)
          break
        case 'RESET_DISPLAY':
          setShowPromotion(null)
          setShowThankYou(false)
          break
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' F'
  }

  // Écran de promotion
  if (showPromotion) {
    return (
      <Box
        sx={{
          height: '100vh',
          background: 'linear-gradient(135deg, #f59e0b, #f97316)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          p: 4
        }}
      >
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
        >
          {showPromotion}
        </Typography>
      </Box>
    )
  }

  // Écran de remerciement
  if (showThankYou) {
    return (
      <Box
        sx={{
          height: '100vh',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          p: 4
        }}
      >
        <Typography variant="h1" sx={{ fontSize: '120px', mb: 3 }}>
          ✓
        </Typography>
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          Merci de votre achat !
        </Typography>
        <Typography variant="h5" sx={{ opacity: 0.9 }}>
          À bientôt chez nous
        </Typography>
      </Box>
    )
  }

  // Écran principal
  return (
    <Box
      sx={{
        height: '100vh',
        background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* En-tête */}
      <Box sx={{ textAlign: 'center', p: 4, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          {displayData?.boutique_name || 'OBS SYSTEME'}
        </Typography>
        <Typography variant="h5" sx={{ opacity: 0.8 }}>
          Bienvenue chez nous !
        </Typography>
      </Box>

      {/* Contenu principal */}
      <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {displayData && displayData.items.length > 0 ? (
          <>
            {/* Liste des articles */}
            <Box
              sx={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 3,
                p: 3,
                mb: 3,
                backdropFilter: 'blur(10px)'
              }}
            >
              <List>
                {displayData.items.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" fontWeight="medium">
                              {item.name}
                            </Typography>
                            <Typography variant="h6" fontWeight="semibold">
                              {formatPrice(item.total_price)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            {item.quantity} × {formatPrice(item.unit_price)}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < displayData.items.length - 1 && (
                      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Box>

            {/* Total */}
            <Box
              sx={{
                textAlign: 'center',
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: 3,
                p: 4,
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ opacity: 0.9 }}>
                TOTAL À PAYER
              </Typography>
              <Typography
                variant="h2"
                fontWeight="bold"
                sx={{ color: '#f59e0b' }}
              >
                {formatPrice(displayData.total)}
              </Typography>
            </Box>
          </>
        ) : (
          // Écran d'accueil
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ opacity: 0.8 }}>
              Prêt à vous servir
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.6 }}>
              Vos articles apparaîtront ici
            </Typography>
          </Box>
        )}
      </Box>

      {/* Pied de page */}
      <Box sx={{ textAlign: 'center', p: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Powered by OBS SYSTEME - SONUTEC SARL
        </Typography>
      </Box>
    </Box>
  )
}
