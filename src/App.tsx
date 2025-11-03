import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import ProgramSection from './components/ProgramSection';
import SpeakersSection from './components/SpeakersSection';
import DonationSection from './components/DonationSection';
import RegistrationForm from './components/RegistrationForm';
import ContactSection from './components/ContactSection';
import Navigation from './components/Navigation';
import DonationSuccess from './components/DonationSuccess';
import DonationCancel from './components/DonationCancel';
import ConfigWarning from './components/ConfigWarning';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [currentPage, setCurrentPage] = useState('home');

  // Détecter la page actuelle en fonction de l'URL
  useEffect(() => {
    const handleRouteChange = () => {
      const hash = window.location.hash;
      if (hash.includes('donation-success')) {
        setCurrentPage('donation-success');
      } else if (hash.includes('donation-cancel')) {
        setCurrentPage('donation-cancel');
      } else {
        setCurrentPage('home');
      }
    };

    // Écouter les changements de hash
    window.addEventListener('hashchange', handleRouteChange);
    // Vérifier la route initiale
    handleRouteChange();

    // Cleanup
    return () => window.removeEventListener('hashchange', handleRouteChange);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // Afficher les pages de donation (succès/annulation)
  if (currentPage === 'donation-success') {
    return (
      <>
        <DonationSuccess />
        <ConfigWarning />
      </>
    );
  }

  if (currentPage === 'donation-cancel') {
    return (
      <>
        <DonationCancel />
        <ConfigWarning />
      </>
    );
  }

  // Afficher la page principale
  return (
    <div className="min-h-screen bg-black">
      <ConfigWarning />
      <Navigation activeSection={activeSection} onNavigate={scrollToSection} />
      
      <main>
        <section id="home">
          <Hero onRegisterClick={() => scrollToSection('register')} />
        </section>
        
        <section id="program">
          <ProgramSection />
        </section>
        
        <section id="speakers">
          <SpeakersSection />
        </section>
        
        <section id="donate">
          <DonationSection />
        </section>
        
        <section id="register">
          <RegistrationForm />
        </section>
        
        <section id="contact">
          <ContactSection />
        </section>
      </main>
      
      <footer className="bg-black text-white py-8 text-center border-t border-[#b5882a]/20">
        <p className="text-gray-400">© 2025 Vision 2026 - Cité d'Excellence</p>
      </footer>
    </div>
  );
}
