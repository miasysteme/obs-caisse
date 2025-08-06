import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material'
import {
  Payment,
  CreditCard,
  PhoneAndroid,
  AccountBalance,
  MonetizationOn
} from '@mui/icons-material'

interface CartItem {
  id: string
  product_id: string
  name: string
  quantity: number
  unit_price: number
  total_price: number
  imei?: string
  requires_imei: boolean
}

interface Customer {
  name: string
  phone: string
  email?: string
}

interface PaymentDialogProps {
  open: boolean
  onClose: () => void
  cart: CartItem[]
  customer: Customer
  subtotal: number
  taxAmount: number
  total: number
  onCompleteSale: (paymentMethod: string, amountReceived?: number) => Promise<any>
  loading: boolean
}

const paymentMethods = [
  { id: 'cash', label: 'Espèces', icon: MonetizationOn, requiresAmount: true },
  { id: 'card', label: 'Carte Bancaire', icon: CreditCard, requiresAmount: false },
  { id: 'mobile_money', label: 'Mobile Money', icon: PhoneAndroid, requiresAmount: false },
  { id: 'bank_transfer', label: 'Virement', icon: AccountBalance, requiresAmount: false },
]

export const PaymentDialog: React.FC<PaymentDialogProps> = ({
  open,
  onClose,
  cart,
  customer,
  subtotal,
  taxAmount,
  total,
  onCompleteSale,
  loading
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('cash')
  const [amountReceived, setAmountReceived] = useState<string>(total.toString())
  const [error, setError] = useState<string>('')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' F'
  }

  const calculateChange = () => {
    const received = parseFloat(amountReceived) || 0
    return Math.max(0, received - total)
  }

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId)
    setError('')
    
    // Pour les espèces, pré-remplir avec le montant total
    if (methodId === 'cash') {
      setAmountReceived(total.toString())
    }
  }

  const handleCompleteSale = async () => {
    setError('')
    
    try {
      // Validation pour les espèces
      if (selectedMethod === 'cash') {
        const received = parseFloat(amountReceived) || 0
        if (received < total) {
          setError('Le montant reçu doit être supérieur ou égal au total')
          return
        }
      }

      // Validation des IMEI
      const missingIMEI = cart.filter(item => item.requires_imei && !item.imei)
      if (missingIMEI.length > 0) {
        setError(`IMEI manquant pour: ${missingIMEI.map(item => item.name).join(', ')}`)
        return
      }

      const result = await onCompleteSale(
        selectedMethod,
        selectedMethod === 'cash' ? parseFloat(amountReceived) : undefined
      )

      if (!result.success) {
        setError(result.error || 'Erreur lors de la vente')
      }
    } catch (err: any) {
      setError(err.message || 'Erreur inattendue')
    }
  }

  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: 600 }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Payment />
          <Typography variant="h6">Finaliser la vente</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Résumé de la commande */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Résumé de la commande
            </Typography>
            
            {/* Informations client */}
            {(customer.name || customer.phone) && (
              <Box sx={{ mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>Client:</Typography>
                {customer.name && (
                  <Typography variant="body2">{customer.name}</Typography>
                )}
                {customer.phone && (
                  <Typography variant="body2">{customer.phone}</Typography>
                )}
              </Box>
            )}

            {/* Articles */}
            <List dense>
              {cart.map((item) => (
                <ListItem key={item.id} sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">
                          {item.name} {item.imei && `(${item.imei})`}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {formatPrice(item.total_price)}
                        </Typography>
                      </Box>
                    }
                    secondary={`${item.quantity} × ${formatPrice(item.unit_price)}`}
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Totaux */}
            <Box sx={{ space: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Sous-total:</Typography>
                <Typography variant="body2">{formatPrice(subtotal)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">TVA (19.25%):</Typography>
                <Typography variant="body2">{formatPrice(taxAmount)}</Typography>
              </Box>
              
              <Divider sx={{ my: 1 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight="bold">TOTAL:</Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {formatPrice(total)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Méthodes de paiement */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Mode de paiement
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              {paymentMethods.map((method) => {
                const Icon = method.icon
                return (
                  <Grid item xs={6} key={method.id}>
                    <Button
                      fullWidth
                      variant={selectedMethod === method.id ? 'contained' : 'outlined'}
                      onClick={() => handlePaymentMethodSelect(method.id)}
                      sx={{
                        height: 80,
                        flexDirection: 'column',
                        gap: 1
                      }}
                    >
                      <Icon />
                      <Typography variant="caption">
                        {method.label}
                      </Typography>
                    </Button>
                  </Grid>
                )
              })}
            </Grid>

            {/* Champ montant pour les espèces */}
            {selectedMethod === 'cash' && (
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Montant reçu"
                  type="number"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">F</InputAdornment>,
                  }}
                  sx={{ mb: 2 }}
                />

                {parseFloat(amountReceived) >= total && (
                  <Alert severity="info">
                    <Typography variant="body2">
                      <strong>Rendu à donner: {formatPrice(calculateChange())}</strong>
                    </Typography>
                  </Alert>
                )}
              </Box>
            )}

            {/* Erreurs */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          size="large"
        >
          Annuler
        </Button>
        
        <Button
          variant="contained"
          onClick={handleCompleteSale}
          disabled={loading || !selectedMethod}
          size="large"
          sx={{ minWidth: 200 }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            `Confirmer - ${formatPrice(total)}`
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
