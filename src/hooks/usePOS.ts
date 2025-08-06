import { useState, useCallback } from 'react'
import { supabase } from '../config/supabase'

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

export const usePOS = (boutiqueId: string) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [customer, setCustomer] = useState<Customer>({ name: '', phone: '' })
  const [loading, setLoading] = useState(false)

  const addToCart = useCallback((product: any, quantity: number = 1) => {
    const existingItem = cart.find(item => item.product_id === product.id)
    
    if (existingItem && !product.requires_imei) {
      // Augmenter la quantité si pas d'IMEI requis
      setCart(prev => prev.map(item =>
        item.product_id === product.id
          ? { 
              ...item, 
              quantity: item.quantity + quantity, 
              total_price: (item.quantity + quantity) * item.unit_price 
            }
          : item
      ))
    } else {
      // Ajouter nouvel item
      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        product_id: product.id,
        name: product.name,
        quantity,
        unit_price: product.recommended_price || 0,
        total_price: (product.recommended_price || 0) * quantity,
        requires_imei: product.requires_imei || false
      }
      setCart(prev => [...prev, newItem])
    }
  }, [cart])

  const updateItemPrice = useCallback((itemId: string, newPrice: number) => {
    setCart(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, unit_price: newPrice, total_price: newPrice * item.quantity }
        : item
    ))
  }, [])

  const updateItemQuantity = useCallback((itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }
    
    setCart(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, quantity: newQuantity, total_price: item.unit_price * newQuantity }
        : item
    ))
  }, [])

  const updateItemIMEI = useCallback((itemId: string, imei: string) => {
    setCart(prev => prev.map(item =>
      item.id === itemId ? { ...item, imei } : item
    ))
  }, [])

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId))
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
    setCustomer({ name: '', phone: '' })
  }, [])

  const calculateTotal = useCallback(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.total_price, 0)
    const taxRate = 0.1925 // 19.25% TVA Cameroun
    const taxAmount = subtotal * taxRate
    const total = subtotal + taxAmount

    return { subtotal, taxAmount, total }
  }, [cart])

  const validateSale = useCallback(() => {
    const errors: string[] = []

    // Vérifier que le panier n'est pas vide
    if (cart.length === 0) {
      errors.push('Le panier est vide')
    }

    // Vérifier les IMEI requis
    cart.forEach(item => {
      if (item.requires_imei && !item.imei) {
        errors.push(`IMEI requis pour ${item.name}`)
      }
      if (item.imei && !/^\d{15}$/.test(item.imei)) {
        errors.push(`IMEI invalide pour ${item.name} (doit contenir 15 chiffres)`)
      }
    })

    return errors
  }, [cart])

  const generateSaleNumber = useCallback(async (boutiqueId: string) => {
    try {
      const { data, error } = await supabase.rpc('generate_sale_number', {
        boutique_id: boutiqueId
      })
      
      if (error) throw error
      return data
    } catch (error) {
      // Fallback: générer un numéro simple
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
      return `SALE-${date}-${random}`
    }
  }, [])

  const processSale = useCallback(async (
    paymentMethod: string, 
    amountReceived?: number,
    cashierId?: string
  ) => {
    setLoading(true)
    try {
      const errors = validateSale()
      if (errors.length > 0) {
        throw new Error(errors.join(', '))
      }

      const { subtotal, taxAmount, total } = calculateTotal()
      const saleNumber = await generateSaleNumber(boutiqueId)

      // Créer la vente
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert({
          sale_number: saleNumber,
          boutique_id: boutiqueId,
          cashier_id: cashierId,
          customer_name: customer.name || null,
          customer_phone: customer.phone || null,
          customer_email: customer.email || null,
          subtotal,
          tax_amount: taxAmount,
          total_amount: total,
          payment_method: paymentMethod,
          amount_received: amountReceived || total,
          change_amount: amountReceived ? Math.max(0, amountReceived - total) : 0,
          status: 'completed'
        })
        .select()
        .single()

      if (saleError) throw saleError

      // Ajouter les articles de vente
      const saleItems = cart.map(item => ({
        sale_id: sale.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        imei: item.imei || null
      }))

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems)

      if (itemsError) throw itemsError

      // Mettre à jour le tracking IMEI pour les téléphones
      for (const item of cart) {
        if (item.imei) {
          await supabase
            .from('imei_tracking')
            .upsert({
              imei: item.imei,
              product_id: item.product_id,
              current_boutique_id: boutiqueId,
              original_sale_id: sale.id,
              current_status: 'sold',
              sale_date: new Date().toISOString().split('T')[0]
            })
        }
      }

      // Réinitialiser le panier
      clearCart()

      return { success: true, sale, saleNumber }
    } catch (error: any) {
      console.error('Erreur lors de la vente:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }, [cart, customer, boutiqueId, calculateTotal, validateSale, generateSaleNumber, clearCart])

  return {
    cart,
    customer,
    setCustomer,
    loading,
    addToCart,
    updateItemPrice,
    updateItemQuantity,
    updateItemIMEI,
    removeFromCart,
    clearCart,
    calculateTotal,
    processSale,
    validateSale
  }
}
