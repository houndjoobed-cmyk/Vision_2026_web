-- ============================================
-- SCHÉMA DE BASE DE DONNÉES SUPABASE
-- Vision 2026 - Cité d'Excellence
-- ============================================

-- Table pour les inscriptions au séminaire
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  city VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 13 AND age <= 35),
  ticket_code VARCHAR(50) UNIQUE NOT NULL,
  qr_code_url TEXT,
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  email_sent BOOLEAN DEFAULT FALSE,
  checked_in BOOLEAN DEFAULT FALSE,
  check_in_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les donations (tracking uniquement, paiement via FedaPay)
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name VARCHAR(200),
  donor_email VARCHAR(255),
  donor_phone VARCHAR(20),
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'XOF',
  fedapay_transaction_id VARCHAR(255) UNIQUE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, cancelled
  payment_method VARCHAR(50), -- mobile_money, card, etc.
  description TEXT,
  callback_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Table pour les stats et analytics (optionnel)
CREATE TABLE IF NOT EXISTS event_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_registrations INTEGER DEFAULT 0,
  total_donations DECIMAL(12, 2) DEFAULT 0,
  total_check_ins INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEX pour améliorer les performances
-- ============================================

CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_ticket_code ON registrations(ticket_code);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at);
CREATE INDEX IF NOT EXISTS idx_donations_email ON donations(donor_email);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_fedapay_id ON donations(fedapay_transaction_id);

-- ============================================
-- TRIGGER pour mettre à jour updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) Policies
-- ============================================

-- Activer RLS sur les tables
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_stats ENABLE ROW LEVEL SECURITY;

-- Policy: Tout le monde peut créer des inscriptions
CREATE POLICY "Anyone can create registrations"
  ON registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Les utilisateurs authentifiés peuvent lire toutes les inscriptions
CREATE POLICY "Authenticated users can read all registrations"
  ON registrations
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Les utilisateurs anonymes peuvent lire leur propre inscription via email
CREATE POLICY "Users can read their own registration"
  ON registrations
  FOR SELECT
  TO anon
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Policy: Seuls les admins peuvent mettre à jour les inscriptions
CREATE POLICY "Only authenticated users can update registrations"
  ON registrations
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy: Tout le monde peut créer des donations
CREATE POLICY "Anyone can create donations"
  ON donations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Les utilisateurs authentifiés peuvent lire toutes les donations
CREATE POLICY "Authenticated users can read all donations"
  ON donations
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Les utilisateurs authentifiés peuvent mettre à jour les donations
CREATE POLICY "Authenticated users can update donations"
  ON donations
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy: Lecture publique des stats
CREATE POLICY "Anyone can read event stats"
  ON event_stats
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ============================================
-- FONCTIONS UTILITAIRES
-- ============================================

-- Fonction pour générer un code de billet unique
CREATE OR REPLACE FUNCTION generate_ticket_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Génère un code au format V2026-XXXXX
    code := 'V2026-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    
    -- Vérifie si le code existe déjà
    SELECT EXISTS(SELECT 1 FROM registrations WHERE ticket_code = code) INTO exists;
    
    -- Si le code n'existe pas, on le retourne
    IF NOT exists THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour les statistiques
CREATE OR REPLACE FUNCTION update_event_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour ou insérer les statistiques
  INSERT INTO event_stats (id, total_registrations, total_donations, total_check_ins, last_updated)
  VALUES (
    '00000000-0000-0000-0000-000000000001',
    (SELECT COUNT(*) FROM registrations),
    (SELECT COALESCE(SUM(amount), 0) FROM donations WHERE status = 'completed'),
    (SELECT COUNT(*) FROM registrations WHERE checked_in = true),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    total_registrations = (SELECT COUNT(*) FROM registrations),
    total_donations = (SELECT COALESCE(SUM(amount), 0) FROM donations WHERE status = 'completed'),
    total_check_ins = (SELECT COUNT(*) FROM registrations WHERE checked_in = true),
    last_updated = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour mettre à jour les stats automatiquement
CREATE TRIGGER update_stats_on_registration
  AFTER INSERT OR UPDATE OR DELETE ON registrations
  FOR EACH STATEMENT
  EXECUTE FUNCTION update_event_stats();

CREATE TRIGGER update_stats_on_donation
  AFTER INSERT OR UPDATE OR DELETE ON donations
  FOR EACH STATEMENT
  EXECUTE FUNCTION update_event_stats();

-- ============================================
-- VUES UTILES
-- ============================================

-- Vue pour les statistiques par ville
CREATE OR REPLACE VIEW registrations_by_city AS
SELECT 
  city,
  COUNT(*) as total_registrations,
  AVG(age) as average_age,
  COUNT(CASE WHEN checked_in THEN 1 END) as checked_in_count
FROM registrations
GROUP BY city
ORDER BY total_registrations DESC;

-- Vue pour les statistiques par âge
CREATE OR REPLACE VIEW registrations_by_age_group AS
SELECT 
  CASE 
    WHEN age BETWEEN 13 AND 17 THEN '13-17'
    WHEN age BETWEEN 18 AND 24 THEN '18-24'
    WHEN age BETWEEN 25 AND 30 THEN '25-30'
    WHEN age BETWEEN 31 AND 35 THEN '31-35'
  END as age_group,
  COUNT(*) as count
FROM registrations
GROUP BY age_group
ORDER BY age_group;

-- ============================================
-- DONNÉES INITIALES
-- ============================================

-- Insérer une ligne de statistiques initiale
INSERT INTO event_stats (id, total_registrations, total_donations, total_check_ins)
VALUES ('00000000-0000-0000-0000-000000000001', 0, 0, 0)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- NOTES D'IMPLÉMENTATION
-- ============================================

/*
1. Pour créer ce schéma dans Supabase:
   - Allez dans votre projet Supabase
   - Cliquez sur "SQL Editor"
   - Collez ce script et exécutez-le

2. Configuration de l'email:
   - Configurez SMTP dans Supabase pour envoyer les billets
   - Utilisez les Edge Functions pour générer et envoyer les QR codes

3. Sécurité:
   - Les policies RLS sont configurées pour la sécurité
   - Les utilisateurs anonymes peuvent s'inscrire
   - Seuls les utilisateurs authentifiés (admins) peuvent modifier

4. FedaPay Integration:
   - Les transactions FedaPay sont trackées dans la table donations
   - Le webhook FedaPay doit mettre à jour le statut
*/
