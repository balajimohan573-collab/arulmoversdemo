import React from 'react';
import { Phone, MessageCircle, Calendar } from 'lucide-react';
import { businessConfig } from '../config/businessConfig';

export const FloatingContact: React.FC = () => {
  const handleBookClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Arul Earth Movers 👋\nI would like to enquire about JCB rental and availability.\n\nPlease share more details.`
  );

  return (
    <>
      {/* Desktop Floating Actions: Bottom-Right */}
      <div className="hidden md:flex flex-col gap-3 fixed bottom-6 right-6 z-50">
        {/* Call Button */}
        <a
          href={`tel:${businessConfig.phoneRaw}`}
          className="flex items-center justify-center w-14 h-14 bg-charcoal hover:bg-charcoal-light text-primary hover:text-white rounded-full shadow-2xl transition-all duration-300 border border-primary/20 hover:scale-110 group relative"
          aria-label="Call Now"
        >
          <Phone size={24} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute right-16 bg-charcoal text-white text-xs font-semibold py-1.5 px-3 rounded shadow-lg border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            Call: {businessConfig.phone}
          </span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${businessConfig.whatsapp}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 bg-green-600 hover:bg-green-500 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group relative"
          aria-label="WhatsApp Us"
        >
          <MessageCircle size={26} className="group-hover:scale-110 transition-transform" />
          <span className="absolute right-16 bg-charcoal text-white text-xs font-semibold py-1.5 px-3 rounded shadow-lg border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            Chat on WhatsApp
          </span>
        </a>
      </div>

      {/* Mobile Sticky Bottom Navigation: CALL | WHATSAPP | BOOK JCB */}
      <div className="flex md:hidden fixed bottom-0 left-0 right-0 h-16 bg-charcoal border-t border-charcoal-medium z-50 shadow-[0_-8px_24px_rgba(0,0,0,0.4)]">
        {/* Call Button */}
        <a
          href={`tel:${businessConfig.phoneRaw}`}
          className="flex-1 flex flex-col items-center justify-center text-gray-300 hover:text-white border-r border-charcoal-medium transition-colors"
        >
          <Phone size={20} className="text-primary mb-1" />
          <span className="text-[11px] font-bold uppercase tracking-wider">Call Now</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${businessConfig.whatsapp}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center text-gray-300 hover:text-white border-r border-charcoal-medium transition-colors"
        >
          <MessageCircle size={20} className="text-green-500 mb-1" />
          <span className="text-[11px] font-bold uppercase tracking-wider">WhatsApp</span>
        </a>

        {/* Book JCB Button (Yellow highlight) */}
        <button
          onClick={handleBookClick}
          className="flex-[1.5] flex items-center justify-center bg-primary hover:bg-primary-hover text-charcoal font-black transition-colors"
        >
          <Calendar size={18} className="mr-1.5" />
          <span className="text-[12px] uppercase tracking-wider">Book JCB</span>
        </button>
      </div>
    </>
  );
};
export default FloatingContact;
