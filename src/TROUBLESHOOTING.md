# 🔧 Dépannage - Vision 2026

Guide de résolution des problèmes courants.

---

## 🚨 Erreurs fréquentes

### ❌ "Cannot read properties of undefined (reading 'VITE_SUPABASE_URL')"

**Cause:** Le fichier `.env.local` n'existe pas ou n'est pas correctement configuré.

**Solution:**

```bash
# 1. Vérifier si le fichier existe
ls -la .env.local

# 2. Si le fichier n'existe pas, le créer
cp .env.example .env.local

# 3. Éditer .env.local et ajouter vos clés
# Voir FIRST-TIME-SETUP.md pour obtenir les clés

# 4. Redémarrer le serveur
npm run dev
```

---

### ❌ "fetch failed" ou "Failed to fetch"

**Cause:** Les clés Supabase sont incorrectes ou le projet Supabase n'existe pas.

**Solution:**

1. Vérifiez votre fichier `.env.local`
2. Assurez-vous que `VITE_SUPABASE_URL` commence par `https://`
3. Vérifiez que la clé `VITE_SUPABASE_ANON_KEY` est correcte
4. Testez la connexion :

```javascript
// Dans la console du navigateur
console.log(import.meta.env.VITE_SUPABASE_URL);
// Devrait afficher: https://xxx.supabase.co
```

---

### ❌ "CORS policy" error

**Cause:** Problème de configuration CORS ou URL Supabase incorrecte.

**Solution:**

1. Vérifiez que l'URL Supabase est correcte dans `.env.local`
2. Vérifiez dans Supabase Dashboard > Settings > API que l'URL correspond
3. Essayez de redémarrer le serveur de développement

---

### ❌ Avertissement jaune persiste après configuration

**Cause:** Le serveur n'a pas été redémarré après avoir modifié `.env.local`.

**Solution:**

```bash
# Arrêter le serveur (Ctrl+C dans le terminal)
# Puis relancer
npm run dev
```

> Les variables d'environnement ne sont chargées qu'au démarrage du serveur.

---

### ❌ "Duplicate key value violates unique constraint"

**Cause:** Vous essayez de vous inscrire avec un email déjà utilisé.

**Solution:**

Option 1 - Utiliser un autre email :
```
test+1@example.com
test+2@example.com
```

Option 2 - Supprimer l'inscription existante :
1. Allez dans Supabase > Table Editor > registrations
2. Trouvez l'email
3. Supprimez la ligne
4. Réessayez

---

### ❌ Les emails ne sont pas envoyés

**Cause:** La Edge Function `send-ticket-email` n'est pas déployée ou le service email n'est pas configuré.

**Solution temporaire - Voir les données dans Supabase:**

1. Allez dans Supabase > Table Editor > registrations
2. Vous verrez l'inscription même si l'email n'a pas été envoyé
3. Le champ `email_sent` sera `false`

**Solution permanente - Déployer la fonction:**

```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter
supabase login

# Lier le projet
supabase link --project-ref [VOTRE_PROJECT_REF]

# Déployer la fonction
supabase functions deploy send-ticket-email
```

Voir [SETUP-GUIDE.md - Étape 4](./SETUP-GUIDE.md#étape-4-configuration-des-edge-functions) pour plus de détails.

---

### ❌ Redirection FedaPay ne fonctionne pas

**Cause:** La clé publique FedaPay est incorrecte ou manquante.

**Solution:**

1. Vérifiez `.env.local` :
```bash
VITE_FEDAPAY_PUBLIC_KEY=pk_sandbox_xxx  # Doit commencer par pk_
VITE_FEDAPAY_SANDBOX=true
```

2. Vérifiez dans le dashboard FedaPay que la clé est correcte

3. Testez avec un montant minimal (100 FCFA)

---

### ❌ "Module not found" ou "Cannot find module"

**Cause:** Les dépendances ne sont pas installées.

**Solution:**

```bash
# Supprimer node_modules et package-lock.json
rm -rf node_modules package-lock.json

# Réinstaller
npm install

# Relancer
npm run dev
```

---

### ❌ Le build échoue (`npm run build`)

**Cause 1:** Variables d'environnement manquantes

**Solution:**
```bash
# Vérifier que .env.local existe et contient toutes les clés
cat .env.local
```

**Cause 2:** Erreur TypeScript

**Solution:**
```bash
# Vérifier les erreurs TypeScript
npm run type-check  # Si disponible

# Ou ignorer temporairement (non recommandé)
# Dans vite.config.ts, ajouter:
# build: { rollupOptions: { external: [...] } }
```

---

## 🔍 Diagnostics

### Vérifier la configuration

```bash
# 1. Variables d'environnement
cat .env.local

# 2. Structure des fichiers
ls -la lib/

# 3. Dépendances installées
npm list @supabase/supabase-js
```

### Tester la connexion Supabase

Dans la console du navigateur (F12) :

```javascript
// Test 1: Variables d'env
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...');

// Test 2: Client Supabase
import { supabase } from './lib/supabase';
const { data, error } = await supabase.from('registrations').select('count');
console.log('Connection test:', data, error);
```

### Vérifier les logs Supabase

1. Allez dans Supabase Dashboard
2. **Database** > **Logs** - Voir les requêtes SQL
3. **API** > **Logs** - Voir les appels API
4. **Edge Functions** > **Logs** - Voir les logs des fonctions

---

## 📊 Problèmes de base de données

### ❌ "relation does not exist" ou "table not found"

**Cause:** Le schéma SQL n'a pas été exécuté.

**Solution:**

1. Allez dans Supabase > SQL Editor
2. Créez une nouvelle query
3. Copiez le contenu de `supabase-schema.sql`
4. Exécutez (bouton "Run")
5. Vérifiez dans Table Editor que les tables existent

---

### ❌ "insufficient_privilege" ou "permission denied"

**Cause:** Les Row Level Security (RLS) policies ne sont pas correctes.

**Solution:**

1. Vérifiez que vous utilisez la bonne clé API (anon key, pas service role)
2. Vérifiez les RLS policies dans Supabase > Authentication > Policies
3. Réexécutez `supabase-schema.sql` pour recréer les policies

---

### ❌ Les statistiques ne se mettent pas à jour

**Cause:** Les triggers ne fonctionnent pas.

**Solution:**

1. Dans Supabase SQL Editor, exécutez :

```sql
-- Vérifier les triggers
SELECT * FROM pg_trigger WHERE tgname LIKE '%stats%';

-- Mettre à jour manuellement
SELECT update_event_stats();
```

2. Si pas de triggers, réexécutez `supabase-schema.sql`

---

## 🚀 Problèmes de performance

### Le site est lent

**Diagnostic:**

1. Ouvrez les DevTools (F12)
2. Onglet **Network**
3. Rechargez la page
4. Identifiez les requêtes lentes

**Solutions:**

- Activer le caching (voir [INTEGRATION-GUIDE.md](./INTEGRATION-GUIDE.md#caching-côté-frontend))
- Optimiser les requêtes SQL (ajouter des index)
- Utiliser `select()` pour limiter les colonnes retournées

---

## 🔐 Problèmes de sécurité

### "Warning: Exposed API keys in browser"

**C'est normal !** Les clés `VITE_SUPABASE_ANON_KEY` et `VITE_FEDAPAY_PUBLIC_KEY` sont **publiques** et sécurisées par :

- Row Level Security (Supabase)
- Restrictions de domaine (FedaPay)

**Ne jamais exposer:**
- ❌ `SUPABASE_SERVICE_ROLE_KEY`
- ❌ `FEDAPAY_SECRET_KEY`

---

## 📱 Problèmes mobile

### Le site ne s'affiche pas correctement sur mobile

**Solution:**

1. Vérifiez que le viewport est configuré dans `index.html` :
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

2. Testez avec les DevTools en mode responsive (F12 > Toggle device toolbar)

---

## 🔄 Problèmes de déploiement

### Le build fonctionne en local mais pas en production

**Cause:** Variables d'environnement non configurées dans la plateforme de déploiement.

**Solution:**

Dans Netlify/Vercel/Cloudflare Pages :

1. Allez dans Settings > Environment Variables
2. Ajoutez :
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
VITE_FEDAPAY_PUBLIC_KEY=pk_xxx
VITE_FEDAPAY_SANDBOX=false
```
3. Redéployez

---

## 📞 Obtenir de l'aide

### Support officiel

- 📖 Documentation : [DOCUMENTATION-INDEX.md](./DOCUMENTATION-INDEX.md)
- 🚀 Setup : [FIRST-TIME-SETUP.md](./FIRST-TIME-SETUP.md)
- 📧 Email : support@citeexcellence.org

### Ressources externes

- Supabase : https://supabase.com/docs
- FedaPay : https://docs.fedapay.com
- React : https://react.dev
- Vite : https://vitejs.dev

---

## ✅ Checklist de dépannage

Avant de demander de l'aide, vérifiez :

- [ ] Le fichier `.env.local` existe et contient les bonnes clés
- [ ] Le serveur a été redémarré après modification de `.env.local`
- [ ] Les dépendances sont installées (`npm install`)
- [ ] Le schéma SQL a été exécuté dans Supabase
- [ ] La console du navigateur (F12) pour voir les erreurs
- [ ] Les logs Supabase pour les erreurs backend

---

**La plupart des problèmes sont résolus en redémarrant le serveur ! 🔄**
