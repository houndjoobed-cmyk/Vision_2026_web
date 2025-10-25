import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import logo from 'figma:asset/7a8c4b0370a0594d8ca399ae923d51b3f2f3bcb8.png';

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export default function Navigation({ activeSection, onNavigate }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Accueil' },
    { id: 'program', label: 'Programme' },
    { id: 'speakers', label: 'Intervenants' },
    { id: 'donate', label: 'Soutenir' },
    { id: 'register', label: 'Inscription' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3"
          >
            <img src={logo} alt="Cité d'Excellence" className="h-12 w-auto" />
            <span className="text-xl tracking-tight text-[#ffcf00]">Vision 2026</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors ${
                  activeSection === item.id
                    ? 'text-[#ffcf00]'
                    : 'text-white hover:text-[#ffcf00]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#b5882a]/20">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-4 py-3 transition-colors ${
                  activeSection === item.id
                    ? 'text-[#ffcf00] bg-[#b5882a]/10'
                    : 'text-white hover:bg-[#b5882a]/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
