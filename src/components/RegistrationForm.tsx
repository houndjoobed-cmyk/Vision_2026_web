import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { CheckCircle2, Send, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import type { Registration } from '../lib/supabase';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    age: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketCode, setTicketCode] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Générer un code de billet unique
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_ticket_code');

      if (codeError) {
        throw new Error('Erreur lors de la génération du code de billet');
      }

      const generatedTicketCode = codeData as string;

      // 2. Créer l'inscription dans Supabase
      const registration: Omit<Registration, 'id' | 'created_at' | 'updated_at'> = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        age: parseInt(formData.age),
        ticket_code: generatedTicketCode,
      };

      const { data: newRegistration, error: insertError } = await supabase
        .from('registrations')
        .insert(registration)
        .select()
        .single();

      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error('Cet email est déjà inscrit.');
        }
        throw new Error('Erreur lors de l\'inscription. Veuillez réessayer.');
      }

      // 3. Envoyer l'email avec le billet (via Edge Function)
      console.log('Registration successful, data:', newRegistration);
      console.log('Calling Edge Function with registration ID:', newRegistration.id);
      
      try {
        const { data: emailData, error: emailError } = await supabase.functions.invoke('send-ticket-email', {
          body: JSON.stringify({ registrationId: newRegistration.id })
        });
        
        console.log('Raw response from Edge Function:', { data: emailData, error: emailError });

        if (emailError) {
          console.error('Email error:', emailError);
          console.error('Email error details:', emailError.message, emailError.stack);
          // L'inscription est créée, mais l'email n'a pas été envoyé
          toast.warning('Inscription réussie !🎉🎉🎉');
        } else {
          console.log('Edge Function response:', emailData);
          toast.success('Inscription réussie !🎉🎉🎉');
        }
      } catch (functionError) {
        console.error('Edge Function invocation error:', functionError);
        toast.error('Erreur lors de l\'envoi du billet. Notre équipe a été notifiée.');
      }

      // Show success state
      setTicketCode(generatedTicketCode);
      setIsSubmitted(true);

      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setTicketCode('');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          city: '',
          age: '',
        });
      }, 60000);

    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-black py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500 rounded-2xl p-12 text-center">
            <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto mb-6 animate-bounce" />
            <h3 className="text-3xl text-white mb-4">Inscription réussie ! 🎉</h3>
            
            
            {ticketCode && (
              <div className="bg-black/50 rounded-lg p-6 border border-[#ffcf00]/30 mb-6">
                <p className="text-[#b5882a] mb-2">🎫 Votre code de billet</p>
                <p className="text-2xl text-[#ffcf00] tracking-wider mb-2">{ticketCode}</p>
             
            </div>
            )}
            
            <div className="bg-black/50 rounded-lg p-6 border border-[#b5882a]/30">
              <p className="text-[#ffcf00] mb-2">📧 Votre inscription a été confirmée avec succès !
              🎉🎉🎉
              Merci de votre confiance !
              </p>
              <p className="text-sm text-white/70">
                Restez connecté pour des nouvelles actualités. À bientôt au séminaire !
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black py-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl text-[#ffcf00] mb-4">Inscription</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Réservez votre place à Vision 2026. Remplissez le formulaire ci-dessous.
      
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-black border border-[#b5882a]/30 rounded-2xl p-8 sm:p-12 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName" className="text-white mb-2 block">
                  Prénom *
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="bg-black border-[#b5882a]/30 text-white placeholder:text-gray-500 focus:border-[#ffcf00] focus:ring-[#ffcf00]"
                  placeholder="Jean"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-white mb-2 block">
                  Nom *
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="bg-black border-[#b5882a]/30 text-white placeholder:text-gray-500 focus:border-[#ffcf00] focus:ring-[#ffcf00]"
                  placeholder="Kouassi"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-white mb-2 block">
                Adresse Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="bg-black border-[#b5882a]/30 text-white placeholder:text-gray-500 focus:border-[#ffcf00] focus:ring-[#ffcf00]"
                placeholder="jean.kouassi@example.com"
              />

            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="text-white mb-2 block">
                Numéro de téléphone *
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="bg-black border-[#b5882a]/30 text-white placeholder:text-gray-500 focus:border-[#ffcf00] focus:ring-[#ffcf00]"
                placeholder="+229 01 00 00 00 00"
              />
            </div>

            {/* City and Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="city" className="text-white mb-2 block">
                  Ville *
                </Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="bg-black border-[#b5882a]/30 text-white placeholder:text-gray-500 focus:border-[#ffcf00] focus:ring-[#ffcf00]"
                  placeholder="Cotonou"
                />
              </div>
              <div>
                <Label htmlFor="age" className="text-white mb-2 block">
                  Âge *
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  required
                  min="13"
                  max="100"
                  value={formData.age}
                  onChange={handleChange}
                  className="bg-black border-[#b5882a]/30 text-white placeholder:text-gray-500 focus:border-[#ffcf00] focus:ring-[#ffcf00]"
                  placeholder="18"
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-[#ffcf00]/10 border border-[#ffcf00]/30 rounded-lg p-4">
              <p className="text-sm text-[#ffcf00]">
                <span className="text-[#ffcf00]">✨ Événement Gratuit</span> - Ce séminaire est entièrement 
                gratuit pour tous les participants. Nous vous remercions.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#fe0000] to-[#ffcf00] hover:from-[#ffcf00] hover:to-[#b5882a] text-white py-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Traitement en cours...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Finaliser l'inscription</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Privacy Note */}
        <p className="text-center text-sm text-gray-500 mt-8">
          En vous inscrivant, vous acceptez de recevoir des mises à jour sur Vision 2026. 
          Vos informations seront sécurisées et ne seront jamais partagées.
        </p>
      </div>
    </div>
  );
}
