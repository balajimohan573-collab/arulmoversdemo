// Business Configuration for Arul Earth Movers
// Easy central config for editing business details

export interface BusinessConfig {
  name: string;
  phone: string;
  phoneRaw: string; // for tel: links
  whatsapp: string; // for whatsapp links (include country code without + or spaces)
  location: string;
  jcbHourlyPrice: number;
  businessHours: string;
  email: string;
  mapsEmbedUrl: string;
  mapsDirectionUrl: string;
  operatorIncluded: boolean;
}

export const businessConfig: BusinessConfig = {
  name: "Arul Earth Movers",
  phone: "+91 98424 56789", // Business owner's phone for display
  phoneRaw: "+919842456789", // Raw format for tel: links
  whatsapp: "919842456789", // WhatsApp format (country code followed by 10 digits, e.g. 919842456789)
  location: "Kallakurichi, Tamil Nadu, India",
  email: "arulearthmovers@gmail.com",
  jcbHourlyPrice: 1000,
  businessHours: "6:00 AM - 9:00 PM (Everyday)",
  // Standard Kallakurichi location map embed
  mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31191.0772224157!2d78.9443657!3d11.7380126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bab07a3c3b0368b%3A0xe543e49e2dc1120f!2sKallakurichi%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  mapsDirectionUrl: "https://maps.app.goo.gl/k3B77kP8B77c5s5u9", // Standard Kallakurichi map search
  operatorIncluded: true, // Configurable setting: Operator is included in hourly pricing
};
