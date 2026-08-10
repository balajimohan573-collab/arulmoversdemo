import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Lock,
  Hammer,
  MapPin,
  AlertCircle,
  Truck,
  MessageSquare,
  Image as ImageIcon,
  Trash2,
  Plus,
  Save,
  LogOut,
  Sparkles,
  Inbox,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { LocalDb, type JcbStatus, type Enquiry, type Material, type Testimonial, type GalleryItem } from '../utils/localStorageDb';

export const Admin: React.FC = () => {

  // Authentication States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard Data States
  const [jcbStatus, setJcbStatus] = useState<JcbStatus>({ availability: 'Available', hourlyPrice: 1000, operatorIncluded: true });
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'jcb' | 'enquiries' | 'materials' | 'testimonials' | 'gallery'>('jcb');

  // Input states for editing/adding
  const [jcbRateInput, setJcbRateInput] = useState(1000);
  const [jcbAvailabilityInput, setJcbAvailabilityInput] = useState<'Available' | 'Limited' | 'Booked'>('Available');
  const [jcbOperatorInput, setJcbOperatorInput] = useState(true);

  // New Material input state
  const [newMatName, setNewMatName] = useState('');
  const [newMatDesc, setNewMatDesc] = useState('');
  const [newMatPrice, setNewMatPrice] = useState('Market Rate');
  const [newMatAvail, setNewMatAvail] = useState(true);
  const [newMatImg, setNewMatImg] = useState('/images/m_sand.png');

  // New Testimonial input state
  const [newTestAuthor, setNewTestAuthor] = useState('');
  const [newTestRole, setNewTestRole] = useState('');
  const [newTestContent, setNewTestContent] = useState('');
  const [newTestRating, setNewTestRating] = useState(5);

  // New Gallery input state
  const [newGalImgUrl, setNewGalImgUrl] = useState('/images/jcb_hero.png');
  const [newGalCategory, setNewGalCategory] = useState<'JCB' | 'Earthwork' | 'Materials'>('JCB');
  const [newGalCaption, setNewGalCaption] = useState('');

  // Toast message state
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // Check local session storage if authenticated this session
    const authSession = sessionStorage.getItem('aem_admin_auth');
    if (authSession === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const loadAllData = () => {
    const status = LocalDb.getJcbStatus();
    setJcbStatus(status);
    setJcbRateInput(status.hourlyPrice);
    setJcbAvailabilityInput(status.availability);
    setJcbOperatorInput(status.operatorIncluded);

    setEnquiries(LocalDb.getEnquiries());
    setMaterials(LocalDb.getMaterials());
    setTestimonials(LocalDb.getTestimonials());
    setGallery(LocalDb.getGallery());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Pre-configured simple password for demo
    if (password === 'admin123' || password === 'arul123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('aem_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid password. Please use password: admin123 or arul123');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('aem_admin_auth');
    setPassword('');
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2500);
  };

  // JCB Updates Save
  const handleSaveJcb = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: JcbStatus = {
      availability: jcbAvailabilityInput,
      hourlyPrice: jcbRateInput,
      operatorIncluded: jcbOperatorInput
    };
    LocalDb.saveJcbStatus(updated);
    setJcbStatus(updated);
    // Notify home pages/tabs of database update
    window.dispatchEvent(new Event('aem_db_update'));
    triggerToast('JCB Status and pricing updated successfully!');
  };

  // Enquiry Status Update
  const handleUpdateEnquiryStatus = (id: string, newStatus: 'New' | 'Contacted' | 'Confirmed' | 'Completed') => {
    const updated = enquiries.map(enq => {
      if (enq.id === id) {
        return { ...enq, status: newStatus };
      }
      return enq;
    });
    LocalDb.saveEnquiries(updated);
    setEnquiries(updated);
    window.dispatchEvent(new Event('aem_db_update'));
    triggerToast(`Enquiry status updated to ${newStatus}`);
  };

  // Enquiry Delete
  const handleDeleteEnquiry = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    const filtered = enquiries.filter(enq => enq.id !== id);
    LocalDb.saveEnquiries(filtered);
    setEnquiries(filtered);
    window.dispatchEvent(new Event('aem_db_update'));
    triggerToast('Enquiry deleted.');
  };

  // Materials CRUD
  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatName.trim() || !newMatDesc.trim()) return;

    const newMaterial: Material = {
      id: 'mat-' + Date.now(),
      name: newMatName,
      description: newMatDesc,
      price: newMatPrice,
      availability: newMatAvail,
      image: newMatImg
    };

    const updated = [...materials, newMaterial];
    LocalDb.saveMaterials(updated);
    setMaterials(updated);
    window.dispatchEvent(new Event('aem_db_update'));
    triggerToast('New material added!');

    // Reset inputs
    setNewMatName('');
    setNewMatDesc('');
    setNewMatPrice('Market Rate');
    setNewMatAvail(true);
  };

  const handleDeleteMaterial = (id: string) => {
    if (!window.confirm('Delete this material listing?')) return;
    const filtered = materials.filter(m => m.id !== id);
    LocalDb.saveMaterials(filtered);
    setMaterials(filtered);
    window.dispatchEvent(new Event('aem_db_update'));
    triggerToast('Material listing removed.');
  };

  // Testimonials CRUD
  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestAuthor.trim() || !newTestContent.trim()) return;

    const newTest: Testimonial = {
      id: 'test-' + Date.now(),
      author: newTestAuthor,
      role: newTestRole || 'Client',
      rating: newTestRating,
      content: newTestContent,
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newTest, ...testimonials];
    LocalDb.saveTestimonials(updated);
    setTestimonials(updated);
    window.dispatchEvent(new Event('aem_db_update'));
    triggerToast('Review added!');

    // Reset inputs
    setNewTestAuthor('');
    setNewTestRole('');
    setNewTestContent('');
    setNewTestRating(5);
  };

  const handleDeleteTestimonial = (id: string) => {
    if (!window.confirm('Delete this review?')) return;
    const filtered = testimonials.filter(t => t.id !== id);
    LocalDb.saveTestimonials(filtered);
    setTestimonials(filtered);
    window.dispatchEvent(new Event('aem_db_update'));
    triggerToast('Review removed.');
  };

  // Gallery CRUD
  const handleAddGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalCaption.trim()) return;

    const newItem: GalleryItem = {
      id: 'gal-' + Date.now(),
      imageUrl: newGalImgUrl,
      category: newGalCategory,
      caption: newGalCaption
    };

    const updated = [...gallery, newItem];
    LocalDb.saveGallery(updated);
    setGallery(updated);
    window.dispatchEvent(new Event('aem_db_update'));
    triggerToast('Photo added to work gallery!');

    setNewGalCaption('');
  };

  const handleDeleteGalleryItem = (id: string) => {
    if (!window.confirm('Delete this gallery photo?')) return;
    const filtered = gallery.filter(g => g.id !== id);
    LocalDb.saveGallery(filtered);
    setGallery(filtered);
    window.dispatchEvent(new Event('aem_db_update'));
    triggerToast('Photo removed from gallery.');
  };

  // Count helper functions for Stats Panel
  const pendingEnquiriesCount = enquiries.filter(e => e.status === 'New').length;
  const contactedEnquiriesCount = enquiries.filter(e => e.status === 'Contacted').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-charcoal bg-noise flex items-center justify-center p-4">
        {/* Industry blueprints detail overlay */}
        <div className="absolute inset-0 bg-grid-blueprint opacity-10 pointer-events-none"></div>

        <div className="max-w-md w-full bg-charcoal-light border border-charcoal-medium rounded-lg p-8 shadow-2xl relative">
          {/* Yellow strip detail on side */}
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-primary"></div>
          
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-white font-display">
              <span className="font-bebas text-2xl tracking-wider text-primary">ARUL</span>
              <span className="font-display font-light text-[10px] tracking-[0.2em] text-white">EARTH MOVERS</span>
            </Link>
            <h2 className="text-xl font-bold font-display text-white mt-4">Admin Dashboard Login</h2>
            <p className="text-gray-500 text-xs mt-1">Configure business settings & check database logs.</p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-950/50 border border-red-500/30 text-red-200 text-xs font-bold rounded flex items-center gap-2">
              <AlertCircle size={14} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Lock size={12} className="text-primary" /> Admin Security Key
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (default: admin123)"
                className="w-full bg-charcoal border border-charcoal-medium text-white px-4 py-3 rounded text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary hover:bg-primary-hover text-charcoal font-black text-xs uppercase tracking-widest rounded transition-all shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              ACCESS DASHBOARD
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-charcoal-medium/50 text-center">
            <Link to="/" className="text-xs text-gray-400 hover:text-primary transition-colors">
              ← Back to Main Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal bg-noise text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-primary text-charcoal px-4 py-3.5 rounded font-bold text-xs uppercase tracking-widest shadow-2xl flex items-center gap-2 border border-primary/20 animate-fade-in-right">
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-charcoal border-b border-charcoal-medium py-4 px-6 flex justify-between items-center bg-noise">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-display">
            <span className="font-bebas text-2xl tracking-wider text-primary">ARUL</span>
            <span className="font-display font-light text-[10px] tracking-[0.2em] text-white">EARTH MOVERS</span>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest border border-charcoal-medium px-2 py-0.5 rounded ml-2">
              Demo Panel
            </span>
          </Link>
          
          <Link to="/" className="text-xs text-gray-400 hover:text-primary hidden sm:inline transition-colors">
            View Live Site
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded border border-charcoal-medium hover:border-red-500 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
        >
          <LogOut size={14} />
          <span>LOGOUT</span>
        </button>
      </header>

      {/* Main Layout grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Stats Overview bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stat 1: JCB Availability */}
          <div className="bg-charcoal-light border border-charcoal-medium rounded p-5 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">Live JCB Status</span>
                <span className="text-2xl font-bold mt-1 font-display block">
                  {jcbStatus.availability}
                </span>
              </div>
              <span className={`w-3 h-3 rounded-full ${
                jcbStatus.availability === 'Available' ? 'bg-green-500 animate-pulse' : 
                jcbStatus.availability === 'Limited' ? 'bg-amber-500' : 'bg-red-500'
              }`}></span>
            </div>
            <span className="text-[11px] text-gray-400 mt-2 block">Rate: ₹{jcbStatus.hourlyPrice.toLocaleString('en-IN')}/hour</span>
          </div>

          {/* Stat 2: New Enquiries */}
          <div className="bg-charcoal-light border border-charcoal-medium rounded p-5">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">New Enquiries</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-display text-primary">{pendingEnquiriesCount}</span>
              <span className="text-xs text-gray-400 font-semibold">Pending Action</span>
            </div>
            <span className="text-[11px] text-gray-400 mt-2 block">Total Logged: {enquiries.length}</span>
          </div>

          {/* Stat 3: Confirmed / Running */}
          <div className="bg-charcoal-light border border-charcoal-medium rounded p-5">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">Active Contacted</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-display text-white">{contactedEnquiriesCount}</span>
              <span className="text-xs text-gray-400 font-semibold">Customers</span>
            </div>
            <span className="text-[11px] text-gray-400 mt-2 block">Confirmed: {enquiries.filter(e => e.status === 'Confirmed').length}</span>
          </div>

          {/* Stat 4: Material Types */}
          <div className="bg-charcoal-light border border-charcoal-medium rounded p-5">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">Material Showcase</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-display text-white">{materials.length}</span>
              <span className="text-xs text-gray-400 font-semibold">In Stock Listings</span>
            </div>
            <span className="text-[11px] text-gray-400 mt-2 block">Active: {materials.filter(m => m.availability).length} products</span>
          </div>
        </div>

        {/* Workspace Shell */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Navigation Menu */}
          <div className="lg:col-span-3 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('jcb')}
              className={`w-full text-left px-4 py-3 rounded text-xs font-bold uppercase tracking-widest border transition-all flex items-center gap-3 ${
                activeTab === 'jcb'
                  ? 'bg-primary text-charcoal border-primary'
                  : 'bg-charcoal-light border-charcoal-medium text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              <Hammer size={16} />
              <span>JCB Machine Config</span>
            </button>

            <button
              onClick={() => setActiveTab('enquiries')}
              className={`w-full text-left px-4 py-3 rounded text-xs font-bold uppercase tracking-widest border transition-all flex items-center gap-3 justify-between ${
                activeTab === 'enquiries'
                  ? 'bg-primary text-charcoal border-primary'
                  : 'bg-charcoal-light border-charcoal-medium text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <Inbox size={16} />
                <span>Enquiries Logs</span>
              </div>
              {pendingEnquiriesCount > 0 && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                  activeTab === 'enquiries' ? 'bg-charcoal text-white' : 'bg-primary text-charcoal'
                }`}>
                  {pendingEnquiriesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('materials')}
              className={`w-full text-left px-4 py-3 rounded text-xs font-bold uppercase tracking-widest border transition-all flex items-center gap-3 ${
                activeTab === 'materials'
                  ? 'bg-primary text-charcoal border-primary'
                  : 'bg-charcoal-light border-charcoal-medium text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              <Truck size={16} />
              <span>Material Catalog</span>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`w-full text-left px-4 py-3 rounded text-xs font-bold uppercase tracking-widest border transition-all flex items-center gap-3 ${
                activeTab === 'testimonials'
                  ? 'bg-primary text-charcoal border-primary'
                  : 'bg-charcoal-light border-charcoal-medium text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              <MessageSquare size={16} />
              <span>Testimonials</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full text-left px-4 py-3 rounded text-xs font-bold uppercase tracking-widest border transition-all flex items-center gap-3 ${
                activeTab === 'gallery'
                  ? 'bg-primary text-charcoal border-primary'
                  : 'bg-charcoal-light border-charcoal-medium text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              <ImageIcon size={16} />
              <span>Worksite Gallery</span>
            </button>
          </div>

          {/* Right Workspace Content */}
          <div className="lg:col-span-9 bg-charcoal-light border border-charcoal-medium rounded p-6 relative">
            {/* Strip detail top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-stripes opacity-30"></div>

            {/* TAB 1: JCB CONFIG */}
            {activeTab === 'jcb' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-display">JCB Availability & Rate Configuration</h3>
                  <p className="text-gray-500 text-xs">These values update dynamically on the home page calculators and pricing badges.</p>
                </div>

                <form onSubmit={handleSaveJcb} className="space-y-5 max-w-xl">
                  {/* Hourly Rate */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5">JCB Hourly Rate (₹)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={jcbRateInput}
                      onChange={(e) => setJcbRateInput(parseInt(e.target.value) || 0)}
                      className="w-full bg-charcoal border border-charcoal-medium text-white px-4 py-3 rounded text-xs focus:border-primary focus:outline-none"
                    />
                  </div>

                  {/* Availability selection */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5">Machine Availability Status</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['Available', 'Limited', 'Booked'] as const).map((statusOption) => (
                        <button
                          key={statusOption}
                          type="button"
                          onClick={() => setJcbAvailabilityInput(statusOption)}
                          className={`py-3.5 px-3 border rounded text-xs font-bold uppercase tracking-wider transition-colors ${
                            jcbAvailabilityInput === statusOption
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-charcoal border-charcoal-medium text-gray-400 hover:border-gray-700'
                          }`}
                        >
                          {statusOption}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Operator Included toggle */}
                  <div className="flex items-center justify-between p-3.5 bg-charcoal rounded border border-charcoal-medium">
                    <div>
                      <span className="text-xs font-bold block">Operator & Fuel Included?</span>
                      <span className="text-[10px] text-gray-500">Toggles the display terms on the estimator</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setJcbOperatorInput(!jcbOperatorInput)}
                      className="text-primary hover:text-primary-hover focus:outline-none"
                    >
                      {jcbOperatorInput ? <ToggleRight size={36} /> : <ToggleLeft size={36} className="text-gray-500" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary hover:bg-primary-hover text-charcoal font-black text-xs uppercase tracking-widest rounded transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Save size={14} />
                    <span>SAVE CHANGES</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: ENQUIRIES */}
            {activeTab === 'enquiries' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold font-display">Customer Enquiries & Bookings ({enquiries.length})</h3>
                    <p className="text-gray-500 text-xs">Submitted live from the Quick Booking form, project estimator, and contact page.</p>
                  </div>
                </div>

                {enquiries.length > 0 ? (
                  <div className="space-y-4">
                    {enquiries.map((enq) => (
                      <div
                        key={enq.id}
                        className="bg-charcoal border border-charcoal-medium rounded p-5 relative space-y-4"
                      >
                        {/* Enquiry Header */}
                        <div className="flex flex-wrap justify-between items-start gap-3 border-b border-charcoal-medium/50 pb-3">
                          <div>
                            <span className="font-bold text-sm text-white block">{enq.name}</span>
                            <a href={`tel:${enq.phone}`} className="text-xs text-primary font-semibold hover:underline">
                              📞 {enq.phone}
                            </a>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-[10px] text-gray-500 font-bold">
                              {new Date(enq.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>

                            {/* Status badges select */}
                            <select
                              value={enq.status}
                              onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value as any)}
                              className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded border focus:outline-none ${
                                enq.status === 'New' ? 'bg-primary text-charcoal border-primary' :
                                enq.status === 'Contacted' ? 'bg-amber-600/10 text-amber-400 border-amber-500/20' :
                                enq.status === 'Confirmed' ? 'bg-green-600/10 text-green-400 border-green-500/20' :
                                'bg-gray-800 text-gray-400 border-gray-700'
                              }`}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                            </select>

                            <button
                              onClick={() => handleDeleteEnquiry(enq.id)}
                              className="text-gray-500 hover:text-red-500 transition-colors p-1"
                              title="Delete Enquiry"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-gray-500 font-bold uppercase tracking-wider block mb-0.5">Service</span>
                            <span className="font-semibold text-white">{enq.service}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 font-bold uppercase tracking-wider block mb-0.5">Hours</span>
                            <span className="font-semibold text-white">{enq.hours} Hours</span>
                          </div>
                          <div>
                            <span className="text-gray-500 font-bold uppercase tracking-wider block mb-0.5">Preferred Date</span>
                            <span className="font-semibold text-white">{enq.date || 'Asap'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 font-bold uppercase tracking-wider block mb-0.5">Site Location</span>
                            <span className="font-semibold text-white flex items-center gap-1">
                              <MapPin size={10} className="text-primary" /> {enq.location}
                            </span>
                          </div>
                        </div>

                        {enq.message && (
                          <div className="p-3 bg-charcoal-light rounded border border-charcoal-medium text-xs text-gray-400 leading-normal">
                            {enq.message}
                          </div>
                        )}

                        {/* WhatsApp direct contact */}
                        <a
                          href={`https://wa.me/91${enq.phone}?text=${encodeURIComponent(`Hello ${enq.name}, relative to your enquiry with Arul Earth Movers for ${enq.service} at ${enq.location}...`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-green-400 hover:text-green-300"
                        >
                          <MessageSquare size={12} />
                          <span>Chat with Customer on WhatsApp</span>
                        </a>

                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500 border border-dashed border-charcoal-medium rounded">
                    <Inbox size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No enquiries logged yet. Fill out contact forms on website to see them appear here.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: MATERIALS */}
            {activeTab === 'materials' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-display">Manage Materials Listings ({materials.length})</h3>
                  <p className="text-gray-500 text-xs">Add and delete sand / aggregate listings for the public showcase.</p>
                </div>

                {/* Add Material Form */}
                <form onSubmit={handleAddMaterial} className="bg-charcoal border border-charcoal-medium rounded p-5 space-y-4">
                  <h4 className="font-bold text-sm text-primary flex items-center gap-1">
                    <Plus size={16} /> Add New Material listing
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Name</label>
                      <input
                        type="text"
                        required
                        value={newMatName}
                        onChange={(e) => setNewMatName(e.target.value)}
                        placeholder="e.g. Premium Plastering Sand"
                        className="w-full bg-charcoal-light border border-charcoal-medium text-white px-3 py-2 rounded text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Estimated Cost / Pricing display</label>
                      <input
                        type="text"
                        required
                        value={newMatPrice}
                        onChange={(e) => setNewMatPrice(e.target.value)}
                        placeholder="e.g. Market Rate"
                        className="w-full bg-charcoal-light border border-charcoal-medium text-white px-3 py-2 rounded text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Description</label>
                    <textarea
                      required
                      rows={2}
                      value={newMatDesc}
                      onChange={(e) => setNewMatDesc(e.target.value)}
                      placeholder="Add sand grains, sieve washes and grading specifications..."
                      className="w-full bg-charcoal-light border border-charcoal-medium text-white px-3 py-2 rounded text-xs focus:outline-none"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Stock Availability</label>
                      <select
                        value={newMatAvail ? 'true' : 'false'}
                        onChange={(e) => setNewMatAvail(e.target.value === 'true')}
                        className="w-full bg-charcoal-light border border-charcoal-medium text-white px-3 py-2 rounded text-xs focus:outline-none"
                      >
                        <option value="true">In Stock / Available</option>
                        <option value="false">Out of Stock</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Product Photo</label>
                      <select
                        value={newMatImg}
                        onChange={(e) => setNewMatImg(e.target.value)}
                        className="w-full bg-charcoal-light border border-charcoal-medium text-white px-3 py-2 rounded text-xs focus:outline-none"
                      >
                        <option value="/images/m_sand.png">M-Sand Pile Image</option>
                        <option value="/images/b_sand.png">B-Sand Pile Image</option>
                        <option value="/images/crusher.png">Crusher Stones Image</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary hover:bg-primary-hover text-charcoal font-black text-xs uppercase tracking-widest rounded transition-colors cursor-pointer"
                  >
                    ADD LISTING
                  </button>
                </form>

                {/* Active Materials list */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-gray-400 uppercase tracking-widest">Active Listings</h4>
                  
                  {materials.map((mat) => (
                    <div
                      key={mat.id}
                      className="bg-charcoal border border-charcoal-medium rounded p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img src={mat.image} alt={mat.name} className="w-12 h-12 object-cover rounded border border-charcoal-medium" />
                        <div>
                          <span className="font-bold text-sm text-white block">{mat.name}</span>
                          <span className="text-[10px] text-gray-400 line-clamp-1">{mat.description}</span>
                          <span className="text-[10px] text-primary font-semibold block mt-0.5">{mat.price}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteMaterial(mat.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors p-2"
                        title="Delete Listing"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: TESTIMONIALS */}
            {activeTab === 'testimonials' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-display">Manage Testimonials & Reviews ({testimonials.length})</h3>
                  <p className="text-gray-500 text-xs">Verify, add and moderate customer reviews displayed on the website.</p>
                </div>

                {/* Add Review Form */}
                <form onSubmit={handleAddTestimonial} className="bg-charcoal border border-charcoal-medium rounded p-5 space-y-4">
                  <h4 className="font-bold text-sm text-primary flex items-center gap-1">
                    <Plus size={16} /> Add Custom Testimonial
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Author Name</label>
                      <input
                        type="text"
                        required
                        value={newTestAuthor}
                        onChange={(e) => setNewTestAuthor(e.target.value)}
                        placeholder="e.g. Murugan K."
                        className="w-full bg-charcoal-light border border-charcoal-medium text-white px-3 py-2 rounded text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Role / Designation</label>
                      <input
                        type="text"
                        required
                        value={newTestRole}
                        onChange={(e) => setNewTestRole(e.target.value)}
                        placeholder="e.g. Mason Contractor"
                        className="w-full bg-charcoal-light border border-charcoal-medium text-white px-3 py-2 rounded text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Rating</label>
                    <select
                      value={newTestRating}
                      onChange={(e) => setNewTestRating(parseInt(e.target.value))}
                      className="w-full bg-charcoal-light border border-charcoal-medium text-white px-3 py-2 rounded text-xs focus:outline-none"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                      <option value="3">⭐⭐⭐ (3 Stars)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Review Text</label>
                    <textarea
                      required
                      rows={2}
                      value={newTestContent}
                      onChange={(e) => setNewTestContent(e.target.value)}
                      placeholder="Write review testimonial content..."
                      className="w-full bg-charcoal-light border border-charcoal-medium text-white px-3 py-2 rounded text-xs focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary hover:bg-primary-hover text-charcoal font-black text-xs uppercase tracking-widest rounded transition-colors cursor-pointer"
                  >
                    ADD TESTIMONIAL
                  </button>
                </form>

                {/* Testimonial logs */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-gray-400 uppercase tracking-widest">Active Testimonials</h4>
                  {testimonials.map((t) => (
                    <div
                      key={t.id}
                      className="bg-charcoal border border-charcoal-medium rounded p-4 flex justify-between items-start gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{t.author}</span>
                          <span className="text-[10px] text-gray-500">({t.role})</span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1 italic">"{t.content}"</p>
                        <span className="text-[9px] text-primary font-bold block mt-2">Rating: {t.rating}/5 Stars</span>
                      </div>

                      <button
                        onClick={() => handleDeleteTestimonial(t.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors p-2"
                        title="Delete Review"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: GALLERY */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-display">Manage Worksite Gallery ({gallery.length})</h3>
                  <p className="text-gray-500 text-xs">Add images to show off JCB machinery at worksites.</p>
                </div>

                {/* Add Gallery Form */}
                <form onSubmit={handleAddGalleryItem} className="bg-charcoal border border-charcoal-medium rounded p-5 space-y-4">
                  <h4 className="font-bold text-sm text-primary flex items-center gap-1">
                    <Plus size={16} /> Add Photo to Gallery
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Image URL Placeholder</label>
                      <select
                        value={newGalImgUrl}
                        onChange={(e) => setNewGalImgUrl(e.target.value)}
                        className="w-full bg-charcoal-light border border-charcoal-medium text-white px-3 py-2 rounded text-xs focus:outline-none"
                      >
                        <option value="/images/jcb_hero.png">Tamil Nadu JCB Site Image</option>
                        <option value="/images/m_sand.png">M-Sand Heap Photo</option>
                        <option value="/images/b_sand.png">B-Sand Heap Photo</option>
                        <option value="/images/crusher.png">Crusher stone aggregates</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Category Filter</label>
                      <select
                        value={newGalCategory}
                        onChange={(e) => setNewGalCategory(e.target.value as any)}
                        className="w-full bg-charcoal-light border border-charcoal-medium text-white px-3 py-2 rounded text-xs focus:outline-none"
                      >
                        <option value="JCB">JCB Work</option>
                        <option value="Earthwork">Earthwork / Levelling</option>
                        <option value="Materials">Materials delivery</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Photo Caption</label>
                    <input
                      type="text"
                      required
                      value={newGalCaption}
                      onChange={(e) => setNewGalCaption(e.target.value)}
                      placeholder="e.g. Digging foundation trenches for a building layout in Kallakurichi Town"
                      className="w-full bg-charcoal-light border border-charcoal-medium text-white px-3 py-2 rounded text-xs focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary hover:bg-primary-hover text-charcoal font-black text-xs uppercase tracking-widest rounded transition-colors cursor-pointer"
                  >
                    UPLOAD TO GALLERY
                  </button>
                </form>

                {/* Gallery List items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {gallery.map((g) => (
                    <div
                      key={g.id}
                      className="bg-charcoal border border-charcoal-medium rounded overflow-hidden relative group"
                    >
                      <img src={g.imageUrl} alt={g.caption} className="w-full aspect-[4/3] object-cover" />
                      <div className="p-3 bg-charcoal bg-noise">
                        <span className="text-[9px] text-primary font-bold uppercase tracking-widest">{g.category}</span>
                        <p className="text-[11px] text-gray-400 line-clamp-2 leading-tight mt-1">{g.caption}</p>
                        
                        <button
                          onClick={() => handleDeleteGalleryItem(g.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/75 hover:bg-red-600 text-white transition-colors"
                          title="Delete Photo"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
export default Admin;
