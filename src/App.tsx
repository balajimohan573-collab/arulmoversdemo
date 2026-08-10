import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Hammer, Phone, MessageSquare, MapPin, Clock } from 'lucide-react';
import { businessConfig } from './config/businessConfig';
import Navbar from './components/Navbar';
import FloatingContact from './components/FloatingContact';
import Home from './pages/Home';
import Admin from './pages/Admin';

// Component to scroll to top on page navigation or hash changes
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

// Footer component inside App.tsx or split, let's implement here for simplicity
const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal border-t border-charcoal-medium pt-16 pb-24 md:pb-12 text-white bg-noise relative overflow-hidden">
      {/* Blueprint pattern detail */}
      <div className="absolute inset-0 bg-grid-blueprint opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Top footer row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-display">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded border border-primary/20">
                <Hammer className="text-charcoal w-4 h-4 -rotate-45" />
              </div>
              <div>
                <span className="font-bebas text-xl tracking-wider text-primary">ARUL</span>
                <span className="font-display font-light text-[9px] tracking-[0.2em] text-white block -mt-1">EARTH MOVERS</span>
              </div>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              Providing premium JCB rental services, site levelling, excavation, and high-quality manufactured construction sand (M-sand/B-sand) supply in Kallakurichi.
            </p>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              Rate: ₹{businessConfig.jcbHourlyPrice.toLocaleString('en-IN')}/hour
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-primary">Quick Links</h4>
            <ul className="space-y-2 text-xs text-gray-400 font-semibold">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><a href="#/jcb-rental" className="hover:text-white transition-colors">JCB Rental</a></li>
              <li><a href="#/materials" className="hover:text-white transition-colors">Materials</a></li>
              <li><a href="#/services" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services List */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-primary">Services</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>JCB Rental (₹{businessConfig.jcbHourlyPrice}/hr)</li>
              <li>Foundation Excavation</li>
              <li>Site Levelling & Grading</li>
              <li>Land Clearing & Scrubbing</li>
              <li>M-Sand (Manufactured Concrete Sand)</li>
              <li>B-Sand (Plastering Fine Sand)</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 text-xs text-gray-400">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-primary">Contact Us</h4>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-primary mt-0.5 flex-shrink-0" />
                <span>{businessConfig.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-primary flex-shrink-0" />
                <a href={`tel:${businessConfig.phoneRaw}`} className="hover:text-white transition-colors">{businessConfig.phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare size={14} className="text-green-500 flex-shrink-0" />
                <a href={`https://wa.me/${businessConfig.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp Support</a>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-primary flex-shrink-0" />
                <span>{businessConfig.businessHours}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom row */}
        <div className="pt-8 border-t border-charcoal-medium/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-bold uppercase tracking-wider">
          <div>
            © 2026 Arul Earth Movers. All Rights Reserved.
          </div>
          <div className="flex gap-4">
            <Link to="/admin" className="hover:text-primary transition-colors text-[10px]">
              Admin Panel Login (Demo)
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      
      {/* Common layout structures */}
      <Navbar />
      
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <Footer />
      <FloatingContact />
    </Router>
  );
};

export default App;
