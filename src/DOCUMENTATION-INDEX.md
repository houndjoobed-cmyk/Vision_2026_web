# 📚 Index de la documentation - Vision 2026

Bienvenue dans la documentation complète du projet Vision 2026 !

---

## 🚀 Par où commencer ?

### Vous êtes développeur et voulez lancer le projet ?
👉 Commencez par **[QUICK-REFERENCE.md](./QUICK-REFERENCE.md)** (5 minutes)  
Puis suivez **[SETUP-GUIDE.md](./SETUP-GUIDE.md)** (30 minutes)

### Vous voulez comprendre l'architecture ?
👉 Lisez **[ARCHITECTURE.md](./ARCHITECTURE.md)**

### Vous cherchez des endpoints API spécifiques ?
👉 Consultez **[API-ENDPOINTS.md](./API-ENDPOINTS.md)**

### Vous voulez comprendre la base de données ?
👉 Voir **[DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md)**

---

## 📖 Documentation complète

### 📄 Fichiers principaux

| Fichier | Description | Temps de lecture |
|---------|-------------|------------------|
| **[README.md](./README.md)** | Vue d'ensemble du projet | 5 min |
| **[QUICK-REFERENCE.md](./QUICK-REFERENCE.md)** | Référence rapide | 5 min |
| **[SETUP-GUIDE.md](./SETUP-GUIDE.md)** | Guide d'installation complet | 30 min |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Architecture du système | 15 min |
| **[DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md)** | Schéma de base de données | 20 min |
| **[API-ENDPOINTS.md](./API-ENDPOINTS.md)** | Endpoints API détaillés | 15 min |
| **[INTEGRATION-GUIDE.md](./INTEGRATION-GUIDE.md)** | Guide d'intégration | 20 min |
| **[supabase-api-documentation.md](./supabase-api-documentation.md)** | Doc API Supabase | 25 min |

### 🗂️ Fichiers de configuration

| Fichier | Description |
|---------|-------------|
| **[.env.example](./.env.example)** | Exemple de variables d'environnement |
| **[supabase-schema.sql](./supabase-schema.sql)** | Script SQL pour créer les tables |

---

## 🎯 Documentation par rôle

### 👨‍💻 Développeur Frontend

**À lire en priorité:**
1. [QUICK-REFERENCE.md](./QUICK-REFERENCE.md) - Démarrage rapide
2. [README.md](./README.md) - Vue d'ensemble
3. [API-ENDPOINTS.md](./API-ENDPOINTS.md) - Utiliser les APIs

**Fichiers de code importants:**
- `/components/RegistrationForm.tsx` - Formulaire d'inscription
- `/components/DonationSection.tsx` - Gestion des dons
- `/lib/supabase.ts` - Client Supabase
- `/lib/fedapay.ts` - Intégration FedaPay

---

### 🔧 Développeur Backend

**À lire en priorité:**
1. [SETUP-GUIDE.md](./SETUP-GUIDE.md) - Configuration
2. [DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md) - Structure BD
3. [supabase-api-documentation.md](./supabase-api-documentation.md) - API Supabase

**Fichiers de code importants:**
- `supabase-schema.sql` - Schéma de la BD
- `/supabase/functions/send-ticket-email/` - Edge Function email
- `/supabase/functions/fedapay-webhook/` - Edge Function webhook

---

### 🏗️ Architecte / Tech Lead

**À lire en priorité:**
1. [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture complète
2. [INTEGRATION-GUIDE.md](./INTEGRATION-GUIDE.md) - Intégration des services
3. [DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md) - Modèle de données

---

### 🎨 Designer UI/UX

**Informations utiles:**
- Palette de couleurs: Rouge #fe0000, Jaune #ffcf00, Doré #b5882a, Noir #000000
- Framework: Tailwind CSS 4.0
- Composants: ShadCN UI
- Animations: Motion (Framer Motion)
- Voir: `/components/` pour les composants

---

### 📊 Product Owner / Chef de projet

**À lire en priorité:**
1. [README.md](./README.md) - Vue d'ensemble du projet
2. [SETUP-GUIDE.md](./SETUP-GUIDE.md) - Étapes de déploiement
3. [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture technique

**Checklists importantes:**
- [README.md](./README.md) - Checklist de lancement
- [QUICK-REFERENCE.md](./QUICK-REFERENCE.md) - Checklist avant déploiement

---

## 📋 Documentation par fonctionnalité

### ✍️ Inscription des participants

**Documentation:**
- [API-ENDPOINTS.md](./API-ENDPOINTS.md#inscriptions-registrations) - Endpoints d'inscription
- [DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md#1-registrations) - Table registrations

**Fichiers de code:**
- `/components/RegistrationForm.tsx`
- `/lib/supabase.ts`

**Flux:**
```
Utilisateur → Formulaire → Supabase → Edge Function → Email
```

---

### 💰 Donations

**Documentation:**
- [API-ENDPOINTS.md](./API-ENDPOINTS.md#donations) - Endpoints donations
- [INTEGRATION-GUIDE.md](./INTEGRATION-GUIDE.md#flux-2-donation-avec-fedapay) - Intégration FedaPay

**Fichiers de code:**
- `/components/DonationSection.tsx`
- `/lib/fedapay.ts`
- `/supabase/functions/fedapay-webhook/`

**Flux:**
```
Utilisateur → Formulaire → Supabase → FedaPay → Webhook → Supabase
```

---

### 📧 Envoi d'emails

**Documentation:**
- [INTEGRATION-GUIDE.md](./INTEGRATION-GUIDE.md#flux-3-envoi-demails) - Configuration email
- [supabase-api-documentation.md](./supabase-api-documentation.md#edge-functions) - Edge Functions

**Fichiers de code:**
- `/supabase/functions/send-ticket-email/`

**Services supportés:**
- Resend
- SendGrid
- SMTP personnalisé

---

### 📊 Statistiques

**Documentation:**
- [DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md#3-event_stats) - Table event_stats
- [API-ENDPOINTS.md](./API-ENDPOINTS.md#statistiques) - Endpoints stats

**Requêtes utiles:**
```sql
SELECT * FROM event_stats;
SELECT * FROM registrations_by_city;
SELECT * FROM registrations_by_age_group;
```

---

## 🔍 Recherche rapide

### Configuration

**Supabase:**
- [SETUP-GUIDE.md - Étape 2](./SETUP-GUIDE.md#étape-2-configuration-supabase)
- Variables d'env: [.env.example](./.env.example)

**FedaPay:**
- [SETUP-GUIDE.md - Étape 3](./SETUP-GUIDE.md#étape-3-configuration-fedapay)
- Intégration: [INTEGRATION-GUIDE.md](./INTEGRATION-GUIDE.md#flux-2-donation-avec-fedapay)

**Email:**
- [SETUP-GUIDE.md - Étape 5](./SETUP-GUIDE.md#étape-5-configuration-de-lenvoi-demails)
- Templates: [INTEGRATION-GUIDE.md](./INTEGRATION-GUIDE.md#template-demail)

---

### Commandes fréquentes

```bash
# Développement
npm run dev

# Build
npm run build

# Déployer Edge Functions
supabase functions deploy send-ticket-email
supabase functions deploy fedapay-webhook

# Tests
# Voir QUICK-REFERENCE.md - Section Tests
```

---

### Requêtes SQL fréquentes

```sql
-- Voir toutes les inscriptions
SELECT * FROM registrations ORDER BY created_at DESC;

-- Statistiques
SELECT * FROM event_stats;

-- Vérifier un billet
SELECT * FROM registrations WHERE ticket_code = 'V2026-ABC123';

-- Total des donations
SELECT SUM(amount) FROM donations WHERE status = 'completed';
```

---

### Endpoints API fréquents

```javascript
// Créer une inscription
await supabase.from('registrations').insert({...});

// Obtenir les stats
await supabase.from('event_stats').select('*').single();

// Créer une donation
await supabase.from('donations').insert({...});

// Envoyer un email
await supabase.functions.invoke('send-ticket-email', {...});
```

---

## 🐛 Dépannage

**Problème: Les inscriptions ne fonctionnent pas**
👉 [QUICK-REFERENCE.md - Résolution de problèmes](./QUICK-REFERENCE.md#résolution-de-problèmes)

**Problème: FedaPay ne redirige pas**
👉 [INTEGRATION-GUIDE.md - Tests](./INTEGRATION-GUIDE.md#test-complet-du-flux-de-donation)

**Problème: Les emails ne sont pas envoyés**
👉 [QUICK-REFERENCE.md - Les emails ne sont pas envoyés](./QUICK-REFERENCE.md#les-emails-ne-sont-pas-envoyés)

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

## 📝 Contribuer à la documentation

Pour améliorer la documentation:

1. Identifiez la section à améliorer
2. Modifiez le fichier .md correspondant
3. Testez vos changements
4. Créez une Pull Request

**Conventions:**
- Utilisez des emojis pour la lisibilité 🎨
- Incluez des exemples de code
- Gardez un ton clair et accessible
- Structurez avec des sections

---

## 🗺️ Roadmap de la documentation

### ✅ Complété
- [x] README principal
- [x] Guide d'installation
- [x] Architecture
- [x] Schéma de base de données
- [x] Endpoints API
- [x] Guide d'intégration
- [x] Référence rapide

### 🚧 En cours
- [ ] Tutoriels vidéo
- [ ] FAQ
- [ ] Guide de contribution
- [ ] Guide de déploiement avancé

### 📅 Prévu
- [ ] Guide de migration
- [ ] Guide de performance
- [ ] Guide de sécurité avancé
- [ ] Diagrammes interactifs

---

## 📚 Lectures recommandées

### Pour démarrer (Jour 1)
1. [README.md](./README.md) - 5 min
2. [QUICK-REFERENCE.md](./QUICK-REFERENCE.md) - 5 min
3. [SETUP-GUIDE.md](./SETUP-GUIDE.md) - 30 min

### Pour approfondir (Semaine 1)
4. [ARCHITECTURE.md](./ARCHITECTURE.md) - 15 min
5. [DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md) - 20 min
6. [API-ENDPOINTS.md](./API-ENDPOINTS.md) - 15 min

### Pour maîtriser (Mois 1)
7. [INTEGRATION-GUIDE.md](./INTEGRATION-GUIDE.md) - 20 min
8. [supabase-api-documentation.md](./supabase-api-documentation.md) - 25 min
9. Expérimentation et tests

---

## ✨ Bonne lecture !

La documentation est votre meilleur ami. N'hésitez pas à y revenir régulièrement ! 📖

Pour toute question ou suggestion, contactez-nous à **support@citeexcellence.org**

---

**Dernière mise à jour:** 23 octobre 2025  
**Version:** 1.0.0  
**Auteur:** Équipe Vision 2026
