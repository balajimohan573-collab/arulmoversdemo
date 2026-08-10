import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Check,
  ChevronDown,
  ChevronUp,
  Star,
  Shield,
  Zap,
  Users,
  Building,
  Hammer,
  Send,
  CheckCircle2,
  X
} from 'lucide-react';
import { businessConfig } from '../config/businessConfig';
import { LocalDb, type Material, type Testimonial } from '../utils/localStorageDb';
import Hero from '../components/Hero';
import QuickBookingBar from '../components/QuickBookingBar';
import RentalCalculator from '../components/RentalCalculator';
import ProjectEstimator from '../components/ProjectEstimator';
import GallerySection from '../components/GallerySection';

export const Home: React.FC = () => {
  // States
  const [jcbPrice, setJcbPrice] = useState(businessConfig.jcbHourlyPrice);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  
  // Custom review modal states
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRole, setNewReviewRole] = useState('Local Customer');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewContent, setNewReviewContent] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Contact Form states
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactService, setContactService] = useState('JCB Rental');
  const [contactLocation, setContactLocation] = useState('');
  const [contactHours, setContactHours] = useState<number>(4);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);

  useEffect(() => {
    const loadData = () => {
      const status = LocalDb.getJcbStatus();
      setJcbPrice(status.hourlyPrice);
      setMaterials(LocalDb.getMaterials());
      setTestimonials(LocalDb.getTestimonials());
    };
    loadData();

    window.addEventListener('aem_db_update', loadData);
    return () => window.removeEventListener('aem_db_update', loadData);
  }, []);

  // Handlers
  const handleFaqToggle = (index: number) => {
    if (faqOpen === index) {
      setFaqOpen(null);
    } else {
      setFaqOpen(index);
    }
  };

  const handleBookJcbScroll = () => {
    const el = document.getElementById('booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim() || !contactLocation.trim()) {
      alert('Please fill out all required fields.');
      return;
    }
    setContactSubmitting(true);
    setTimeout(() => {
      // Save enquiry to local database
      LocalDb.addEnquiry({
        name: contactName,
        phone: contactPhone,
        service: contactService,
        location: contactLocation,
        hours: contactHours,
        message: contactMessage,
        date: new Date().toISOString().split('T')[0],
      });
      
      window.dispatchEvent(new Event('aem_db_update'));
      setContactSubmitting(false);
      setContactSubmitted(true);
    }, 800);
  };

  const handleNewReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewContent.trim()) {
      alert('Please fill in your name and review details.');
      return;
    }
    
    const allTestimonials = LocalDb.getTestimonials();
    const updatedTestimonials: Testimonial[] = [
      ...allTestimonials,
      {
        id: 'test-' + Date.now(),
        author: newReviewAuthor,
        role: newReviewRole,
        rating: newReviewRating,
        content: newReviewContent,
        date: new Date().toISOString().split('T')[0],
      }
    ];
    LocalDb.saveTestimonials(updatedTestimonials);
    window.dispatchEvent(new Event('aem_db_update'));

    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewModalOpen(false);
      setNewReviewAuthor('');
      setNewReviewRole('Local Customer');
      setNewReviewRating(5);
      setNewReviewContent('');
      setReviewSubmitted(false);
    }, 1500);
  };

  const generateWhatsAppMaterial = (materialName: string) => {
    const msg = `Hello Arul Earth Movers 👋\nI would like to request pricing and delivery details for:\n*Material:* ${materialName}\n\nPlease share current rates per load and availability.`;
    return `https://wa.me/${businessConfig.whatsapp}?text=${encodeURIComponent(msg)}`;
  };

  const generateWhatsAppQuote = (serviceName: string) => {
    const msg = `Hello Arul Earth Movers 👋\nI would like to get a quote for excavation/earthwork services:\n*Service Type:* ${serviceName}\n\nPlease contact me to discuss.`;
    return `https://wa.me/${businessConfig.whatsapp}?text=${encodeURIComponent(msg)}`;
  };

  const faqs = [
    {
      q: "What is the JCB rental price?",
      a: `JCB rental is priced at ₹${jcbPrice.toLocaleString('en-IN')} per hour. This includes fuel and a professional operator. Please note that transportation charges to and from your location will be calculated separately based on distance.`
    },
    {
      q: "Do you provide an operator?",
      a: "Yes, all our JCB rentals include a highly skilled, experienced machine operator at no extra cost. This ensures the job is done safely, quickly, and professionally."
    },
    {
      q: "What areas do you serve?",
      a: "We are based in Kallakurichi, Tamil Nadu, and serve all surrounding residential properties, commercial sites, agricultural fields, and local layouts. Contact us with your site location to confirm machine availability."
    },
    {
      q: "Do you provide M-Sand?",
      a: "Yes! We supply high-grade Manufactured Sand (M-Sand) suitable for concrete, pillars, brickwork, and plaster. We deliver direct to your site in tractor or lorry loads. Call us for current market pricing."
    },
    {
      q: "Do you supply B-Sand?",
      a: "Yes, we supply premium quality plastering B-Sand, which is washed and double-sieved to ensure perfect binding, offering a smooth finish for walls and plastering tasks."
    },
    {
      q: "Can I book a JCB for a few hours?",
      a: "Yes, you can rent a JCB for as little as a few hours up to multiple weeks, depending on machine availability. Simply enter your hours in our booking form or calculator to get started."
    },
    {
      q: "How can I book?",
      a: "You can book using our online form, which estimates the cost and generates a prefilled WhatsApp request, or you can call us directly on our mobile number for instant scheduling."
    }
  ];

  return (
    <div className="bg-offwhite bg-noise">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Quick Booking Bar */}
      <QuickBookingBar />

      {/* 3. Services Showcase Section */}
      <section id="services" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary text-xs font-black uppercase tracking-widest block mb-2">Our Capabilities</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-charcoal tracking-tight">
            WHAT WE DO
          </h2>
          <div className="w-12 h-1.5 bg-primary mx-auto my-4 rounded-sm"></div>
          <p className="text-gray-500 text-sm sm:text-base font-medium">
            Reliable earthmoving equipment and premium construction material supplies for every stage of your project.
          </p>
        </div>

        {/* Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1: JCB Rental */}
          <div className="bg-charcoal text-white rounded-lg p-6 bg-noise border border-charcoal-medium flex flex-col justify-between hover:shadow-xl transition-all group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 bg-primary/10 rounded border border-primary/20 text-primary flex items-center justify-center font-bold">
                  01
                </span>
                <span className="text-xs font-extrabold uppercase text-primary tracking-widest bg-primary/10 px-2.5 py-1 rounded">
                  Rate: ₹{jcbPrice}/hr
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">JCB Rental</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">
                Reliable JCB rental service in Kallakurichi for house excavations, drainage, pipeline trenches, compound demolitions, and tree removals. Includes fuel and driver.
              </p>
            </div>
            <button
              onClick={handleBookJcbScroll}
              className="w-full py-2.5 bg-primary hover:bg-primary-hover text-charcoal text-xs font-black uppercase tracking-widest rounded transition-colors"
            >
              Book JCB →
            </button>
          </div>

          {/* Card 2: Earthwork */}
          <div className="bg-white text-charcoal rounded-lg p-6 border border-gray-200 flex flex-col justify-between hover:shadow-xl transition-all group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 bg-gray-100 rounded text-charcoal-medium flex items-center justify-center font-bold">
                  02
                </span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Service</span>
              </div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-2">Excavation & Earthwork</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-6">
                Professional subgrade excavation, drainage laying, plot digging, stone laying, and soil moving contractors. We handle site layouts with premium accuracy.
              </p>
            </div>
            <a
              href={generateWhatsAppQuote('Excavation / Earthwork')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2.5 bg-charcoal hover:bg-charcoal-light text-white text-xs font-bold uppercase tracking-widest rounded transition-colors block"
            >
              Get Quote →
            </a>
          </div>

          {/* Card 3: Site Levelling */}
          <div className="bg-white text-charcoal rounded-lg p-6 border border-gray-200 flex flex-col justify-between hover:shadow-xl transition-all group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 bg-gray-100 rounded text-charcoal-medium flex items-center justify-center font-bold">
                  03
                </span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Service</span>
              </div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-2">Site Levelling</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-6">
                Accurate land leveling, plot preparation, layout mapping, red soil/gravel filling, and compaction support to get your site ready for architectural work.
              </p>
            </div>
            <a
              href={generateWhatsAppQuote('Site Levelling')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2.5 bg-gray-100 hover:bg-gray-200 text-charcoal-medium text-xs font-bold uppercase tracking-widest rounded transition-colors block border border-gray-200"
            >
              Enquire →
            </a>
          </div>

          {/* Card 4: Land Clearing */}
          <div className="bg-white text-charcoal rounded-lg p-6 border border-gray-200 flex flex-col justify-between hover:shadow-xl transition-all group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 bg-gray-100 rounded text-charcoal-medium flex items-center justify-center font-bold">
                  04
                </span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Service</span>
              </div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-2">Land Clearing</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-6">
                Clearing vegetation, massive root systems, unwanted bushes, wild trees, bricks, old debris, and garbage to reset your site before major builders move in.
              </p>
            </div>
            <a
              href={generateWhatsAppQuote('Land Clearing')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2.5 bg-gray-100 hover:bg-gray-200 text-charcoal-medium text-xs font-bold uppercase tracking-widest rounded transition-colors block border border-gray-200"
            >
              Enquire →
            </a>
          </div>

          {/* Card 5: M-Sand Supply */}
          <div className="bg-white text-charcoal rounded-lg p-6 border border-gray-200 flex flex-col justify-between hover:shadow-xl transition-all group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 bg-gray-100 rounded text-charcoal-medium flex items-center justify-center font-bold">
                  05
                </span>
                <span className="text-xs font-extrabold uppercase text-green-600 tracking-widest bg-green-50 px-2 py-0.5 rounded">
                  Available
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-2">M-Sand Supply</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-6">
                Crushed manufactured sand washed to concrete grade specifications. Delivered directly to site for building structures, columns, and foundations.
              </p>
            </div>
            <a
              href={generateWhatsAppMaterial('M-Sand (Manufactured Sand)')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2.5 bg-primary hover:bg-primary-hover text-charcoal text-xs font-black uppercase tracking-widest rounded transition-colors block"
            >
              Request M-Sand →
            </a>
          </div>

          {/* Card 6: B-Sand Supply */}
          <div className="bg-white text-charcoal rounded-lg p-6 border border-gray-200 flex flex-col justify-between hover:shadow-xl transition-all group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 bg-gray-100 rounded text-charcoal-medium flex items-center justify-center font-bold">
                  06
                </span>
                <span className="text-xs font-extrabold uppercase text-green-600 tracking-widest bg-green-50 px-2 py-0.5 rounded">
                  Available
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-2">B-Sand Supply</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-6">
                Finely graded plastering sand (B-Sand) washed and sieved. Offers ideal smooth texture finishes for indoor/outdoor wall rendering and plastering work.
              </p>
            </div>
            <a
              href={generateWhatsAppMaterial('B-Sand (Plastering Sand)')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2.5 bg-primary hover:bg-primary-hover text-charcoal text-xs font-black uppercase tracking-widest rounded transition-colors block"
            >
              Request B-Sand →
            </a>
          </div>

        </div>
      </section>

      {/* 4. Dedicated JCB Rental Feature Section */}
      <section id="jcb-rental" className="py-24 bg-charcoal text-white bg-noise border-y border-charcoal-medium relative overflow-hidden">
        
        {/* Industry grid line background */}
        <div className="absolute inset-0 bg-grid-blueprint opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: JCB Image */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary to-amber-500 rounded-lg blur opacity-15 group-hover:opacity-25 transition duration-1000"></div>
              <div className="relative border border-primary/20 rounded-lg overflow-hidden shadow-2xl bg-charcoal-light">
                <img
                  src="/images/jcb_hero.png"
                  alt="JCB Excavator Loader"
                  className="w-full h-auto object-cover filter brightness-90 group-hover:scale-[1.01] transition-transform duration-500"
                />
                
                {/* Embedded status details */}
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-charcoal/90 backdrop-blur-md rounded border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Equipment Model</span>
                    <span className="text-sm font-bold text-white">JCB 3DX EcoBackhoe</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">Live Status</span>
                    <span className="text-xs font-extrabold text-green-400 uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span> Ready
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Copy & Feature Details */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-block text-primary text-xs font-black uppercase tracking-widest bg-primary/10 border border-primary/25 px-3 py-1 rounded">
                Exclusive Rental Offer
              </span>
              
              <h2 className="font-display font-bold text-3xl sm:text-4xl leading-tight text-white">
                YOUR SITE. OUR MACHINE. <br />
                <span className="text-primary">YOUR PROJECT MOVES FORWARD.</span>
              </h2>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Whether you need a JCB for a couple of hours of drain cleaning, day-long layout grading, 
                or week-long commercial plot clearing, we provide robust, well-maintained earthmovers with professional operators in Kallakurichi.
              </p>

              {/* Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm font-semibold">
                <div className="flex items-center gap-2 text-gray-300">
                  <Check size={16} className="text-primary" />
                  <span>₹{jcbPrice.toLocaleString('en-IN')} / Hour Price</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Check size={16} className="text-primary" />
                  <span>Experienced Operator Included</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Check size={16} className="text-primary" />
                  <span>Fast Machine Availability</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Check size={16} className="text-primary" />
                  <span>Flexible Rental Durations</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Check size={16} className="text-primary" />
                  <span>Residential & Commercial Work</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Check size={16} className="text-primary" />
                  <span>Kallakurichi & Surrounding Areas</span>
                </div>
              </div>

              {/* Action grid */}
              <div className="pt-6 border-t border-charcoal-medium/50 flex flex-wrap items-center gap-6">
                <div>
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block">Hourly Rate</span>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-extrabold text-white">₹{jcbPrice.toLocaleString('en-IN')}</span>
                    <span className="text-sm text-gray-400 font-semibold ml-1">/ hour</span>
                  </div>
                </div>

                <button
                  onClick={handleBookJcbScroll}
                  className="px-6 py-3.5 bg-primary hover:bg-primary-hover text-charcoal font-black text-xs uppercase tracking-widest rounded transition-colors shadow-lg cursor-pointer"
                >
                  BOOK JCB NOW
                </button>

                <div className="text-left py-2 px-4 rounded border border-charcoal-medium text-xs font-bold uppercase tracking-wider text-gray-400">
                  ⚡ 24/7 Enquiry Support
                </div>
              </div>

            </div>

          </div>

          {/* Embedded Calculator Card beneath features */}
          <div className="mt-20">
            <RentalCalculator />
          </div>

        </div>
      </section>

      {/* 5. Construction Materials Section */}
      <section id="materials" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary text-xs font-black uppercase tracking-widest block mb-2 font-bold">Materials Portfolio</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-charcoal tracking-tight">
            QUALITY MATERIALS. DELIVERED TO YOUR SITE.
          </h2>
          <div className="w-12 h-1.5 bg-primary mx-auto my-4 rounded-sm"></div>
          <p className="text-gray-500 text-sm sm:text-base font-medium">
            We deliver premium construction aggregates, concrete sand, and plastering supplies directly to your location in Kallakurichi.
          </p>
        </div>

        {/* Materials Cards Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {materials.map((mat) => (
            <div
              key={mat.id}
              className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300"
            >
              {/* Product Image */}
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative border-b border-gray-100">
                <img
                  src={mat.image}
                  alt={mat.name}
                  className="w-full h-full object-cover filter brightness-95"
                />
                
                {/* Availability Tag */}
                <div className="absolute top-3 right-3">
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow ${
                    mat.availability
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white'
                  }`}>
                    {mat.availability ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Copy details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-charcoal mb-2 leading-tight">
                    {mat.name}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3">
                    {mat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-400 uppercase">
                    <span>Est. Cost:</span>
                    <span className="text-charcoal font-bold text-sm text-primary-hover">{mat.price}</span>
                  </div>
                  <a
                    href={generateWhatsAppMaterial(mat.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-2.5 bg-charcoal hover:bg-charcoal-light text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
                  >
                    GET PRICE
                  </a>
                </div>
              </div>
            </div>
          ))}

          {/* Ask Us Extra Card */}
          <div className="bg-charcoal text-white bg-noise rounded-lg p-5 border border-charcoal-medium flex flex-col justify-between hover:shadow-lg transition-all relative overflow-hidden group">
            {/* Warning yellow slash */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-stripes-light opacity-30 transform translate-x-4 -translate-y-4 -skew-x-12 pointer-events-none"></div>

            <div>
              <div className="w-10 h-10 bg-primary/10 rounded border border-primary/20 text-primary flex items-center justify-center font-bold mb-4">
                +
              </div>
              <h3 className="font-display font-bold text-base text-white mb-2 leading-tight">
                Other Materials
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">
                Need cement, blue metal blocks, bricks, red soil, or customized crusher products for your building foundations?
              </p>
            </div>

            <div className="pt-4 border-t border-charcoal-medium/50 flex flex-col gap-3">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Custom Supplies</span>
              <a
                href={`https://wa.me/${businessConfig.whatsapp}?text=${encodeURIComponent('Hello Arul Earth Movers 👋\nI am looking for customized construction materials. Can you support other material deliveries?')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-2.5 bg-primary hover:bg-primary-hover text-charcoal text-xs font-black uppercase tracking-wider rounded transition-colors"
              >
                ASK US
              </a>
            </div>
          </div>
        </div>

        {/* Embedded Project Estimator Bar */}
        <div className="mt-20">
          <ProjectEstimator />
        </div>
      </section>

      {/* 6. Why Choose Us Section */}
      <section id="about" className="py-24 bg-charcoal text-white bg-noise border-t border-charcoal-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary text-xs font-black uppercase tracking-widest block mb-2 font-bold">Our Philosophy</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
              WHY ARUL EARTH MOVERS?
            </h2>
            <div className="w-12 h-1.5 bg-primary mx-auto my-4 rounded-sm"></div>
            <p className="text-gray-400 text-sm sm:text-base font-medium">
              We stand out in the local Kallakurichi industry for our professional operations and reliable services.
            </p>
          </div>

          {/* Cards Grid - 6 Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1: Transparent Pricing */}
            <div className="bg-charcoal-light border border-charcoal-medium p-6 rounded-lg space-y-4 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded flex items-center justify-center text-primary">
                <Shield size={24} />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Transparent Pricing</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Know the rental rate upfront. Clear ₹{jcbPrice.toLocaleString('en-IN')}/hour billing structure. No hidden fees or sudden operator surcharges.
              </p>
            </div>

            {/* Feature 2: Reliable Equipment */}
            <div className="bg-charcoal-light border border-charcoal-medium p-6 rounded-lg space-y-4 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded flex items-center justify-center text-primary">
                <Hammer size={24} />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Reliable Equipment</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Our machines undergo constant servicing. Avoid downtime at your site because of breakdown delays. Backed by standby parts.
              </p>
            </div>

            {/* Feature 3: Fast Response */}
            <div className="bg-charcoal-light border border-charcoal-medium p-6 rounded-lg space-y-4 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded flex items-center justify-center text-primary">
                <Zap size={24} />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Fast Response</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Quick responses for urgent trenching or pipeline clearing jobs. Our proximity to Kallakurichi allows for speedy machine mobilizations.
              </p>
            </div>

            {/* Feature 4: Experienced Service */}
            <div className="bg-charcoal-light border border-charcoal-medium p-6 rounded-lg space-y-4 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded flex items-center justify-center text-primary">
                <Users size={24} />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Experienced Service</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Machine operators have deep local experience in handling diverse soil profiles, narrow foundations, agricultural canals, and site levelling.
              </p>
            </div>

            {/* Feature 5: Local Expertise */}
            <div className="bg-charcoal-light border border-charcoal-medium p-6 rounded-lg space-y-4 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded flex items-center justify-center text-primary">
                <MapPin size={24} />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Local Expertise</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Deep roots serving Kallakurichi Town and all neighboring rural layouts. We know transportation coordinates and local regulations.
              </p>
            </div>

            {/* Feature 6: One-Stop Solution */}
            <div className="bg-charcoal-light border border-charcoal-medium p-6 rounded-lg space-y-4 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded flex items-center justify-center text-primary">
                <Building size={24} />
              </div>
              <h3 className="font-display font-bold text-lg text-white">One-Stop Solution</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                No need to call three different suppliers. Get JCB machines, land clearance support, and building sand/crusher supplies in one call.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Machines At Work (Gallery Section) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary text-xs font-black uppercase tracking-widest block mb-2 font-bold">Our Worksite Logs</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-charcoal tracking-tight">
            OUR MACHINES AT WORK
          </h2>
          <div className="w-12 h-1.5 bg-primary mx-auto my-4 rounded-sm"></div>
          <p className="text-gray-500 text-sm sm:text-base font-medium">
            Take a look at JCB excavations, building aggregates delivery, and clearing operations on locations across Kallakurichi.
          </p>
        </div>

        {/* Gallery React grid component */}
        <GallerySection />
      </section>

      {/* 8. Service Area Map Section */}
      <section className="bg-charcoal text-white bg-noise py-20 border-t border-charcoal-medium relative overflow-hidden">
        {/* Industry stripes grid details */}
        <div className="absolute inset-0 bg-stripes-light opacity-5 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Map Information */}
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-flex text-primary text-[10px] font-black uppercase tracking-wider bg-primary/10 border border-primary/25 px-2.5 py-1 rounded">
                Kallakurichi Territory
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
                SERVING KALLAKURICHI & SURROUNDING AREAS
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Our main office is located in Kallakurichi Town, allowing us to serve clients across a wide radius. 
                We regularly dispatch JCB equipment and delivery loaders to local residential and agricultural sites.
              </p>
              
              <div className="space-y-4 pt-4 border-t border-charcoal-medium">
                <div className="flex items-start gap-3">
                  <MapPin className="text-primary w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-sm text-white block">Operational Base</span>
                    <span className="text-xs text-gray-400">Kallakurichi District, Tamil Nadu, India</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-400 italic">
                  Contact us to check service availability at your specific village or layout. We provide custom site travel assessments.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <a
                  href="#contact"
                  className="text-center px-6 py-3.5 bg-primary hover:bg-primary-hover text-charcoal font-black text-xs uppercase tracking-widest rounded transition-colors"
                >
                  CHECK SERVICE AVAILABILITY
                </a>
                
                <a
                  href={businessConfig.mapsDirectionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center px-6 py-3.5 bg-transparent border border-white/10 hover:border-white/30 text-white font-bold text-xs uppercase tracking-widest rounded transition-colors"
                >
                  GET DIRECTIONS
                </a>
              </div>
            </div>

            {/* Right: Embedded Interactive Map */}
            <div className="lg:col-span-7 bg-charcoal-light border border-charcoal-medium rounded-lg p-3 shadow-2xl relative">
              {/* Caution stripe background */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-stripes opacity-20 pointer-events-none rounded-tr-lg"></div>
              
              <div className="w-full aspect-[16/9] rounded overflow-hidden shadow-inner">
                <iframe
                  title="Arul Earth Movers Location Map"
                  src={businessConfig.mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="filter grayscale brightness-95 opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-500"
                ></iframe>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. Testimonials / Reviews Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary text-xs font-black uppercase tracking-widest block mb-2 font-bold">Customer Endorsements</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-charcoal tracking-tight">
            WHAT OUR CUSTOMERS SAY
          </h2>
          <div className="w-12 h-1.5 bg-primary mx-auto my-4 rounded-sm"></div>
          <p className="text-gray-500 text-sm sm:text-base font-medium">
            Real feedback from local property owners and construction contractors in Kallakurichi.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < t.rating ? "currentColor" : "none"}
                      className={i < t.rating ? "text-primary" : "text-gray-300"}
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-xs italic leading-relaxed">
                  "{t.content}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-charcoal block">{t.author}</span>
                  <span className="text-[10px] text-gray-400 block">{t.role}</span>
                </div>
                <span className="text-[10px] text-gray-400 font-bold">
                  {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Leave Review Action CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setReviewModalOpen(true)}
            className="px-6 py-3 bg-charcoal hover:bg-charcoal-light text-white font-bold text-xs uppercase tracking-widest rounded transition-all cursor-pointer shadow-lg inline-flex items-center gap-1.5"
          >
            <span>Leave a Review</span>
          </button>
        </div>
      </section>

      {/* Review Modal Dialog */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-charcoal border border-charcoal-medium bg-noise rounded-lg p-6 max-w-md w-full relative text-white">
            <button
              onClick={() => setReviewModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h3 className="font-display font-bold text-lg text-white mb-4">Leave a Review</h3>
            
            {reviewSubmitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 text-green-500">
                  <CheckCircle2 size={24} />
                </div>
                <p className="text-sm font-semibold text-gray-300">Thank you! Your review has been saved locally.</p>
              </div>
            ) : (
              <form onSubmit={handleNewReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 font-bold mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-charcoal-light border border-charcoal-medium text-white px-3 py-2 rounded text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-400 font-bold mb-1">Your Role / Designation</label>
                  <input
                    type="text"
                    required
                    value={newReviewRole}
                    onChange={(e) => setNewReviewRole(e.target.value)}
                    placeholder="e.g., Builder, Land Owner, Local Resident"
                    className="w-full bg-charcoal-light border border-charcoal-medium text-white px-3 py-2 rounded text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 font-bold mb-1">Rating</label>
                  <div className="flex gap-1.5 text-primary">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReviewRating(star)}
                        className="focus:outline-none"
                      >
                        <Star size={20} fill={star <= newReviewRating ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 font-bold mb-1">Review Content</label>
                  <textarea
                    required
                    rows={4}
                    value={newReviewContent}
                    onChange={(e) => setNewReviewContent(e.target.value)}
                    placeholder="Write details about your experience working with us..."
                    className="w-full bg-charcoal-light border border-charcoal-medium text-white px-3 py-2 rounded text-xs focus:border-primary focus:outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-primary hover:bg-primary-hover text-charcoal font-black text-xs uppercase tracking-widest rounded transition-colors"
                >
                  SUBMIT REVIEW
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 10. Accordion FAQ Section */}
      <section className="py-24 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-primary text-xs font-black uppercase tracking-widest block mb-2 font-bold">Common Queries</span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-charcoal tracking-tight">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <div className="w-12 h-1.5 bg-primary mx-auto my-4 rounded-sm"></div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => handleFaqToggle(index)}
                  className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100/70 text-left transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-charcoal pr-4">
                    {faq.q}
                  </span>
                  {faqOpen === index ? (
                    <ChevronUp size={18} className="text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {faqOpen === index && (
                  <div className="p-5 bg-white border-t border-gray-100 text-xs sm:text-sm text-gray-500 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Premium Contact Section */}
      <section id="contact" className="py-24 bg-charcoal text-white bg-noise border-t border-charcoal-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left: Contact Info details */}
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-block text-primary text-xs font-black uppercase tracking-widest bg-primary/10 border border-primary/25 px-3 py-1 rounded">
                Get In Touch
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
                LET'S GET YOUR PROJECT MOVING
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Contact Arul Earth Movers for immediate JCB bookings, building aggregates supply, or machinery questions. 
                Our operators are ready.
              </p>

              {/* Detail Blocks */}
              <div className="space-y-4 pt-6 border-t border-charcoal-medium">
                
                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="text-primary w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase block">Office Location</span>
                    <span className="text-sm text-white font-semibold">{businessConfig.location}</span>
                  </div>
                </div>

                {/* Call */}
                <div className="flex items-start gap-3">
                  <Phone className="text-primary w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase block">Phone Number</span>
                    <a href={`tel:${businessConfig.phoneRaw}`} className="text-sm text-white font-semibold hover:text-primary transition-colors">
                      {businessConfig.phone}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3">
                  <MessageSquare className="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase block">WhatsApp Chat</span>
                    <a
                      href={`https://wa.me/${businessConfig.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white font-semibold hover:text-green-400 transition-colors"
                    >
                      Instant Chat Support
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <Clock className="text-primary w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase block">Business Hours</span>
                    <span className="text-sm text-white font-semibold">{businessConfig.businessHours}</span>
                  </div>
                </div>

              </div>

              {/* Giant CTA buttons grid */}
              <div className="pt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href={`tel:${businessConfig.phoneRaw}`}
                  className="text-center px-6 py-4 bg-primary hover:bg-primary-hover text-charcoal font-black text-xs uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone size={14} />
                  <span>CALL NOW</span>
                </a>
                
                <a
                  href={`https://wa.me/${businessConfig.whatsapp}?text=Hello%20Arul%20Earth%20Movers%20👋`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center px-6 py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-xs uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageSquare size={14} />
                  <span>WHATSAPP NOW</span>
                </a>
              </div>

            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-7 bg-charcoal-light border border-charcoal-medium rounded-lg p-6 md:p-8 relative">
              {/* Caution corner graphic */}
              <div className="absolute top-0 right-0 w-16 h-1 bg-stripes opacity-40"></div>

              {!contactSubmitted ? (
                <form onSubmit={handleContactFormSubmit} className="space-y-5">
                  <h3 className="font-display font-bold text-xl text-white mb-2">Request an Estimate / Message Us</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full bg-charcoal border border-charcoal-medium text-white px-4 py-3 rounded text-xs focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="Enter 10-digit mobile"
                        className="w-full bg-charcoal border border-charcoal-medium text-white px-4 py-3 rounded text-xs focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">Service Required</label>
                      <select
                        value={contactService}
                        onChange={(e) => setContactService(e.target.value)}
                        className="w-full bg-charcoal border border-charcoal-medium text-white px-4 py-3 rounded text-xs focus:border-primary focus:outline-none transition-colors"
                      >
                        <option value="JCB Rental">JCB Rental</option>
                        <option value="Excavation">Excavation Services</option>
                        <option value="Land Clearing">Land Clearing</option>
                        <option value="Site Levelling">Site Levelling</option>
                        <option value="Foundation Work">Foundation Excavation</option>
                        <option value="M-Sand">M-Sand Delivery</option>
                        <option value="B-Sand">B-Sand Delivery</option>
                        <option value="Other">Other Construction Supplies</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">Hours (For JCB)</label>
                      <input
                        type="number"
                        min="1"
                        value={contactHours}
                        onChange={(e) => setContactHours(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-full bg-charcoal border border-charcoal-medium text-white px-4 py-3 rounded text-xs focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5">Site Location *</label>
                    <input
                      type="text"
                      required
                      value={contactLocation}
                      onChange={(e) => setContactLocation(e.target.value)}
                      placeholder="Specify the village or area in Kallakurichi"
                      className="w-full bg-charcoal border border-charcoal-medium text-white px-4 py-3 rounded text-xs focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5">Your Message</label>
                    <textarea
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Tell us about your project requirements..."
                      className="w-full bg-charcoal border border-charcoal-medium text-white px-4 py-3 rounded text-xs focus:border-primary focus:outline-none transition-colors"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="w-full py-4 bg-primary hover:bg-primary-hover text-charcoal font-black text-xs uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Send size={14} />
                    <span>{contactSubmitting ? 'SENDING...' : 'SEND ENQUIRY'}</span>
                  </button>
                </form>
              ) : (
                <div className="text-center py-12 space-y-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 text-green-500">
                    <CheckCircle2 size={36} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-white">Enquiry Received</h3>
                    <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">
                      Thank you, {contactName}. We have saved your enquiry in the admin dashboard database logs. We will reach out to you shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setContactSubmitted(false);
                      setContactName('');
                      setContactPhone('');
                      setContactLocation('');
                      setContactMessage('');
                    }}
                    className="px-6 py-2.5 bg-transparent border border-charcoal-medium text-gray-400 hover:text-white rounded text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;
