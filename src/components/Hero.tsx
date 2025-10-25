import { ArrowRight, Calendar, Target, Sparkles } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';

interface HeroProps {
  onRegisterClick: () => void;
}

export default function Hero({ onRegisterClick }: HeroProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center pt-20 pb-20">
        {/* Main Title */}
        <div className="mb-12">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#ffcf00] mb-8 tracking-tight drop-shadow-2xl font-bold">
            VISION 2026
          </h1>
          
          {/* Taglines - Same Typography */}
          <div className="space-y-3">
            <p className="text-lg sm:text-xl md:text-2xl text-white/95 drop-shadow-lg italic font-light">
              Empowering Youth. Shaping Tomorrow.
            </p>
            <p className="text-lg sm:text-xl md:text-2xl text-white/95 drop-shadow-lg italic font-light">
              Together we rise, striving for excellence.
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="max-w-3xl mx-auto mb-12">
          <p className="text-base sm:text-lg text-white/90 leading-relaxed">
           Un temps de 3 jours pour inspirer les jeunes à rêver avec Dieu, planifier pour 2026 et lui remettre leurs projets pour qu’ils prennent vie.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-[#b5882a]/30">
            <Calendar className="w-8 h-8 text-[#ffcf00] mx-auto mb-3" />
            <h3 className="text-white mb-2">3 Jours</h3>
            <p className="text-sm text-white/80">Formation intensive</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-[#b5882a]/30">
            <Target className="w-8 h-8 text-[#ffcf00] mx-auto mb-3" />
            <h3 className="text-white mb-2">Projets & Visions</h3>
            <p className="text-sm text-white/80">Créer et réaliser</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-[#b5882a]/30">
            <Sparkles className="w-8 h-8 text-[#ffcf00] mx-auto mb-3" />
            <h3 className="text-white mb-2">Excellence</h3>
            <p className="text-sm text-white/80">Transformer l'avenir</p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onRegisterClick}
          className="group bg-gradient-to-r from-[#fe0000] to-[#ffcf00] hover:from-[#ffcf00] hover:to-[#b5882a] text-white px-8 py-4 rounded-full transition-all transform hover:scale-105 shadow-2xl flex items-center gap-2 mx-auto"
        >
          <span>S'inscrire maintenant</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
