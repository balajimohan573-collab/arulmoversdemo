import React, { useEffect, useState } from 'react';
import { Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { businessConfig } from '../config/businessConfig';
import { LocalDb } from '../utils/localStorageDb';
import AvailabilityWidget from './AvailabilityWidget';

export const Hero: React.FC = () => {
  const [jcbPrice, setJcbPrice] = useState(businessConfig.jcbHourlyPrice);

  useEffect(() => {
    const loadPrice = () => {
      const status = LocalDb.getJcbStatus();
      setJcbPrice(status.hourlyPrice);
    };
    loadPrice();
    
    // Listen for custom database changes
    window.addEventListener('aem_db_update', loadPrice);
    return () => window.removeEventListener('aem_db_update', loadPrice);
  }, []);

  const handleBookClick = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Arul Earth Movers 👋\nI would like to book a JCB rental for a project in Kallakurichi.\n\nPlease share availability details.`
  );

  return (
    <div id="home" className="relative min-h-screen flex items-center justify-center bg-charcoal overflow-hidden pt-20">
      {/* Background Image with Dark Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/jcb_hero.png"
          alt="JCB working at a construction site in Tamil Nadu"
          className="w-full h-full object-cover object-center filter brightness-[0.4]"
        />
        {/* Modern radial & linear overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-charcoal/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-transparent to-transparent opacity-80"></div>
        
        {/* Industry blueprint grid pattern */}
        <div className="absolute inset-0 bg-grid-blueprint opacity-40 mix-blend-overlay"></div>
      </div>

      {/* Decorative Blueprint Corner Line */}
      <div className="absolute top-24 left-6 w-32 h-32 border-t border-l border-primary/20 pointer-events-none hidden lg:block">
        <div className="absolute top-0 left-0 w-2 h-2 bg-primary"></div>
      </div>
      <div className="absolute bottom-24 right-6 w-32 h-32 border-b border-r border-primary/20 pointer-events-none hidden lg:block">
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-primary"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 flex flex-col items-center text-center">
        
        {/* Live Availability Indicator */}
        <div className="mb-6 animate-fade-in-down">
          <AvailabilityWidget />
        </div>

        {/* Small badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-charcoal-medium/80 border border-primary/20 text-xs font-semibold uppercase tracking-wider text-primary mb-6 shadow-md backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow"></span>
          Trusted Earthmover & Materials in Kallakurichi
        </div>

        {/* Main Headline */}
        <h1 className="font-bebas text-5xl sm:text-7xl md:text-8xl tracking-wider text-white leading-[0.9] max-w-5xl mb-6">
          POWERING YOUR PROJECTS <br />
          <span className="text-primary bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">FROM THE GROUND UP.</span>
        </h1>

        {/* Supporting Line */}
        <p className="font-sans text-base sm:text-xl text-gray-300 max-w-3xl mb-10 leading-relaxed font-medium">
          Premium JCB Rental, Earthwork services, and supreme quality Construction Materials — 
          plastering sand, manufactured sand, and blue metal. Served locally in Kallakurichi.
        </p>

        {/* Price Card & CTAs Grid */}
        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
          
          {/* Hourly Price Highlight Card */}
          <div className="glass-card px-8 py-5 rounded-lg border border-primary/30 flex items-center gap-5 shadow-2xl relative overflow-hidden group">
            {/* Warning yellow warning stripe details on side */}
            <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-primary"></div>
            
            <div className="text-left">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-widest block">JCB Rental Rate</span>
              <span className="font-bebas text-4xl text-primary font-bold">₹{jcbPrice.toLocaleString('en-IN')}</span>
              <span className="text-white text-sm font-semibold"> / Hour</span>
            </div>
            <div className="h-10 w-[1px] bg-charcoal-medium"></div>
            <div className="text-left text-xs font-bold text-gray-300 uppercase tracking-wide leading-tight">
              ✓ Operator Included <br />
              ✓ Fuel Included
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Primary CTA */}
          <button
            onClick={handleBookClick}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-primary-hover text-charcoal font-black text-sm uppercase tracking-widest rounded shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] group cursor-pointer"
          >
            <span>BOOK JCB NOW</span>
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Secondary CTA (WhatsApp) */}
          <a
            href={`https://wa.me/${businessConfig.whatsapp}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-transparent hover:bg-white/5 text-white border border-white/20 hover:border-white rounded font-bold text-sm uppercase tracking-widest transition-all duration-300"
          >
            <MessageSquare size={16} className="mr-2 text-green-500" />
            <span>WhatsApp Us</span>
          </a>

          {/* Call CTA */}
          <a
            href={`tel:${businessConfig.phoneRaw}`}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-charcoal-medium/50 hover:bg-charcoal-medium text-gray-200 hover:text-white border border-charcoal-medium/80 rounded font-bold text-sm uppercase tracking-widest transition-all duration-300"
          >
            <Phone size={16} className="mr-2 text-primary" />
            <span>Call Now</span>
          </a>
        </div>

        {/* Small trust line */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs font-bold text-gray-400 tracking-wider uppercase">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Fast Response
          </span>
          <span className="hidden sm:inline text-gray-700">•</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Reliable Machines
          </span>
          <span className="hidden sm:inline text-gray-700">•</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Transparent Pricing
          </span>
        </div>

      </div>

      {/* Hero Bottom Diagonal Cut/Transition styling */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-offwhite skew-y-1 origin-bottom-left transform scale-y-110 pointer-events-none"></div>
    </div>
  );
};
export default Hero;
