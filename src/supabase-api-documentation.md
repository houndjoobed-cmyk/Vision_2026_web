# Documentation API - Vision 2026 Supabase

## Table des matières
1. [Configuration](#configuration)
2. [Endpoints Registrations](#endpoints-registrations)
3. [Endpoints Donations](#endpoints-donations)
4. [Edge Functions](#edge-functions)
5. [Webhooks FedaPay](#webhooks-fedapay)
6. [Exemples de code](#exemples-de-code)

---

## Configuration

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_publique_anon
VITE_FEDAPAY_PUBLIC_KEY=votre_cle_publique_fedapay
```

### Installation du client Supabase

```bash
npm install @supabase/supabase-js
```

---

## Endpoints Registrations

### 1. Créer une inscription

**Endpoint:** `POST /rest/v1/registrations`

**Body:**
```json
{
  "first_name": "Jean",
  "last_name": "Kouassi",
  "email": "jean.kouassi@example.com",
  "phone": "+229 01 00 00 00 00",
  "city": "Cotonou",
  "age": 25
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "first_name": "Jean",
  "last_name": "Kouassi",
  "email": "jean.kouassi@example.com",
  "phone": "+229 01 00 00 00 00",
  "city": "Cotonou",
  "age": 25,
  "ticket_code": "V2026-A1B2C3D4",
  "qr_code_url": "https://...",
  "registration_date": "2025-10-23T10:00:00Z",
  "created_at": "2025-10-23T10:00:00Z"
}
```

### 2. Récupérer toutes les inscriptions (Admin)

**Endpoint:** `GET /rest/v1/registrations`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `order=created_at.desc` - Trier par date
- `limit=50` - Limiter les résultats
- `offset=0` - Pagination

### 3. Récupérer une inscription par email

**Endpoint:** `GET /rest/v1/registrations?email=eq.{email}`

**Response (200):**
```json
[
  {
    "id": "uuid",
    "first_name": "Jean",
    "last_name": "Kouassi",
    "email": "jean.kouassi@example.com",
    "ticket_code": "V2026-A1B2C3D4",
    "qr_code_url": "https://..."
  }
]
```

### 4. Vérifier un billet (Check-in)

**Endpoint:** `PATCH /rest/v1/registrations?ticket_code=eq.{code}`

**Body:**
```json
{
  "checked_in": true,
  "check_in_date": "2025-10-23T10:00:00Z"
}
```

### 5. Statistiques

**Endpoint:** `GET /rest/v1/event_stats`

**Response (200):**
```json
[
  {
    "total_registrations": 450,
    "total_donations": 1500000,
    "total_check_ins": 320,
    "last_updated": "2025-10-23T10:00:00Z"
  }
]
```

---

## Endpoints Donations

### 1. Créer une donation (tracking)

**Endpoint:** `POST /rest/v1/donations`

**Body:**
```json
{
  "donor_name": "Marie Dupont",
  "donor_email": "marie@example.com",
  "donor_phone": "+229 01 00 00 00 00",
  "amount": 5000,
  "currency": "XOF",
  "fedapay_transaction_id": "fedapay_txn_xxx",
  "status": "pending",
  "description": "Don pour Vision 2026"
}
```

### 2. Mettre à jour le statut d'une donation (Webhook)

**Endpoint:** `PATCH /rest/v1/donations?fedapay_transaction_id=eq.{txn_id}`

**Body:**
```json
{
  "status": "completed",
  "completed_at": "2025-10-23T10:00:00Z",
  "payment_method": "mobile_money",
  "callback_data": { ... }
}
```

### 3. Récupérer les donations

**Endpoint:** `GET /rest/v1/donations?status=eq.completed&order=created_at.desc`

---

## Edge Functions

### 1. Envoyer le billet par email

**Function:** `send-ticket-email`

**Deploy:**
```bash
supabase functions deploy send-ticket-email
```

**Code (supabase/functions/send-ticket-email/index.ts):**

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { registrationId } = await req.json()
    
    // Récupérer les données de l'inscription
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    const { data: registration } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', registrationId)
      .single()
    
    if (!registration) {
      throw new Error('Registration not found')
    }
    
    // Générer le QR code
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${registration.ticket_code}`
    
    // Mettre à jour l'URL du QR code
    await supabase
      .from('registrations')
      .update({ qr_code_url: qrCodeUrl })
      .eq('id', registrationId)
    
    // Envoyer l'email avec Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Vision 2026 <noreply@citeexcellence.org>',
        to: registration.email,
        subject: '🎉 Votre billet Vision 2026 - Cité d\'Excellence',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #ffcf00; text-align: center;">Bienvenue à Vision 2026 !</h1>
            
            <p>Bonjour ${registration.first_name} ${registration.last_name},</p>
            
            <p>Nous sommes ravis de confirmer votre inscription au séminaire Vision 2026 !</p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h2 style="color: #fe0000; margin-top: 0;">Vos informations</h2>
              <p><strong>Nom:</strong> ${registration.first_name} ${registration.last_name}</p>
              <p><strong>Email:</strong> ${registration.email}</p>
              <p><strong>Code du billet:</strong> <span style="font-size: 20px; color: #b5882a;">${registration.ticket_code}</span></p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <img src="${qrCodeUrl}" alt="QR Code" style="max-width: 300px;" />
              <p style="color: #666; font-size: 14px;">Présentez ce QR code à l'entrée</p>
            </div>
            
            <div style="background: #ffcf00; color: #000; padding: 15px; border-radius: 10px; text-align: center;">
              <h3 style="margin: 0;">📅 Informations pratiques</h3>
              <p>Du [Date Jour 1] au [Date Jour 3]<br>
              [Lieu du séminaire]<br>
              Cotonou, Bénin</p>
            </div>
            
            <p style="margin-top: 30px;">À très bientôt !</p>
            <p><strong>L'équipe Vision 2026</strong><br>
            Cité d'Excellence</p>
          </div>
        `
      })
    })
    
    if (!emailResponse.ok) {
      throw new Error('Failed to send email')
    }
    
    // Marquer l'email comme envoyé
    await supabase
      .from('registrations')
      .update({ email_sent: true })
      .eq('id', registrationId)
    
    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { headers: { 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

### 2. Invoquer la fonction depuis le frontend

```typescript
const { data, error } = await supabase.functions.invoke('send-ticket-email', {
  body: { registrationId: 'uuid' }
})
```

---

## Webhooks FedaPay

### Configuration du Webhook

1. Allez dans votre dashboard FedaPay
2. Configurez l'URL du webhook: `https://votre-projet.supabase.co/functions/v1/fedapay-webhook`
3. Sélectionnez les événements: `transaction.approved`, `transaction.canceled`

### Edge Function pour le Webhook

**Function:** `fedapay-webhook`

**Code (supabase/functions/fedapay-webhook/index.ts):**

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const webhook = await req.json()
    
    console.log('FedaPay Webhook received:', webhook)
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Vérifier le type d'événement
    if (webhook.event === 'transaction.approved') {
      // Mettre à jour le statut de la donation
      const { error } = await supabase
        .from('donations')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          payment_method: webhook.entity?.customer?.payment_method,
          callback_data: webhook
        })
        .eq('fedapay_transaction_id', webhook.entity?.id)
      
      if (error) throw error
      
      // Envoyer un email de remerciement (optionnel)
      // ...
      
    } else if (webhook.event === 'transaction.canceled') {
      await supabase
        .from('donations')
        .update({
          status: 'cancelled',
          callback_data: webhook
        })
        .eq('fedapay_transaction_id', webhook.entity?.id)
    }
    
    return new Response(
      JSON.stringify({ received: true }),
      { headers: { 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

---

## Exemples de code

### Configuration du client Supabase

**Créer `/lib/supabase.ts`:**

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Exemple complet d'inscription

```typescript
import { supabase } from '../lib/supabase'

async function registerUser(formData: any) {
  try {
    // 1. Générer le code de billet
    const { data: ticketData } = await supabase.rpc('generate_ticket_code')
    const ticketCode = ticketData
    
    // 2. Créer l'inscription
    const { data: registration, error: insertError } = await supabase
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
      .single()
    
    if (insertError) throw insertError
    
    // 3. Envoyer l'email avec le billet
    const { error: emailError } = await supabase.functions.invoke('send-ticket-email', {
      body: { registrationId: registration.id }
    })
    
    if (emailError) throw emailError
    
    return { success: true, registration }
    
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, error: error.message }
  }
}
```

### Exemple de donation avec FedaPay

```typescript
async function processDonation(amount: number, donorInfo: any) {
  try {
    // 1. Créer l'entrée de donation dans Supabase
    const { data: donation, error } = await supabase
      .from('donations')
      .insert({
        donor_name: donorInfo.name,
        donor_email: donorInfo.email,
        donor_phone: donorInfo.phone,
        amount: amount,
        currency: 'XOF',
        status: 'pending',
        description: `Don pour Vision 2026 - ${amount} FCFA`
      })
      .select()
      .single()
    
    if (error) throw error
    
    // 2. Rediriger vers FedaPay
    const fedapayUrl = `https://checkout.fedapay.com/v2/${import.meta.env.VITE_FEDAPAY_PUBLIC_KEY}`
    const params = new URLSearchParams({
      amount: amount.toString(),
      currency: 'XOF',
      description: `Don Vision 2026`,
      callback_url: `${window.location.origin}/donation-success`,
      cancel_url: `${window.location.origin}/donation-cancel`,
      custom_metadata: JSON.stringify({ donation_id: donation.id })
    })
    
    window.location.href = `${fedapayUrl}?${params.toString()}`
    
  } catch (error) {
    console.error('Donation error:', error)
    throw error
  }
}
```

---

## Résumé des étapes d'implémentation

### Étape 1: Configuration Supabase
1. Créez un projet sur supabase.com
2. Exécutez le script `supabase-schema.sql` dans SQL Editor
3. Configurez les variables d'environnement

### Étape 2: Edge Functions
1. Installez Supabase CLI: `npm install -g supabase`
2. Initialisez: `supabase init`
3. Créez les functions: `send-ticket-email` et `fedapay-webhook`
4. Déployez: `supabase functions deploy`

### Étape 3: Configuration Email
1. Configurez un service email (Resend, SendGrid, etc.)
2. Ajoutez la clé API dans les secrets Supabase
3. Testez l'envoi d'emails

### Étape 4: Intégration FedaPay
1. Créez un compte sur fedapay.com
2. Récupérez votre clé publique
3. Configurez le webhook
4. Testez les paiements en mode sandbox

### Étape 5: Tests
1. Testez l'inscription complète
2. Vérifiez la réception des emails
3. Testez le processus de donation
4. Vérifiez les webhooks FedaPay

---

## Support et ressources

- Documentation Supabase: https://supabase.com/docs
- Documentation FedaPay: https://docs.fedapay.com
- API Reference Supabase: https://supabase.com/docs/reference
- FedaPay API: https://fedapay.readme.io

Pour toute question, contactez: support@citeexcellence.org
