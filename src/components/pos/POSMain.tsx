import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Badge
} from '@mui/material'
import {
  ShoppingCart,
  Person,
  ExitToApp,
  Print,
  Monitor
} from '@mui/icons-material'
import { useAuth } from '../../hooks/useAuth'
import { usePOS } from '../../hooks/usePOS'
import { ProductGrid } from './ProductGrid'
import { CartSidebar } from './CartSidebar'
import { PaymentDialog } from './PaymentDialog'

export const POSMain: React.FC = () => {
  const { user, signOut } = useAuth()
  const {
    cart,
    customer,
    setCustomer,
    addToCart,
    updateItemPrice,
    updateItemQuantity,
    updateItemIMEI,
    removeFromCart,
    clearCart,
    calculateTotal,
    processSale,
    loading
  } = usePOS(user?.boutique_id || '')

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [customerDisplayOpen, setCustomerDisplayOpen] = useState(false)

  const { subtotal, taxAmount, total } = calculateTotal()
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleLogout = async () => {
    await signOut()
  }

  const handleOpenPayment = () => {
    if (cart.length > 0) {
      setPaymentDialogOpen(true)
    }
  }

  const handleCompleteSale = async (paymentMethod: string, amountReceived?: number) => {
    const result = await processSale(paymentMethod, amountReceived, user?.id)
    
    if (result.success) {
      setPaymentDialogOpen(false)
      // TODO: Imprimer le reçu
      // TODO: Afficher message de succès
    }
    
    return result
  }

  const toggleCustomerDisplay = () => {
    if (customerDisplayOpen) {
      // Fermer l'écran client
      setCustomerDisplayOpen(false)
    } else {
      // Ouvrir l'écran client
      const customerWindow = window.open(
        '/customer-display',
        'customerDisplay',
        'width=800,height=600,fullscreen=yes,toolbar=no,menubar=no,scrollbars=no'
      )
      if (customerWindow) {
        setCustomerDisplayOpen(true)
      }
    }
  }

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            OBS CAISSE - {user?.boutique_name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              color="inherit"
              startIcon={<Monitor />}
              onClick={toggleCustomerDisplay}
              variant={customerDisplayOpen ? 'outlined' : 'text'}
            >
              Écran Client
            </Button>
            
            <IconButton color="inherit">
              <Print />
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person />
              <Typography variant="body2">
                {user?.first_name} {user?.last_name}
              </Typography>
            </Box>
            
            <IconButton color="inherit" onClick={handleLogout}>
              <ExitToApp />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Products Area */}
        <Box sx={{ flexGrow: 1, p: 2, overflow: 'auto' }}>
          <ProductGrid onAddToCart={addToCart} boutiqueId={user?.boutique_id || ''} />
        </Box>

        {/* Cart Sidebar */}
        <Paper 
          sx={{ 
            width: 400, 
            display: 'flex', 
            flexDirection: 'column',
            borderRadius: 0,
            borderLeft: 1,
            borderColor: 'divider'
          }}
        >
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">
                Panier
              </Typography>
              <Badge badgeContent={cartItemsCount} color="primary">
                <ShoppingCart />
              </Badge>
            </Box>
          </Box>

          <CartSidebar
            cart={cart}
            customer={customer}
            onCustomerChange={setCustomer}
            onUpdatePrice={updateItemPrice}
            onUpdateQuantity={updateItemQuantity}
            onUpdateIMEI={updateItemIMEI}
            onRemoveItem={removeFromCart}
            onClearCart={clearCart}
            subtotal={subtotal}
            taxAmount={taxAmount}
            total={total}
          />

          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleOpenPayment}
              disabled={cart.length === 0 || loading}
              sx={{ height: 56 }}
            >
              VALIDER VENTE ({total.toLocaleString('fr-FR')} F)
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Payment Dialog */}
      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        cart={cart}
        customer={customer}
        subtotal={subtotal}
        taxAmount={taxAmount}
        total={total}
        onCompleteSale={handleCompleteSale}
        loading={loading}
      />
    </Box>
  )
}
