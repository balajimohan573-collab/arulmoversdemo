import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Calendar, Hammer } from 'lucide-react';
import { businessConfig } from '../config/businessConfig';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setIsOpen(false);
    
    // Check if we are on the home page. If not, redirect to home page with hash
    if (location.pathname !== '/') {
      navigate('/#' + sectionId);
      // Let standard hash scrolling take place
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'JCB Rental', id: 'jcb-rental' },
    { label: 'Materials', id: 'materials' },
    { label: 'Services', id: 'services' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 bg-noise ${
        isScrolled
          ? 'bg-charcoal border-b border-charcoal-medium py-3 shadow-lg'
          : 'bg-gradient-to-b from-charcoal/80 to-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 font-display text-white focus:outline-none"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded border border-primary/20 shadow-md">
              <Hammer className="text-charcoal w-5 h-5 -rotate-45" />
            </div>
            <div>
              <span className="font-bebas text-2xl tracking-wider text-primary">ARUL</span>
              <span className="font-display font-light text-[11px] tracking-[0.25em] text-white block -mt-1.5">EARTH MOVERS</span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-sm font-semibold tracking-wide text-gray-300 hover:text-primary transition-colors duration-300 cursor-pointer focus:outline-none"
              >
                {item.label}
              </button>
            ))}
            
            {/* Admin link for easy client evaluation */}
            <Link
              to="/admin"
              className="text-xs font-medium tracking-wide text-gray-500 hover:text-primary transition-colors"
            >
              Admin Panel
            </Link>
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={`tel:${businessConfig.phoneRaw}`}
              className="flex items-center gap-1.5 text-sm font-bold text-white hover:text-primary transition-colors"
            >
              <Phone size={16} className="text-primary animate-pulse-slow" />
              <span>{businessConfig.phone}</span>
            </a>
            <button
              onClick={() => handleNavClick('booking')}
              className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-charcoal bg-primary hover:bg-primary-hover border border-primary rounded transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-md shadow-primary/10 overflow-hidden group cursor-pointer"
            >
              <Calendar size={15} className="mr-2" />
              <span>Book JCB</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <Link
              to="/admin"
              className="text-[11px] font-medium tracking-wide text-gray-500 mr-1"
            >
              Admin
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-charcoal-medium focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6 text-primary" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-y-0 right-0 w-80 bg-charcoal bg-noise border-l border-charcoal-medium z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center px-6 py-5 border-b border-charcoal-medium">
          <span className="font-bebas text-2xl tracking-wider text-primary">ARUL EARTH MOVERS</span>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-md text-gray-400 hover:text-white focus:outline-none"
          >
            <X className="h-6 w-6 text-primary" />
          </button>
        </div>
        
        <div className="px-6 py-8 flex flex-col gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="text-left text-lg font-bold tracking-wide text-gray-200 hover:text-primary transition-colors py-1 focus:outline-none"
            >
              {item.label}
            </button>
          ))}
          <Link
            to="/admin"
            onClick={() => setIsOpen(false)}
            className="text-left text-sm font-semibold text-gray-500 hover:text-primary py-1"
          >
            Admin Panel (Demo Dashboard)
          </Link>

          <div className="h-[1px] bg-charcoal-medium my-4"></div>

          <a
            href={`tel:${businessConfig.phoneRaw}`}
            className="flex items-center gap-3 text-lg font-bold text-white hover:text-primary py-2"
          >
            <Phone size={20} className="text-primary" />
            <span>{businessConfig.phone}</span>
          </a>

          <button
            onClick={() => handleNavClick('booking')}
            className="w-full flex items-center justify-center py-4 bg-primary hover:bg-primary-hover text-charcoal font-black rounded uppercase tracking-wider text-sm transition-all shadow-lg mt-2"
          >
            <Calendar size={18} className="mr-2" />
            Book JCB Now
          </button>
        </div>
      </div>

      {/* Overlay when mobile menu is open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        ></div>
      )}
    </nav>
  );
};
export default Navbar;
