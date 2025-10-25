import { XCircle, Home, Heart } from 'lucide-react';

export default function DonationCancel() {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleRetryDonation = () => {
    window.location.href = '/#donate';
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-20">
      <div className="max-w-2xl w-full">
        <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border-2 border-orange-500 rounded-2xl p-12 text-center">
          <XCircle className="w-24 h-24 text-orange-400 mx-auto mb-6" />
          
          <h1 className="text-4xl text-white mb-4">
            Don annulé
          </h1>
          
          <p className="text-xl text-white/90 mb-8">
            Votre transaction a été annulée. Aucun montant n'a été débité.
          </p>

          <div className="bg-[#ffcf00]/10 border border-[#ffcf00]/30 rounded-lg p-6 mb-8">
            <p className="text-white/80 text-sm">
              Nous comprenons que vous avez peut-être rencontré un problème ou changé d'avis.
              Vous pouvez réessayer à tout moment.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleRetryDonation}
              className="w-full bg-gradient-to-r from-[#fe0000] to-[#ffcf00] hover:from-[#ffcf00] hover:to-[#b5882a] text-white py-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-xl flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" />
              <span>Réessayer de faire un don</span>
            </button>

            <button
              onClick={handleGoHome}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-lg transition-all border border-white/20 flex items-center justify-center gap-2"
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

        {/* Encouragement Message */}
        <div className="mt-8 text-center bg-gradient-to-r from-[#fe0000]/10 to-[#ffcf00]/10 border border-[#b5882a]/30 rounded-2xl p-8">
          <p className="text-lg text-white/90">
            <span className="text-[#ffcf00]">💝 Chaque don compte !</span><br />
            Même une petite contribution aide à transformer des vies.
          </p>
        </div>
      </div>
    </div>
  );
}
