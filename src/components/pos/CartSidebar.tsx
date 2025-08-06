import React from 'react'
import {
  Box,
  List,
  ListItem,
  ListItemText,
  TextField,
  IconButton,
  Typography,
  Divider,
  Button,
  InputAdornment,
  Chip
} from '@mui/material'
import {
  Add,
  Remove,
  Delete,
  Clear,
  Person,
  Phone
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

interface CartSidebarProps {
  cart: CartItem[]
  customer: Customer
  onCustomerChange: (customer: Customer) => void
  onUpdatePrice: (itemId: string, newPrice: number) => void
  onUpdateQuantity: (itemId: string, newQuantity: number) => void
  onUpdateIMEI: (itemId: string, imei: string) => void
  onRemoveItem: (itemId: string) => void
  onClearCart: () => void
  subtotal: number
  taxAmount: number
  total: number
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  cart,
  customer,
  onCustomerChange,
  onUpdatePrice,
  onUpdateQuantity,
  onUpdateIMEI,
  onRemoveItem,
  onClearCart,
  subtotal,
  taxAmount,
  total
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' F'
  }

  const handlePriceChange = (itemId: string, value: string) => {
    const newPrice = parseFloat(value) || 0
    if (newPrice >= 0) {
      onUpdatePrice(itemId, newPrice)
    }
  }

  const handleQuantityChange = (itemId: string, delta: number) => {
    const item = cart.find(i => i.id === itemId)
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta)
      onUpdateQuantity(itemId, newQuantity)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Informations client */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle2" gutterBottom>
          Informations Client
        </Typography>
        
        <TextField
          fullWidth
          size="small"
          placeholder="Nom du client"
          value={customer.name}
          onChange={(e) => onCustomerChange({ ...customer, name: e.target.value })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1 }}
        />
        
        <TextField
          fullWidth
          size="small"
          placeholder="Téléphone"
          value={customer.phone}
          onChange={(e) => onCustomerChange({ ...customer, phone: e.target.value })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Liste des articles */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {cart.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Panier vide
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {cart.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem sx={{ flexDirection: 'column', alignItems: 'stretch', py: 2 }}>
                  {/* Nom et prix */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ flexGrow: 1, mr: 1 }}>
                      <Typography variant="subtitle2" noWrap>
                        {item.name}
                      </Typography>
                      {item.requires_imei && (
                        <Chip label="IMEI requis" size="small" color="warning" sx={{ mt: 0.5 }} />
                      )}
                    </Box>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Contrôles quantité */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <Remove fontSize="small" />
                    </IconButton>
                    
                    <Typography variant="body2" sx={{ mx: 2, minWidth: 20, textAlign: 'center' }}>
                      {item.quantity}
                    </Typography>
                    
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      <Add fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Prix unitaire modifiable */}
                  <TextField
                    fullWidth
                    size="small"
                    label="Prix unitaire"
                    type="number"
                    value={item.unit_price}
                    onChange={(e) => handlePriceChange(item.id, e.target.value)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">F</InputAdornment>,
                    }}
                    sx={{ mb: 1 }}
                  />

                  {/* Champ IMEI si requis */}
                  {item.requires_imei && (
                    <TextField
                      fullWidth
                      size="small"
                      label="IMEI (15 chiffres)"
                      placeholder="123456789012345"
                      value={item.imei || ''}
                      onChange={(e) => onUpdateIMEI(item.id, e.target.value)}
                      inputProps={{
                        maxLength: 15,
                        pattern: '[0-9]{15}'
                      }}
                      error={item.imei ? !/^\d{15}$/.test(item.imei) : false}
                      helperText={item.imei && !/^\d{15}$/.test(item.imei) ? 'IMEI doit contenir 15 chiffres' : ''}
                      sx={{ mb: 1 }}
                    />
                  )}

                  {/* Total de la ligne */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {item.quantity} × {formatPrice(item.unit_price)}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {formatPrice(item.total_price)}
                    </Typography>
                  </Box>
                </ListItem>
                
                {index < cart.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>

      {/* Bouton vider panier */}
      {cart.length > 0 && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<Clear />}
            onClick={onClearCart}
            size="small"
          >
            Vider le panier
          </Button>
        </Box>
      )}

      {/* Totaux */}
      <Box sx={{ p: 2, borderTop: 2, borderColor: 'divider', backgroundColor: 'grey.50' }}>
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
    </Box>
  )
}
