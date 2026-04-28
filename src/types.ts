export interface SiteSettings {
  headline: string;
  description: string;
  heroImage: string;
  whatsappNumber: string;
  shopeeLink?: string;
  tokopediaLink?: string;
  location?: string;
  instagramLink?: string;
  tiktokLink?: string;
  faviconUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  imageUrl: string;
  weight?: string;
  order: number;
  link?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  role?: string;
  avatarUrl?: string;
  order: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}
