-- =====================================================
-- ARCHITECTURE MULTI-TENANT MULTI-SECTORIELLE
-- OBS BUSINESS SUITE - SONUTEC SARL
-- =====================================================

-- Extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- =====================================================
-- 1. TABLES DE CONFIGURATION SYSTÈME
-- =====================================================

-- Table des secteurs d'activité
CREATE TABLE business_sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL, -- 'telephony', 'hotel', 'bar', 'restaurant'
    name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100), -- Icône pour l'interface
    color VARCHAR(7), -- Couleur hexadécimale pour le thème
    modules JSONB DEFAULT '[]', -- Modules disponibles pour ce secteur
    default_config JSONB DEFAULT '{}', -- Configuration par défaut
    pricing_model JSONB DEFAULT '{}', -- Modèle de tarification
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des modules système
CREATE TABLE system_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL, -- 'pos', 'inventory', 'reports', 'hotel_rooms'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    component_path VARCHAR(500), -- Chemin vers le composant React
    permissions TEXT[], -- Permissions requises
    dependencies TEXT[], -- Modules dépendants
    pricing JSONB DEFAULT '{}', -- Tarification du module
    is_core BOOLEAN DEFAULT false, -- Module du noyau (obligatoire)
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table de liaison secteurs-modules
CREATE TABLE sector_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sector_id UUID REFERENCES business_sectors(id) ON DELETE CASCADE,
    module_id UUID REFERENCES system_modules(id) ON DELETE CASCADE,
    is_default BOOLEAN DEFAULT false, -- Module activé par défaut
    config JSONB DEFAULT '{}', -- Configuration spécifique au secteur
    UNIQUE(sector_id, module_id)
);

-- =====================================================
-- 2. TABLES CLIENTS ET MULTI-TENANCY
-- =====================================================

-- Table des clients (entreprises utilisant la plateforme)
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    registration_number VARCHAR(100), -- Numéro RCCM
    tax_number VARCHAR(100), -- Numéro fiscal
    contact_info JSONB DEFAULT '{}', -- Email, téléphone, adresse
    sectors UUID[] DEFAULT '{}', -- Secteurs d'activité du client
    subscription_plan VARCHAR(50) DEFAULT 'basic', -- 'basic', 'standard', 'premium'
    billing_cycle VARCHAR(20) DEFAULT 'monthly', -- 'monthly', 'quarterly', 'yearly'
    is_active BOOLEAN DEFAULT true,
    trial_ends_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des établissements (boutiques/restaurants/hôtels/bars)
CREATE TABLE establishments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    sector_id UUID REFERENCES business_sectors(id),
    name VARCHAR(255) NOT NULL,
    commercial_name VARCHAR(255),
    type VARCHAR(100), -- Type spécifique dans le secteur
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    coordinates JSONB, -- Latitude, longitude
    config JSONB DEFAULT '{}', -- Configuration spécifique
    modules_enabled UUID[] DEFAULT '{}', -- Modules activés
    subscription_status VARCHAR(50) DEFAULT 'active',
    subscription_start_date DATE DEFAULT CURRENT_DATE,
    subscription_end_date DATE,
    monthly_fee DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 3. GESTION DES UTILISATEURS MULTI-TENANT
-- =====================================================

-- Table des rôles système
CREATE TABLE system_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL, -- 'super_admin', 'client_admin', 'manager', 'user'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    level INTEGER NOT NULL, -- Niveau hiérarchique (1=super_admin, 4=user)
    permissions TEXT[] DEFAULT '{}',
    is_system BOOLEAN DEFAULT false, -- Rôle système non modifiable
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table des utilisateurs
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role_id UUID REFERENCES system_roles(id),
    client_id UUID REFERENCES clients(id), -- NULL pour super admin
    establishment_id UUID REFERENCES establishments(id), -- NULL pour admins clients
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    avatar_url VARCHAR(500),
    preferences JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des sessions utilisateur
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    establishment_id UUID REFERENCES establishments(id), -- Établissement actif
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 4. TABLES COMMUNES MULTI-SECTEURS
-- =====================================================

-- Table des catégories (adaptable par secteur)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    establishment_id UUID REFERENCES establishments(id) ON DELETE CASCADE,
    sector_id UUID REFERENCES business_sectors(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    icon VARCHAR(100),
    color VARCHAR(7),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table des produits/services (générique multi-secteur)
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    establishment_id UUID REFERENCES establishments(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id),
    code VARCHAR(100), -- Code produit/service
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- 'product', 'service', 'room', 'drink', 'food'
    unit VARCHAR(50), -- 'piece', 'liter', 'kg', 'hour', 'night'
    purchase_price DECIMAL(10,2),
    selling_price DECIMAL(10,2),
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    tax_rate DECIMAL(5,4) DEFAULT 0.1925, -- TVA Côte d'Ivoire
    specifications JSONB DEFAULT '{}', -- Spécifications spécifiques au secteur
    images JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    requires_tracking BOOLEAN DEFAULT false, -- IMEI, numéro série, etc.
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(establishment_id, code)
);

-- Table du stock/inventaire (générique)
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    establishment_id UUID REFERENCES establishments(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    quantity DECIMAL(10,3) DEFAULT 0, -- Support des décimales pour liquides
    reserved_quantity DECIMAL(10,3) DEFAULT 0,
    min_threshold DECIMAL(10,3) DEFAULT 0,
    max_threshold DECIMAL(10,3) DEFAULT 0,
    unit_cost DECIMAL(10,2),
    location VARCHAR(255), -- Emplacement physique
    last_inventory_date DATE,
    last_updated TIMESTAMP DEFAULT NOW(),
    UNIQUE(establishment_id, item_id)
);

-- Table des mouvements de stock
CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    establishment_id UUID REFERENCES establishments(id),
    item_id UUID REFERENCES items(id),
    movement_type VARCHAR(50) NOT NULL, -- 'in', 'out', 'adjustment', 'transfer'
    quantity DECIMAL(10,3) NOT NULL,
    unit_cost DECIMAL(10,2),
    reference_type VARCHAR(50), -- 'sale', 'purchase', 'adjustment', 'transfer'
    reference_id UUID,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 5. TABLES TRANSACTIONNELLES GÉNÉRIQUES
-- =====================================================

-- Table des transactions (ventes, réservations, etc.)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    establishment_id UUID REFERENCES establishments(id),
    transaction_number VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'sale', 'reservation', 'service', 'rental'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    customer_data JSONB DEFAULT '{}', -- Données client spécifiques au secteur
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    amount_paid DECIMAL(10,2) DEFAULT 0,
    amount_due DECIMAL(10,2) DEFAULT 0,
    transaction_data JSONB DEFAULT '{}', -- Données spécifiques au secteur
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des lignes de transaction
CREATE TABLE transaction_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id),
    quantity DECIMAL(10,3) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    item_data JSONB DEFAULT '{}', -- Données spécifiques (IMEI, durée, etc.)
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 6. TABLES SPÉCIFIQUES SECTEURS (EXEMPLES)
-- =====================================================

-- Table pour traçabilité (téléphonie, électronique)
CREATE TABLE item_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    establishment_id UUID REFERENCES establishments(id),
    item_id UUID REFERENCES items(id),
    tracking_number VARCHAR(100) NOT NULL, -- IMEI, numéro série
    current_status VARCHAR(50) DEFAULT 'in_stock',
    purchase_date DATE,
    sale_date DATE,
    warranty_start_date DATE,
    warranty_end_date DATE,
    transaction_id UUID REFERENCES transactions(id),
    history JSONB DEFAULT '[]', -- Historique des mouvements
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(establishment_id, tracking_number)
);

-- Table pour gestion des chambres (hôtellerie)
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    establishment_id UUID REFERENCES establishments(id) ON DELETE CASCADE,
    room_number VARCHAR(50) NOT NULL,
    room_type VARCHAR(100), -- 'standard', 'deluxe', 'suite'
    floor INTEGER,
    capacity INTEGER DEFAULT 2,
    amenities JSONB DEFAULT '[]',
    base_price DECIMAL(10,2),
    hourly_price DECIMAL(10,2), -- Prix à l'heure (repos, passage)
    status VARCHAR(50) DEFAULT 'available', -- 'available', 'occupied', 'cleaning', 'maintenance'
    last_cleaned TIMESTAMP,
    coordinates JSONB, -- Position sur le plan
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(establishment_id, room_number)
);

-- Table des occupations de chambres
CREATE TABLE room_occupations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id),
    transaction_id UUID REFERENCES transactions(id),
    occupation_type VARCHAR(50) NOT NULL, -- 'sejour', 'nuitee', 'repos', 'passage'
    check_in TIMESTAMP NOT NULL,
    check_out TIMESTAMP,
    planned_checkout TIMESTAMP,
    guest_count INTEGER DEFAULT 1,
    rate_per_unit DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'cancelled'
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 7. TABLES DE CONFIGURATION ET ABONNEMENTS
-- =====================================================

-- Table des abonnements
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    establishment_id UUID REFERENCES establishments(id) ON DELETE CASCADE,
    plan_name VARCHAR(100),
    modules_included UUID[],
    monthly_fee DECIMAL(10,2),
    setup_fee DECIMAL(10,2) DEFAULT 0,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'suspended', 'cancelled'
    auto_renew BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table des factures d'abonnement
CREATE TABLE subscription_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES subscriptions(id),
    establishment_id UUID REFERENCES establishments(id),
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    period_start DATE,
    period_end DATE,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'overdue', 'cancelled'
    payment_date TIMESTAMP,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 8. TABLES D'AUDIT ET LOGS
-- =====================================================

-- Table d'audit
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    establishment_id UUID REFERENCES establishments(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 9. INDEX POUR PERFORMANCE
-- =====================================================

-- Index pour les requêtes fréquentes
CREATE INDEX idx_establishments_client_sector ON establishments(client_id, sector_id);
CREATE INDEX idx_users_establishment ON users(establishment_id);
CREATE INDEX idx_items_establishment_active ON items(establishment_id, is_active);
CREATE INDEX idx_inventory_establishment_item ON inventory(establishment_id, item_id);
CREATE INDEX idx_transactions_establishment_date ON transactions(establishment_id, created_at);
CREATE INDEX idx_transaction_items_transaction ON transaction_items(transaction_id);
CREATE INDEX idx_rooms_establishment_status ON rooms(establishment_id, status);
CREATE INDEX idx_audit_logs_establishment_date ON audit_logs(establishment_id, created_at);

-- Index pour la recherche full-text
CREATE INDEX idx_items_search ON items USING gin(to_tsvector('french', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_clients_search ON clients USING gin(to_tsvector('french', company_name));

-- =====================================================
-- 10. POLITIQUES RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Activer RLS sur les tables sensibles
ALTER TABLE establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Politique pour les établissements
CREATE POLICY establishment_isolation ON establishments
    FOR ALL TO authenticated
    USING (
        client_id = (SELECT client_id FROM users WHERE id = auth.uid())
        OR 
        id = (SELECT establishment_id FROM users WHERE id = auth.uid())
        OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role_id IN (
            SELECT id FROM system_roles WHERE code = 'super_admin'
        ))
    );

-- Politique pour les utilisateurs
CREATE POLICY user_access_policy ON users
    FOR ALL TO authenticated
    USING (
        id = auth.uid()
        OR
        client_id = (SELECT client_id FROM users WHERE id = auth.uid())
        OR
        establishment_id = (SELECT establishment_id FROM users WHERE id = auth.uid())
        OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role_id IN (
            SELECT id FROM system_roles WHERE code IN ('super_admin', 'client_admin')
        ))
    );

-- Politique pour les items
CREATE POLICY items_establishment_policy ON items
    FOR ALL TO authenticated
    USING (
        establishment_id IN (
            SELECT id FROM establishments WHERE 
            client_id = (SELECT client_id FROM users WHERE id = auth.uid())
            OR id = (SELECT establishment_id FROM users WHERE id = auth.uid())
        )
        OR
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role_id IN (
            SELECT id FROM system_roles WHERE code = 'super_admin'
        ))
    );

-- =====================================================
-- 11. FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour générer les numéros de transaction
CREATE OR REPLACE FUNCTION generate_transaction_number(
    establishment_id UUID,
    transaction_type VARCHAR(50)
)
RETURNS VARCHAR(100) AS $$
DECLARE
    establishment_code VARCHAR(10);
    sequence_num INTEGER;
    transaction_number VARCHAR(100);
BEGIN
    -- Récupérer le code de l'établissement
    SELECT UPPER(LEFT(name, 3)) INTO establishment_code
    FROM establishments WHERE id = establishment_id;
    
    -- Générer le numéro séquentiel pour aujourd'hui
    SELECT COALESCE(MAX(CAST(RIGHT(transaction_number, 4) AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM transactions 
    WHERE establishment_id = generate_transaction_number.establishment_id
    AND type = transaction_type
    AND DATE(created_at) = CURRENT_DATE;
    
    -- Format: EST-TYPE-YYYYMMDD-0001
    transaction_number := establishment_code || '-' || UPPER(transaction_type) || '-' || 
                         TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || 
                         LPAD(sequence_num::TEXT, 4, '0');
    
    RETURN transaction_number;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour l'inventaire
CREATE OR REPLACE FUNCTION update_inventory_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
    -- Décrémenter l'inventaire pour les ventes
    IF NEW.type = 'sale' AND NEW.status = 'completed' THEN
        UPDATE inventory 
        SET quantity = quantity - ti.quantity,
            last_updated = NOW()
        FROM transaction_items ti
        WHERE ti.transaction_id = NEW.id
        AND inventory.item_id = ti.item_id
        AND inventory.establishment_id = NEW.establishment_id;
        
        -- Enregistrer les mouvements
        INSERT INTO inventory_movements (
            establishment_id, item_id, movement_type, quantity,
            reference_type, reference_id, created_by
        )
        SELECT 
            NEW.establishment_id, ti.item_id, 'out', ti.quantity,
            'sale', NEW.id, NEW.processed_by
        FROM transaction_items ti
        WHERE ti.transaction_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mise à jour automatique de l'inventaire
CREATE TRIGGER trigger_update_inventory_on_transaction
    AFTER UPDATE ON transactions
    FOR EACH ROW
    WHEN (OLD.status != NEW.status AND NEW.status = 'completed')
    EXECUTE FUNCTION update_inventory_on_transaction();

-- =====================================================
-- 12. DONNÉES DE BASE
-- =====================================================

-- Insertion des secteurs d'activité
INSERT INTO business_sectors (code, name, display_name, description, icon, color) VALUES
('telephony', 'Téléphonie', 'Téléphonie & Électronique', 'Vente de téléphones, accessoires et électronique', 'phone', '#2196F3'),
('hotel', 'Hôtellerie', 'Hôtellerie & Hébergement', 'Gestion d''hôtels, auberges et résidences', 'hotel', '#FF9800'),
('bar', 'Bar', 'Bars & Débits de Boisson', 'Gestion de bars, nightclubs et buvettes', 'local_bar', '#9C27B0'),
('restaurant', 'Restauration', 'Restauration & Alimentation', 'Restaurants, maquis et fast-food', 'restaurant', '#4CAF50'),
('retail', 'Commerce', 'Commerce de Détail', 'Boutiques, supérettes et magasins', 'store', '#FF5722'),
('health', 'Santé', 'Santé & Médical', 'Cliniques, pharmacies et laboratoires', 'local_hospital', '#F44336'),
('education', 'Éducation', 'Éducation & Formation', 'Écoles privées et centres de formation', 'school', '#3F51B5'),
('services', 'Services', 'Services Divers', 'Garages, salons de beauté, etc.', 'build', '#607D8B');

-- Insertion des modules système
INSERT INTO system_modules (code, name, description, is_core) VALUES
('auth', 'Authentification', 'Gestion des utilisateurs et connexions', true),
('dashboard', 'Tableau de Bord', 'Vue d''ensemble et métriques', true),
('pos', 'Point de Vente', 'Interface de caisse et ventes', true),
('inventory', 'Inventaire', 'Gestion des stocks et produits', true),
('customers', 'Clients', 'Gestion de la clientèle', false),
('reports', 'Rapports', 'Rapports et analyses', false),
('settings', 'Paramètres', 'Configuration du système', true),
('hotel_rooms', 'Gestion Chambres', 'Gestion des chambres d''hôtel', false),
('bar_stock', 'Stock Bar', 'Fiche journalière pour bars', false),
('restaurant_orders', 'Commandes Restaurant', 'Gestion des commandes restaurant', false),
('item_tracking', 'Traçabilité', 'Suivi IMEI et numéros de série', false);

-- Insertion des rôles système
INSERT INTO system_roles (code, name, description, level, permissions, is_system) VALUES
('super_admin', 'Super Administrateur', 'Administrateur SONUTEC avec tous les droits', 1, ARRAY['*'], true),
('client_admin', 'Administrateur Client', 'Administrateur d''une entreprise cliente', 2, ARRAY['manage_establishments', 'manage_users', 'view_reports'], true),
('manager', 'Manager', 'Gestionnaire d''un établissement', 3, ARRAY['manage_inventory', 'view_reports', 'manage_staff'], true),
('cashier', 'Caissier', 'Utilisateur de caisse', 4, ARRAY['process_sales', 'view_inventory'], true),
('staff', 'Personnel', 'Personnel général', 4, ARRAY['basic_access'], true);

-- Liaison secteurs-modules par défaut
INSERT INTO sector_modules (sector_id, module_id, is_default)
SELECT s.id, m.id, true
FROM business_sectors s, system_modules m
WHERE m.is_core = true;

-- Modules spécifiques par secteur
INSERT INTO sector_modules (sector_id, module_id, is_default)
SELECT s.id, m.id, true
FROM business_sectors s, system_modules m
WHERE (s.code = 'telephony' AND m.code = 'item_tracking')
   OR (s.code = 'hotel' AND m.code = 'hotel_rooms')
   OR (s.code = 'bar' AND m.code = 'bar_stock')
   OR (s.code = 'restaurant' AND m.code = 'restaurant_orders');

COMMENT ON SCHEMA public IS 'Architecture multi-tenant multi-sectorielle - OBS Business Suite';
