# Schéma de base de données - Vision 2026

## 📊 Vue d'ensemble

Ce document détaille le schéma complet de la base de données Supabase pour le projet Vision 2026.

---

## 🗃️ Tables

### 1. `registrations`

Table principale pour stocker les inscriptions au séminaire.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identifiant unique |
| `first_name` | VARCHAR(100) | NOT NULL | Prénom du participant |
| `last_name` | VARCHAR(100) | NOT NULL | Nom du participant |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Email (unique) |
| `phone` | VARCHAR(20) | NOT NULL | Numéro de téléphone |
| `city` | VARCHAR(100) | NOT NULL | Ville de résidence |
| `age` | INTEGER | NOT NULL, CHECK (13-35) | Âge (entre 13 et 35 ans) |
| `ticket_code` | VARCHAR(50) | UNIQUE, NOT NULL | Code unique du billet (V2026-XXXXX) |
| `qr_code_url` | TEXT | | URL du QR code généré |
| `registration_date` | TIMESTAMPTZ | DEFAULT NOW() | Date d'inscription |
| `email_sent` | BOOLEAN | DEFAULT FALSE | Email de confirmation envoyé ? |
| `checked_in` | BOOLEAN | DEFAULT FALSE | Participant présent ? |
| `check_in_date` | TIMESTAMPTZ | | Date de présence |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Date de création |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Date de mise à jour |

**Index:**
- `idx_registrations_email` sur `email`
- `idx_registrations_ticket_code` sur `ticket_code`
- `idx_registrations_created_at` sur `created_at`

**Exemple de données:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "first_name": "Jean",
  "last_name": "Kouassi",
  "email": "jean.kouassi@example.com",
  "phone": "+229 01 00 00 00 00",
  "city": "Cotonou",
  "age": 25,
  "ticket_code": "V2026-A1B2C3D4",
  "qr_code_url": "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=V2026-A1B2C3D4",
  "registration_date": "2025-10-23T10:00:00Z",
  "email_sent": true,
  "checked_in": false,
  "created_at": "2025-10-23T10:00:00Z"
}
```

---

### 2. `donations`

Table pour tracker les donations (paiements gérés par FedaPay).

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Identifiant unique |
| `donor_name` | VARCHAR(200) | | Nom du donateur (optionnel) |
| `donor_email` | VARCHAR(255) | | Email du donateur |
| `donor_phone` | VARCHAR(20) | | Téléphone du donateur |
| `amount` | DECIMAL(12,2) | NOT NULL | Montant du don |
| `currency` | VARCHAR(3) | DEFAULT 'XOF' | Devise (FCFA) |
| `fedapay_transaction_id` | VARCHAR(255) | UNIQUE | ID transaction FedaPay |
| `status` | VARCHAR(50) | DEFAULT 'pending' | Statut du paiement |
| `payment_method` | VARCHAR(50) | | Méthode de paiement |
| `description` | TEXT | | Description du don |
| `callback_data` | JSONB | | Données du webhook FedaPay |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Date de création |
| `completed_at` | TIMESTAMPTZ | | Date de complétion |

**Statuts possibles:**
- `pending` - En attente de paiement
- `completed` - Paiement réussi
- `failed` - Paiement échoué
- `cancelled` - Paiement annulé

**Index:**
- `idx_donations_email` sur `donor_email`
- `idx_donations_status` sur `status`
- `idx_donations_fedapay_id` sur `fedapay_transaction_id`

**Exemple de données:**
```json
{
  "id": "456e7890-e89b-12d3-a456-426614174001",
  "donor_name": "Marie Dupont",
  "donor_email": "marie@example.com",
  "donor_phone": "+229 01 00 00 00 00",
  "amount": 5000.00,
  "currency": "XOF",
  "fedapay_transaction_id": "fedapay_txn_abc123",
  "status": "completed",
  "payment_method": "mobile_money",
  "description": "Don pour Vision 2026 - 5000 FCFA",
  "callback_data": { ... },
  "created_at": "2025-10-23T10:00:00Z",
  "completed_at": "2025-10-23T10:05:00Z"
}
```

---

### 3. `event_stats`

Table pour les statistiques globales de l'événement.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | ID fixe (singleton) |
| `total_registrations` | INTEGER | DEFAULT 0 | Nombre total d'inscriptions |
| `total_donations` | DECIMAL(12,2) | DEFAULT 0 | Total des dons (en FCFA) |
| `total_check_ins` | INTEGER | DEFAULT 0 | Nombre de présents |
| `last_updated` | TIMESTAMPTZ | DEFAULT NOW() | Dernière mise à jour |

**Note:** Cette table contient une seule ligne (ID fixe) mise à jour automatiquement par des triggers.

**Exemple de données:**
```json
{
  "id": "00000000-0000-0000-0000-000000000001",
  "total_registrations": 450,
  "total_donations": 1500000.00,
  "total_check_ins": 320,
  "last_updated": "2025-10-23T15:30:00Z"
}
```

---

## 🔒 Row Level Security (RLS)

### Registrations

**Politique d'insertion:**
```sql
-- Tout le monde peut créer des inscriptions
CREATE POLICY "Anyone can create registrations"
  ON registrations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
```

**Politique de lecture:**
```sql
-- Les utilisateurs authentifiés peuvent tout lire
CREATE POLICY "Authenticated users can read all registrations"
  ON registrations FOR SELECT
  TO authenticated
  USING (true);

-- Les utilisateurs anonymes peuvent lire leur propre inscription
CREATE POLICY "Users can read their own registration"
  ON registrations FOR SELECT
  TO anon
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');
```

**Politique de mise à jour:**
```sql
-- Seuls les utilisateurs authentifiés (admins) peuvent modifier
CREATE POLICY "Only authenticated users can update registrations"
  ON registrations FOR UPDATE
  TO authenticated
  USING (true);
```

### Donations

**Politique d'insertion:**
```sql
-- Tout le monde peut créer des donations
CREATE POLICY "Anyone can create donations"
  ON donations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
```

**Politique de lecture:**
```sql
-- Seuls les utilisateurs authentifiés peuvent lire les donations
CREATE POLICY "Authenticated users can read all donations"
  ON donations FOR SELECT
  TO authenticated
  USING (true);
```

**Politique de mise à jour:**
```sql
-- Seuls les utilisateurs authentifiés peuvent mettre à jour
CREATE POLICY "Authenticated users can update donations"
  ON donations FOR UPDATE
  TO authenticated
  USING (true);
```

### Event Stats

**Politique de lecture:**
```sql
-- Tout le monde peut lire les statistiques
CREATE POLICY "Anyone can read event stats"
  ON event_stats FOR SELECT
  TO anon, authenticated
  USING (true);
```

---

## ⚙️ Fonctions SQL

### 1. `generate_ticket_code()`

Génère un code de billet unique au format `V2026-XXXXXXXX`.

```sql
CREATE OR REPLACE FUNCTION generate_ticket_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    code := 'V2026-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    SELECT EXISTS(SELECT 1 FROM registrations WHERE ticket_code = code) INTO exists;
    IF NOT exists THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

**Utilisation:**
```sql
SELECT generate_ticket_code();
-- Retourne: "V2026-A1B2C3D4"
```

### 2. `update_event_stats()`

Met à jour automatiquement les statistiques de l'événement.

```sql
CREATE OR REPLACE FUNCTION update_event_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO event_stats (id, total_registrations, total_donations, total_check_ins)
  VALUES (
    '00000000-0000-0000-0000-000000000001',
    (SELECT COUNT(*) FROM registrations),
    (SELECT COALESCE(SUM(amount), 0) FROM donations WHERE status = 'completed'),
    (SELECT COUNT(*) FROM registrations WHERE checked_in = true)
  )
  ON CONFLICT (id) DO UPDATE SET
    total_registrations = EXCLUDED.total_registrations,
    total_donations = EXCLUDED.total_donations,
    total_check_ins = EXCLUDED.total_check_ins,
    last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Triggers associés:**
```sql
CREATE TRIGGER update_stats_on_registration
  AFTER INSERT OR UPDATE OR DELETE ON registrations
  FOR EACH STATEMENT
  EXECUTE FUNCTION update_event_stats();

CREATE TRIGGER update_stats_on_donation
  AFTER INSERT OR UPDATE OR DELETE ON donations
  FOR EACH STATEMENT
  EXECUTE FUNCTION update_event_stats();
```

### 3. `update_updated_at_column()`

Met à jour automatiquement la colonne `updated_at`.

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Trigger associé:**
```sql
CREATE TRIGGER update_registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 📈 Vues

### 1. `registrations_by_city`

Statistiques des inscriptions par ville.

```sql
CREATE OR REPLACE VIEW registrations_by_city AS
SELECT 
  city,
  COUNT(*) as total_registrations,
  AVG(age) as average_age,
  COUNT(CASE WHEN checked_in THEN 1 END) as checked_in_count
FROM registrations
GROUP BY city
ORDER BY total_registrations DESC;
```

**Utilisation:**
```sql
SELECT * FROM registrations_by_city;
```

**Résultat:**
| city | total_registrations | average_age | checked_in_count |
|------|---------------------|-------------|------------------|
| Cotonou | 250 | 23.5 | 180 |
| Porto-Novo | 120 | 22.8 | 90 |
| Parakou | 80 | 24.1 | 50 |

### 2. `registrations_by_age_group`

Statistiques des inscriptions par tranche d'âge.

```sql
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
```

**Utilisation:**
```sql
SELECT * FROM registrations_by_age_group;
```

**Résultat:**
| age_group | count |
|-----------|-------|
| 13-17 | 80 |
| 18-24 | 220 |
| 25-30 | 120 |
| 31-35 | 30 |

---

## 🔄 Flux de données

### Inscription d'un participant

```
1. Frontend → API Supabase: Créer inscription
2. Supabase: Générer ticket_code unique
3. Supabase: Insérer dans registrations
4. Trigger: Mettre à jour event_stats
5. Edge Function: Générer QR code
6. Edge Function: Envoyer email avec billet
7. Supabase: Mettre à jour email_sent = true
```

### Processus de donation

```
1. Frontend → API Supabase: Créer donation (status = pending)
2. Frontend → FedaPay: Redirection vers page de paiement
3. Utilisateur: Effectue le paiement sur FedaPay
4. FedaPay → Webhook Supabase: Notification du paiement
5. Edge Function: Mettre à jour status = completed
6. Trigger: Mettre à jour event_stats (total_donations)
7. (Optionnel) Edge Function: Envoyer email de remerciement
```

---

## 📊 Diagramme ER (Entité-Relation)

```
┌─────────────────┐
│  registrations  │
├─────────────────┤
│ id (PK)         │
│ first_name      │
│ last_name       │
│ email (UNIQUE)  │
│ phone           │
│ city            │
│ age             │
│ ticket_code (U) │
│ qr_code_url     │
│ ...             │
└─────────────────┘

┌─────────────────┐
│    donations    │
├─────────────────┤
│ id (PK)         │
│ donor_name      │
│ donor_email     │
│ amount          │
│ status          │
│ fedapay_txn_id  │
│ ...             │
└─────────────────┘

┌─────────────────┐
│  event_stats    │
├─────────────────┤
│ id (PK)         │
│ total_reg       │
│ total_donations │
│ total_checkins  │
└─────────────────┘
        ▲
        │
  Auto-updated
   by triggers
```

---

## 🔍 Requêtes utiles

### Obtenir toutes les inscriptions d'aujourd'hui

```sql
SELECT *
FROM registrations
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;
```

### Obtenir le total des donations par statut

```sql
SELECT 
  status,
  COUNT(*) as count,
  SUM(amount) as total_amount
FROM donations
GROUP BY status;
```

### Chercher un participant par email

```sql
SELECT *
FROM registrations
WHERE email ILIKE '%jean%'
LIMIT 10;
```

### Vérifier un billet par code

```sql
SELECT 
  first_name,
  last_name,
  email,
  ticket_code,
  checked_in
FROM registrations
WHERE ticket_code = 'V2026-A1B2C3D4';
```

### Marquer un participant comme présent

```sql
UPDATE registrations
SET 
  checked_in = true,
  check_in_date = NOW()
WHERE ticket_code = 'V2026-A1B2C3D4';
```

---

## 📝 Notes importantes

1. **Sécurité**: Les RLS policies sont activées pour protéger les données
2. **Performance**: Les index sont créés sur les colonnes fréquemment recherchées
3. **Intégrité**: Les contraintes UNIQUE et CHECK garantissent la qualité des données
4. **Automatisation**: Les triggers maintiennent les statistiques à jour automatiquement
5. **Auditabilité**: Les colonnes `created_at` et `updated_at` permettent le tracking

---

## 🚀 Prochaines étapes

Pour étendre le schéma, vous pourriez ajouter:

- Table `check_in_logs` pour l'historique des scans
- Table `email_logs` pour tracker les emails envoyés
- Table `sessions` pour les sessions du séminaire
- Table `feedback` pour les retours des participants
- Table `certificates` pour les certificats de participation
