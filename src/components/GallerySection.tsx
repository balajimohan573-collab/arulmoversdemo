import React, { useState, useEffect } from 'react';
import { LocalDb, type GalleryItem } from '../utils/localStorageDb';
import { Maximize2, X } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'All' | 'JCB' | 'Earthwork' | 'Materials'>('All');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const loadGallery = () => {
      setItems(LocalDb.getGallery());
    };
    loadGallery();
    window.addEventListener('aem_db_update', loadGallery);
    return () => window.removeEventListener('aem_db_update', loadGallery);
  }, []);

  const filteredItems = activeFilter === 'All'
    ? items
    : items.filter(item => item.category === activeFilter);

  const filters: ('All' | 'JCB' | 'Earthwork' | 'Materials')[] = ['All', 'JCB', 'Earthwork', 'Materials'];

  return (
    <div className="space-y-8">
      {/* Category Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all duration-300 ${
              activeFilter === filter
                ? 'bg-primary text-charcoal border border-primary shadow-lg shadow-primary/10'
                : 'bg-charcoal border border-charcoal-medium text-gray-400 hover:text-white hover:border-gray-600'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Grid Layout */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative bg-charcoal border border-charcoal-medium rounded-lg overflow-hidden cursor-pointer shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image Aspect ratio container */}
              <div className="aspect-[4/3] bg-charcoal-light relative overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.caption}
                  className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 group-hover:brightness-100 transition-all duration-500"
                  loading="lazy"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="w-10 h-10 rounded-full bg-primary/95 text-charcoal flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Maximize2 size={16} />
                  </span>
                </div>
              </div>

              {/* Caption and Category tag */}
              <div className="p-4 bg-charcoal bg-noise border-t border-charcoal-medium/50 flex flex-col justify-between">
                <span className="inline-block self-start text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/25 mb-2">
                  {item.category}
                </span>
                <p className="text-gray-300 text-xs font-semibold leading-relaxed line-clamp-2">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500 border border-dashed border-charcoal-medium rounded-lg">
          No works found under this category.
        </div>
      )}

      {/* Lightbox Overlay */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-charcoal text-white hover:text-primary transition-colors focus:outline-none"
            aria-label="Close Lightbox"
          >
            <X size={24} />
          </button>

          {/* Lightbox Content Container */}
          <div
            className="relative max-w-4xl w-full bg-charcoal border border-charcoal-medium rounded-lg overflow-hidden shadow-2xl flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()} // Stop closing click inside card
          >
            {/* Image display */}
            <div className="flex-1 max-h-[80vh] md:max-h-none overflow-hidden bg-black flex items-center justify-center">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.caption}
                className="max-h-[50vh] md:max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Description Details Panel */}
            <div className="w-full md:w-80 bg-charcoal-light p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-charcoal-medium">
              <div>
                <span className="inline-block text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded border border-primary/20 mb-4">
                  {selectedImage.category}
                </span>
                <h4 className="font-display font-bold text-lg text-white mb-2 leading-tight">
                  Arul Earth Movers At Work
                </h4>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                  {selectedImage.caption}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-charcoal-medium flex items-center gap-4">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="w-full py-2 bg-charcoal border border-charcoal-medium hover:border-gray-500 rounded text-xs font-semibold uppercase tracking-wider text-gray-300 transition-colors"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default GallerySection;
