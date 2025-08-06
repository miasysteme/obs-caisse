import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Button,
  CircularProgress
} from '@mui/material'
import { Search, Add } from '@mui/icons-material'
import { supabase } from '../../config/supabase'

interface Product {
  id: string
  name: string
  sku: string | null
  recommended_price: number | null
  purchase_price: number | null
  is_phone: boolean
  requires_imei: boolean
  images: any
  description: string | null
  warranty_months: number
}

interface ProductGridProps {
  onAddToCart: (product: Product, quantity?: number) => void
  boutiqueId: string
}

export const ProductGrid: React.FC<ProductGridProps> = ({ onAddToCart, boutiqueId }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [boutiqueId])

  useEffect(() => {
    // Filtrer les produits selon le terme de recherche
    if (searchTerm.trim() === '') {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredProducts(filtered)
    }
  }, [searchTerm, products])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      
      // Récupérer les produits avec leur stock pour cette boutique
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          stock!inner(quantity, min_threshold)
        `)
        .eq('stock.boutique_id', boutiqueId)
        .eq('is_active', true)
        .order('name')

      if (error) throw error

      setProducts(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    onAddToCart(product, 1)
  }

  const formatPrice = (price: number | null) => {
    if (!price) return 'N/A'
    return new Intl.NumberFormat('fr-FR').format(price) + ' F'
  }

  const getStockStatus = (product: any) => {
    const stock = product.stock?.[0]
    if (!stock) return { status: 'unknown', color: 'default' as const }
    
    if (stock.quantity === 0) return { status: 'Rupture', color: 'error' as const }
    if (stock.quantity <= stock.min_threshold) return { status: 'Faible', color: 'warning' as const }
    return { status: 'Disponible', color: 'success' as const }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      {/* Barre de recherche */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Rechercher un produit par nom ou code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500 }}
        />
      </Box>

      {/* Grille de produits */}
      <Grid container spacing={2}>
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product)
          const stock = product.stock?.[0]
          
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                  }
                }}
                onClick={() => handleAddToCart(product)}
              >
                {/* Image du produit */}
                <CardMedia
                  component="div"
                  sx={{
                    height: 140,
                    backgroundColor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Pas d'image
                    </Typography>
                  )}
                  
                  {/* Badge stock */}
                  <Chip
                    label={stockStatus.status}
                    color={stockStatus.color}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8
                    }}
                  />
                </CardMedia>

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Nom du produit */}
                  <Typography variant="h6" component="h3" gutterBottom noWrap>
                    {product.name}
                  </Typography>

                  {/* SKU */}
                  {product.sku && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Code: {product.sku}
                    </Typography>
                  )}

                  {/* Prix */}
                  <Typography variant="h6" color="primary" gutterBottom>
                    {formatPrice(product.recommended_price)}
                  </Typography>

                  {/* Stock disponible */}
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Stock: {stock?.quantity || 0} unités
                  </Typography>

                  {/* Badges */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    {product.is_phone && (
                      <Chip label="Téléphone" size="small" color="info" />
                    )}
                    {product.requires_imei && (
                      <Chip label="IMEI requis" size="small" color="warning" />
                    )}
                  </Box>

                  {/* Bouton d'ajout */}
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    fullWidth
                    disabled={stock?.quantity === 0}
                    sx={{ mt: 'auto' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddToCart(product)
                    }}
                  >
                    Ajouter
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Message si aucun produit */}
      {filteredProducts.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucun produit trouvé
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? 'Essayez avec d\'autres mots-clés' : 'Aucun produit disponible'}
          </Typography>
        </Box>
      )}
    </Box>
  )
}
