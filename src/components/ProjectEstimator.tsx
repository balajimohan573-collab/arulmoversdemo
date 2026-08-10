import React, { useState, useEffect } from 'react';
import { HardHat, Compass, Sun, MessageSquare, Landmark, Trees } from 'lucide-react';
import { businessConfig } from '../config/businessConfig';
import { LocalDb } from '../utils/localStorageDb';

interface ProjectType {
  id: string;
  name: string;
  icon: React.ReactNode;
  suggestedHours: number;
  description: string;
}

export const ProjectEstimator: React.FC = () => {
  const [selectedType, setSelectedType] = useState('excavation');
  const [hours, setHours] = useState(8);
  const [location, setLocation] = useState('');
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

  const projectTypes: ProjectType[] = [
    {
      id: 'excavation',
      name: 'Excavation',
      icon: <HardHat size={20} />,
      suggestedHours: 8,
      description: 'Deep digging, trenching, or bulk earth removal.'
    },
    {
      id: 'clearing',
      name: 'Land Clearing',
      icon: <Trees size={20} />,
      suggestedHours: 5,
      description: 'Removing plants, root systems, stones, and debris.'
    },
    {
      id: 'levelling',
      name: 'Site Levelling',
      icon: <Compass size={20} />,
      suggestedHours: 6,
      description: 'Grading and levelling soil for foundation work.'
    },
    {
      id: 'foundation',
      name: 'Foundation Work',
      icon: <Landmark size={20} />,
      suggestedHours: 12,
      description: 'Precise trench digging matching structural blueprints.'
    },
    {
      id: 'earthwork',
      name: 'General Earthwork',
      icon: <Sun size={20} />,
      suggestedHours: 4,
      description: 'Moving soil, refilling, or shifting aggregates.'
    }
  ];

  const currentProject = projectTypes.find(p => p.id === selectedType) || projectTypes[0];
  const calculatedCost = hours * jcbPrice;

  // Set suggested hours when project type changes
  const handleTypeSelect = (id: string, suggested: number) => {
    setSelectedType(id);
    setHours(suggested);
  };

  const handleWhatsAppEnquiry = () => {
    const projectTypeName = currentProject.name;
    const msg = `Hello Arul Earth Movers 👋

I would like to request a Project Estimate:
*Project Type:* ${projectTypeName}
*Estimated Hours:* ${hours} Hours
*Site Location:* ${location || 'Not Specified'}
*Calculated JCB Rental:* ₹${calculatedCost.toLocaleString('en-IN')}

Please confirm availability and estimate.`;

    const url = `https://wa.me/${businessConfig.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');

    // Add enquiry to list
    LocalDb.addEnquiry({
      name: 'Estimator Customer',
      phone: businessConfig.phone,
      service: projectTypeName,
      location: location || 'Estimator Check',
      hours,
      date: new Date().toISOString().split('T')[0],
      message: `Project Estimator used. Type: ${projectTypeName}, Hours: ${hours}, Price: ₹${calculatedCost}`,
    });
    window.dispatchEvent(new Event('aem_db_update'));
  };

  return (
    <div className="bg-charcoal border border-charcoal-medium rounded-xl p-6 md:p-8 bg-noise text-white">
      <div className="flex items-center gap-2 mb-6">
        <span className="w-8 h-8 rounded bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold">
          ?
        </span>
        <div>
          <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest block">Interactive Tool</span>
          <h3 className="font-display font-bold text-xl md:text-2xl text-white tracking-tight">
            Plan Your Project
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Configurations */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Select Type */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-3">
              1. What do you need?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projectTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleTypeSelect(type.id, type.suggestedHours)}
                  className={`flex items-start gap-3 p-3.5 rounded border text-left transition-all duration-300 ${
                    selectedType === type.id
                      ? 'bg-primary/10 border-primary text-white'
                      : 'bg-charcoal-light border-charcoal-medium text-gray-400 hover:border-gray-700'
                  }`}
                >
                  <span className={`p-2 rounded ${selectedType === type.id ? 'bg-primary text-charcoal' : 'bg-charcoal-medium text-gray-300'}`}>
                    {type.icon}
                  </span>
                  <div>
                    <span className="font-bold text-sm text-white block">{type.name}</span>
                    <span className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{type.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Hours Input */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2 flex justify-between">
              <span>2. Estimated Hours</span>
              <span className="text-primary font-bold">{hours} Hours</span>
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value))}
              className="w-full h-2 bg-charcoal-medium rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
            />
            <span className="text-[10px] text-gray-500 font-bold block mt-2">
              Suggested standard duration for {currentProject.name}: {currentProject.suggestedHours} Hours
            </span>
          </div>

          {/* Step 3: Location Input */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
              3. Site Location
            </label>
            <input
              type="text"
              placeholder="e.g., Kallakurichi Town or surrounding village"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-charcoal-light border border-charcoal-medium text-white px-4 py-3.5 rounded text-sm placeholder-gray-600 focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Right Column - Cost display card */}
        <div className="lg:col-span-5">
          <div className="bg-charcoal-light border border-charcoal-medium rounded-lg p-6 flex flex-col justify-between h-full relative overflow-hidden">
            {/* Warning outline stripes */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-stripes opacity-40"></div>

            <div className="space-y-4">
              <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest block">Project Cost Summary</span>
              
              <div className="space-y-2 border-b border-charcoal-medium/50 pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Project Area:</span>
                  <span className="font-semibold text-white">{currentProject.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Duration Scheduled:</span>
                  <span className="font-semibold text-white">{hours} Hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Hourly Rate:</span>
                  <span className="font-semibold text-white">₹{jcbPrice.toLocaleString('en-IN')}/hr</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black block">Your Estimated JCB Cost</span>
                <span className="text-3xl sm:text-4xl font-extrabold text-primary block mt-1">
                  ₹{calculatedCost.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-gray-500 font-medium block mt-1">
                  Includes driver service, fuel, and equipment rental.
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={handleWhatsAppEnquiry}
                className="w-full px-6 py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-xs uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] cursor-pointer"
              >
                <MessageSquare size={16} />
                <span>GET ESTIMATE ON WHATSAPP</span>
              </button>
              
              <span className="text-[10px] text-gray-500 italic text-center block leading-tight">
                *Final transportation charges will be calculated based on your site distance from Kallakurichi.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default ProjectEstimator;
