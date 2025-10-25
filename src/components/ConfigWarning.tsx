import { AlertCircle, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ConfigWarning() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Vérifier si les variables d'environnement sont configurées
    const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;
    const fedapayKey = import.meta.env?.VITE_FEDAPAY_PUBLIC_KEY;

    if (!supabaseUrl || !supabaseKey || !fedapayKey) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-yellow-500/90 backdrop-blur-sm text-black p-4 rounded-lg shadow-2xl border-2 border-yellow-600 z-50">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configuration requise
          </h3>
          <p className="text-sm mb-3">
            Les variables d'environnement ne sont pas configurées. Le site fonctionne en mode démo.
          </p>
          <div className="bg-black/20 rounded p-3 mb-3">
            <p className="text-xs font-mono mb-2">Pour configurer :</p>
            <ol className="text-xs space-y-1 list-decimal list-inside">
              <li>Créez un fichier <code className="bg-black/30 px-1 rounded">.env.local</code></li>
              <li>Copiez le contenu de <code className="bg-black/30 px-1 rounded">.env.example</code></li>
              <li>Ajoutez vos clés API Supabase et FedaPay</li>
              <li>Redémarrez le serveur</li>
            </ol>
          </div>
          <button
            onClick={() => setShow(false)}
            className="text-xs underline hover:no-underline"
          >
            Masquer ce message
          </button>
        </div>
      </div>
    </div>
  );
}
