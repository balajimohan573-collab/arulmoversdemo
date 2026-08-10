// LocalStorage Database helper for Arul Earth Movers Static Demo
import { businessConfig } from "../config/businessConfig";

export interface JcbStatus {
  availability: 'Available' | 'Limited' | 'Booked';
  hourlyPrice: number;
  operatorIncluded: boolean;
}

export interface Material {
  id: string;
  name: string;
  description: string;
  price: string;
  availability: boolean;
  image: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  rating: number;
  content: string;
  date: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  category: 'JCB' | 'Earthwork' | 'Materials';
  caption: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  service: string;
  location: string;
  hours: number;
  date: string;
  message: string;
  timestamp: string;
  status: 'New' | 'Contacted' | 'Confirmed' | 'Completed';
}

const DEFAULT_JCB_STATUS: JcbStatus = {
  availability: 'Available',
  hourlyPrice: businessConfig.jcbHourlyPrice,
  operatorIncluded: businessConfig.operatorIncluded,
};

const DEFAULT_MATERIALS: Material[] = [
  {
    id: 'mat-1',
    name: 'M-Sand (Manufactured Sand)',
    description: 'High-quality washed manufactured sand, the perfect replacement for river sand in concreting and masonry.',
    price: 'Market Rate (Call for Quote)',
    availability: true,
    image: '/images/m_sand.png',
  },
  {
    id: 'mat-2',
    name: 'B-Sand (Plastering Sand)',
    description: 'Premium plastering sand (B-sand) for smooth wall finishes, mortar preparation, and ceiling plastering.',
    price: 'Market Rate (Call for Quote)',
    availability: true,
    image: '/images/b_sand.png',
  },
  {
    id: 'mat-3',
    name: 'Crusher Aggregates / Blue Metal',
    description: 'Graded blue metal aggregate stones (12mm, 20mm, 40mm) and GSB for durable concrete mixes and road layouts.',
    price: 'Market Rate (Call for Quote)',
    availability: true,
    image: '/images/crusher.png',
  },
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    author: 'Senthil Kumar',
    role: 'Local Civil Contractor',
    rating: 5,
    content: 'Excellent JCB service in Kallakurichi area. The operator is highly skilled, understands site levelling perfectly, and the machine arrived on time as promised.',
    date: '2026-07-28',
  },
  {
    id: 'test-2',
    author: 'Ramanathan G.',
    role: 'Home Owner, Kallakurichi',
    rating: 5,
    content: 'Booked their JCB for foundation excavation. Clear pricing of ₹1,000/hour with no hidden costs. The process was transparent and simple to schedule.',
    date: '2026-08-02',
  },
  {
    id: 'test-3',
    author: 'K. Vetrivel',
    role: 'Developer, V-Builders',
    rating: 5,
    content: 'We source all our construction sand (M-sand and B-sand) from Arul Earth Movers. Consistently clean, fast delivery, and very competitive prices.',
    date: '2026-08-05',
  },
];

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    imageUrl: '/images/jcb_hero.png',
    category: 'JCB',
    caption: 'JCB Excavator at a residential foundation digging site in Kallakurichi.',
  },
  {
    id: 'gal-2',
    imageUrl: '/images/m_sand.png',
    category: 'Materials',
    caption: 'High-quality Manufactured Sand (M-Sand) ready for delivery.',
  },
  {
    id: 'gal-3',
    imageUrl: '/images/b_sand.png',
    category: 'Materials',
    caption: 'Washed Plastering Sand (B-Sand) loaded for transport.',
  },
  {
    id: 'gal-4',
    imageUrl: '/images/crusher.png',
    category: 'Materials',
    caption: 'Crushed stone aggregate supplies (Blue Metal) graded for concrete.',
  },
];

const DEFAULT_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-1',
    name: 'Muthu Krishnan',
    phone: '9876543210',
    service: 'Site Levelling',
    location: 'Kacharapalayam Road, Kallakurichi',
    hours: 8,
    date: '2026-08-12',
    message: 'Need plot levelling for residential construction. The site is about 2400 sq.ft.',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'New',
  },
];

const DB_KEYS = {
  JCB_STATUS: 'aem_jcb_status',
  MATERIALS: 'aem_materials',
  TESTIMONIALS: 'aem_testimonials',
  GALLERY: 'aem_gallery',
  ENQUIRIES: 'aem_enquiries',
};

// Database class
export class LocalDb {
  static getJcbStatus(): JcbStatus {
    const data = localStorage.getItem(DB_KEYS.JCB_STATUS);
    if (!data) {
      localStorage.setItem(DB_KEYS.JCB_STATUS, JSON.stringify(DEFAULT_JCB_STATUS));
      return DEFAULT_JCB_STATUS;
    }
    return JSON.parse(data);
  }

  static saveJcbStatus(status: JcbStatus): void {
    localStorage.setItem(DB_KEYS.JCB_STATUS, JSON.stringify(status));
  }

  static getMaterials(): Material[] {
    const data = localStorage.getItem(DB_KEYS.MATERIALS);
    if (!data) {
      localStorage.setItem(DB_KEYS.MATERIALS, JSON.stringify(DEFAULT_MATERIALS));
      return DEFAULT_MATERIALS;
    }
    return JSON.parse(data);
  }

  static saveMaterials(materials: Material[]): void {
    localStorage.setItem(DB_KEYS.MATERIALS, JSON.stringify(materials));
  }

  static getTestimonials(): Testimonial[] {
    const data = localStorage.getItem(DB_KEYS.TESTIMONIALS);
    if (!data) {
      localStorage.setItem(DB_KEYS.TESTIMONIALS, JSON.stringify(DEFAULT_TESTIMONIALS));
      return DEFAULT_TESTIMONIALS;
    }
    return JSON.parse(data);
  }

  static saveTestimonials(testimonials: Testimonial[]): void {
    localStorage.setItem(DB_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
  }

  static getGallery(): GalleryItem[] {
    const data = localStorage.getItem(DB_KEYS.GALLERY);
    if (!data) {
      localStorage.setItem(DB_KEYS.GALLERY, JSON.stringify(DEFAULT_GALLERY));
      return DEFAULT_GALLERY;
    }
    return JSON.parse(data);
  }

  static saveGallery(gallery: GalleryItem[]): void {
    localStorage.setItem(DB_KEYS.GALLERY, JSON.stringify(gallery));
  }

  static getEnquiries(): Enquiry[] {
    const data = localStorage.getItem(DB_KEYS.ENQUIRIES);
    if (!data) {
      localStorage.setItem(DB_KEYS.ENQUIRIES, JSON.stringify(DEFAULT_ENQUIRIES));
      return DEFAULT_ENQUIRIES;
    }
    return JSON.parse(data);
  }

  static saveEnquiries(enquiries: Enquiry[]): void {
    localStorage.setItem(DB_KEYS.ENQUIRIES, JSON.stringify(enquiries));
  }

  static addEnquiry(enquiry: Omit<Enquiry, 'id' | 'timestamp' | 'status'>): Enquiry {
    const enquiries = this.getEnquiries();
    const newEnquiry: Enquiry = {
      ...enquiry,
      id: 'enq-' + Date.now(),
      timestamp: new Date().toISOString(),
      status: 'New',
    };
    enquiries.unshift(newEnquiry);
    this.saveEnquiries(enquiries);
    return newEnquiry;
  }
}
