import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, MessageCircle } from 'lucide-react';

export default function ContactSection() {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'jeunedimpact01@gmail.com',
      link: 'mailto:jeunedimpact01@gmail.com',
    },
    {
      icon: Phone,
      title: 'Téléphone',
      value: '+229 01 96 32 04 44',
      link: 'tel:+2290196320444',
    },
    {
      icon: MapPin,
      title: 'Lieu',
      value: 'Cité d\'Excellence, Abomey-Calavi',
      link: '#',
    },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      name: 'Facebook',
      url: 'https://www.facebook.com/profile.php?id=61577961128556&sk=reviews',
      color: 'hover:bg-blue-600',
    },
    {
      icon: MessageCircle,
      name: 'WhatsApp',
      url: 'https://wa.me/+2290196320444',
      color: 'hover:bg-green-600',
    },
  ];

  return (
    <div className="bg-gradient-to-b from-black to-black py-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl text-[#ffcf00] mb-4">Contactez-nous</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Des questions ? Nous sommes là pour vous aider ! Contactez-nous par l'un de ces canaux.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactInfo.map((contact, idx) => {
            const Icon = contact.icon;
            return (
              <a
                key={idx}
                href={contact.link}
                className="bg-black border border-[#b5882a]/30 rounded-xl p-8 text-center hover:border-[#ffcf00]/50 transition-all hover:shadow-xl hover:shadow-[#ffcf00]/10 group"
              >
                <div className="bg-gradient-to-br from-[#fe0000] to-[#ffcf00] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white mb-2">{contact.title}</h3>
                <p className="text-sm text-gray-400">{contact.value}</p>
              </a>
            );
          })}
        </div>

        {/* Social Media Section */}
        <div className="bg-black border border-[#b5882a]/30 rounded-2xl p-8 sm:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl text-white mb-3">Rejoignez-nous</h3>
            <p className="text-gray-400">
              Suivez-nous sur les réseaux sociaux pour les mises à jour, les coulisses et l'inspiration !
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex flex-wrap justify-center gap-4">
            {socialLinks.map((social, idx) => {
              const Icon = social.icon;
              return (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-[#b5882a]/20 w-14 h-14 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${social.color}`}
                  title={social.name}
                >
                  <Icon className="w-6 h-6 text-white" />
                </a>
              );
            })}
          </div>

          {/* Hashtag */}
          <div className="text-center mt-8">
            <p className="text-[#ffcf00] text-lg">#Vision2026 #CitéDExcellence #jeudimpact</p>
          </div>
        </div>

        {/* FAQ Teaser */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-black/50 border border-[#b5882a]/30 rounded-xl p-6">
            <h4 className="text-white mb-3">🕐 Quand aura lieu le séminaire ?</h4>
            <p className="text-sm text-gray-400">
              Le séminaire se tiendra sur 3 jours consécutifs. Les dates exactes seront annoncées bientôt. 
              Restez à l'écoute !
            </p>
          </div>
          <div className="bg-black/50 border border-[#b5882a]/30 rounded-xl p-6">
            <h4 className="text-white mb-3">💰 Y a-t-il des frais d'inscription ?</h4>
            <p className="text-sm text-gray-400">
              Non ! Vision 2026 est entièrement gratuit pour tous les jeunes participants. Inscrivez-vous 
              et venez !
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-gradient-to-r from-[#fe0000]/10 to-[#ffcf00]/10 border border-[#b5882a]/30 rounded-2xl p-8">
          <h3 className="text-2xl text-white mb-4">Prêt à transformer votre avenir ?</h3>
          <p className="text-gray-300 mb-6">
            Ne manquez pas cette opportunité de faire partie de quelque chose d'extraordinaire. 
            Inscrivez-vous maintenant et réservez votre place !
          </p>
          <button
            onClick={() => {
              document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-gradient-to-r from-[#fe0000] to-[#ffcf00] hover:from-[#ffcf00] hover:to-[#b5882a] text-white px-8 py-3 rounded-full transition-all transform hover:scale-105 shadow-xl"
          >
            S'inscrire maintenant
          </button>
        </div>
      </div>
    </div>
  );
}
