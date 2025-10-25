# Endpoints & APIs - Vision 2026

## 📡 Vue d'ensemble des APIs

Ce document liste tous les endpoints API utilisés dans le projet Vision 2026.

---

## 🔗 Base URLs

### Supabase

```
Production: https://[VOTRE_PROJECT_REF].supabase.co
REST API:   https://[VOTRE_PROJECT_REF].supabase.co/rest/v1
Functions:  https://[VOTRE_PROJECT_REF].supabase.co/functions/v1
```

### FedaPay

```
Production: https://checkout.fedapay.com
Sandbox:    https://sandbox-checkout.fedapay.com
API:        https://api.fedapay.com/v1
```

---

## 📝 INSCRIPTIONS (Registrations)

### 1. Créer une inscription

**Endpoint:** `POST /rest/v1/registrations`

**Headers:**
```
Content-Type: application/json
apikey: [VOTRE_SUPABASE_ANON_KEY]
Authorization: Bearer [VOTRE_SUPABASE_ANON_KEY]
Prefer: return=representation
```

**Body:**
```json
{
  "first_name": "Jean",
  "last_name": "Kouassi",
  "email": "jean.kouassi@example.com",
  "phone": "+229 01 00 00 00 00",
  "city": "Cotonou",
  "age": 25,
  "ticket_code": "V2026-A1B2C3D4"
}
```

**Response 201:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "first_name": "Jean",
  "last_name": "Kouassi",
  "email": "jean.kouassi@example.com",
  "phone": "+229 01 00 00 00 00",
  "city": "Cotonou",
  "age": 25,
  "ticket_code": "V2026-A1B2C3D4",
  "qr_code_url": null,
  "registration_date": "2025-10-23T10:30:00.000Z",
  "email_sent": false,
  "checked_in": false,
  "check_in_date": null,
  "created_at": "2025-10-23T10:30:00.000Z",
  "updated_at": "2025-10-23T10:30:00.000Z"
}
```

**Exemple cURL:**
```bash
curl -X POST 'https://[PROJECT_REF].supabase.co/rest/v1/registrations' \
  -H "apikey: [ANON_KEY]" \
  -H "Authorization: Bearer [ANON_KEY]" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "first_name": "Jean",
    "last_name": "Kouassi",
    "email": "jean@example.com",
    "phone": "+229 01 00 00 00 00",
    "city": "Cotonou",
    "age": 25,
    "ticket_code": "V2026-ABC123"
  }'
```

---

### 2. Lister toutes les inscriptions (Admin)

**Endpoint:** `GET /rest/v1/registrations`

**Headers:**
```
apikey: [VOTRE_SUPABASE_ANON_KEY]
Authorization: Bearer [ACCESS_TOKEN]
```

**Query Parameters:**
- `select=*` - Colonnes à retourner (par défaut: toutes)
- `order=created_at.desc` - Tri (desc = décroissant)
- `limit=50` - Nombre de résultats
- `offset=0` - Pagination

**Response 200:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "first_name": "Jean",
    "last_name": "Kouassi",
    "email": "jean@example.com",
    "ticket_code": "V2026-ABC123",
    ...
  },
  ...
]
```

**Exemple cURL:**
```bash
curl 'https://[PROJECT_REF].supabase.co/rest/v1/registrations?select=*&order=created_at.desc&limit=50' \
  -H "apikey: [ANON_KEY]" \
  -H "Authorization: Bearer [ACCESS_TOKEN]"
```

---

### 3. Rechercher par email

**Endpoint:** `GET /rest/v1/registrations?email=eq.{email}`

**Headers:**
```
apikey: [VOTRE_SUPABASE_ANON_KEY]
```

**Response 200:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "first_name": "Jean",
    "last_name": "Kouassi",
    "email": "jean@example.com",
    "ticket_code": "V2026-ABC123",
    ...
  }
]
```

**Exemple cURL:**
```bash
curl 'https://[PROJECT_REF].supabase.co/rest/v1/registrations?email=eq.jean@example.com' \
  -H "apikey: [ANON_KEY]"
```

---

### 4. Vérifier un billet

**Endpoint:** `GET /rest/v1/registrations?ticket_code=eq.{code}`

**Response 200:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "first_name": "Jean",
    "last_name": "Kouassi",
    "ticket_code": "V2026-ABC123",
    "checked_in": false,
    ...
  }
]
```

---

### 5. Check-in d'un participant

**Endpoint:** `PATCH /rest/v1/registrations?ticket_code=eq.{code}`

**Headers:**
```
Content-Type: application/json
apikey: [VOTRE_SUPABASE_ANON_KEY]
Authorization: Bearer [ACCESS_TOKEN]
Prefer: return=representation
```

**Body:**
```json
{
  "checked_in": true,
  "check_in_date": "2025-10-23T08:00:00.000Z"
}
```

**Response 200:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "ticket_code": "V2026-ABC123",
    "checked_in": true,
    "check_in_date": "2025-10-23T08:00:00.000Z",
    ...
  }
]
```

**Exemple cURL:**
```bash
curl -X PATCH 'https://[PROJECT_REF].supabase.co/rest/v1/registrations?ticket_code=eq.V2026-ABC123' \
  -H "apikey: [ANON_KEY]" \
  -H "Authorization: Bearer [ACCESS_TOKEN]" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "checked_in": true,
    "check_in_date": "2025-10-23T08:00:00.000Z"
  }'
```

---

## 💰 DONATIONS

### 1. Créer une donation

**Endpoint:** `POST /rest/v1/donations`

**Headers:**
```
Content-Type: application/json
apikey: [VOTRE_SUPABASE_ANON_KEY]
Authorization: Bearer [VOTRE_SUPABASE_ANON_KEY]
Prefer: return=representation
```

**Body:**
```json
{
  "donor_name": "Marie Dupont",
  "donor_email": "marie@example.com",
  "donor_phone": "+229 01 00 00 00 00",
  "amount": 5000,
  "currency": "XOF",
  "status": "pending",
  "description": "Don pour Vision 2026 - 5000 FCFA"
}
```

**Response 201:**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "donor_name": "Marie Dupont",
  "donor_email": "marie@example.com",
  "donor_phone": "+229 01 00 00 00 00",
  "amount": 5000.00,
  "currency": "XOF",
  "fedapay_transaction_id": null,
  "status": "pending",
  "payment_method": null,
  "description": "Don pour Vision 2026 - 5000 FCFA",
  "callback_data": null,
  "created_at": "2025-10-23T10:30:00.000Z",
  "completed_at": null
}
```

---

### 2. Lister les donations (Admin)

**Endpoint:** `GET /rest/v1/donations`

**Headers:**
```
apikey: [VOTRE_SUPABASE_ANON_KEY]
Authorization: Bearer [ACCESS_TOKEN]
```

**Query Parameters:**
- `status=eq.completed` - Filtrer par statut
- `order=created_at.desc` - Tri
- `limit=50` - Limite

**Response 200:**
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "donor_email": "marie@example.com",
    "amount": 5000.00,
    "status": "completed",
    "created_at": "2025-10-23T10:30:00.000Z",
    ...
  },
  ...
]
```

---

### 3. Mettre à jour une donation (Webhook)

**Endpoint:** `PATCH /rest/v1/donations?fedapay_transaction_id=eq.{txn_id}`

**Headers:**
```
Content-Type: application/json
apikey: [VOTRE_SUPABASE_ANON_KEY]
Authorization: Bearer [SERVICE_ROLE_KEY]
Prefer: return=representation
```

**Body:**
```json
{
  "status": "completed",
  "fedapay_transaction_id": "fedapay_txn_abc123",
  "payment_method": "mobile_money",
  "completed_at": "2025-10-23T10:35:00.000Z",
  "callback_data": { ... }
}
```

---

## 📊 STATISTIQUES

### 1. Obtenir les statistiques globales

**Endpoint:** `GET /rest/v1/event_stats`

**Headers:**
```
apikey: [VOTRE_SUPABASE_ANON_KEY]
```

**Response 200:**
```json
[
  {
    "id": "00000000-0000-0000-0000-000000000001",
    "total_registrations": 450,
    "total_donations": 1500000.00,
    "total_check_ins": 320,
    "last_updated": "2025-10-23T15:30:00.000Z"
  }
]
```

**Exemple cURL:**
```bash
curl 'https://[PROJECT_REF].supabase.co/rest/v1/event_stats' \
  -H "apikey: [ANON_KEY]"
```

---

### 2. Statistiques par ville

**Endpoint:** `GET /rest/v1/registrations_by_city`

**Headers:**
```
apikey: [VOTRE_SUPABASE_ANON_KEY]
Authorization: Bearer [ACCESS_TOKEN]
```

**Response 200:**
```json
[
  {
    "city": "Cotonou",
    "total_registrations": 250,
    "average_age": 23.5,
    "checked_in_count": 180
  },
  {
    "city": "Porto-Novo",
    "total_registrations": 120,
    "average_age": 22.8,
    "checked_in_count": 90
  },
  ...
]
```

---

### 3. Statistiques par tranche d'âge

**Endpoint:** `GET /rest/v1/registrations_by_age_group`

**Headers:**
```
apikey: [VOTRE_SUPABASE_ANON_KEY]
Authorization: Bearer [ACCESS_TOKEN]
```

**Response 200:**
```json
[
  {
    "age_group": "13-17",
    "count": 80
  },
  {
    "age_group": "18-24",
    "count": 220
  },
  {
    "age_group": "25-30",
    "count": 120
  },
  {
    "age_group": "31-35",
    "count": 30
  }
]
```

---

## ⚡ EDGE FUNCTIONS

### 1. Envoyer un billet par email

**Endpoint:** `POST /functions/v1/send-ticket-email`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer [VOTRE_SUPABASE_ANON_KEY]
```

**Body:**
```json
{
  "registrationId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Response 400:**
```json
{
  "error": "Registration not found"
}
```

**Exemple JavaScript:**
```javascript
const { data, error } = await supabase.functions.invoke('send-ticket-email', {
  body: { registrationId: '550e8400-e29b-41d4-a716-446655440000' }
});
```

---

### 2. Webhook FedaPay

**Endpoint:** `POST /functions/v1/fedapay-webhook`

**Headers:**
```
Content-Type: application/json
X-FedaPay-Signature: [SIGNATURE]
```

**Body (exemple FedaPay):**
```json
{
  "event": "transaction.approved",
  "entity": {
    "id": "fedapay_txn_abc123",
    "amount": 5000,
    "status": "approved",
    "custom_metadata": {
      "donation_id": "660e8400-e29b-41d4-a716-446655440001"
    },
    "customer": {
      "email": "marie@example.com",
      "payment_method": "mobile_money"
    }
  }
}
```

**Response 200:**
```json
{
  "received": true
}
```

**Événements supportés:**
- `transaction.approved` - Paiement réussi
- `transaction.canceled` - Paiement annulé
- `transaction.failed` - Paiement échoué

---

## 🔧 RPC FUNCTIONS

### 1. Générer un code de billet

**Endpoint:** `POST /rest/v1/rpc/generate_ticket_code`

**Headers:**
```
Content-Type: application/json
apikey: [VOTRE_SUPABASE_ANON_KEY]
Authorization: Bearer [VOTRE_SUPABASE_ANON_KEY]
```

**Body:**
```json
{}
```

**Response 200:**
```json
"V2026-A1B2C3D4"
```

**Exemple JavaScript:**
```javascript
const { data, error } = await supabase.rpc('generate_ticket_code');
console.log(data); // "V2026-A1B2C3D4"
```

---

## 💳 FEDAPAY CHECKOUT

### URL de redirection

**Endpoint:** `https://checkout.fedapay.com`

**Paramètres (Query String):**

| Paramètre | Type | Required | Description |
|-----------|------|----------|-------------|
| `public_key` | string | ✅ | Votre clé publique FedaPay |
| `amount` | number | ✅ | Montant en FCFA |
| `currency` | string | ✅ | Devise (XOF) |
| `description` | string | ✅ | Description du paiement |
| `callback_url` | string | ✅ | URL de retour (succès) |
| `cancel_url` | string | ✅ | URL de retour (annulation) |
| `customer[email]` | string | ⚪ | Email du client |
| `customer[firstname]` | string | ⚪ | Prénom du client |
| `customer[lastname]` | string | ⚪ | Nom du client |
| `customer[phone_number][number]` | string | ⚪ | Numéro de téléphone |
| `customer[phone_number][country]` | string | ⚪ | Code pays (BJ) |
| `custom_metadata` | JSON | ⚪ | Données personnalisées |

**Exemple d'URL complète:**
```
https://checkout.fedapay.com?
  public_key=pk_sandbox_xxx&
  amount=5000&
  currency=XOF&
  description=Don%20Vision%202026&
  callback_url=https://vision2026.com/donation-success&
  cancel_url=https://vision2026.com/donation-cancel&
  customer[email]=marie@example.com&
  custom_metadata={"donation_id":"660e8400-e29b-41d4-a716-446655440001"}
```

**Exemple JavaScript:**
```javascript
const checkoutUrl = createFedaPayCheckoutUrl({
  amount: 5000,
  donorEmail: 'marie@example.com',
  customMetadata: { donation_id: 'xxx' }
});

window.location.href = checkoutUrl;
```

---

## 🔐 AUTHENTIFICATION

### Clés API

**Supabase:**
- **Anon Key:** Clé publique (frontend) - Limitée par RLS
- **Service Role Key:** Clé privée (backend/Edge Functions) - Accès complet

**FedaPay:**
- **Public Key:** `pk_sandbox_xxx` (test) ou `pk_live_xxx` (prod)
- **Secret Key:** `sk_sandbox_xxx` (test) ou `sk_live_xxx` (prod) - Jamais exposée au frontend

### Headers d'authentification

**Supabase (Anonyme):**
```
apikey: [SUPABASE_ANON_KEY]
Authorization: Bearer [SUPABASE_ANON_KEY]
```

**Supabase (Authentifié):**
```
apikey: [SUPABASE_ANON_KEY]
Authorization: Bearer [USER_ACCESS_TOKEN]
```

**Supabase (Service Role):**
```
apikey: [SERVICE_ROLE_KEY]
Authorization: Bearer [SERVICE_ROLE_KEY]
```

---

## 📝 Exemples de code

### TypeScript/JavaScript (Frontend)

```typescript
import { supabase } from './lib/supabase';

// Créer une inscription
async function createRegistration(formData: any) {
  // 1. Générer le code
  const { data: ticketCode } = await supabase.rpc('generate_ticket_code');
  
  // 2. Créer l'inscription
  const { data, error } = await supabase
    .from('registrations')
    .insert({
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      age: parseInt(formData.age),
      ticket_code: ticketCode
    })
    .select()
    .single();
    
  if (error) throw error;
  
  // 3. Envoyer l'email
  await supabase.functions.invoke('send-ticket-email', {
    body: { registrationId: data.id }
  });
  
  return data;
}

// Créer une donation
async function createDonation(amount: number, donorInfo: any) {
  const { data, error } = await supabase
    .from('donations')
    .insert({
      donor_name: donorInfo.name,
      donor_email: donorInfo.email,
      donor_phone: donorInfo.phone,
      amount: amount,
      status: 'pending'
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

// Obtenir les statistiques
async function getStats() {
  const { data, error } = await supabase
    .from('event_stats')
    .select('*')
    .single();
    
  if (error) throw error;
  return data;
}
```

---

## 🐛 Codes d'erreur

### Supabase

| Code | Description |
|------|-------------|
| `23505` | Duplicate key (email déjà inscrit) |
| `23503` | Foreign key violation |
| `23502` | Not null violation |
| `PGRST116` | No rows returned |
| `PGRST301` | JWT expired |

### FedaPay

| Code | Description |
|------|-------------|
| `400` | Bad request (paramètres invalides) |
| `401` | Unauthorized (clé API invalide) |
| `404` | Transaction not found |
| `500` | Internal server error |

---

## 📞 Support

**Documentation:**
- Supabase API: https://supabase.com/docs/reference/javascript
- FedaPay API: https://docs.fedapay.com

**Contact:**
- Email: support@citeexcellence.org
