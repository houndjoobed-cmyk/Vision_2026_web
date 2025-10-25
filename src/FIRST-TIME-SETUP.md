# 🚀 Configuration initiale - Vision 2026

## ⚠️ Vous voyez ce message ?

Vous avez probablement vu une erreur ou un avertissement concernant les variables d'environnement. **C'est normal !** Suivez ces étapes pour configurer le projet.

---

## ✅ Configuration rapide (5 minutes)

### Étape 1 : Créer le fichier de configuration

Dans le terminal, à la racine du projet :

```bash
# Copier le fichier d'exemple
cp .env.example .env.local
```

Ou créez manuellement un fichier `.env.local` avec ce contenu :

```bash
# Configuration Supabase
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_publique_anon_key_ici

# Configuration FedaPay
VITE_FEDAPAY_PUBLIC_KEY=votre_cle_publique_fedapay_ici
VITE_FEDAPAY_SANDBOX=true
```

### Étape 2 : Obtenir les clés Supabase (GRATUIT)

1. Allez sur [supabase.com](https://supabase.com)
2. Cliquez sur "Start your project" (Gratuit, pas de carte bancaire)
3. Créez un compte
4. Créez un nouveau projet
5. Allez dans **Settings** > **API**
6. Copiez :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`
7. Collez dans `.env.local`

### Étape 3 : Obtenir la clé FedaPay

**Option A : Mode TEST (recommandé pour débuter)**

1. Allez sur [fedapay.com](https://fedapay.com)
2. Créez un compte
3. Allez dans **Développeurs** > **Clés API**
4. Copiez la **Clé Publique de Test** (commence par `pk_sandbox_`)
5. Collez dans `.env.local` pour `VITE_FEDAPAY_PUBLIC_KEY`
6. Laissez `VITE_FEDAPAY_SANDBOX=true`

**Option B : Travailler sans FedaPay pour le moment**

Si vous voulez tester uniquement les inscriptions sans les dons :

```bash
VITE_FEDAPAY_PUBLIC_KEY=pk_sandbox_test_temporaire
VITE_FEDAPAY_SANDBOX=true
```

### Étape 4 : Redémarrer le serveur

```bash
# Arrêter le serveur (Ctrl+C)
# Puis relancer
npm run dev
```

---

## 🎯 Configuration complète

Pour une configuration complète avec base de données, emails, etc., suivez le guide détaillé :

👉 **[SETUP-GUIDE.md](./SETUP-GUIDE.md)**

---

## ✅ Vérification

Après avoir configuré `.env.local` et redémarré le serveur :

1. ✅ Pas d'avertissement jaune en bas à droite
2. ✅ Le formulaire d'inscription fonctionne
3. ✅ Vous pouvez voir les données dans Supabase

---

## 🆘 Problèmes fréquents

### ❌ Erreur : "Cannot read properties of undefined"

**Solution :** Vous n'avez pas créé le fichier `.env.local`

```bash
cp .env.example .env.local
# Puis éditez .env.local avec vos clés
```

### ❌ Avertissement jaune persiste après configuration

**Solution :** Redémarrez le serveur de développement

```bash
# Ctrl+C pour arrêter
npm run dev
```

### ❌ "fetch failed" ou "CORS error"

**Solution :** Vérifiez que vos clés Supabase sont correctes dans `.env.local`

---

## 📝 Exemple de `.env.local` complet

```bash
# Configuration Supabase (REMPLACEZ avec vos vraies valeurs)
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5ODQwMDAwMCwiZXhwIjoyMDE0MDAwMDAwfQ.VOTRE_CLE_ICI

# Configuration FedaPay (REMPLACEZ avec votre vraie clé)
VITE_FEDAPAY_PUBLIC_KEY=pk_sandbox_0123456789abcdef
VITE_FEDAPAY_SANDBOX=true
```

---

## 🚀 Prochaines étapes

Une fois que le site fonctionne en local :

1. **Créer le schéma de base de données**
   - Allez dans Supabase > SQL Editor
   - Copiez le contenu de `supabase-schema.sql`
   - Exécutez le script

2. **Tester les inscriptions**
   - Remplissez le formulaire
   - Vérifiez dans Supabase > Table Editor > registrations

3. **Configurer les emails** (optionnel)
   - Voir [SETUP-GUIDE.md - Étape 5](./SETUP-GUIDE.md#étape-5-configuration-de-lenvoi-demails)

---

## 📞 Besoin d'aide ?

- 📖 Documentation complète : [SETUP-GUIDE.md](./SETUP-GUIDE.md)
- 🚀 Référence rapide : [QUICK-REFERENCE.md](./QUICK-REFERENCE.md)
- 📧 Support : support@citeexcellence.org

---

**Bon développement ! 🎉**
