import { supabase } from '../config/supabase'

// Script pour initialiser les données de test OBS CAISSE
export async function setupTestData() {
  console.log('🚀 Initialisation des données de test OBS CAISSE...')

  try {
    // 1. Créer un client entreprise (La Maison des Téléphones)
    const { data: client, error: clientError } = await supabase
      .from('obs_clients')
      .upsert({
        nom: 'La Maison des Téléphones',
        email_contact: 'contact@maisontel.com'
      })
      .select()
      .single()

    if (clientError) {
      console.error('Erreur création client:', clientError)
      return
    }

    console.log('✅ Client créé:', client.nom)

    // 2. Créer des boutiques de test
    const boutiques = [
      {
        client_id: client.id,
        nom: 'Boutique Centrale Yaoundé',
        adresse: 'Avenue Kennedy, Yaoundé',
        telephone: '+237123456789',
        email: 'centrale@maisontel.com'
      },
      {
        client_id: client.id,
        nom: 'Boutique Douala',
        adresse: 'Rue de la Liberté, Douala',
        telephone: '+237987654321',
        email: 'douala@maisontel.com'
      },
      {
        client_id: client.id,
        nom: 'Boutique Bafoussam',
        adresse: 'Marché Central, Bafoussam',
        telephone: '+237555666777',
        email: 'bafoussam@maisontel.com'
      }
    ]

    const { data: stores, error: storesError } = await supabase
      .from('obs_stores')
      .upsert(boutiques)
      .select()

    if (storesError) {
      console.error('Erreur création boutiques:', storesError)
      return
    }

    console.log('✅ Boutiques créées:', stores.length)

    // 3. Créer des abonnements pour les boutiques
    const subscriptions = stores.map(store => ({
      store_id: store.id,
      date_debut: new Date().toISOString().split('T')[0],
      prochaine_date_paiement: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      statut: 'active' as const
    }))

    const { error: subscriptionsError } = await supabase
      .from('obs_subscriptions')
      .upsert(subscriptions)

    if (subscriptionsError) {
      console.error('Erreur création abonnements:', subscriptionsError)
      return
    }

    console.log('✅ Abonnements créés')

    // 4. Créer un catalogue de produits
    const products = [
      {
        nom: 'iPhone 14 Pro Max',
        categorie: 'telephone' as const,
        prix_base: 450000
      },
      {
        nom: 'iPhone 14',
        categorie: 'telephone' as const,
        prix_base: 380000
      },
      {
        nom: 'Samsung Galaxy S23',
        categorie: 'telephone' as const,
        prix_base: 320000
      },
      {
        nom: 'Samsung Galaxy A54',
        categorie: 'telephone' as const,
        prix_base: 180000
      },
      {
        nom: 'Redmi Note 12',
        categorie: 'telephone' as const,
        prix_base: 120000
      },
      {
        nom: 'Écouteurs Bluetooth',
        categorie: 'accessoire' as const,
        prix_base: 15000
      },
      {
        nom: 'Chargeur USB-C',
        categorie: 'accessoire' as const,
        prix_base: 8000
      },
      {
        nom: 'Coque iPhone',
        categorie: 'accessoire' as const,
        prix_base: 5000
      },
      {
        nom: 'iPad Air',
        categorie: 'tablette' as const,
        prix_base: 280000
      },
      {
        nom: 'Samsung Tab A8',
        categorie: 'tablette' as const,
        prix_base: 150000
      }
    ]

    const { data: catalogProducts, error: productsError } = await supabase
      .from('obs_products_catalog')
      .upsert(products)
      .select()

    if (productsError) {
      console.error('Erreur création produits:', productsError)
      return
    }

    console.log('✅ Catalogue produits créé:', catalogProducts.length, 'produits')

    // 5. Créer des enregistrements IMEI pour les téléphones
    const phoneProducts = catalogProducts.filter(p => p.categorie === 'telephone')
    const imeiRecords: any[] = []

    for (const product of phoneProducts) {
      for (let i = 0; i < 5; i++) {
        // Générer un IMEI fictif (15 chiffres)
        const imei = `${Math.floor(Math.random() * 900000000000000) + 100000000000000}`
        
        imeiRecords.push({
          imei,
          product_id: product.id,
          store_id: stores[Math.floor(Math.random() * stores.length)].id,
          statut: 'en_stock' as const
        })
      }
    }

    const { data: createdImeiRecords, error: imeiError } = await supabase
      .from('obs_imei_records')
      .upsert(imeiRecords)
      .select()

    if (imeiError) {
      console.error('Erreur création IMEI:', imeiError)
      return
    }

    console.log('✅ Enregistrements IMEI créés:', imeiRecords.length)

    // 6. Créer quelques ventes de test
    const testSales = [
      {
        store_id: stores[0].id,
        montant_total: 450000,
        imei: imeiRecords[0].imei,
        nom_client: 'Jean Dupont',
        numero_facture: `FAC-${Date.now()}-001`,
        sale_price: 450000
      },
      {
        store_id: stores[1].id,
        montant_total: 180000,
        imei: imeiRecords[1].imei,
        nom_client: 'Marie Ngono',
        numero_facture: `FAC-${Date.now()}-002`,
        sale_price: 180000
      }
    ]

    const { data: sales, error: salesError } = await supabase
      .from('obs_sales')
      .upsert(testSales)
      .select()

    if (salesError) {
      console.error('Erreur création ventes:', salesError)
      return
    }

    console.log('✅ Ventes de test créées:', sales?.length || 0)

    // 7. Mettre à jour le statut des IMEI vendus
    if (sales) {
      for (let i = 0; i < sales.length; i++) {
        await supabase
          .from('obs_imei_records')
          .update({
            statut: 'vendu',
            sale_id: sales[i].id
          })
          .eq('imei', testSales[i].imei)
      }
    }

    console.log('✅ Statuts IMEI mis à jour')

    // 8. Créer des notifications de test
    const notifications = [
      {
        store_id: stores[1].id,
        message: 'Paiement d\'abonnement dû dans 7 jours',
        type: 'payment_reminder' as const
      },
      {
        store_id: stores[2].id,
        message: 'Stock faible détecté pour iPhone 14',
        type: 'warning' as const
      },
      {
        message: 'Mise à jour système programmée ce soir',
        type: 'system' as const
      }
    ]

    const { error: notificationsError } = await supabase
      .from('obs_notifications')
      .upsert(notifications)

    if (notificationsError) {
      console.error('Erreur création notifications:', notificationsError)
      return
    }

    console.log('✅ Notifications créées')

    // 9. Créer des paiements de test
    const payments = stores.map((store, index) => ({
      store_id: store.id,
      montant: 20000,
      date_paiement: new Date(Date.now() - (index * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      numero_facture: `PAY-${Date.now()}-${index + 1}`,
      recu_url: null
    }))

    const { error: paymentsError } = await supabase
      .from('obs_payments')
      .upsert(payments)

    if (paymentsError) {
      console.error('Erreur création paiements:', paymentsError)
      return
    }

    console.log('✅ Paiements créés')

    console.log('\n🎉 Données de test OBS CAISSE initialisées avec succès!')
    console.log('\n📊 Résumé:')
    console.log(`- 1 client entreprise: ${client.nom}`)
    console.log(`- ${stores.length} boutiques`)
    console.log(`- ${catalogProducts.length} produits au catalogue`)
    console.log(`- ${imeiRecords.length} enregistrements IMEI`)
    console.log(`- ${sales.length} ventes de test`)
    console.log(`- ${notifications.length} notifications`)
    console.log(`- ${payments.length} paiements`)

    return {
      client,
      stores,
      products: catalogProducts,
      imeiRecords,
      sales,
      success: true
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error)
    return { success: false, error }
  }
}

// Fonction pour nettoyer les données de test
export async function cleanupTestData() {
  console.log('🧹 Nettoyage des données de test...')

  try {
    // Supprimer dans l'ordre inverse des dépendances
    await supabase.from('obs_notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('obs_payments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('obs_imei_records').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('obs_sales').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('obs_products_catalog').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('obs_subscriptions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('obs_stores').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('obs_clients').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    console.log('✅ Données de test nettoyées')
    return { success: true }
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error)
    return { success: false, error }
  }
}

// Fonction pour vérifier la connexion Supabase
export async function testSupabaseConnection() {
  console.log('🔗 Test de connexion Supabase...')

  try {
    const { data, error } = await supabase
      .from('obs_clients')
      .select('count')
      .limit(1)

    if (error) {
      console.error('❌ Erreur de connexion:', error)
      return { success: false, error }
    }

    console.log('✅ Connexion Supabase réussie')
    return { success: true, data }
  } catch (error) {
    console.error('❌ Erreur de connexion:', error)
    return { success: false, error }
  }
}

// Script d'initialisation des données de test OBS CAISSE
// Utiliser: import { setupTestData } from './scripts/setupTestData'
