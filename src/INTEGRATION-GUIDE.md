# Guide d'intégration - Vision 2026

## 🔌 Intégration complète des services

Ce guide explique comment les différents services s'intègrent ensemble.

---

## 📊 Vue d'ensemble de l'intégration

```
┌────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                       │
│                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Registration │  │  Donation    │  │   Contact    │    │
│  │    Form      │  │   Section    │  │   Section    │    │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘    │
│         │                 │                                │
└─────────┼─────────────────┼────────────────────────────────┘
          │                 │
          ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE (Backend)                       │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐  │
│  │     DB      │  │   Edge      │  │   Realtime       │  │
│  │  Tables     │  │  Functions  │  │  (optionnel)     │  │
│  └─────────────┘  └─────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
          │                 │
          ▼                 ▼
┌──────────────────┐  ┌──────────────────┐
│     FEDAPAY      │  │  EMAIL SERVICE   │
│   (Paiements)    │  │ (Resend/SMTP)    │
└──────────────────┘  └──────────────────┘
```

---

## 🎯 Flux 1: Inscription d'un participant

### Étape par étape

**1. Utilisateur remplit le formulaire**
```typescript
// RegistrationForm.tsx
const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  age: ''
});
```

**2. Soumission du formulaire**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // a. Générer le code de billet
  const { data: ticketCode } = await supabase.rpc('generate_ticket_code');
  
  // b. Créer l'inscription
  const { data: registration } = await supabase
    .from('registrations')
    .insert({ ...formData, ticket_code: ticketCode })
    .select()
    .single();
    
  // c. Déclencher l'envoi de l'email
  await supabase.functions.invoke('send-ticket-email', {
    body: { registrationId: registration.id }
  });
};
```

**3. Supabase reçoit la requête**
```
POST /rest/v1/registrations
Body: { first_name, last_name, email, ... }

↓ RLS Policy vérifie
↓ INSERT autorisé pour "anon"
↓ Données insérées

Trigger: update_event_stats()
↓ Mise à jour automatique des statistiques
```

**4. Edge Function envoie l'email**
```typescript
// supabase/functions/send-ticket-email/index.ts
serve(async (req) => {
  const { registrationId } = await req.json();
  
  // Récupérer les données
  const { data: registration } = await supabase
    .from('registrations')
    .select('*')
    .eq('id', registrationId)
    .single();
  
  // Générer le QR code
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${registration.ticket_code}`;
  
  // Envoyer l'email
  await sendEmail({
    to: registration.email,
    subject: 'Votre billet Vision 2026',
    html: `<img src="${qrCodeUrl}" />...`
  });
  
  // Mettre à jour email_sent
  await supabase
    .from('registrations')
    .update({ email_sent: true, qr_code_url: qrCodeUrl })
    .eq('id', registrationId);
});
```

**5. Utilisateur reçoit l'email**
```
📧 Email reçu avec:
- Billet au format PDF/HTML
- QR Code unique
- Code: V2026-XXXXX
- Informations pratiques
```

---

## 💰 Flux 2: Donation avec FedaPay

### Étape par étape

**1. Utilisateur sélectionne un montant**
```typescript
// DonationSection.tsx
const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
const [donorInfo, setDonorInfo] = useState({
  name: '',
  email: '',
  phone: ''
});
```

**2. Création de la donation**
```typescript
const handleDonate = async () => {
  // a. Créer l'entrée donation (status: pending)
  const { data: donation } = await supabase
    .from('donations')
    .insert({
      donor_email: donorInfo.email,
      amount: selectedAmount,
      status: 'pending'
    })
    .select()
    .single();
  
  // b. Générer l'URL FedaPay
  const checkoutUrl = createFedaPayCheckoutUrl({
    amount: selectedAmount,
    donorEmail: donorInfo.email,
    customMetadata: { donation_id: donation.id }
  });
  
  // c. Rediriger
  window.location.href = checkoutUrl;
};
```

**3. Redirection vers FedaPay**
```
https://checkout.fedapay.com?
  public_key=pk_xxx&
  amount=5000&
  currency=XOF&
  description=Don Vision 2026&
  callback_url=https://vision2026.com/donation-success&
  cancel_url=https://vision2026.com/donation-cancel&
  custom_metadata={"donation_id":"xxx"}
```

**4. Utilisateur effectue le paiement**
```
┌─────────────────────────┐
│  FedaPay Checkout       │
├─────────────────────────┤
│ Choisir la méthode:     │
│ ◉ MTN Mobile Money      │
│ ○ Moov Money            │
│ ○ Carte bancaire        │
│                         │
│ [Numéro]: 96000001      │
│ [Code]:   ******        │
│                         │
│     [Payer 5000 F]      │
└─────────────────────────┘
```

**5. FedaPay traite le paiement**
```
a. Utilisateur entre ses infos
b. FedaPay contacte l'opérateur (MTN/Moov)
c. Confirmation du paiement
d. FedaPay envoie un webhook
```

**6. Webhook FedaPay → Supabase**
```typescript
// supabase/functions/fedapay-webhook/index.ts
serve(async (req) => {
  const webhook = await req.json();
  
  if (webhook.event === 'transaction.approved') {
    // Mettre à jour le statut de la donation
    await supabase
      .from('donations')
      .update({
        status: 'completed',
        fedapay_transaction_id: webhook.entity.id,
        payment_method: webhook.entity.customer.payment_method,
        completed_at: new Date().toISOString()
      })
      .eq('id', webhook.entity.custom_metadata.donation_id);
  }
  
  return new Response(JSON.stringify({ received: true }));
});
```

**7. Redirection vers page de succès**
```
FedaPay redirige vers:
https://vision2026.com/donation-success?transaction_id=xxx

App.tsx détecte l'URL et affiche:
<DonationSuccess />
```

---

## 📧 Flux 3: Envoi d'emails

### Configuration du service email

**Option 1: Resend (Recommandé)**

```bash
# 1. Créer un compte sur resend.com
# 2. Obtenir l'API Key
# 3. Ajouter dans Supabase Secrets
supabase secrets set RESEND_API_KEY=re_xxx
```

**Option 2: SendGrid**

```bash
supabase secrets set SENDGRID_API_KEY=SG.xxx
```

**Option 3: SMTP personnalisé**

```bash
supabase secrets set SMTP_HOST=smtp.gmail.com
supabase secrets set SMTP_PORT=587
supabase secrets set SMTP_USER=xxx@gmail.com
supabase secrets set SMTP_PASS=xxx
```

### Template d'email

```typescript
// supabase/functions/send-ticket-email/index.ts

const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: #ffcf00; padding: 20px; text-align: center; }
    .qr-code { text-align: center; padding: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Vision 2026</h1>
    </div>
    
    <div class="content">
      <h2>Bonjour ${firstName} ${lastName},</h2>
      <p>Votre inscription est confirmée !</p>
      
      <div class="qr-code">
        <img src="${qrCodeUrl}" alt="QR Code" />
        <p>Code du billet: <strong>${ticketCode}</strong></p>
      </div>
      
      <h3>Informations pratiques</h3>
      <ul>
        <li>Dates: [À compléter]</li>
        <li>Lieu: [À compléter]</li>
        <li>Heure: [À compléter]</li>
      </ul>
    </div>
  </div>
</body>
</html>
`;

await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${RESEND_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from: 'Vision 2026 <noreply@citeexcellence.org>',
    to: registration.email,
    subject: 'Votre billet Vision 2026',
    html: emailTemplate
  })
});
```

---

## 🔐 Sécurité et authentification

### Row Level Security (RLS)

**Configuration des policies**

```sql
-- Registrations: Tout le monde peut s'inscrire
CREATE POLICY "Anyone can create registrations"
  ON registrations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Registrations: Lire uniquement ses propres données
CREATE POLICY "Users can read their own registration"
  ON registrations FOR SELECT
  TO anon
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Donations: Créer une donation
CREATE POLICY "Anyone can create donations"
  ON donations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Donations: Seuls les admins lisent
CREATE POLICY "Authenticated users can read donations"
  ON donations FOR SELECT
  TO authenticated
  USING (true);
```

### Clés API

**Frontend (Public)**
```typescript
// .env.local
VITE_SUPABASE_ANON_KEY=eyJxxx... // Limitée par RLS
VITE_FEDAPAY_PUBLIC_KEY=pk_xxx   // Public
```

**Backend (Secret)**
```bash
# Supabase Secrets
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
supabase secrets set FEDAPAY_SECRET_KEY=sk_xxx
supabase secrets set RESEND_API_KEY=re_xxx
```

---

## 🧪 Tests d'intégration

### Test complet du flux d'inscription

```bash
# 1. Démarrer le serveur
npm run dev

# 2. Ouvrir http://localhost:5173
# 3. Remplir le formulaire avec:
#    - Email: test@example.com
#    - Âge: 25
#    - Etc.

# 4. Soumettre

# 5. Vérifier dans Supabase:
# Table Editor > registrations > Nouvelle ligne créée

# 6. Vérifier dans Edge Functions > Logs:
# Fonction send-ticket-email appelée

# 7. Vérifier l'email reçu (si service configuré)
```

### Test complet du flux de donation

```bash
# 1. Cliquer sur "Faire un don"
# 2. Sélectionner 1000 FCFA
# 3. Entrer email: test@example.com
# 4. Cliquer sur "Faire un don maintenant"

# 5. Vérifier la redirection vers FedaPay
# 6. Utiliser les numéros de test:
#    MTN: 96000001 / Code: 123456

# 7. Confirmer le paiement

# 8. Vérifier la redirection vers /donation-success

# 9. Vérifier dans Supabase:
# Table Editor > donations > status = 'completed'

# 10. Vérifier dans Edge Functions > Logs:
# Webhook fedapay-webhook appelé
```

---

## 📊 Monitoring et logs

### Supabase Dashboard

**Database Logs**
```
Dashboard > Database > Logs
- Voir toutes les requêtes SQL
- Filtrer par table
- Exporter les logs
```

**Edge Functions Logs**
```
Dashboard > Edge Functions > Logs
- Voir les invocations
- Erreurs et succès
- Temps d'exécution
```

**API Logs**
```
Dashboard > API > Logs
- Requêtes REST
- Temps de réponse
- Erreurs
```

### FedaPay Dashboard

**Transactions**
```
Dashboard > Transactions
- Statut des paiements
- Montants
- Dates
- Méthodes de paiement
```

**Webhooks**
```
Dashboard > Developers > Webhooks > Logs
- Événements envoyés
- Réponses reçues
- Retry attempts
```

---

## 🚀 Optimisations

### Performance de la base de données

```sql
-- Index pour recherches rapides
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_ticket_code ON registrations(ticket_code);
CREATE INDEX idx_donations_status ON donations(status);

-- Vues matérialisées pour stats (si beaucoup de données)
CREATE MATERIALIZED VIEW stats_summary AS
SELECT 
  COUNT(*) as total_registrations,
  SUM(CASE WHEN donations.status = 'completed' THEN amount ELSE 0 END) as total_donations
FROM registrations
LEFT JOIN donations ON true;

-- Rafraîchir toutes les heures
REFRESH MATERIALIZED VIEW stats_summary;
```

### Caching côté frontend

```typescript
// Utiliser React Query pour le caching
import { useQuery } from '@tanstack/react-query';

function EventStats() {
  const { data } = useQuery({
    queryKey: ['eventStats'],
    queryFn: async () => {
      const { data } = await supabase
        .from('event_stats')
        .select('*')
        .single();
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  return <div>Total: {data?.total_registrations}</div>;
}
```

---

## 🔄 Mises à jour en temps réel (optionnel)

### Activer Realtime pour les stats

```typescript
// Écouter les changements dans event_stats
useEffect(() => {
  const subscription = supabase
    .channel('event_stats_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'event_stats' },
      (payload) => {
        console.log('Stats updated:', payload.new);
        setStats(payload.new);
      }
    )
    .subscribe();
  
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

---

## ✅ Checklist d'intégration

### Supabase
- [ ] Projet créé
- [ ] Tables créées (schema.sql exécuté)
- [ ] RLS policies activées
- [ ] Edge Functions déployées
- [ ] Secrets configurés (API keys)
- [ ] Connexion testée depuis le frontend

### FedaPay
- [ ] Compte créé
- [ ] Mode sandbox testé
- [ ] Clé publique récupérée
- [ ] Webhook URL configurée
- [ ] Paiement test réussi
- [ ] Mode production activé (quand prêt)

### Email
- [ ] Service choisi (Resend/SendGrid/SMTP)
- [ ] API Key configurée
- [ ] Template d'email créé
- [ ] Test d'envoi réussi
- [ ] Domain vérifié (si nécessaire)

### Frontend
- [ ] Variables d'env configurées
- [ ] Client Supabase initialisé
- [ ] Helpers FedaPay créés
- [ ] Composants connectés
- [ ] Tests manuels réussis

---

## 📞 Support

**Problèmes d'intégration:**
- Email: support@citeexcellence.org
- Documentation: Voir les fichiers .md du projet

**Services externes:**
- Supabase: https://supabase.com/docs
- FedaPay: https://docs.fedapay.com

---

**Intégration complète ! 🎉**
