import { Heart, Gift, Users, Zap, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { supabase } from '../lib/supabase';
import { createFedaPayCheckoutUrl, formatAmount } from '../lib/fedapay';
import type { Donation } from '../lib/supabase';
import { toast } from 'sonner';

export default function DonationSection() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showDonorForm, setShowDonorForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const amounts = [1000, 2500, 5000, 10000, 25000, 50000];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setShowDonorForm(true);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
    if (parseInt(e.target.value) >= 100) {
      setShowDonorForm(true);
    }
  };

  const handleDonorInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDonorInfo({
      ...donorInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleDonate = async () => {
    const amount = selectedAmount || parseInt(customAmount);
    
    // Validation
    if (!amount || amount < 100) {
      toast.error('Veuillez sélectionner ou entrer un montant d\'au moins 100 FCFA');
      return;
    }

    if (!donorInfo.email) {
      toast.error('Veuillez entrer votre adresse email');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Créer l'entrée de donation dans Supabase (statut: pending)
      const donation: Omit<Donation, 'id' | 'created_at'> = {
        donor_name: donorInfo.name || undefined,
        donor_email: donorInfo.email,
        donor_phone: donorInfo.phone || undefined,
        amount: amount,
        currency: 'XOF',
        status: 'pending',
        description: `Don pour Vision 2026 - ${amount} FCFA`,
      };

      const { data: newDonation, error: insertError } = await supabase
        .from('donations')
        .insert(donation)
        .select()
        .single();

      if (insertError) {
        throw new Error('Erreur lors de la création de la donation');
      }

      // 2. Créer l'URL de checkout FedaPay et rediriger
      const checkoutUrl = createFedaPayCheckoutUrl({
        amount: amount,
        donorName: donorInfo.name,
        donorEmail: donorInfo.email,
        donorPhone: donorInfo.phone,
        description: `Don pour Vision 2026 - ${amount} FCFA`,
        customMetadata: {
          donation_id: newDonation.id,
          event: 'Vision 2026',
        },
      });

      // Rediriger vers la page de paiement FedaPay
      toast.success('Redirection vers la page de paiement...');
      
      // Petit délai pour montrer le message
      setTimeout(() => {
        window.location.href = checkoutUrl;
      }, 500);

    } catch (error: any) {
      console.error('Donation error:', error);
      toast.error(error.message || 'Une erreur est survenue. Veuillez réessayer.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-black to-[#1a1a1a] py-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block p-3 bg-[#fe0000]/10 rounded-full mb-4">
            <Heart className="w-12 h-12 text-[#fe0000]" />
          </div>
          <h2 className="text-4xl sm:text-5xl text-[#ffcf00] mb-4">Soutenez Vision 2026</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Votre générosité aide à financer ce séminaire gratuit et à transformer 
            la vie de centaines de jeunes. Chaque don compte !
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-[#fe0000]/10 to-transparent border border-[#fe0000]/30 rounded-xl p-6 text-center">
            <Gift className="w-10 h-10 text-[#ffcf00] mx-auto mb-3" />
            <h3 className="text-2xl text-white mb-2">500+</h3>
            <p className="text-sm text-gray-400">Jeunes attendus</p>
          </div>
          <div className="bg-gradient-to-br from-[#ffcf00]/10 to-transparent border border-[#ffcf00]/30 rounded-xl p-6 text-center">
            <Users className="w-10 h-10 text-[#ffcf00] mx-auto mb-3" />
            <h3 className="text-2xl text-white mb-2">100%</h3>
            <p className="text-sm text-gray-400">Gratuit pour tous</p>
          </div>
          <div className="bg-gradient-to-br from-[#b5882a]/10 to-transparent border border-[#b5882a]/30 rounded-xl p-6 text-center">
            <Zap className="w-10 h-10 text-[#ffcf00] mx-auto mb-3" />
            <h3 className="text-2xl text-white mb-2">3 Jours</h3>
            <p className="text-sm text-gray-400">D'impact transformateur</p>
          </div>
        </div>

        {/* Donation Form */}
        <div className="bg-black border border-[#b5882a]/30 rounded-2xl p-8 sm:p-12 max-w-3xl mx-auto">
          <h3 className="text-2xl text-white mb-6 text-center">Choisissez votre contribution</h3>
          
          {/* Preset Amounts */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {amounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedAmount === amount
                    ? 'border-[#ffcf00] bg-[#ffcf00]/10 text-[#ffcf00]'
                    : 'border-[#b5882a]/30 text-white hover:border-[#ffcf00]/50'
                }`}
              >
                <span className="text-xl">{amount.toLocaleString()}</span>
                <span className="text-sm block">FCFA</span>
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="mb-6">
            <label className="block text-white mb-2 text-sm">Ou entrez un montant personnalisé</label>
            <div className="relative">
              <input
                type="number"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="Montant personnalisé"
                className="w-full bg-black border border-[#b5882a]/30 rounded-lg px-4 py-3 text-white focus:border-[#ffcf00] focus:outline-none focus:ring-2 focus:ring-[#ffcf00]/20"
                min="100"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">FCFA</span>
            </div>
          </div>

          {/* Donor Information Form */}
          {showDonorForm && (
            <div className="bg-[#b5882a]/5 border border-[#b5882a]/20 rounded-lg p-6 mb-6 space-y-4">
              <h4 className="text-[#ffcf00] mb-3">Vos informations</h4>
              
              <div>
                <Label htmlFor="donor-name" className="text-white mb-2 block text-sm">
                  Nom complet (optionnel)
                </Label>
                <Input
                  id="donor-name"
                  name="name"
                  type="text"
                  value={donorInfo.name}
                  onChange={handleDonorInfoChange}
                  className="bg-black border-[#b5882a]/30 text-white placeholder:text-gray-500 focus:border-[#ffcf00] focus:ring-[#ffcf00]"
                  placeholder="Marie Dupont"
                />
              </div>

              <div>
                <Label htmlFor="donor-email" className="text-white mb-2 block text-sm">
                  Email *
                </Label>
                <Input
                  id="donor-email"
                  name="email"
                  type="email"
                  required
                  value={donorInfo.email}
                  onChange={handleDonorInfoChange}
                  className="bg-black border-[#b5882a]/30 text-white placeholder:text-gray-500 focus:border-[#ffcf00] focus:ring-[#ffcf00]"
                  placeholder="marie@example.com"
                />
              </div>

              <div>
                <Label htmlFor="donor-phone" className="text-white mb-2 block text-sm">
                  Téléphone (optionnel)
                </Label>
                <Input
                  id="donor-phone"
                  name="phone"
                  type="tel"
                  value={donorInfo.phone}
                  onChange={handleDonorInfoChange}
                  className="bg-black border-[#b5882a]/30 text-white placeholder:text-gray-500 focus:border-[#ffcf00] focus:ring-[#ffcf00]"
                  placeholder="+229 01 00 00 00 00"
                />
              </div>
            </div>
          )}

          {/* What Your Donation Does */}
          <div className="bg-[#ffcf00]/5 border border-[#ffcf00]/20 rounded-lg p-6 mb-6">
            <h4 className="text-[#ffcf00] mb-3 text-sm">Votre don finance :</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <span className="text-[#ffcf00] mt-1">✓</span>
                <span>Repas et rafraîchissements pour tous les participants</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ffcf00] mt-1">✓</span>
                <span>Matériel pédagogique et supports de formation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ffcf00] mt-1">✓</span>
                <span>Location de l'espace et équipements techniques</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ffcf00] mt-1">✓</span>
                <span>Certificats et ressources pour les participants</span>
              </li>
            </ul>
          </div>

          {/* Donate Button */}
          <button
            onClick={handleDonate}
            disabled={isProcessing || (!selectedAmount && !customAmount)}
            className="w-full bg-gradient-to-r from-[#fe0000] to-[#ffcf00] hover:from-[#ffcf00] hover:to-[#b5882a] text-white py-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Redirection vers FedaPay...</span>
              </>
            ) : (
              <>
                <Heart className="w-5 h-5" />
                <span>Faire un don maintenant</span>
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            🔒 Paiement sécurisé via FedaPay • Reçu fiscal disponible
          </p>
        </div>

        {/* Thank You Message */}
        <div className="mt-12 text-center">
          <p className="text-lg text-white/90 mb-2">
            🙏 Merci pour votre générosité !
          </p>
          <p className="text-sm text-gray-400">
            Chaque contribution nous rapproche de notre objectif : transformer 500 vies de jeunes.
          </p>
        </div>
      </div>
    </div>
  );
}
