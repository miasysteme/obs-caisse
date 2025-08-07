// =====================================================
// SCRIPT D'INITIALISATION BASE DE DONNÉES MULTI-TENANT
// OBS BUSINESS SUITE - SONUTEC SARL
// =====================================================

import { supabase } from '../config/supabase'

// Script d'initialisation de la base de données multi-tenant
export const initializeMultiTenantDatabase = async () => {
  try {
    console.log('🚀 Initialisation de la base de données multi-tenant...')

    // 1. Vérifier la connexion Supabase
    const { data: connectionTest, error: connectionError } = await supabase
      .from('business_sectors')
      .select('count')
      .limit(1)

    if (connectionError) {
      console.log('⚠️ Les tables multi-tenant n\'existent pas encore.')
      console.log('📋 Veuillez d\'abord exécuter le script SQL dans Supabase :')
      console.log('   database/schema_multitenant.sql')
      return false
    }

    console.log('✅ Connexion à la base de données établie')

    // 2. Vérifier si les données de base existent déjà
    const { data: existingSectors } = await supabase
      .from('business_sectors')
      .select('id')
      .limit(1)

    if (existingSectors && existingSectors.length > 0) {
      console.log('ℹ️ Les données de base existent déjà')
      return true
    }

    // 3. Insérer les secteurs d'activité
    console.log('📊 Insertion des secteurs d\'activité...')
    const { error: sectorsError } = await supabase
      .from('business_sectors')
      .insert([
        {
          code: 'telephony',
          name: 'Téléphonie',
          display_name: 'Téléphonie & Électronique',
          description: 'Vente de téléphones, accessoires et électronique',
          icon: 'phone',
          color: '#2196F3',
          modules: ['pos', 'inventory', 'item_tracking', 'reports'],
          default_config: {
            currency: 'FCFA',
            tax_rate: 0.1925,
            requires_imei: true
          },
          pricing_model: {
            basic: 15000,
            standard: 25000,
            premium: 40000
          }
        },
        {
          code: 'hotel',
          name: 'Hôtellerie',
          display_name: 'Hôtellerie & Hébergement',
          description: 'Gestion d\'hôtels, auberges et résidences',
          icon: 'hotel',
          color: '#FF9800',
          modules: ['pos', 'hotel_rooms', 'reports', 'customers'],
          default_config: {
            currency: 'FCFA',
            tax_rate: 0.1925,
            occupation_types: ['sejour', 'nuitee', 'repos', 'passage']
          },
          pricing_model: {
            basic: 30000,
            standard: 50000,
            premium: 75000
          }
        },
        {
          code: 'bar',
          name: 'Bar',
          display_name: 'Bars & Débits de Boisson',
          description: 'Gestion de bars, nightclubs et buvettes',
          icon: 'local_bar',
          color: '#9C27B0',
          modules: ['pos', 'inventory', 'bar_stock', 'reports'],
          default_config: {
            currency: 'FCFA',
            tax_rate: 0.1925,
            daily_sheets: true,
            liquid_inventory: true
          },
          pricing_model: {
            basic: 18000,
            standard: 30000,
            premium: 45000
          }
        },
        {
          code: 'restaurant',
          name: 'Restauration',
          display_name: 'Restauration & Alimentation',
          description: 'Restaurants, maquis et fast-food',
          icon: 'restaurant',
          color: '#4CAF50',
          modules: ['pos', 'restaurant_orders', 'inventory', 'reports'],
          default_config: {
            currency: 'FCFA',
            tax_rate: 0.1925,
            table_management: true,
            kitchen_orders: true
          },
          pricing_model: {
            basic: 20000,
            standard: 35000,
            premium: 50000
          }
        },
        {
          code: 'retail',
          name: 'Commerce',
          display_name: 'Commerce de Détail',
          description: 'Boutiques, supérettes et magasins',
          icon: 'store',
          color: '#FF5722',
          modules: ['pos', 'inventory', 'customers', 'reports'],
          default_config: {
            currency: 'FCFA',
            tax_rate: 0.1925,
            promotions: true,
            loyalty_program: true
          },
          pricing_model: {
            basic: 15000,
            standard: 25000,
            premium: 40000
          }
        },
        {
          code: 'health',
          name: 'Santé',
          display_name: 'Santé & Médical',
          description: 'Cliniques, pharmacies et laboratoires',
          icon: 'local_hospital',
          color: '#F44336',
          modules: ['pos', 'inventory', 'customers', 'reports'],
          default_config: {
            currency: 'FCFA',
            tax_rate: 0.1925,
            patient_records: true,
            prescriptions: true
          },
          pricing_model: {
            basic: 25000,
            standard: 40000,
            premium: 60000
          }
        },
        {
          code: 'education',
          name: 'Éducation',
          display_name: 'Éducation & Formation',
          description: 'Écoles privées et centres de formation',
          icon: 'school',
          color: '#3F51B5',
          modules: ['pos', 'customers', 'reports'],
          default_config: {
            currency: 'FCFA',
            tax_rate: 0.1925,
            student_management: true,
            fee_collection: true
          },
          pricing_model: {
            basic: 20000,
            standard: 35000,
            premium: 50000
          }
        },
        {
          code: 'services',
          name: 'Services',
          display_name: 'Services Divers',
          description: 'Garages, salons de beauté, etc.',
          icon: 'build',
          color: '#607D8B',
          modules: ['pos', 'customers', 'reports'],
          default_config: {
            currency: 'FCFA',
            tax_rate: 0.1925,
            appointments: true,
            service_tracking: true
          },
          pricing_model: {
            basic: 15000,
            standard: 25000,
            premium: 40000
          }
        }
      ])

    if (sectorsError) {
      console.error('❌ Erreur insertion secteurs:', sectorsError)
      return false
    }

    console.log('✅ Secteurs d\'activité créés')

    // 4. Insérer les modules système
    console.log('🔧 Insertion des modules système...')
    const { error: modulesError } = await supabase
      .from('system_modules')
      .insert([
        {
          code: 'auth',
          name: 'Authentification',
          description: 'Gestion des utilisateurs et connexions',
          permissions: ['login', 'logout', 'change_password'],
          dependencies: [],
          pricing: { included: true },
          is_core: true
        },
        {
          code: 'dashboard',
          name: 'Tableau de Bord',
          description: 'Vue d\'ensemble et métriques',
          permissions: ['view_dashboard', 'view_metrics'],
          dependencies: ['auth'],
          pricing: { included: true },
          is_core: true
        },
        {
          code: 'pos',
          name: 'Point de Vente',
          description: 'Interface de caisse et ventes',
          permissions: ['process_sales', 'view_products', 'manage_cart'],
          dependencies: ['auth', 'dashboard'],
          pricing: { included: true },
          is_core: true
        },
        {
          code: 'inventory',
          name: 'Inventaire',
          description: 'Gestion des stocks et produits',
          permissions: ['view_inventory', 'manage_products', 'adjust_stock'],
          dependencies: ['auth'],
          pricing: { included: true },
          is_core: true
        },
        {
          code: 'customers',
          name: 'Clients',
          description: 'Gestion de la clientèle',
          permissions: ['view_customers', 'manage_customers'],
          dependencies: ['auth'],
          pricing: { monthly: 5000 },
          is_core: false
        },
        {
          code: 'reports',
          name: 'Rapports',
          description: 'Rapports et analyses',
          permissions: ['view_reports', 'export_data'],
          dependencies: ['auth'],
          pricing: { monthly: 3000 },
          is_core: false
        },
        {
          code: 'settings',
          name: 'Paramètres',
          description: 'Configuration du système',
          permissions: ['manage_settings', 'configure_modules'],
          dependencies: ['auth'],
          pricing: { included: true },
          is_core: true
        },
        {
          code: 'hotel_rooms',
          name: 'Gestion Chambres',
          description: 'Gestion des chambres d\'hôtel',
          permissions: ['view_rooms', 'manage_occupations', 'housekeeping'],
          dependencies: ['auth', 'pos'],
          pricing: { monthly: 10000 },
          is_core: false
        },
        {
          code: 'bar_stock',
          name: 'Stock Bar',
          description: 'Fiche journalière pour bars',
          permissions: ['view_daily_sheets', 'manage_liquid_inventory'],
          dependencies: ['auth', 'inventory'],
          pricing: { monthly: 8000 },
          is_core: false
        },
        {
          code: 'restaurant_orders',
          name: 'Commandes Restaurant',
          description: 'Gestion des commandes restaurant',
          permissions: ['view_orders', 'manage_kitchen', 'table_management'],
          dependencies: ['auth', 'pos'],
          pricing: { monthly: 12000 },
          is_core: false
        },
        {
          code: 'item_tracking',
          name: 'Traçabilité',
          description: 'Suivi IMEI et numéros de série',
          permissions: ['track_items', 'view_history', 'manage_warranties'],
          dependencies: ['auth', 'inventory'],
          pricing: { monthly: 7000 },
          is_core: false
        }
      ])

    if (modulesError) {
      console.error('❌ Erreur insertion modules:', modulesError)
      return false
    }

    console.log('✅ Modules système créés')

    // 5. Insérer les rôles système
    console.log('👥 Insertion des rôles système...')
    const { error: rolesError } = await supabase
      .from('system_roles')
      .insert([
        {
          code: 'super_admin',
          name: 'Super Administrateur',
          description: 'Administrateur SONUTEC avec tous les droits',
          level: 1,
          permissions: ['*'],
          is_system: true
        },
        {
          code: 'client_admin',
          name: 'Administrateur Client',
          description: 'Administrateur d\'une entreprise cliente',
          level: 2,
          permissions: [
            'manage_establishments',
            'manage_users',
            'view_reports',
            'configure_modules',
            'manage_subscriptions'
          ],
          is_system: true
        },
        {
          code: 'manager',
          name: 'Manager',
          description: 'Gestionnaire d\'un établissement',
          level: 3,
          permissions: [
            'manage_inventory',
            'view_reports',
            'manage_staff',
            'process_sales',
            'manage_customers',
            'configure_establishment'
          ],
          is_system: true
        },
        {
          code: 'cashier',
          name: 'Caissier',
          description: 'Utilisateur de caisse',
          level: 4,
          permissions: [
            'process_sales',
            'view_inventory',
            'view_customers'
          ],
          is_system: true
        },
        {
          code: 'staff',
          name: 'Personnel',
          description: 'Personnel général',
          level: 4,
          permissions: [
            'basic_access',
            'view_inventory'
          ],
          is_system: true
        }
      ])

    if (rolesError) {
      console.error('❌ Erreur insertion rôles:', rolesError)
      return false
    }

    console.log('✅ Rôles système créés')

    // 6. Créer les liaisons secteurs-modules par défaut
    console.log('🔗 Création des liaisons secteurs-modules...')
    
    // Récupérer les IDs des secteurs et modules
    const { data: sectors } = await supabase.from('business_sectors').select('id, code')
    const { data: modules } = await supabase.from('system_modules').select('id, code, is_core')

    if (!sectors || !modules) {
      console.error('❌ Impossible de récupérer les secteurs ou modules')
      return false
    }

    const sectorModules = []

    // Modules de base pour tous les secteurs
    const coreModules = modules.filter((m: any) => m.is_core)
    for (const sector of sectors) {
      for (const module of coreModules) {
        sectorModules.push({
          sector_id: sector.id,
          module_id: module.id,
          is_default: true,
          config: {}
        })
      }
    }

    // Modules spécifiques par secteur
    const sectorSpecificModules: Record<string, string[]> = {
      'telephony': ['item_tracking'],
      'hotel': ['hotel_rooms'],
      'bar': ['bar_stock'],
      'restaurant': ['restaurant_orders']
    }

    for (const sectorCode in sectorSpecificModules) {
      const modulesCodes = sectorSpecificModules[sectorCode]
      const sector = sectors.find((s: any) => s.code === sectorCode)
      if (sector) {
        for (const moduleCode of modulesCodes) {
          const module = modules.find((m: any) => m.code === moduleCode)
          if (module) {
            sectorModules.push({
              sector_id: sector.id,
              module_id: module.id,
              is_default: true,
              config: {}
            })
          }
        }
      }
    }

    const { error: sectorModulesError } = await supabase
      .from('sector_modules')
      .insert(sectorModules)

    if (sectorModulesError) {
      console.error('❌ Erreur création liaisons secteurs-modules:', sectorModulesError)
      return false
    }

    console.log('✅ Liaisons secteurs-modules créées')

    // 7. Créer un client de test (La Maison des Téléphones)
    console.log('🏢 Création du client de test...')
    const { data: testClient, error: clientError } = await supabase
      .from('clients')
      .insert({
        company_name: 'La Maison des Téléphones',
        legal_name: 'La Maison des Téléphones SARL',
        registration_number: 'RC-YDE-2020-B-12345',
        tax_number: 'M012345678901',
        contact_info: {
          email: 'contact@maisontel.com',
          phone: '+237123456789',
          address: 'Yaoundé, Cameroun',
          website: 'www.maisontel.com'
        },
        sectors: [sectors.find((s: any) => s.code === 'telephony')?.id],
        subscription_plan: 'standard',
        billing_cycle: 'monthly',
        is_active: true
      })
      .select()
      .single()

    if (clientError) {
      console.error('❌ Erreur création client:', clientError)
      return false
    }

    console.log('✅ Client de test créé')

    // 8. Créer un établissement de test
    console.log('🏪 Création de l\'établissement de test...')
    const telephonySector = sectors.find((s: any) => s.code === 'telephony')
    const coreModuleIds = modules.filter((m: any) => m.is_core).map((m: any) => m.id)
    const trackingModule = modules.find((m: any) => m.code === 'item_tracking')
    const enabledModules = trackingModule ? [...coreModuleIds, trackingModule.id] : coreModuleIds

    const { data: testEstablishment, error: establishmentError } = await supabase
      .from('establishments')
      .insert({
        client_id: testClient.id,
        sector_id: telephonySector?.id,
        name: 'Boutique Centrale',
        commercial_name: 'La Maison des Téléphones - Central',
        type: 'boutique',
        address: 'Avenue Kennedy, Yaoundé',
        phone: '+237123456789',
        email: 'central@maisontel.com',
        config: {
          currency: 'FCFA',
          tax_rate: 0.1925,
          requires_imei: true,
          theme: {
            primary: '#2196F3',
            secondary: '#1976D2'
          }
        },
        modules_enabled: enabledModules,
        subscription_status: 'active',
        subscription_start_date: new Date().toISOString().split('T')[0],
        subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        monthly_fee: 25000,
        is_active: true
      })
      .select()
      .single()

    if (establishmentError) {
      console.error('❌ Erreur création établissement:', establishmentError)
      return false
    }

    console.log('✅ Établissement de test créé')

    console.log('🎉 Initialisation multi-tenant terminée avec succès!')
    console.log('\n📋 Résumé:')
    console.log(`- ${sectors.length} secteurs d'activité créés`)
    console.log(`- ${modules.length} modules système créés`)
    console.log(`- ${sectorModules.length} liaisons secteurs-modules créées`)
    console.log('- 1 client de test créé (La Maison des Téléphones)')
    console.log('- 1 établissement de test créé (Boutique Centrale)')
    console.log('\n✨ La plateforme multi-tenant est prête!')

    return true

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation multi-tenant:', error)
    return false
  }
}

// Fonction pour nettoyer les données de test (développement uniquement)
export const cleanMultiTenantDatabase = async () => {
  try {
    console.log('🧹 Nettoyage de la base de données multi-tenant...')

    // Supprimer dans l'ordre inverse des dépendances
    await supabase.from('sector_modules').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('establishments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('clients').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('system_roles').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('system_modules').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('business_sectors').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    console.log('✅ Base de données multi-tenant nettoyée')
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error)
  }
}

// Fonction pour vérifier l'état de la base de données
export const checkMultiTenantDatabase = async () => {
  try {
    console.log('🔍 Vérification de l\'état de la base de données...')

    const checks = [
      { table: 'business_sectors', name: 'Secteurs d\'activité' },
      { table: 'system_modules', name: 'Modules système' },
      { table: 'system_roles', name: 'Rôles système' },
      { table: 'clients', name: 'Clients' },
      { table: 'establishments', name: 'Établissements' }
    ]

    for (const check of checks) {
      const { data, error } = await supabase
        .from(check.table)
        .select('id')
        .limit(1)

      if (error) {
        console.log(`❌ ${check.name}: Table non trouvée`)
      } else {
        const { count } = await supabase
          .from(check.table)
          .select('*', { count: 'exact', head: true })

        console.log(`✅ ${check.name}: ${count || 0} enregistrements`)
      }
    }

    return true
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error)
    return false
  }
}
