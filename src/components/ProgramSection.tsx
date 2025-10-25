import { Lightbulb, Target, Rocket, Users, Heart, Award } from 'lucide-react';

export default function ProgramSection() {
  const programDays = [
    {
      day: 1,
      title: 'Fondation & Vision',
      theme: 'Découvrir votre appel',
      color: 'from-[#fe0000] to-[#ffcf00]',
      sessions: [
        {
          time: '9h00 - 10h30',
          title: 'Cérémonie d\'ouverture',
          description: 'Discours d\'accueil et présentation du séminaire',
          icon: Users,
        },
        {
          time: '11h00 - 13h00',
          title: 'Les fondements du leadership chrétien',
          description: 'Comprendre les principes bibliques du leadership',
          icon: Target,
        },
        {
          time: '14h00 - 16h00',
          title: 'Atelier : Cartographie de vision 2026',
          description: 'Session interactive pour découvrir et définir votre vision',
          icon: Lightbulb,
        },
        {
          time: '16h30 - 18h00',
          title: 'Temps de réseautage',
          description: 'Connectez-vous avec d\'autres jeunes leaders',
          icon: Users,
        },
      ],
    },
    {
      day: 2,
      title: 'Stratégie & Projets',
      theme: 'Construire votre avenir',
      color: 'from-[#ffcf00] to-[#b5882a]',
      sessions: [
        {
          time: '9h00 - 11h00',
          title: 'Innovation & Créativité',
          description: 'Techniques pour développer des projets innovants',
          icon: Lightbulb,
        },
        {
          time: '11h30 - 13h30',
          title: 'Entrepreneuriat et foi',
          description: 'Comment créer des entreprises qui honorent Dieu',
          icon: Rocket,
        },
        {
          time: '14h30 - 16h30',
          title: 'Planification stratégique',
          description: 'Créer des plans d\'action concrets pour vos objectifs',
          icon: Target,
        },
        {
          time: '17h00 - 18h30',
          title: 'Panel : Témoignages de réussite',
          description: 'Jeunes entrepreneurs partagent leurs parcours',
          icon: Award,
        },
      ],
    },
    {
      day: 3,
      title: 'Action & Engagement',
      theme: 'Réaliser votre vision',
      color: 'from-[#b5882a] to-[#fe0000]',
      sessions: [
        {
          time: '9h00 - 11h00',
          title: 'Idéation de projets',
          description: 'Développer votre projet d\'impact communautaire',
          icon: Rocket,
        },
        {
          time: '11h30 - 13h30',
          title: 'Soumettre sa vision à Dieu',
          description: 'Temps de prière et d\'engagement spirituel',
          icon: Heart,
        },
        {
          time: '14h30 - 16h30',
          title: 'Présentation des visions 2026',
          description: 'Partagez votre vision et plan d\'action devant tous',
          icon: Target,
        },
        {
          time: '17h00 - 18h30',
          title: 'Cérémonie de clôture',
          description: 'Célébration, remise de certificats et prochaines étapes',
          icon: Award,
        },
      ],
    },
  ];

  return (
    <div className="bg-black py-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl text-[#ffcf00] mb-4">Programme sur 3 jours</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Un parcours immersif conçu pour transformer votre perspective et vous équiper 
            avec les outils nécessaires pour créer un impact significatif.
          </p>
        </div>

        {/* Program Days */}
        <div className="space-y-12">
          {programDays.map((day) => (
            <div key={day.day} className="relative">
              {/* Day Header */}
              <div className={`bg-gradient-to-r ${day.color} rounded-2xl p-8 mb-6 shadow-2xl`}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-white/90 mb-2">Jour {day.day}</div>
                    <h3 className="text-2xl sm:text-3xl text-white mb-2">{day.title}</h3>
                    <p className="text-white/90 italic">{day.theme}</p>
                  </div>
                  <div className="text-6xl sm:text-7xl opacity-20 text-white">
                    {day.day}
                  </div>
                </div>
              </div>

              {/* Sessions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {day.sessions.map((session, idx) => {
                  const Icon = session.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-black border border-[#b5882a]/30 rounded-xl p-6 hover:border-[#ffcf00]/50 transition-all hover:shadow-xl hover:shadow-[#ffcf00]/10"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`bg-gradient-to-br ${day.color} p-3 rounded-lg flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-[#ffcf00] mb-2">{session.time}</div>
                          <h4 className="text-white mb-2">{session.title}</h4>
                          <p className="text-sm text-gray-400">{session.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-gradient-to-r from-[#fe0000]/10 to-[#ffcf00]/10 border border-[#b5882a]/30 rounded-2xl p-8 text-center">
          <p className="text-lg text-white/90">
            <span className="text-[#ffcf00]">💡 Bon à savoir :</span> Chaque jour comprend les repas, 
            des rafraîchissements et de nombreuses pauses pour le réseautage et la réflexion.
          </p>
        </div>
      </div>
    </div>
  );
}
