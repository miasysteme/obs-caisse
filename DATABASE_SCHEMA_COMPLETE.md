# OBS CAISSE - Schéma de Base de Données Complet

## STRUCTURE COMPLÈTE SUPABASE

### 1. CONFIGURATION INITIALE

```sql
-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Extension pour fonctions de date
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Configuration RLS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';
```

### 2. TABLES PRINCIPALES

#### 2.1 Gestion des utilisateurs et boutiques

```sql
-- Table des entreprises clientes (SONUTEC clients)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address TEXT,
    subscription_plan VARCHAR(50) DEFAULT 'standard',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des boutiques
CREATE TABLE boutiques (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    commercial_name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    is_central BOOLEAN DEFAULT false,
    subscription_status VARCHAR(50) DEFAULT 'active',
    subscription_start_date DATE,
    subscription_end_date DATE,
    monthly_fee DECIMAL(10,2) DEFAULT 20000,
    last_payment_date DATE,
    grace_period_end DATE,
    printer_config JSONB DEFAULT '{}',
    pos_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des utilisateurs
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin_master', 'admin_central', 'manager', 'cashier')),
    company_id UUID REFERENCES companies(id),
    boutique_id UUID REFERENCES boutiques(id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_boutique ON users(boutique_id);
CREATE INDEX idx_boutiques_company ON boutiques(company_id);
```

#### 2.2 Gestion des produits et stock

```sql
-- Table des catégories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table des marques
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table des produits
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    category_id UUID REFERENCES categories(id),
    brand_id UUID REFERENCES brands(id),
    model VARCHAR(100),
    is_phone BOOLEAN DEFAULT false,
    requires_imei BOOLEAN DEFAULT false,
    purchase_price DECIMAL(10,2),
    recommended_price DECIMAL(10,2),
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    description TEXT,
    specifications JSONB DEFAULT '{}',
    images JSONB DEFAULT '[]',
    warranty_months INTEGER DEFAULT 12,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table du stock par boutique
CREATE TABLE stock (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    boutique_id UUID REFERENCES boutiques(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 0 CHECK (quantity >= 0),
    reserved_quantity INTEGER DEFAULT 0 CHECK (reserved_quantity >= 0),
    min_threshold INTEGER DEFAULT 5,
    max_threshold INTEGER DEFAULT 100,
    last_inventory_date DATE,
    last_updated TIMESTAMP DEFAULT NOW(),
    UNIQUE(product_id, boutique_id)
);

-- Table des mouvements de stock
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    boutique_id UUID REFERENCES boutiques(id),
    movement_type VARCHAR(50) NOT NULL CHECK (movement_type IN ('in', 'out', 'transfer_out', 'transfer_in', 'adjustment', 'inventory')),
    quantity INTEGER NOT NULL,
    unit_cost DECIMAL(10,2),
    reference_type VARCHAR(50), -- 'sale', 'transfer', 'adjustment', 'inventory'
    reference_id UUID,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour performance stock
CREATE INDEX idx_stock_boutique_product ON stock(boutique_id, product_id);
CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_boutique ON stock_movements(boutique_id);
CREATE INDEX idx_stock_movements_date ON stock_movements(created_at);
```

#### 2.3 Gestion des ventes et IMEI

```sql
-- Table des ventes
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_number VARCHAR(50) UNIQUE NOT NULL,
    boutique_id UUID REFERENCES boutiques(id),
    cashier_id UUID REFERENCES users(id),
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    tax_rate DECIMAL(5,4) DEFAULT 0.1925, -- 19.25% TVA Cameroun
    tax_amount DECIMAL(10,2) NOT NULL CHECK (tax_amount >= 0),
    discount_amount DECIMAL(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('cash', 'card', 'mobile_money', 'credit', 'bank_transfer')),
    amount_received DECIMAL(10,2),
    change_amount DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded')),
    receipt_printed BOOLEAN DEFAULT false,
    invoice_printed BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des articles vendus
CREATE TABLE sale_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    imei VARCHAR(50),
    serial_number VARCHAR(100),
    warranty_start_date DATE DEFAULT CURRENT_DATE,
    warranty_end_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table de traçabilité IMEI
CREATE TABLE imei_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    imei VARCHAR(50) UNIQUE NOT NULL,
    product_id UUID REFERENCES products(id),
    current_boutique_id UUID REFERENCES boutiques(id),
    original_sale_id UUID REFERENCES sales(id),
    current_status VARCHAR(50) DEFAULT 'in_stock' CHECK (current_status IN ('in_stock', 'sold', 'returned', 'transferred', 'defective')),
    purchase_date DATE,
    sale_date DATE,
    return_date DATE,
    warranty_status VARCHAR(50) DEFAULT 'active' CHECK (warranty_status IN ('active', 'expired', 'voided')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Historique des mouvements IMEI
CREATE TABLE imei_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    imei VARCHAR(50) NOT NULL,
    previous_status VARCHAR(50),
    new_status VARCHAR(50),
    boutique_id UUID REFERENCES boutiques(id),
    reference_type VARCHAR(50), -- 'sale', 'return', 'transfer'
    reference_id UUID,
    changed_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour IMEI
CREATE INDEX idx_imei_tracking_imei ON imei_tracking(imei);
CREATE INDEX idx_imei_tracking_boutique ON imei_tracking(current_boutique_id);
CREATE INDEX idx_imei_history_imei ON imei_history(imei);
CREATE INDEX idx_sales_boutique_date ON sales(boutique_id, created_at);
CREATE INDEX idx_sales_number ON sales(sale_number);
```

#### 2.4 Gestion des transferts

```sql
-- Table des transferts
CREATE TABLE transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transfer_number VARCHAR(50) UNIQUE NOT NULL,
    from_boutique_id UUID REFERENCES boutiques(id),
    to_boutique_id UUID REFERENCES boutiques(id),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'shipped', 'received', 'cancelled')),
    requested_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    shipped_by UUID REFERENCES users(id),
    received_by UUID REFERENCES users(id),
    request_date TIMESTAMP DEFAULT NOW(),
    approval_date TIMESTAMP,
    ship_date TIMESTAMP,
    receive_date TIMESTAMP,
    total_items INTEGER DEFAULT 0,
    notes TEXT,
    shipping_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des articles de transfert
CREATE TABLE transfer_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transfer_id UUID REFERENCES transfers(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity_requested INTEGER NOT NULL CHECK (quantity_requested > 0),
    quantity_shipped INTEGER DEFAULT 0 CHECK (quantity_shipped >= 0),
    quantity_received INTEGER DEFAULT 0 CHECK (quantity_received >= 0),
    unit_cost DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour transferts
CREATE INDEX idx_transfers_from_boutique ON transfers(from_boutique_id);
CREATE INDEX idx_transfers_to_boutique ON transfers(to_boutique_id);
CREATE INDEX idx_transfers_status ON transfers(status);
```

#### 2.5 Gestion des abonnements et facturation

```sql
-- Table des abonnements
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boutique_id UUID REFERENCES boutiques(id) ON DELETE CASCADE,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    payment_date TIMESTAMP,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    late_fee DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des paiements
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES subscriptions(id),
    boutique_id UUID REFERENCES boutiques(id),
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(50) NOT NULL,
    payment_reference VARCHAR(255),
    transaction_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    processed_by UUID REFERENCES users(id),
    receipt_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table des notifications de paiement
CREATE TABLE payment_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boutique_id UUID REFERENCES boutiques(id),
    subscription_id UUID REFERENCES subscriptions(id),
    notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('reminder', 'overdue', 'suspension', 'reactivation')),
    message TEXT NOT NULL,
    sent_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### 2.6 Audit et logs

```sql
-- Table d'audit
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    boutique_id UUID REFERENCES boutiques(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table des sessions utilisateur
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour audit
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_date ON audit_logs(created_at);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
```

### 3. FONCTIONS ET TRIGGERS

#### 3.1 Fonction de mise à jour du stock

```sql
-- Fonction pour mettre à jour le stock après une vente
CREATE OR REPLACE FUNCTION update_stock_after_sale()
RETURNS TRIGGER AS $$
BEGIN
    -- Décrémenter le stock
    UPDATE stock 
    SET quantity = quantity - NEW.quantity,
        last_updated = NOW()
    WHERE product_id = NEW.product_id 
    AND boutique_id = (SELECT boutique_id FROM sales WHERE id = NEW.sale_id);
    
    -- Enregistrer le mouvement de stock
    INSERT INTO stock_movements (
        product_id, boutique_id, movement_type, quantity, 
        reference_type, reference_id, created_by
    )
    SELECT 
        NEW.product_id, s.boutique_id, 'out', NEW.quantity,
        'sale', NEW.sale_id, s.cashier_id
    FROM sales s WHERE s.id = NEW.sale_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger sur les ventes
CREATE TRIGGER trigger_update_stock_after_sale
    AFTER INSERT ON sale_items
    FOR EACH ROW
    EXECUTE FUNCTION update_stock_after_sale();
```

#### 3.2 Fonction de génération des numéros

```sql
-- Fonction pour générer les numéros de vente
CREATE OR REPLACE FUNCTION generate_sale_number(boutique_id UUID)
RETURNS VARCHAR(50) AS $$
DECLARE
    boutique_code VARCHAR(10);
    sequence_num INTEGER;
    sale_number VARCHAR(50);
BEGIN
    -- Récupérer le code de la boutique (3 premiers caractères du nom)
    SELECT UPPER(LEFT(name, 3)) INTO boutique_code
    FROM boutiques WHERE id = boutique_id;
    
    -- Générer le numéro séquentiel pour aujourd'hui
    SELECT COALESCE(MAX(CAST(RIGHT(sale_number, 4) AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM sales 
    WHERE boutique_id = generate_sale_number.boutique_id
    AND DATE(created_at) = CURRENT_DATE;
    
    -- Format: BOT-YYYYMMDD-0001
    sale_number := boutique_code || '-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(sequence_num::TEXT, 4, '0');
    
    RETURN sale_number;
END;
$$ LANGUAGE plpgsql;
```

#### 3.3 Fonction de vérification IMEI

```sql
-- Fonction pour valider l'unicité IMEI
CREATE OR REPLACE FUNCTION validate_imei_uniqueness()
RETURNS TRIGGER AS $$
BEGIN
    -- Vérifier si l'IMEI existe déjà pour un autre produit vendu
    IF EXISTS (
        SELECT 1 FROM imei_tracking 
        WHERE imei = NEW.imei 
        AND current_status = 'sold'
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)
    ) THEN
        RAISE EXCEPTION 'IMEI % déjà utilisé pour un autre téléphone', NEW.imei;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger sur IMEI tracking
CREATE TRIGGER trigger_validate_imei_uniqueness
    BEFORE INSERT OR UPDATE ON imei_tracking
    FOR EACH ROW
    EXECUTE FUNCTION validate_imei_uniqueness();
```

### 4. VUES POUR RAPPORTS

#### 4.1 Vue des ventes par boutique

```sql
CREATE VIEW v_sales_summary AS
SELECT 
    b.id as boutique_id,
    b.name as boutique_name,
    DATE(s.created_at) as sale_date,
    COUNT(s.id) as total_sales,
    SUM(s.total_amount) as total_revenue,
    SUM(s.tax_amount) as total_tax,
    AVG(s.total_amount) as average_sale
FROM sales s
JOIN boutiques b ON s.boutique_id = b.id
WHERE s.status = 'completed'
GROUP BY b.id, b.name, DATE(s.created_at);
```

#### 4.2 Vue du stock critique

```sql
CREATE VIEW v_critical_stock AS
SELECT 
    b.name as boutique_name,
    p.name as product_name,
    s.quantity as current_stock,
    s.min_threshold,
    CASE 
        WHEN s.quantity = 0 THEN 'RUPTURE'
        WHEN s.quantity <= s.min_threshold THEN 'CRITIQUE'
        ELSE 'OK'
    END as stock_status
FROM stock s
JOIN products p ON s.product_id = p.id
JOIN boutiques b ON s.boutique_id = b.id
WHERE s.quantity <= s.min_threshold
ORDER BY s.quantity ASC;
```

### 5. POLITIQUES RLS (ROW LEVEL SECURITY)

```sql
-- Activer RLS sur toutes les tables sensibles
ALTER TABLE boutiques ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;

-- Politique pour les boutiques - utilisateurs ne voient que leur boutique
CREATE POLICY boutique_access_policy ON boutiques
    FOR ALL TO authenticated
    USING (
        id = (SELECT boutique_id FROM users WHERE id = auth.uid())
        OR 
        company_id = (SELECT company_id FROM users WHERE id = auth.uid())
        OR
        (SELECT role FROM users WHERE id = auth.uid()) = 'admin_master'
    );

-- Politique pour les ventes
CREATE POLICY sales_access_policy ON sales
    FOR ALL TO authenticated
    USING (
        boutique_id = (SELECT boutique_id FROM users WHERE id = auth.uid())
        OR
        boutique_id IN (
            SELECT b.id FROM boutiques b
            JOIN users u ON b.company_id = u.company_id
            WHERE u.id = auth.uid() AND u.role = 'admin_central'
        )
        OR
        (SELECT role FROM users WHERE id = auth.uid()) = 'admin_master'
    );
```

### 6. FONCTIONS DE MAINTENANCE

```sql
-- Fonction de nettoyage des sessions expirées
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM user_sessions 
    WHERE expires_at < NOW() OR is_active = false;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Planifier le nettoyage quotidien
SELECT cron.schedule('cleanup-sessions', '0 2 * * *', 'SELECT cleanup_expired_sessions();');
```

### 7. DONNÉES DE TEST

```sql
-- Insertion des données de base pour les tests
INSERT INTO companies (id, name, contact_email) VALUES
('11111111-1111-1111-1111-111111111111', 'La Maison des Téléphones', 'contact@maisontel.com');

INSERT INTO boutiques (id, company_id, name, commercial_name, is_central) VALUES
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Boutique Centrale', 'La Maison des Téléphones', true),
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Boutique Yaoundé', 'TechMobile Yaoundé', false);

INSERT INTO categories (id, name) VALUES
('44444444-4444-4444-4444-444444444444', 'Téléphones'),
('55555555-5555-5555-5555-555555555555', 'Accessoires');

INSERT INTO brands (id, name) VALUES
('66666666-6666-6666-6666-666666666666', 'Apple'),
('77777777-7777-7777-7777-777777777777', 'Samsung');
