// Test simple de l'application React sans TypeScript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vhahwekekuuntqlkvtoc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoYWh3ZWtla3V1bnRxbGt2dG9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0OTI4NzEsImV4cCI6MjA0OTA2ODg3MX0.YSBJrVBXhJhEhKJhYJhEhKJhYJhEhKJhYJhEhKJhYJhE';

const supabase = createClient(supabaseUrl, supabaseKey);

// Test de connexion
async function testConnection() {
  try {
    console.log('🔄 Test de connexion Supabase...');
    
    const { data: clients, error: clientsError } = await supabase
      .from('obs_clients')
      .select('*')
      .limit(3);

    if (clientsError) {
      console.error('❌ Erreur clients:', clientsError);
      return false;
    }

    const { data: stores, error: storesError } = await supabase
      .from('obs_stores')
      .select('*')
      .limit(3);

    if (storesError) {
      console.error('❌ Erreur boutiques:', storesError);
      return false;
    }

    const { data: products, error: productsError } = await supabase
      .from('obs_products_catalog')
      .select('*')
      .limit(3);

    if (productsError) {
      console.error('❌ Erreur produits:', productsError);
      return false;
    }

    console.log('✅ Connexion réussie!');
    console.log(`📊 Données trouvées: ${clients.length} clients, ${stores.length} boutiques, ${products.length} produits`);
    
    return {
      clients,
      stores,
      products,
      success: true
    };
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
    return false;
  }
}

// Test de création de vente
async function testCreateSale() {
  try {
    console.log('🔄 Test de création de vente...');
    
    // Récupérer une boutique
    const { data: stores } = await supabase
      .from('obs_stores')
      .select('*')
      .limit(1);

    if (!stores || stores.length === 0) {
      console.error('❌ Aucune boutique trouvée');
      return false;
    }

    const testSale = {
      store_id: stores[0].id,
      montant_total: 300000,
      imei: 'TEST-JS-' + Date.now(),
      nom_client: 'Client Test JavaScript',
      numero_facture: 'FAC-JS-' + Date.now(),
      sale_price: 300000
    };

    const { data: newSale, error } = await supabase
      .from('obs_sales')
      .insert([testSale])
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur création vente:', error);
      return false;
    }

    console.log('✅ Vente créée avec succès:', newSale.numero_facture);
    return newSale;
  } catch (error) {
    console.error('❌ Erreur test vente:', error);
    return false;
  }
}

// Exécuter les tests
async function runTests() {
  console.log('🚀 Démarrage des tests OBS SYSTEME...');
  
  const connectionTest = await testConnection();
  if (!connectionTest) {
    console.log('❌ Tests échoués - Problème de connexion');
    return;
  }

  const saleTest = await testCreateSale();
  if (!saleTest) {
    console.log('❌ Tests échoués - Problème de création de vente');
    return;
  }

  console.log('🎉 Tous les tests réussis!');
  console.log('✅ Application React prête pour production');
}

// Exporter pour utilisation
if (typeof window !== 'undefined') {
  window.obsTests = {
    testConnection,
    testCreateSale,
    runTests
  };
}

export { testConnection, testCreateSale, runTests };

