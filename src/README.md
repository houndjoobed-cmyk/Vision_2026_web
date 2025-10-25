# Vision 2026 - Site d'inscription

![Vision 2026](https://img.shields.io/badge/Vision-2026-yellow?style=for-the-badge)
![React](https://img.shields.io/badge/React-18+-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=for-the-badge&logo=supabase)
![FedaPay](https://img.shields.io/badge/FedaPay-Payment-orange?style=for-the-badge)

Site web d'inscription pour le séminaire **Vision 2026** de la Cité d'Excellence, destiné aux jeunes pour les encourager à créer des projets et développer leurs visions 2026 en les soumettant à Dieu.

---

## ✨ Fonctionnalités

### 🎯 Principales
- ✅ **Page d'accueil dynamique** avec background animé personnalisé
- ✅ **Programme sur 3 jours** détaillé
- ✅ **Présentation des intervenants** (style moderne)
- ✅ **Formulaire d'inscription** connecté à Supabase
- ✅ **Système de donation** avec intégration FedaPay
- ✅ **Génération automatique de billets** avec QR code
- ✅ **Envoi d'emails automatique** avec les billets
- ✅ **Section contact** avec réseaux sociaux
- ✅ **Design responsive** (mobile, tablet, desktop)

### 🎨 Design
- Palette de couleurs personnalisée: Rouge (#fe0000), Jaune (#ffcf00), Doré (#b5882a), Noir (#000000)
- Background animé montrant un jeune qui monte vers sa vision 2026
- Animations fluides avec Motion (Framer Motion)
- Typographie harmonisée
- Design moderne et dynamique

---

## 🚀 Démarrage rapide

### ⚡ Première fois ? Commencez ici !

👉 **[FIRST-TIME-SETUP.md](./FIRST-TIME-SETUP.md)** - Configuration en 5 minutes

### Prérequis

- Node.js 18+
- npm ou yarn
- Compte Supabase (gratuit)
- Compte FedaPay (optionnel pour débuter)

### Installation

```bash
# 1. Cloner le projet
git clone [URL_DU_REPO]
cd vision-2026

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
# Éditez .env.local avec vos clés API
# Suivez FIRST-TIME-SETUP.md pour obtenir les clés

# 4. Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur `http://localhost:5173`

> ⚠️ **Note:** Si vous voyez un avertissement jaune, suivez [FIRST-TIME-SETUP.md](./FIRST-TIME-SETUP.md)

---

## 📋 Configuration complète

Pour une configuration complète du projet, suivez le guide détaillé:

👉 **[SETUP-GUIDE.md](./SETUP-GUIDE.md)** - Guide d'installation complet pas à pas

---

## 🗄️ Structure du projet

```
vision-2026/
├── src/
│   ├── components/          # Composants React
│   │   ├── Hero.tsx
│   │   ├── ProgramSection.tsx
│   │   ├── SpeakersSection.tsx
│   │   ├── RegistrationForm.tsx
│   │   ├── DonationSection.tsx
│   │   ├── ContactSection.tsx
│   │   └── ...
│   ├── lib/                 # Utilitaires
│   │   ├── supabase.ts      # Client Supabase
│   │   └── fedapay.ts       # Helpers FedaPay
│   ├── styles/
│   │   └── globals.css      # Styles globaux
│   └── App.tsx              # Composant principal
│
├── supabase/
│   └── functions/           # Edge Functions
│       ├── send-ticket-email/
│       └── fedapay-webhook/
│
├── supabase-schema.sql      # Schéma de base de données
│
├── Documentation/
│   ├── SETUP-GUIDE.md       # Guide d'installation
│   ├── ARCHITECTURE.md      # Architecture du système
│   ├── DATABASE-SCHEMA.md   # Documentation du schéma BD
│   ├── API-ENDPOINTS.md     # Liste des endpoints API
│   └── supabase-api-documentation.md
│
└── package.json
```

---

## 📊 Base de données

Le projet utilise **Supabase** (PostgreSQL) avec les tables suivantes:

### Tables principales
- **registrations** - Inscriptions des participants
- **donations** - Tracking des donations
- **event_stats** - Statistiques en temps réel

Pour le schéma complet:
👉 **[DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md)**

---

## 🔌 APIs & Endpoints

Le projet expose plusieurs endpoints pour:
- Créer des inscriptions
- Gérer les donations
- Obtenir des statistiques
- Envoyer des emails

Pour la liste complète:
👉 **[API-ENDPOINTS.md](./API-ENDPOINTS.md)**

---

## 🏗️ Architecture

Le projet suit une architecture moderne avec:
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Paiement**: FedaPay (Mobile Money, Cartes)
- **Email**: Resend/SendGrid

Pour plus de détails:
👉 **[ARCHITECTURE.md](./ARCHITECTURE.md)**

---

## 🔐 Sécurité

### Row Level Security (RLS)
Toutes les tables sont protégées par des policies RLS:
- Les utilisateurs anonymes peuvent s'inscrire
- Seuls les admins peuvent voir toutes les données
- Les webhooks utilisent des clés de service

### Variables d'environnement
Les clés sensibles sont stockées de manière sécurisée:
- Frontend: `.env.local` (non commité)
- Backend: Supabase Secrets

---

## 🧪 Tests

### Mode développement

```bash
# Lancer le serveur de développement
npm run dev

# Tester l'inscription
# 1. Allez sur http://localhost:5173
# 2. Remplissez le formulaire d'inscription
# 3. Vérifiez dans Supabase Table Editor

# Tester la donation
# 1. Cliquez sur "Faire un don"
# 2. Utilisez les numéros de test FedaPay
```

### Numéros de test FedaPay

En mode sandbox, utilisez:
- MTN Mobile Money: `96000001` / Code: `123456`
- Moov Money: `97000001` / Code: `123456`

---

## 📦 Déploiement

### Build de production

```bash
npm run build
```

Le dossier `dist/` contient les fichiers prêts à déployer.

### Plateformes recommandées

- **Netlify** - [Tutoriel](https://docs.netlify.com)
- **Vercel** - [Tutoriel](https://vercel.com/docs)
- **Cloudflare Pages** - [Tutoriel](https://developers.cloudflare.com/pages)

### Variables d'environnement (Production)

N'oubliez pas de configurer dans votre plateforme:
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
VITE_FEDAPAY_PUBLIC_KEY=pk_live_xxx
VITE_FEDAPAY_SANDBOX=false
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [SETUP-GUIDE.md](./SETUP-GUIDE.md) | Guide d'installation complet |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Architecture du système |
| [DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md) | Schéma de base de données |
| [API-ENDPOINTS.md](./API-ENDPOINTS.md) | Endpoints API détaillés |
| [supabase-api-documentation.md](./supabase-api-documentation.md) | Documentation API Supabase |

---

## 🛠️ Technologies utilisées

### Frontend
- **React** 18+ - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** 4.0 - Styling
- **Motion (Framer)** - Animations
- **Lucide React** - Icônes
- **Sonner** - Toast notifications
- **ShadCN UI** - Composants UI

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL - Base de données
  - Edge Functions - Serverless
  - Row Level Security - Sécurité
  - REST API - Auto-générée
  
### Services tiers
- **FedaPay** - Paiements (Mobile Money, Cartes)
- **Resend/SendGrid** - Envoi d'emails
- **QR Server API** - Génération de QR codes

---

## 🤝 Contribuer

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 📞 Support & Contact

### Documentation
- Supabase: https://supabase.com/docs
- FedaPay: https://docs.fedapay.com
- React: https://react.dev

### Contact
- **Email:** contact@citeexcellence.org
- **Site web:** [À venir]
- **GitHub Issues:** [Lien du repo]

---

## 🎉 À propos de Vision 2026

**Vision 2026** est un séminaire de 3 jours organisé par la **Cité d'Excellence** pour inspirer les jeunes à:
- Rêver avec Dieu
- Planifier leur avenir pour 2026
- Soumettre leurs projets à Dieu
- Développer leurs visions avec excellence

### Devise
> **"Empowering Youth. Shaping Tomorrow."**  
> *Ensemble, nous nous élevons en visant l'excellence.*

---

## ✅ Checklist de lancement

Avant de lancer en production:

- [ ] Base de données Supabase configurée
- [ ] Schéma SQL exécuté
- [ ] Edge Functions déployées
- [ ] Variables d'environnement configurées
- [ ] FedaPay en mode production
- [ ] Service email configuré
- [ ] Tests complets effectués
- [ ] Webhook FedaPay testé
- [ ] Site déployé
- [ ] Monitoring activé
- [ ] Backup configuré

---

## 🙏 Remerciements

- La **Cité d'Excellence** pour l'organisation de Vision 2026
- Tous les **intervenants** qui partagent leur expertise
- Les **donateurs** qui rendent cet événement possible
- La **communauté** pour son soutien

---

**Développé avec ❤️ pour Vision 2026**

*Ensemble, transformons 500 vies de jeunes !* 🌟
