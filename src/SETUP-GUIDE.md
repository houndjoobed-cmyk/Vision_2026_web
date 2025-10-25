# Guide de configuration - Vision 2026

Ce guide vous aidera à configurer complètement le site Vision 2026 avec Supabase et FedaPay.

## 📋 Prérequis

- Un compte Supabase (gratuit sur [supabase.com](https://supabase.com))
- Un compte FedaPay (inscription sur [fedapay.com](https://fedapay.com))
- Node.js 18+ installé
- Git installé

---

## 🚀 Étape 1: Configuration du projet

### 1.1 Cloner et installer

```bash
# Cloner le projet
git clone [URL_DU_REPO]
cd vision-2026

# Installer les dépendances
npm install
```

### 1.2 Variables d'environnement

```bash
# Créer le fichier .env.local
cp .env.example .env.local
```

Ouvrez `.env.local` et remplissez les valeurs (nous les obtiendrons dans les étapes suivantes).

---

## 🗄️ Étape 2: Configuration Supabase

### 2.1 Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez les informations de connexion

### 2.2 Obtenir les clés API

1. Dans votre projet Supabase, allez dans **Settings** > **API**
2. Copiez les valeurs suivantes dans votre `.env.local`:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

### 2.3 Créer le schéma de base de données

1. Dans Supabase, allez dans **SQL Editor**
2. Cliquez sur **New Query**
3. Copiez le contenu du fichier `supabase-schema.sql`
4. Collez-le dans l'éditeur SQL
5. Cliquez sur **Run** pour exécuter le script

✅ Votre base de données est maintenant configurée !

### 2.4 Vérifier les tables

1. Allez dans **Table Editor**
2. Vous devriez voir:
   - `registrations`
   - `donations`
   - `event_stats`

---

## 💳 Étape 3: Configuration FedaPay

### 3.1 Créer un compte FedaPay

1. Allez sur [fedapay.com](https://fedapay.com)
2. Créez un compte
3. Vérifiez votre email

### 3.2 Obtenir la clé publique

1. Connectez-vous à votre dashboard FedaPay
2. Allez dans **Développeurs** > **Clés API**
3. Copiez votre **Clé Publique de Test** (pour commencer)
4. Ajoutez-la dans `.env.local`:
   ```
   VITE_FEDAPAY_PUBLIC_KEY=pk_sandbox_votre_cle_ici
   VITE_FEDAPAY_SANDBOX=true
   ```

### 3.3 Configurer le webhook (optionnel mais recommandé)

Le webhook permet à FedaPay de notifier votre application quand un paiement est complété.

**Prérequis:** Vous devez d'abord déployer les Edge Functions Supabase (voir Étape 4).

1. Dans FedaPay, allez dans **Développeurs** > **Webhooks**
2. Cliquez sur **Ajouter un webhook**
3. URL du webhook: `https://[VOTRE_PROJET].supabase.co/functions/v1/fedapay-webhook`
4. Sélectionnez les événements:
   - ✅ `transaction.approved`
   - ✅ `transaction.canceled`
5. Sauvegardez

---

## ⚡ Étape 4: Configuration des Edge Functions Supabase

Les Edge Functions permettent d'envoyer des emails et de traiter les webhooks.

### 4.1 Installer Supabase CLI

```bash
# MacOS / Linux
brew install supabase/tap/supabase

# Windows (avec Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Ou via NPM
npm install -g supabase
```

### 4.2 Initialiser Supabase dans le projet

```bash
# Se connecter à Supabase
supabase login

# Lier le projet
supabase link --project-ref [VOTRE_PROJECT_REF]
```

Pour trouver votre `PROJECT_REF`:
- Dans Supabase, allez dans **Settings** > **General**
- C'est la partie de votre URL: `https://[PROJECT_REF].supabase.co`

### 4.3 Créer les Edge Functions

**Function 1: send-ticket-email**

```bash
# Créer la fonction
supabase functions new send-ticket-email
```

Copiez le code suivant dans `supabase/functions/send-ticket-email/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { registrationId } = await req.json()
    
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
    
    // TODO: Envoyer l'email avec un service email
    // Pour l'instant, on marque juste comme envoyé
    await supabase
      .from('registrations')
      .update({ email_sent: true })
      .eq('id', registrationId)
    
    return new Response(
      JSON.stringify({ success: true, message: 'Email marked as sent' }),
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

**Function 2: fedapay-webhook**

```bash
# Créer la fonction
supabase functions new fedapay-webhook
```

Copiez le code suivant dans `supabase/functions/fedapay-webhook/index.ts`:

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
    
    if (webhook.event === 'transaction.approved') {
      const { error } = await supabase
        .from('donations')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          fedapay_transaction_id: webhook.entity?.id,
          payment_method: webhook.entity?.customer?.payment_method,
          callback_data: webhook
        })
        .eq('id', webhook.entity?.custom_metadata?.donation_id)
      
      if (error) throw error
      
    } else if (webhook.event === 'transaction.canceled') {
      await supabase
        .from('donations')
        .update({
          status: 'cancelled',
          callback_data: webhook
        })
        .eq('id', webhook.entity?.custom_metadata?.donation_id)
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

### 4.4 Déployer les functions

```bash
# Déployer toutes les functions
supabase functions deploy send-ticket-email
supabase functions deploy fedapay-webhook
```

---

## 📧 Étape 5: Configuration de l'envoi d'emails (Optionnel)

Pour envoyer les billets par email, vous avez plusieurs options:

### Option 1: Resend (Recommandé)

1. Créez un compte sur [resend.com](https://resend.com)
2. Obtenez votre API Key
3. Ajoutez-la dans Supabase:
   ```bash
   supabase secrets set RESEND_API_KEY=re_votre_cle_ici
   ```
4. Mettez à jour le code de la function `send-ticket-email` pour utiliser Resend

### Option 2: SMTP personnalisé

Configurez SMTP dans les paramètres Supabase:
1. Allez dans **Settings** > **Auth** > **SMTP Settings**
2. Configurez votre serveur SMTP

---

## 🧪 Étape 6: Tests

### 6.1 Tester l'inscription

1. Lancez le projet en local:
   ```bash
   npm run dev
   ```
2. Ouvrez http://localhost:5173
3. Remplissez le formulaire d'inscription
4. Vérifiez dans Supabase **Table Editor** > **registrations**

### 6.2 Tester la donation

1. Cliquez sur "Faire un don"
2. Choisissez un montant
3. Entrez vos informations
4. Vous serez redirigé vers la page de paiement FedaPay (en mode test)
5. Utilisez les numéros de test FedaPay pour simuler un paiement

**Numéros de test FedaPay:**
- MTN Mobile Money: `96000001` / Code: `123456`
- Moov Money: `97000001` / Code: `123456`

### 6.3 Vérifier les données

1. Dans Supabase, vérifiez la table **donations**
2. Le statut devrait passer de `pending` à `completed` après paiement

---

## 🚀 Étape 7: Déploiement en production

### 7.1 Déployer sur Netlify/Vercel

```bash
# Build le projet
npm run build

# Le dossier dist/ contient les fichiers à déployer
```

### 7.2 Configurer les variables d'environnement

Dans Netlify/Vercel, ajoutez les variables d'environnement:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_FEDAPAY_PUBLIC_KEY`
- `VITE_FEDAPAY_SANDBOX=false` (pour la production)

### 7.3 Passer FedaPay en production

1. Dans FedaPay, passez en mode Production
2. Obtenez votre **Clé Publique de Production**
3. Remplacez la clé dans vos variables d'environnement
4. Mettez `VITE_FEDAPAY_SANDBOX=false`

---

## 📊 Étape 8: Monitoring et Analytics

### 8.1 Tableau de bord Supabase

1. Allez dans **Database** > **Table Editor**
2. Consultez `event_stats` pour les statistiques en temps réel

### 8.2 Logs FedaPay

1. Dans FedaPay, allez dans **Transactions**
2. Consultez l'historique des paiements

---

## 🔧 Dépannage

### Problème: Les inscriptions ne s'enregistrent pas

**Solution:**
1. Vérifiez que les clés Supabase sont correctes dans `.env.local`
2. Vérifiez les logs dans la console du navigateur
3. Vérifiez les RLS policies dans Supabase

### Problème: Les emails ne sont pas envoyés

**Solution:**
1. Vérifiez que la Edge Function est déployée
2. Vérifiez les logs de la fonction dans Supabase **Edge Functions** > **Logs**
3. Vérifiez la configuration SMTP/Email

### Problème: La redirection FedaPay ne fonctionne pas

**Solution:**
1. Vérifiez que la clé publique FedaPay est correcte
2. Vérifiez que `VITE_FEDAPAY_SANDBOX` est configuré correctement
3. Consultez les logs de la console

---

## 📞 Support

Pour toute question:
- Documentation Supabase: https://supabase.com/docs
- Documentation FedaPay: https://docs.fedapay.com
- Email: support@citeexcellence.org

---

## ✅ Checklist finale

Avant de lancer en production:

- [ ] Base de données Supabase créée et schéma exécuté
- [ ] Variables d'environnement configurées
- [ ] Edge Functions déployées
- [ ] Webhook FedaPay configuré
- [ ] Tests d'inscription effectués
- [ ] Tests de donation effectués
- [ ] Service email configuré
- [ ] Site déployé
- [ ] FedaPay en mode production
- [ ] Monitoring en place

Félicitations ! Votre site Vision 2026 est prêt ! 🎉
