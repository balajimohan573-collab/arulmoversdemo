import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { businessConfig } from '../config/businessConfig';
import { LocalDb } from '../utils/localStorageDb';

export const RentalCalculator: React.FC = () => {
  const [hours, setHours] = useState(8);
  const [jcbPrice, setJcbPrice] = useState(businessConfig.jcbHourlyPrice);

  useEffect(() => {
    const loadPrice = () => {
      const status = LocalDb.getJcbStatus();
      setJcbPrice(status.hourlyPrice);
    };
    loadPrice();
    window.addEventListener('aem_db_update', loadPrice);
    return () => window.removeEventListener('aem_db_update', loadPrice);
  }, []);

  const totalCost = hours * jcbPrice;

  const handleBookClick = () => {
    // Fill the booking form with this specific hour amount and scroll to it
    const hoursInput = document.querySelector('input[type="number"]') as HTMLInputElement;
    if (hoursInput) {
      hoursInput.value = hours.toString();
      // Dispatch input change event so react state updates
      const event = new Event('input', { bubbles: true });
      hoursInput.dispatchEvent(event);
    }
    
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-charcoal border border-charcoal-medium rounded-xl p-6 md:p-8 bg-noise relative overflow-hidden group">
      {/* Decorative orange slash */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-stripes-light opacity-30 transform translate-x-8 -translate-y-8 -skew-x-12 pointer-events-none"></div>

      <div className="max-w-xl">
        <h3 className="font-display font-bold text-xl md:text-2xl text-white mb-2 tracking-wide">
          Calculate Your JCB Rental Cost
        </h3>
        <p className="text-gray-400 text-xs md:text-sm mb-8 leading-relaxed">
          Drag the slider to calculate estimated costs based on your required work hours. 
        </p>

        {/* Hour Input Slider */}
        <div className="space-y-6">
          <div className="flex items-center justify-between text-sm font-bold uppercase tracking-wider text-gray-300">
            <span>Duration Required</span>
            <span className="text-primary font-display text-lg">{hours} Hours</span>
          </div>

          <div className="relative">
            <input
              type="range"
              min="1"
              max="24"
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value))}
              className="w-full h-2 bg-charcoal-medium rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-bold mt-2">
              <span>1 HR</span>
              <span>6 HRS</span>
              <span>12 HRS</span>
              <span>18 HRS</span>
              <span>24 HRS</span>
            </div>
          </div>
        </div>

        {/* Cost Display and Action */}
        <div className="mt-10 pt-6 border-t border-charcoal-medium/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest block">Estimated Cost</span>
            <span className="font-display font-extrabold text-3xl md:text-4xl text-white">
              ₹{totalCost.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-gray-400 block mt-1">
              (₹{jcbPrice.toLocaleString('en-IN')} × {hours} hours)
            </span>
          </div>

          <button
            onClick={handleBookClick}
            className="w-full sm:w-auto px-6 py-3.5 bg-primary hover:bg-primary-hover text-charcoal font-black text-xs uppercase tracking-widest rounded transition-all duration-300 shadow-md hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar size={15} />
            <span>BOOK THIS JCB</span>
          </button>
        </div>

        <p className="text-[11px] text-gray-500 leading-normal mt-6 italic">
          *Note: Final pricing may vary depending on project location, complexity of work, and machine transportation.
        </p>

      </div>
    </div>
  );
};
export default RentalCalculator;
