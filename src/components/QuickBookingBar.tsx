import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Hammer, CheckCircle2, MessageSquare } from 'lucide-react';
import { businessConfig } from '../config/businessConfig';
import { LocalDb } from '../utils/localStorageDb';

export const QuickBookingBar: React.FC = () => {
  const [service, setService] = useState('JCB Rental');
  const [hours, setHours] = useState<number>(4);
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [jcbPrice, setJcbPrice] = useState(businessConfig.jcbHourlyPrice);
  
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadPrice = () => {
      const status = LocalDb.getJcbStatus();
      setJcbPrice(status.hourlyPrice);
    };
    loadPrice();
    window.addEventListener('aem_db_update', loadPrice);
    return () => window.removeEventListener('aem_db_update', loadPrice);
  }, []);

  const totalEstimate = hours * jcbPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!location.trim()) {
      setErrorMsg('Please enter your site location.');
      return;
    }
    if (!date) {
      setErrorMsg('Please select a preferred date.');
      return;
    }
    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return;
    }

    setSubmitting(true);

    // Simulate submission delay
    setTimeout(() => {
      // Save enquiry to local database
      LocalDb.addEnquiry({
        name,
        phone,
        service,
        location,
        hours,
        date,
        message: `Quick booking submitted via home booking widget. Est. Hours: ${hours}, Estimated cost: ₹${totalEstimate.toLocaleString('en-IN')}`,
      });

      // Dispatch custom event to notify admin panel or other widgets if open
      window.dispatchEvent(new Event('aem_db_update'));

      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  const getWhatsAppLink = () => {
    const formattedDate = new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const msg = `Hello Arul Earth Movers 👋

I would like to book a JCB.
*Customer:* ${name}
*Phone:* ${phone}
*Service:* ${service}
*Hours Required:* ${hours} Hours
*Location:* ${location}
*Date:* ${formattedDate}
*Estimated Cost:* ₹${totalEstimate.toLocaleString('en-IN')}

Please confirm availability and price.`;

    return `https://wa.me/${businessConfig.whatsapp}?text=${encodeURIComponent(msg)}`;
  };

  const resetForm = () => {
    setSubmitted(false);
    setLocation('');
    setDate('');
    setName('');
    setPhone('');
    setHours(4);
  };

  return (
    <div id="booking" className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 -mt-24 md:-mt-32">
      <div className="bg-charcoal border border-primary/20 rounded-xl shadow-2xl p-6 md:p-8 bg-noise">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-charcoal-medium">
          <div>
            <h2 className="font-display font-bold text-xl md:text-2xl text-white tracking-wide flex items-center gap-2">
              <span className="w-2.5 h-6 bg-primary rounded-sm block"></span>
              Need a JCB? Check Your Requirement
            </h2>
            <p className="text-gray-400 text-xs md:text-sm mt-1">
              Select details, get an estimate, and confirm instantly on WhatsApp.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded">
            <span>Rate: ₹{jcbPrice.toLocaleString('en-IN')}/hour</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-500/30 text-red-200 text-xs font-bold rounded">
            ⚠ {errorMsg}
          </div>
        )}

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Service Dropdown */}
              <div>
                <label className="block text-xs font-black text-gray-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Hammer size={12} className="text-primary" /> Service Required
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-charcoal-light border border-charcoal-medium text-white px-4 py-3 rounded text-sm focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="JCB Rental">JCB Rental</option>
                  <option value="Excavation">Excavation</option>
                  <option value="Land Clearing">Land Clearing</option>
                  <option value="Site Levelling">Site Levelling</option>
                  <option value="Foundation Work">Foundation Work</option>
                  <option value="Other">Other Earthwork</option>
                </select>
              </div>

              {/* Hours Input */}
              <div>
                <label className="block text-xs font-black text-gray-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Clock size={12} className="text-primary" /> Hours Required
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={hours}
                    onChange={(e) => setHours(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-charcoal-light border border-charcoal-medium text-white px-4 py-3 rounded text-sm focus:border-primary focus:outline-none transition-colors"
                  />
                  <span className="absolute right-4 top-3.5 text-xs text-gray-500 font-bold uppercase">Hrs</span>
                </div>
              </div>

              {/* Location Input */}
              <div>
                <label className="block text-xs font-black text-gray-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <MapPin size={12} className="text-primary" /> Site Location
                </label>
                <input
                  type="text"
                  placeholder="Enter your site location in Kallakurichi"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-charcoal-light border border-charcoal-medium text-white px-4 py-3 rounded text-sm placeholder-gray-600 focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Date Input */}
              <div>
                <label className="block text-xs font-black text-gray-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Calendar size={12} className="text-primary" /> Date Required
                </label>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-charcoal-light border border-charcoal-medium text-white px-4 py-3 rounded text-sm focus:border-primary focus:outline-none transition-colors"
                />
              </div>

            </div>

            {/* Sub-inputs: Name and Phone for saving enquiry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-charcoal-medium/50">
              <div>
                <label className="block text-xs font-black text-gray-300 uppercase tracking-widest mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-charcoal-light border border-charcoal-medium text-white px-4 py-3 rounded text-sm placeholder-gray-600 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-300 uppercase tracking-widest mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full bg-charcoal-light border border-charcoal-medium text-white px-4 py-3 rounded text-sm placeholder-gray-600 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Estimator Display and Submit Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
              <div className="text-left w-full sm:w-auto">
                <span className="text-gray-400 text-[11px] font-black uppercase tracking-wider block">Estimated JCB Rental Cost</span>
                <span className="font-display font-bold text-2xl text-white">
                  ₹{totalEstimate.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-gray-500 font-semibold block sm:inline sm:ml-2">
                  (Rate: ₹{jcbPrice}/hr for {hours} hrs • Operator & fuel included)
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary-hover text-charcoal font-black text-xs uppercase tracking-wider rounded transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                {submitting ? 'Checking...' : 'CHECK AVAILABILITY →'}
              </button>
            </div>
          </form>
        ) : (
          /* Submission success overlay */
          <div className="text-center py-8 space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 text-green-500">
              <CheckCircle2 size={36} />
            </div>

            <div className="max-w-md mx-auto">
              <h3 className="font-display font-bold text-xl text-white">Enquiry Submitted Successfully!</h3>
              <p className="text-gray-400 text-sm mt-2">
                We have registered your details in our system. To confirm your booking instantly, please click below to send us the pre-filled message on WhatsApp.
              </p>
            </div>

            {/* Estimated cost box */}
            <div className="max-w-xs mx-auto p-4 bg-charcoal-light border border-charcoal-medium rounded">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block">Estimated JCB Cost</span>
              <span className="text-2xl font-bold text-primary">₹{totalEstimate.toLocaleString('en-IN')}</span>
              <span className="text-xs text-gray-300 block mt-1">For {hours} Hours at {location}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-1/2 px-6 py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold text-xs uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageSquare size={16} />
                <span>CONFIRM VIA WHATSAPP</span>
              </a>

              <button
                onClick={resetForm}
                className="w-full sm:w-1/2 px-6 py-3.5 bg-transparent hover:bg-white/5 text-gray-300 border border-charcoal-medium rounded font-bold text-xs uppercase tracking-widest transition-all"
              >
                Book Another Machine
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default QuickBookingBar;
