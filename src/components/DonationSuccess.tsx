import { CheckCircle2, Home, Download } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DonationSuccess() {
  const [transactionId, setTransactionId] = useState<string>('');

  useEffect(() => {
    // Récupérer l'ID de transaction depuis l'URL
    const params = new URLSearchParams(window.location.search);
    const txnId = params.get('transaction_id');
    if (txnId) {
      setTransactionId(txnId);
    }
  }, []);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-20">
      <div className="max-w-2xl w-full">
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500 rounded-2xl p-12 text-center">
          <CheckCircle2 className="w-24 h-24 text-green-400 mx-auto mb-6 animate-bounce" />
          
          <h1 className="text-4xl text-white mb-4">
            Merci pour votre don ! 🙏
          </h1>
          
          <p className="text-xl text-white/90 mb-8">
            Votre contribution a été reçue avec succès.
          </p>

          {transactionId && (
            <div className="bg-black/50 rounded-lg p-6 border border-[#b5882a]/30 mb-8">
              <p className="text-[#b5882a] mb-2 text-sm">Référence de transaction</p>
              <p className="text-[#ffcf00] tracking-wider break-all">{transactionId}</p>
            </div>
          )}

          <div className="bg-[#ffcf00]/10 border border-[#ffcf00]/30 rounded-lg p-6 mb-8">
            <h3 className="text-[#ffcf00] mb-3">Prochaines étapes</h3>
            <ul className="text-left text-white/80 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-[#ffcf00] mt-1">✓</span>
                <span>Un reçu de paiement a été envoyé à votre adresse email</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ffcf00] mt-1">✓</span>
                <span>Vous recevrez un reçu fiscal sous 48h pour votre don</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ffcf00] mt-1">✓</span>
                <span>Votre don contribue directement au succès de Vision 2026</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGoHome}
              className="w-full bg-gradient-to-r from-[#fe0000] to-[#ffcf00] hover:from-[#ffcf00] hover:to-[#b5882a] text-white py-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-xl flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              <span>Retour à l'accueil</span>
            </button>
          </div>

          <p className="mt-8 text-sm text-gray-400">
            Questions ? Contactez-nous à{' '}
            <a href="mailto:contact@citeexcellence.org" className="text-[#ffcf00] hover:underline">
              contact@citeexcellence.org
            </a>
          </p>
        </div>

        {/* Impact Message */}
        <div className="mt-8 text-center bg-gradient-to-r from-[#fe0000]/10 to-[#ffcf00]/10 border border-[#b5882a]/30 rounded-2xl p-8">
          <p className="text-lg text-white/90">
            <span className="text-[#ffcf00]">🌟 Votre générosité</span> fait la différence !<br />
            Ensemble, nous transformons la vie de centaines de jeunes.
          </p>
        </div>
      </div>
    </div>
  );
}
