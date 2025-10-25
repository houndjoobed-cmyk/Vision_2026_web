import {Mail } from 'lucide-react';

export default function SpeakersSection() {
  const speakers = [
    {
      name: 'Dr HOUEKIN HANGBE AHONON Augustine',
      title: 'Leader Spirituel & Entrepreneuse',
      image: 'https://scontent.flbv5-1.fna.fbcdn.net/v/t39.30808-6/481078892_624572333760699_2774798699160097226_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGjWMu5qm-MEmkocX9iTh-UN4Xuu5cd8ds3he67lx3x27n6HjJ6Rt-mJea3tKmdJl3KKHbloDpy3IznjKy6UKj3&_nc_ohc=VvzqmKhnMnEQ7kNvwF6aYko&_nc_oc=AdnzVsj9Q6XH9DodTx7IwMrR4RaOEwmAmpvJzozNUne_oQeqh7krfxc09_aKQ69buZuIxv1tz7G4r0LooznQ84un&_nc_zt=23&_nc_ht=scontent.flbv5-1.fna&_nc_gid=4Ya3Hdb_NfVdPC4nO6U1YA&oh=00_Affjy9Oy4XG5RpqZ8ZfqK3tCs2qqhA7LsVxavy0ljY9jzw&oe=68FDD5A2',
      bio: 'Fondateur de la Cité d\'Excellence, le Docteur HOUEKIN HANGBE AHONON Augustine est un femme de feu visionnaire qui inspire des jeunes de par son intimité avec le Saint-Esprit et à travers ses enseignements sur l\'excellence et la réussite selon les principes bibliques.',
      topics: ['Leadership chrétien', 'Excellence spirituelle', 'Entrepreneuriat de foi'],
      socials: {
        email: 'jmkoffi@citeexcellence.org',
      },
    },
    {
      name: 'Dr HOUEKIN Fidèle',
      title: 'Pasteur',
      image: 'https://scontent.flbv5-1.fna.fbcdn.net/v/t39.30808-6/482058973_624996117051654_3626401151212610259_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGlpUweAVdzggpGxlyNmlEKPT6IhA3l0xY9PoiEDeXTFhUex-4SKO1waoGGKrznLraQDZ_cawRbj5awu7V-E69K&_nc_ohc=dLvbR6lixs8Q7kNvwErNcgh&_nc_oc=Adl3_zu_Tj8iR8qHWI8YqW0HManFEeDg56O4WZvOPZ876MWg4l_B5m066YBjyIzfqZJLDvVw6odmcXehiQ1bpo1M&_nc_zt=23&_nc_ht=scontent.flbv5-1.fna&_nc_gid=Q0PERixwCH0wP4Jx5pEhgg&oh=00_AfeB19SF4N0VymXQKuUpAvSiA65q-J_8-vN2ic_-iqBcqA&oe=68FDF44D',
      bio: 'Fondateur de la Cité d\'Excellence, le Docteur HOUEKIN Fidèle est un homme d\'impact animé d’une foi spirituelle contagiese.À travers son parcours et ses enseignements, il aide chacun à développer une vision claire pour l\'avenir et inspire les jeunes à vivre l’excellence selon Dieu.',
      topics: ['Vision & Planification', 'Excellence spirituelle', 'Mindset de réussite'],
      socials: {
        email: 'sarah@citeexcellence.org',
      },
    },
  ];

  return (
    <div className="bg-black py-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl text-[#ffcf00] mb-4">Nos Intervenants</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Découvrez les leaders inspirants qui partageront leur expertise et leur vision 
            pour vous accompagner dans votre parcours d'excellence.
          </p>
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {speakers.map((speaker, idx) => (
            <div
              key={idx}
              className="group bg-gradient-to-br from-[#b5882a]/10 to-transparent border border-[#b5882a]/30 rounded-2xl overflow-hidden hover:border-[#ffcf00]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#ffcf00]/20"
            >
               <div className="relative h-80 overflow-hidden">
                <img
                  src={speaker.image}
                  alt={speaker.name}
                  className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700"
                  style={{ objectPosition: 'center 10%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                
                {/* Name & Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl text-white mb-1">{speaker.name}</h3>
                  <p className="text-[#ffcf00]">{speaker.title}</p>
                </div>
              </div>

              {/* Speaker Info */}
              <div className="p-8">
                {/* Bio */}
                <p className="text-white/80 mb-6 leading-relaxed">
                  {speaker.bio}
                </p>

                {/* Topics */}
                <div className="mb-6">
                  <h4 className="text-sm text-[#b5882a] mb-3">Thématiques abordées :</h4>
                  <div className="flex flex-wrap gap-2">
                    {speaker.topics.map((topic, topicIdx) => (
                      <span
                        key={topicIdx}
                        className="bg-[#fe0000]/20 text-[#ffcf00] px-3 py-1 rounded-full text-sm border border-[#fe0000]/30"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#b5882a]/20">
                  <span className="text-sm text-white/60">Contact :</span>
                  
                  <a
                    href={`mailto:${speaker.socials.email}`}
                    className="w-9 h-9 bg-[#b5882a]/20 rounded-full flex items-center justify-center hover:bg-[#ffcf00]/20 transition-colors"
                    title="Email"
                  >
                    <Mail className="w-4 h-4 text-[#ffcf00]" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-[#fe0000]/10 to-[#ffcf00]/10 border border-[#b5882a]/30 rounded-2xl p-8">
          <p className="text-lg text-white/90">
            <span className="text-[#ffcf00]">✨ Vous aussi,</span> rejoignez ces leaders inspirants 
            et découvrez comment réaliser votre vision 2026 !
          </p>
        </div>
      </div>
    </div>
  );
}
