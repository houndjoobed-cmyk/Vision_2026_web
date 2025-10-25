import { createClient } from '@supabase/supabase-js';

// Récupérer les variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vérification stricte - Ne pas continuer si manquant
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERREUR CRITIQUE: Configuration Supabase manquante !');
  console.error('');
  console.error('Vérifiez votre fichier .env.local à la racine du projet :');
  console.error('');
  console.error('VITE_SUPABASE_URL=' + (supabaseUrl || '❌ MANQUANT'));
  console.error('VITE_SUPABASE_ANON_KEY=' + (supabaseAnonKey ? '✅ Présent' : '❌ MANQUANT'));
  console.error('');
  console.error('📝 Étapes pour corriger :');
  console.error('1. Créez un fichier .env.local à la racine du projet');
  console.error('2. Ajoutez vos clés Supabase (Dashboard > Settings > API)');
  console.error('3. Redémarrez le serveur de développement (npm run dev)');
  console.error('');
  
  throw new Error('Configuration Supabase manquante. Consultez la console pour plus de détails.');
}

// Créer le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Pas besoin de session pour les inscriptions anonymes
    autoRefreshToken: false,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
});

// Types TypeScript pour la base de données
export interface Registration {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  age: number;
  ticket_code: string;
  qr_code_url?: string;
  registration_date?: string;
  email_sent?: boolean;
  checked_in?: boolean;
  check_in_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Donation {
  id?: string;
  donor_name?: string;
  donor_email?: string;
  donor_phone?: string;
  amount: number;
  currency?: string;
  fedapay_transaction_id?: string;
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';
  payment_method?: string;
  description?: string;
  callback_data?: any;
  created_at?: string;
  completed_at?: string;
}

export interface EventStats {
  id?: string;
  total_registrations: number;
  total_donations: number;
  total_check_ins: number;
  last_updated?: string;
}

// Logs de confirmation
console.log('✅ Supabase client initialisé avec succès');
console.log('📍 URL Supabase:', supabaseUrl);
console.log('🔑 Clé Anon:', supabaseAnonKey.substring(0, 20) + '...');

// Test de connexion (optionnel)
supabase.from('registrations').select('count', { count: 'exact', head: true })
  .then(({ count, error }) => {
    if (error) {
      console.error('❌ Erreur de connexion à Supabase:', error.message);
    } else {
      console.log(`✅ Connexion Supabase OK - ${count || 0} inscriptions`);
    }
  });