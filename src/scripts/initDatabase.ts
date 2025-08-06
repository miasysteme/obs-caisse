import { supabase } from '../config/supabase'

// Script d'initialisation de la base de données avec des données de test
export const initializeDatabase = async () => {
  try {
    console.log('🚀 Initialisation de la base de données...')

    // 1. Créer une entreprise de test
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: 'La Maison des Téléphones',
        contact_email: 'contact@maisontel.com',
        contact_phone: '+237123456789',
        address: 'Yaoundé, Cameroun'
      })
      .select()
      .single()

    if (companyError) {
      console.error('Erreur création entreprise:', companyError)
      return
    }

    console.log('✅ Entreprise créée:', company.name)

    // 2. Créer des boutiques de test
    const boutiques = [
      {
        company_id: company.id,
        name: 'Boutique Centrale',
        commercial_name: 'La Maison des Téléphones - Central',
        address: 'Avenue Kennedy, Yaoundé',
        phone: '+237123456789',
        email: 'central@maisontel.com',
        is_central: true,
        subscription_status: 'active',
        subscription_start_date: new Date().toISOString().split('T')[0],
        subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        company_id: company.id,
        name: 'Boutique Douala',
        commercial_name: 'TechMobile Douala',
        address: 'Rue de la Liberté, Douala',
        phone: '+237987654321',
        email: 'douala@maisontel.com',
        is_central: false,
        subscription_status: 'active',
        subscription_start_date: new Date().toISOString().split('T')[0],
        subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    ]

    const { data: createdBoutiques, error: boutiquesError } = await supabase
      .from('boutiques')
      .insert(boutiques)
      .select()

    if (boutiquesError) {
      console.error('Erreur création boutiques:', boutiquesError)
      return
    }

    console.log('✅ Boutiques créées:', createdBoutiques.length)

    // 3. Créer des catégories
    const categories = [
      { name: 'Smartphones', description: 'Téléphones intelligents' },
      { name: 'Accessoires', description: 'Accessoires pour téléphones' },
      { name: 'Tablettes', description: 'Tablettes tactiles' }
    ]

    const { data: createdCategories, error: categoriesError } = await supabase
      .from('categories')
      .insert(categories)
      .select()

    if (categoriesError) {
      console.error('Erreur création catégories:', categoriesError)
      return
    }

    console.log('✅ Catégories créées:', createdCategories.length)

    // 4. Créer des marques
    const brands = [
      { name: 'Apple', logo_url: null },
      { name: 'Samsung', logo_url: null },
      { name: 'Huawei', logo_url: null },
      { name: 'Xiaomi', logo_url: null },
      { name: 'Tecno', logo_url: null }
    ]

    const { data: createdBrands, error: brandsError } = await supabase
      .from('brands')
      .insert(brands)
      .select()

    if (brandsError) {
      console.error('Erreur création marques:', brandsError)
      return
    }

    console.log('✅ Marques créées:', createdBrands.length)

    // 5. Créer des produits de test
    const smartphoneCategory = createdCategories.find(c => c.name === 'Smartphones')
    const accessoryCategory = createdCategories.find(c => c.name === 'Accessoires')
    const appleBrand = createdBrands.find(b => b.name === 'Apple')
    const samsungBrand = createdBrands.find(b => b.name === 'Samsung')
    const xiaomiBrand = createdBrands.find(b => b.name === 'Xiaomi')

    const products = [
      {
        name: 'iPhone 14 Pro Max',
        sku: 'IPH14PM-256-BLK',
        category_id: smartphoneCategory?.id,
        brand_id: appleBrand?.id,
        model: '14 Pro Max',
        is_phone: true,
        requires_imei: true,
        purchase_price: 400000,
        recommended_price: 550000,
        min_price: 500000,
        max_price: 600000,
        description: 'iPhone 14 Pro Max 256GB Noir',
        specifications: {
          storage: '256GB',
          color: 'Noir',
          screen: '6.7 pouces',
          camera: '48MP'
        },
        warranty_months: 12
      },
      {
        name: 'Samsung Galaxy S23',
        sku: 'SAM-S23-128-WHT',
        category_id: smartphoneCategory?.id,
        brand_id: samsungBrand?.id,
        model: 'Galaxy S23',
        is_phone: true,
        requires_imei: true,
        purchase_price: 250000,
        recommended_price: 350000,
        min_price: 320000,
        max_price: 380000,
        description: 'Samsung Galaxy S23 128GB Blanc',
        specifications: {
          storage: '128GB',
          color: 'Blanc',
          screen: '6.1 pouces',
          camera: '50MP'
        },
        warranty_months: 12
      },
      {
        name: 'Redmi Note 12',
        sku: 'XIA-RN12-64-BLU',
        category_id: smartphoneCategory?.id,
        brand_id: xiaomiBrand?.id,
        model: 'Redmi Note 12',
        is_phone: true,
        requires_imei: true,
        purchase_price: 80000,
        recommended_price: 120000,
        min_price: 110000,
        max_price: 130000,
        description: 'Xiaomi Redmi Note 12 64GB Bleu',
        specifications: {
          storage: '64GB',
          color: 'Bleu',
          screen: '6.67 pouces',
          camera: '48MP'
        },
        warranty_months: 12
      },
      {
        name: 'Écouteurs Bluetooth',
        sku: 'ACC-BT-001',
        category_id: accessoryCategory?.id,
        brand_id: null,
        model: 'BT-001',
        is_phone: false,
        requires_imei: false,
        purchase_price: 8000,
        recommended_price: 15000,
        min_price: 12000,
        max_price: 18000,
        description: 'Écouteurs Bluetooth sans fil',
        specifications: {
          type: 'Bluetooth 5.0',
          battery: '6 heures',
          color: 'Noir'
        },
        warranty_months: 6
      },
      {
        name: 'Chargeur USB-C',
        sku: 'ACC-CHG-USBC',
        category_id: accessoryCategory?.id,
        brand_id: null,
        model: 'CHG-USBC',
        is_phone: false,
        requires_imei: false,
        purchase_price: 3000,
        recommended_price: 8000,
        min_price: 6000,
        max_price: 10000,
        description: 'Chargeur rapide USB-C 20W',
        specifications: {
          power: '20W',
          cable: '1m',
          color: 'Blanc'
        },
        warranty_months: 6
      }
    ]

    const { data: createdProducts, error: productsError } = await supabase
      .from('products')
      .insert(products)
      .select()

    if (productsError) {
      console.error('Erreur création produits:', productsError)
      return
    }

    console.log('✅ Produits créés:', createdProducts.length)

    // 6. Créer du stock pour chaque boutique
    const stockEntries = []
    for (const boutique of createdBoutiques) {
      for (const product of createdProducts) {
        stockEntries.push({
          product_id: product.id,
          boutique_id: boutique.id,
          quantity: Math.floor(Math.random() * 20) + 5, // Entre 5 et 25
          min_threshold: product.is_phone ? 3 : 10,
          max_threshold: product.is_phone ? 50 : 100
        })
      }
    }

    const { error: stockError } = await supabase
      .from('stock')
      .insert(stockEntries)

    if (stockError) {
      console.error('Erreur création stock:', stockError)
      return
    }

    console.log('✅ Stock créé pour toutes les boutiques')

    // 7. Créer des utilisateurs de test
    const users = [
      {
        email: 'admin@sonutec.com',
        password_hash: '$2b$12$dummy_hash_for_admin', // À remplacer par un vrai hash
        role: 'admin_master',
        company_id: null,
        boutique_id: null,
        first_name: 'Admin',
        last_name: 'SONUTEC',
        phone: '+237000000000'
      },
      {
        email: 'central@maisontel.com',
        password_hash: '$2b$12$dummy_hash_for_central',
        role: 'admin_central',
        company_id: company.id,
        boutique_id: null,
        first_name: 'Admin',
        last_name: 'Central',
        phone: '+237111111111'
      },
      {
        email: 'manager.central@maisontel.com',
        password_hash: '$2b$12$dummy_hash_for_manager',
        role: 'manager',
        company_id: company.id,
        boutique_id: createdBoutiques[0].id,
        first_name: 'Manager',
        last_name: 'Central',
        phone: '+237222222222'
      },
      {
        email: 'caissier.central@maisontel.com',
        password_hash: '$2b$12$dummy_hash_for_cashier',
        role: 'cashier',
        company_id: company.id,
        boutique_id: createdBoutiques[0].id,
        first_name: 'Marie',
        last_name: 'NGONO',
        phone: '+237333333333'
      }
    ]

    const { error: usersError } = await supabase
      .from('users')
      .insert(users)

    if (usersError) {
      console.error('Erreur création utilisateurs:', usersError)
      return
    }

    console.log('✅ Utilisateurs de test créés')

    console.log('🎉 Initialisation terminée avec succès!')
    console.log('\n📋 Comptes de test créés:')
    console.log('- Admin SONUTEC: admin@sonutec.com')
    console.log('- Admin Central: central@maisontel.com')
    console.log('- Manager: manager.central@maisontel.com')
    console.log('- Caissier: caissier.central@maisontel.com')
    console.log('\n⚠️  Pensez à mettre à jour les mots de passe dans Supabase Auth!')

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error)
  }
}

// Fonction pour nettoyer la base de données (développement uniquement)
export const cleanDatabase = async () => {
  try {
    console.log('🧹 Nettoyage de la base de données...')

    // Supprimer dans l'ordre inverse des dépendances
    await supabase.from('stock').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('brands').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('boutiques').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('companies').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    console.log('✅ Base de données nettoyée')
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error)
  }
}
