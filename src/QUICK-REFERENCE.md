# 🚀 Référence rapide - Vision 2026

Guide ultra-rapide pour démarrer et utiliser le projet.

---

## ⚡ Démarrage en 5 minutes

```bash
# 1. Installer
npm install

# 2. Copier les variables d'environnement
cp .env.example .env.local

# 3. Éditer .env.local avec vos clés
# Supabase: https://app.supabase.com/project/[PROJECT]/settings/api
# FedaPay: https://dashboard.fedapay.com/developers

# 4. Lancer
npm run dev
```

---

## 📊 Schéma de base de données (simplifié)

```sql
-- Table: registrations
CREATE TABLE registrations (
  id UUID PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  city VARCHAR(100),
  age INTEGER CHECK (13-35),
  ticket_code VARCHAR(50) UNIQUE,
  qr_code_url TEXT,
  email_sent BOOLEAN DEFAULT FALSE,
  checked_in BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ
);

-- Table: donations
CREATE TABLE donations (
  id UUID PRIMARY KEY,
  donor_email VARCHAR(255),
  amount DECIMAL(12,2),
  status VARCHAR(50) DEFAULT 'pending',
  fedapay_transaction_id VARCHAR(255),
  created_at TIMESTAMPTZ
);

-- Table: event_stats (singleton)
CREATE TABLE event_stats (
  id UUID PRIMARY KEY,
  total_registrations INTEGER,
  total_donations DECIMAL(12,2),
  total_check_ins INTEGER,
  last_updated TIMESTAMPTZ
);
```

---

## 🔌 Endpoints clés

### Inscription

```javascript
// Créer une inscription
const { data } = await supabase.from('registrations').insert({
  first_name: "Jean",
  last_name: "Kouassi",
  email: "jean@example.com",
  phone: "+229 01 00 00 00 00",
  city: "Cotonou",
  age: 25,
  ticket_code: await supabase.rpc('generate_ticket_code')
}).select().single();

// Envoyer l'email
await supabase.functions.invoke('send-ticket-email', {
  body: { registrationId: data.id }
});
```

### Donation

```javascript
// 1. Créer la donation
const { data } = await supabase.from('donations').insert({
  donor_email: "marie@example.com",
  amount: 5000,
  status: 'pending'
}).select().single();

// 2. Rediriger vers FedaPay
const url = createFedaPayCheckoutUrl({
  amount: 5000,
  donorEmail: "marie@example.com",
  customMetadata: { donation_id: data.id }
});
window.location.href = url;
```

### Statistiques

```javascript
// Obtenir les stats
const { data } = await supabase
  .from('event_stats')
  .select('*')
  .single();

console.log(data.total_registrations); // 450
console.log(data.total_donations);     // 1500000
```

---

## 🔑 Variables d'environnement

```bash
# .env.local
VITE_SUPABASE_URL=https://[PROJECT_REF].supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxx...
VITE_FEDAPAY_PUBLIC_KEY=pk_sandbox_xxx (test) / pk_live_xxx (prod)
VITE_FEDAPAY_SANDBOX=true (test) / false (prod)
```

**Où trouver les clés:**
- Supabase: Project Settings > API
- FedaPay: Developers > API Keys

---

## 📝 Commandes npm

```bash
npm run dev          # Lancer le serveur de développement
npm run build        # Build pour production
npm run preview      # Prévisualiser le build
npm run lint         # Linter le code
```

---

## 🗂️ Structure des fichiers

```
src/
├── components/
│   ├── RegistrationForm.tsx   ← Formulaire d'inscription
│   ├── DonationSection.tsx    ← Section de don
│   └── ...
├── lib/
│   ├── supabase.ts            ← Client Supabase
│   └── fedapay.ts             ← Helpers FedaPay
└── App.tsx                    ← Point d'entrée

supabase/
└── functions/
    ├── send-ticket-email/     ← Email avec billet
    └── fedapay-webhook/       ← Webhook FedaPay
```

---

## 🧪 Tests rapides

### Test d'inscription

1. Allez sur http://localhost:5173
2. Remplissez le formulaire
3. Vérifiez dans Supabase > Table Editor > registrations

### Test de donation (Sandbox)

1. Cliquez sur "Faire un don"
2. Montant: 1000 FCFA
3. Email: test@example.com
4. Sur FedaPay, utilisez:
   - MTN: `96000001` / Code: `123456`
   - Moov: `97000001` / Code: `123456`

---

## 🔒 Sécurité RLS

```sql
-- Qui peut faire quoi ?

registrations:
  INSERT: ✅ Tout le monde (anon)
  SELECT: ✅ Admins (tout) / Users (leurs données)
  UPDATE: ✅ Admins seulement

donations:
  INSERT: ✅ Tout le monde (anon)
  SELECT: ✅ Admins seulement
  UPDATE: ✅ Admins seulement

event_stats:
  SELECT: ✅ Tout le monde (lecture publique)
```

---

## 🚨 Résolution de problèmes

### Erreur: "fetch failed" ou "CORS error"

**Solution:**
```bash
# Vérifier les clés dans .env.local
# Vérifier que le serveur dev tourne: npm run dev
```

### Erreur: "Duplicate key value violates unique constraint"

**Solution:**
```javascript
// L'email est déjà inscrit
// Chercher l'inscription existante:
const { data } = await supabase
  .from('registrations')
  .select('*')
  .eq('email', 'jean@example.com');
```

### Erreur: "Row level security" ou "insufficient_privilege"

**Solution:**
```bash
# Vérifier que les RLS policies sont créées
# Dans Supabase SQL Editor, exécuter: supabase-schema.sql
```

### Les emails ne sont pas envoyés

**Solution:**
```bash
# 1. Vérifier que l'Edge Function est déployée
supabase functions list

# 2. Vérifier les logs
# Dans Supabase: Edge Functions > Logs

# 3. Configurer le service email
# Ajouter RESEND_API_KEY dans Supabase Secrets
```

---

## 📊 Requêtes SQL utiles

```sql
-- Toutes les inscriptions d'aujourd'hui
SELECT * FROM registrations
WHERE DATE(created_at) = CURRENT_DATE;

-- Total des donations complétées
SELECT SUM(amount) FROM donations
WHERE status = 'completed';

-- Chercher un participant
SELECT * FROM registrations
WHERE email ILIKE '%jean%';

-- Vérifier un billet
SELECT first_name, last_name, checked_in
FROM registrations
WHERE ticket_code = 'V2026-ABC123';

-- Marquer comme présent
UPDATE registrations
SET checked_in = true, check_in_date = NOW()
WHERE ticket_code = 'V2026-ABC123';

-- Stats par ville
SELECT * FROM registrations_by_city;

-- Stats par âge
SELECT * FROM registrations_by_age_group;
```

---

## 🔧 Configuration Supabase en 3 étapes

```bash
# 1. Créer le projet sur supabase.com

# 2. Copier les clés dans .env.local
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...

# 3. Exécuter le schéma SQL
# Dans Supabase > SQL Editor
# Coller le contenu de supabase-schema.sql
# Cliquer sur RUN
```

---

## 💳 Configuration FedaPay en 2 étapes

```bash
# 1. Créer un compte sur fedapay.com

# 2. Copier la clé publique
# Dashboard > Developers > API Keys
# Copier "Public Key (Sandbox)" pour tester

VITE_FEDAPAY_PUBLIC_KEY=pk_sandbox_xxx
VITE_FEDAPAY_SANDBOX=true
```

---

## 📈 Dashboard admin (à venir)

Pour consulter les données:

**Option 1: Supabase Table Editor**
- Supabase Dashboard > Table Editor
- Voir toutes les tables

**Option 2: SQL Editor**
- Exécuter des requêtes SQL personnalisées

**Option 3: API**
```javascript
// Obtenir toutes les inscriptions
const { data } = await supabase
  .from('registrations')
  .select('*')
  .order('created_at', { ascending: false });
```

---

## 🎨 Couleurs du thème

```css
Rouge:  #fe0000  /* Primaire */
Jaune:  #ffcf00  /* Secondaire */
Doré:   #b5882a  /* Accent */
Noir:   #000000  /* Fond */
```

---

## 📱 Numéros de test FedaPay

**En mode sandbox uniquement:**

| Service | Numéro | Code |
|---------|--------|------|
| MTN Mobile Money | `96000001` | `123456` |
| Moov Money | `97000001` | `123456` |

---

## 🚀 Déploiement rapide

### Netlify

```bash
npm run build
# Glisser-déposer le dossier dist/ sur netlify.com
# Ou: connecter le repo GitHub
```

### Vercel

```bash
npm install -g vercel
vercel
# Suivre les instructions
```

---

## 📞 Aide

**Documentation complète:**
- [SETUP-GUIDE.md](./SETUP-GUIDE.md) - Installation détaillée
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture
- [DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md) - Schéma BD
- [API-ENDPOINTS.md](./API-ENDPOINTS.md) - Endpoints

**Support:**
- Email: support@citeexcellence.org
- Issues GitHub: [Lien du repo]

---

## ✅ Checklist avant déploiement

### Développement
- [ ] `npm install` effectué
- [ ] `.env.local` configuré
- [ ] Supabase connecté
- [ ] Tests d'inscription OK
- [ ] Tests de donation OK

### Base de données
- [ ] Projet Supabase créé
- [ ] `supabase-schema.sql` exécuté
- [ ] Tables visibles dans Table Editor
- [ ] RLS policies activées

### Edge Functions
- [ ] `send-ticket-email` déployée
- [ ] `fedapay-webhook` déployée
- [ ] Logs accessibles

### FedaPay
- [ ] Compte créé
- [ ] Clé publique copiée
- [ ] Webhook configuré (optionnel)
- [ ] Tests en sandbox OK

### Production
- [ ] Build test: `npm run build`
- [ ] Variables d'env configurées
- [ ] FedaPay en mode live
- [ ] Email service configuré
- [ ] Monitoring activé

---

**Prêt à lancer Vision 2026 ! 🎉**
