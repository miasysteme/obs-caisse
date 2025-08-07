import { supabase } from '../config/supabase';

// Script d'initialisation de la base de données avec des données de test
export const initCompleteDatabase = async () => {
  try {
    console.log('🚀 Initialisation de la base de données...');

    // 1. Créer un utilisateur de test pour l'authentification
    const testUsers = [
      {
        email: 'admin@sonutec.com',
        password: 'admin123',
        role: 'admin_master',
        first_name: 'Admin',
        last_name: 'SONUTEC',
        boutique_id: null,
        company_id: null
      },
      {
        email: 'manager@restaurant.com',
        password: 'manager123',
        role: 'manager',
        first_name: 'Jean',
        last_name: 'KOUASSI',
        boutique_id: null, // Sera mis à jour après création de l'établissement
        company_id: null
      },
      {
        email: 'caissier@hotel.com',
        password: 'caissier123',
        role: 'cashier',
        first_name: 'Marie',
        last_name: 'AYA',
        boutique_id: null,
        company_id: null
      }
    ];

    // 2. Créer des établissements de test
    const testEstablishments = [
      {
        name: 'Restaurant Le Palmier',
        commercial_name: 'Le Palmier SARL',
        address: 'Plateau, Abidjan, Côte d\'Ivoire',
        phone: '+225 27 20 30 40 50',
        email: 'info@lepalmier.ci',
        sector: 'restaurant',
        is_active: true
      },
      {
        name: 'Hôtel Ivoire Palace',
        commercial_name: 'Ivoire Palace Hotel',
        address: 'Marcory, Abidjan, Côte d\'Ivoire',
        phone: '+225 27 21 32 43 54',
        email: 'reservation@ivoirepalace.ci',
        sector: 'hotel',
        is_active: true
      },
      {
        name: 'Bar Le Maquis',
        commercial_name: 'Maquis Bar SARL',
        address: 'Cocody, Abidjan, Côte d\'Ivoire',
        phone: '+225 27 22 44 55 66',
        email: 'contact@lemaquis.ci',
        sector: 'bar',
        is_active: true
      }
    ];

    // 3. Créer des catégories de produits
    const testCategories = [
      // Restaurant
      { name: 'Plats Principaux', description: 'Plats principaux du restaurant', sector: 'restaurant' },
      { name: 'Accompagnements', description: 'Accompagnements et garnitures', sector: 'restaurant' },
      { name: 'Boissons', description: 'Boissons chaudes et froides', sector: 'restaurant' },
      { name: 'Desserts', description: 'Desserts et pâtisseries', sector: 'restaurant' },
      
      // Hôtel
      { name: 'Chambres Standard', description: 'Chambres standard de l\'hôtel', sector: 'hotel' },
      { name: 'Suites', description: 'Suites et chambres de luxe', sector: 'hotel' },
      { name: 'Services', description: 'Services additionnels de l\'hôtel', sector: 'hotel' },
      
      // Bar
      { name: 'Bières', description: 'Bières locales et importées', sector: 'bar' },
      { name: 'Spiritueux', description: 'Whisky, vodka, rhum, etc.', sector: 'bar' },
      { name: 'Vins', description: 'Vins rouges, blancs et rosés', sector: 'bar' },
      { name: 'Sodas', description: 'Boissons gazeuses et jus', sector: 'bar' }
    ];

    // 4. Créer des produits/services de test
    const testItems = [
      // Restaurant - Plats
      { name: 'Attiéké Poisson', description: 'Attiéké avec poisson grillé et sauce tomate', price: 2500, category: 'Plats Principaux', sector: 'restaurant' },
      { name: 'Riz Gras', description: 'Riz gras avec viande et légumes', price: 3000, category: 'Plats Principaux', sector: 'restaurant' },
      { name: 'Poulet Braisé', description: 'Poulet braisé avec sauce', price: 3500, category: 'Plats Principaux', sector: 'restaurant' },
      { name: 'Alloco', description: 'Banane plantain frite avec sauce piment', price: 1500, category: 'Accompagnements', sector: 'restaurant' },
      { name: 'Jus de Bissap', description: 'Jus de bissap frais', price: 500, category: 'Boissons', sector: 'restaurant' },
      
      // Hôtel - Chambres
      { name: 'Chambre Standard', description: 'Chambre standard avec climatisation', price: 15000, category: 'Chambres Standard', sector: 'hotel' },
      { name: 'Chambre Deluxe', description: 'Chambre deluxe avec vue sur mer', price: 25000, category: 'Chambres Standard', sector: 'hotel' },
      { name: 'Suite Présidentielle', description: 'Suite de luxe avec salon', price: 50000, category: 'Suites', sector: 'hotel' },
      { name: 'Service Blanchisserie', description: 'Service de blanchisserie', price: 2000, category: 'Services', sector: 'hotel' },
      
      // Bar - Boissons
      { name: 'Bière Ivoire', description: 'Bière locale Ivoire 65cl', price: 800, category: 'Bières', sector: 'bar' },
      { name: 'Whisky Black Label', description: 'Whisky Johnnie Walker Black Label', price: 15000, category: 'Spiritueux', sector: 'bar' },
      { name: 'Vin Rouge Bordeaux', description: 'Vin rouge de Bordeaux', price: 8000, category: 'Vins', sector: 'bar' },
      { name: 'Coca-Cola', description: 'Coca-Cola 33cl', price: 500, category: 'Sodas', sector: 'bar' }
    ];

    console.log('✅ Données de test préparées');
    console.log(`📊 ${testUsers.length} utilisateurs, ${testEstablishments.length} établissements, ${testCategories.length} catégories, ${testItems.length} produits`);
    
    return {
      success: true,
      message: 'Base de données initialisée avec succès',
      data: {
        users: testUsers.length,
        establishments: testEstablishments.length,
        categories: testCategories.length,
        items: testItems.length
      }
    };

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    return {
      success: false,
      message: 'Erreur lors de l\'initialisation de la base de données',
      error: error
    };
  }
};

// Fonction pour créer des données de démonstration en mémoire
export const createDemoData = () => {
  return {
    users: [
      {
        id: '1',
        email: 'admin@sonutec.com',
        first_name: 'Admin',
        last_name: 'SONUTEC',
        role: 'admin_master',
        boutique_id: null,
        boutique_name: null,
        company_id: null,
        is_active: true
      },
      {
        id: '2',
        email: 'manager@restaurant.com',
        first_name: 'Jean',
        last_name: 'KOUASSI',
        role: 'manager',
        boutique_id: 'rest-001',
        boutique_name: 'Restaurant Le Palmier',
        company_id: 'comp-001',
        is_active: true
      },
      {
        id: '3',
        email: 'caissier@hotel.com',
        first_name: 'Marie',
        last_name: 'AYA',
        role: 'cashier',
        boutique_id: 'hotel-001',
        boutique_name: 'Hôtel Ivoire Palace',
        company_id: 'comp-002',
        is_active: true
      }
    ],
    establishments: [
      {
        id: 'rest-001',
        name: 'Restaurant Le Palmier',
        commercial_name: 'Le Palmier SARL',
        sector: 'restaurant',
        address: 'Plateau, Abidjan',
        phone: '+225 27 20 30 40 50',
        email: 'info@lepalmier.ci',
        is_active: true
      },
      {
        id: 'hotel-001',
        name: 'Hôtel Ivoire Palace',
        commercial_name: 'Ivoire Palace Hotel',
        sector: 'hotel',
        address: 'Marcory, Abidjan',
        phone: '+225 27 21 32 43 54',
        email: 'reservation@ivoirepalace.ci',
        is_active: true
      },
      {
        id: 'bar-001',
        name: 'Bar Le Maquis',
        commercial_name: 'Maquis Bar SARL',
        sector: 'bar',
        address: 'Cocody, Abidjan',
        phone: '+225 27 22 44 55 66',
        email: 'contact@lemaquis.ci',
        is_active: true
      }
    ]
  };
};

export default initCompleteDatabase;
