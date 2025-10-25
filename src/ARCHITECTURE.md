# Architecture - Vision 2026

## 🏗️ Vue d'ensemble du système

Ce document décrit l'architecture complète du site Vision 2026, incluant le frontend, le backend (Supabase), et l'intégration de paiement (FedaPay).

---

## 📐 Diagramme d'architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         UTILISATEUR                              │
│                    (Navigateur Web)                              │
└────────────┬────────────────────────────────────┬────────────────┘
             │                                    │
             │                                    │
             ▼                                    ▼
┌────────────────────────┐           ┌──────────────────────────┐
│   FRONTEND (React)     │           │   FEDAPAY CHECKOUT       │
│  ─────────────────     │           │  ──────────────────      │
│  • App.tsx             │           │  • Page de paiement      │
│  • Components/         │           │  • Mobile Money          │
│  • Tailwind CSS        │◄─────────►│  • Card Payment          │
│  • Motion/React        │  Redirect │  • QR Code Payment       │
└────────────┬───────────┘           └────────┬─────────────────┘
             │                                │
             │ API Calls                      │ Webhook
             │                                │
             ▼                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE BACKEND                              │
│  ───────────────────────────────────────────────────────        │
│                                                                  │
│  ┌──────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │  PostgreSQL DB   │  │ Edge Functions │  │  Auth & RLS    │ │
│  │  ──────────────  │  │ ────────────── │  │  ───────────   │ │
│  │  • registrations │  │  • send-ticket │  │  • Row Level   │ │
│  │  • donations     │  │    -email      │  │    Security    │ │
│  │  • event_stats   │  │  • fedapay     │  │  • Policies    │ │
│  │                  │  │    -webhook    │  │                │ │
│  └──────────────────┘  └────────────────┘  └────────────────┘ │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              REST API (auto-generated)                    │  │
│  │  • GET /rest/v1/registrations                            │  │
│  │  • POST /rest/v1/registrations                           │  │
│  │  • PATCH /rest/v1/registrations                          │  │
│  │  • GET /rest/v1/donations                                │  │
│  │  • POST /rest/v1/donations                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                               │ SMTP
                               ▼
                    ┌──────────────────────┐
                    │   EMAIL SERVICE      │
                    │  (Resend/SendGrid)   │
                    │  ──────────────────  │
                    │  • Envoi de billets  │
                    │  • QR Code generation│
                    │  • Remerciements     │
                    └──────────────────────┘
```

---

## 🔄 Flux de données détaillés

### 1️⃣ Flux d'inscription

```
┌──────────┐
│Utilisateur│
└─────┬────┘
      │ 1. Remplit le formulaire
      ▼
┌─────────────────────┐
│RegistrationForm.tsx │
└─────────┬───────────┘
          │ 2. handleSubmit()
          │
          │ 3. Appel RPC: generate_ticket_code()
          ▼
┌────────────────────────┐
│   Supabase Function    │
│  generate_ticket_code()│
└─────────┬──────────────┘
          │ 4. Retourne: "V2026-XXXXX"
          ▼
┌─────────────────────┐
│ INSERT INTO         │
│ registrations       │
│ {                   │
│   first_name,       │
│   last_name,        │
│   email,            │
│   ticket_code, ...  │
│ }                   │
└─────────┬───────────┘
          │ 5. Trigger: update_event_stats()
          │
          │ 6. Invoke Edge Function
          ▼
┌─────────────────────────┐
│ send-ticket-email       │
│ Edge Function           │
├─────────────────────────┤
│ 1. Fetch registration   │
│ 2. Generate QR Code URL │
│ 3. Send email           │
│ 4. Update email_sent    │
└─────────┬───────────────┘
          │ 7. Email avec QR Code
          ▼
┌──────────────────┐
│  📧 Email Box    │
│                  │
│  [QR Code]       │
│  Ticket: V2026-XX│
└──────────────────┘
```

**Code correspondant:**

```typescript
// RegistrationForm.tsx
const handleSubmit = async (e: React.FormEvent) => {
  // 1. Générer le code
  const { data: codeData } = await supabase.rpc('generate_ticket_code');
  
  // 2. Créer l'inscription
  const { data: newRegistration } = await supabase
    .from('registrations')
    .insert({ ...formData, ticket_code: codeData })
    .select()
    .single();
  
  // 3. Envoyer l'email
  await supabase.functions.invoke('send-ticket-email', {
    body: { registrationId: newRegistration.id }
  });
};
```

---

### 2️⃣ Flux de donation

```
┌──────────┐
│Utilisateur│
└─────┬────┘
      │ 1. Sélectionne montant
      │ 2. Entre ses infos
      ▼
┌─────────────────────┐
│ DonationSection.tsx │
└─────────┬───────────┘
          │ 3. handleDonate()
          │
          │ 4. INSERT donation (status: pending)
          ▼
┌────────────────────┐
│  donations table   │
│  ──────────────    │
│  id: uuid          │
│  amount: 5000      │
│  status: pending   │
└─────────┬──────────┘
          │ 5. Créer URL FedaPay
          │
          │ 6. Rediriger vers FedaPay
          ▼
┌──────────────────────────┐
│   FedaPay Checkout       │
│  ──────────────────────  │
│  [Choisir méthode]       │
│  • MTN Mobile Money      │
│  • Moov Money            │
│  • Carte bancaire        │
└─────────┬────────────────┘
          │ 7. Utilisateur paie
          │
          │ 8. Webhook POST
          ▼
┌──────────────────────────┐
│  fedapay-webhook         │
│  Edge Function           │
├──────────────────────────┤
│ if (event == 'approved') │
│   UPDATE donation SET    │
│   status = 'completed'   │
└─────────┬────────────────┘
          │ 9. Trigger: update_event_stats()
          │
          │ 10. Redirect to /donation-success
          ▼
┌──────────────────────────┐
│  DonationSuccess.tsx     │
│  ──────────────────────  │
│  ✅ Merci pour votre don!│
│  Reçu envoyé par email   │
└──────────────────────────┘
```

**Code correspondant:**

```typescript
// DonationSection.tsx
const handleDonate = async () => {
  // 1. Créer la donation (pending)
  const { data: newDonation } = await supabase
    .from('donations')
    .insert({
      amount: amount,
      status: 'pending',
      donor_email: donorInfo.email
    })
    .select()
    .single();

  // 2. Créer URL FedaPay
  const checkoutUrl = createFedaPayCheckoutUrl({
    amount: amount,
    customMetadata: { donation_id: newDonation.id }
  });

  // 3. Rediriger
  window.location.href = checkoutUrl;
};
```

---

## 🛠️ Stack technologique

### Frontend

| Technologie | Version | Usage |
|-------------|---------|-------|
| **React** | 18+ | Framework UI |
| **TypeScript** | 5+ | Type safety |
| **Vite** | 5+ | Build tool |
| **Tailwind CSS** | 4.0 | Styling |
| **Motion (Framer)** | Latest | Animations |
| **Lucide React** | Latest | Icons |
| **Sonner** | 2.0.3 | Toast notifications |
| **@supabase/supabase-js** | 2+ | Client Supabase |

### Backend (Supabase)

| Service | Usage |
|---------|-------|
| **PostgreSQL** | Base de données relationnelle |
| **Row Level Security** | Sécurité granulaire |
| **Edge Functions** | Serverless functions (Deno) |
| **REST API** | API auto-générée |
| **Realtime** | Mises à jour en temps réel (optionnel) |

### Services tiers

| Service | Usage |
|---------|-------|
| **FedaPay** | Traitement des paiements (Mobile Money, cartes) |
| **Resend/SendGrid** | Envoi d'emails transactionnels |
| **QR Server API** | Génération de QR codes |

---

## 📂 Structure des fichiers

```
vision-2026/
├── src/
│   ├── components/
│   │   ├── Hero.tsx                    # Page d'accueil
│   │   ├── ProgramSection.tsx          # Programme 3 jours
│   │   ├── SpeakersSection.tsx         # Intervenants
│   │   ├── RegistrationForm.tsx        # 📝 Formulaire d'inscription
│   │   ├── DonationSection.tsx         # 💰 Section de don
│   │   ├── DonationSuccess.tsx         # ✅ Page de succès
│   │   ├── DonationCancel.tsx          # ❌ Page d'annulation
│   │   ├── ContactSection.tsx          # Contact & réseaux sociaux
│   │   ├── AnimatedBackground.tsx      # Background animé
│   │   ├── Navigation.tsx              # Menu de navigation
│   │   └── ui/                         # Composants ShadCN
│   ├── lib/
│   │   ├── supabase.ts                 # 🔧 Client Supabase + types
│   │   └── fedapay.ts                  # 🔧 Helpers FedaPay
│   ├── styles/
│   │   └── globals.css                 # Styles globaux
│   └── App.tsx                         # 🏠 Composant principal
│
├── supabase/
│   └── functions/
│       ├── send-ticket-email/          # ✉️ Edge Function email
│       │   └── index.ts
│       └── fedapay-webhook/            # 🔔 Edge Function webhook
│           └── index.ts
│
├── supabase-schema.sql                 # 📊 Schéma de BD complet
├── supabase-api-documentation.md       # 📖 Doc API
├── DATABASE-SCHEMA.md                  # 📖 Doc schéma
├── SETUP-GUIDE.md                      # 📖 Guide d'installation
├── ARCHITECTURE.md                     # 📖 Ce document
├── .env.example                        # Variables d'env (exemple)
└── package.json
```

---

## 🔐 Sécurité

### Row Level Security (RLS)

Toutes les tables sont protégées par RLS:

**Registrations:**
- ✅ **INSERT**: Tout le monde (anon) peut s'inscrire
- ✅ **SELECT**: Admins voient tout, users voient leurs données
- ✅ **UPDATE**: Seulement les admins (authenticated)

**Donations:**
- ✅ **INSERT**: Tout le monde peut créer une donation
- ✅ **SELECT**: Seulement les admins
- ✅ **UPDATE**: Seulement les admins (ou webhook)

### Variables d'environnement

Les clés sensibles sont stockées en variables d'environnement:

```bash
# Frontend (.env.local)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=public_key_only
VITE_FEDAPAY_PUBLIC_KEY=pk_xxx

# Backend (Supabase Secrets)
SUPABASE_SERVICE_ROLE_KEY=secret_key
RESEND_API_KEY=re_xxx
FEDAPAY_SECRET_KEY=sk_xxx
```

### Validation

**Frontend:**
- Validation des champs (required, email, age 13-35)
- TypeScript pour type safety
- Sanitization des inputs

**Backend:**
- Contraintes SQL (CHECK, UNIQUE, NOT NULL)
- RLS policies
- Edge Functions avec validation

---

## 📊 Endpoints API

### Supabase REST API

**Base URL:** `https://[PROJECT_REF].supabase.co/rest/v1`

| Endpoint | Méthode | Auth | Description |
|----------|---------|------|-------------|
| `/registrations` | POST | anon | Créer une inscription |
| `/registrations` | GET | auth | Lire toutes les inscriptions |
| `/registrations?email=eq.xxx` | GET | anon | Lire sa propre inscription |
| `/registrations?ticket_code=eq.xxx` | PATCH | auth | Check-in d'un participant |
| `/donations` | POST | anon | Créer une donation |
| `/donations` | GET | auth | Lire toutes les donations |
| `/donations?fedapay_transaction_id=eq.xxx` | PATCH | auth | Mettre à jour une donation |
| `/event_stats` | GET | anon | Lire les statistiques |

### Edge Functions

**Base URL:** `https://[PROJECT_REF].supabase.co/functions/v1`

| Function | Méthode | Body | Description |
|----------|---------|------|-------------|
| `/send-ticket-email` | POST | `{registrationId}` | Envoyer le billet par email |
| `/fedapay-webhook` | POST | FedaPay webhook data | Traiter le webhook FedaPay |

### FedaPay

**Checkout URL:** `https://checkout.fedapay.com` (prod) ou `https://sandbox-checkout.fedapay.com` (test)

**Paramètres:**
- `public_key`: Clé publique FedaPay
- `amount`: Montant en FCFA
- `currency`: XOF
- `description`: Description du paiement
- `callback_url`: URL de retour (succès)
- `cancel_url`: URL de retour (annulation)
- `customer[email]`: Email du client
- `custom_metadata`: Données personnalisées (JSON)

---

## 🚀 Déploiement

### Frontend

**Options recommandées:**

1. **Netlify**
   ```bash
   npm run build
   # Deploy dist/ folder
   ```

2. **Vercel**
   ```bash
   vercel --prod
   ```

3. **Cloudflare Pages**
   - Connecter le repo GitHub
   - Build command: `npm run build`
   - Output directory: `dist`

### Backend (Supabase)

**Déjà hébergé:** Supabase gère l'infrastructure

**À configurer:**
1. Créer le projet sur supabase.com
2. Exécuter `supabase-schema.sql`
3. Déployer les Edge Functions:
   ```bash
   supabase functions deploy send-ticket-email
   supabase functions deploy fedapay-webhook
   ```

### Variables d'environnement (Production)

Dans votre plateforme de déploiement (Netlify/Vercel):

```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
VITE_FEDAPAY_PUBLIC_KEY=pk_live_xxx
VITE_FEDAPAY_SANDBOX=false
```

---

## 📈 Performance

### Optimisations implémentées

1. **Database:**
   - Index sur colonnes fréquemment recherchées
   - Views pré-calculées pour les stats
   - Triggers pour mises à jour automatiques

2. **Frontend:**
   - Code splitting (Vite)
   - Lazy loading des composants
   - Optimisation des images
   - CSS minifié (Tailwind)

3. **API:**
   - Requêtes optimisées (select uniquement les colonnes nécessaires)
   - Pagination pour les grandes listes
   - Caching côté client

### Monitoring

**Supabase Dashboard:**
- Database performance
- API usage
- Edge Functions logs

**FedaPay Dashboard:**
- Transaction status
- Payment analytics
- Webhook logs

---

## 🔄 Évolutions futures possibles

### Phase 2

- [ ] Dashboard admin pour gérer les inscriptions
- [ ] Scan de QR codes pour le check-in
- [ ] Envoi de SMS en plus des emails
- [ ] Export CSV des inscriptions

### Phase 3

- [ ] Système de sessions et d'ateliers
- [ ] Inscription aux ateliers
- [ ] Feedback post-événement
- [ ] Génération de certificats

### Phase 4

- [ ] Application mobile (React Native)
- [ ] Notifications push
- [ ] Chat en direct
- [ ] Gamification

---

## 📞 Support

**Documentation:**
- Supabase: https://supabase.com/docs
- FedaPay: https://docs.fedapay.com
- React: https://react.dev
- Tailwind: https://tailwindcss.com

**Contact:**
- Email: support@citeexcellence.org
- GitHub Issues: [Lien du repo]

---

## ✅ Checklist de mise en production

**Avant le lancement:**

- [ ] Tests complets (inscription, donation, email)
- [ ] Variables d'environnement configurées
- [ ] FedaPay en mode production
- [ ] Email service configuré (Resend/SendGrid)
- [ ] Webhook FedaPay configuré et testé
- [ ] SSL/HTTPS activé
- [ ] Backup automatique de la BD configuré
- [ ] Monitoring activé
- [ ] Documentation à jour
- [ ] Tests de charge effectués

**Le jour J:**

- [ ] Vérifier que tous les services sont up
- [ ] Monitorer les inscriptions en temps réel
- [ ] Support disponible pour assistance
- [ ] Backup de secours prêt

---

## 📝 Changelog

**v1.0.0** (Date de lancement)
- ✅ Système d'inscription avec génération de billets
- ✅ Système de donation avec FedaPay
- ✅ Envoi d'emails automatique
- ✅ Dashboard de statistiques
- ✅ Design responsive
- ✅ Background animé personnalisé

---

Bonne chance pour Vision 2026 ! 🎉
