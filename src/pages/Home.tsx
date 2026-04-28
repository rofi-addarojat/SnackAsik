import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SiteSettings, Product, Testimonial, FAQ } from '../types';
import { defaultSettings, defaultProducts, defaultTestimonials, defaultFAQs } from '../constants';

import Hero from '../components/Hero';
import Features from '../components/Features';
import ProductList from '../components/ProductList';
import Education from '../components/Education';
import Testimonials from '../components/Testimonials';
import FAQSection from '../components/FAQ';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Settings
        const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
        if (settingsDoc.exists()) {
          setSettings({ ...defaultSettings, ...settingsDoc.data() } as SiteSettings);
        }

        // Fetch Products
        const productsQuery = query(collection(db, 'products'), orderBy('order', 'asc'));
        const productsSnap = await getDocs(productsQuery);
        const productsList = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(productsList.length > 0 ? productsList : defaultProducts);

        // Fetch Testimonials
        const testimonialsQuery = query(collection(db, 'testimonials'), orderBy('order', 'asc'));
        const testimonialsSnap = await getDocs(testimonialsQuery);
        const testimonialsList = testimonialsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
        setTestimonials(testimonialsList.length > 0 ? testimonialsList : defaultTestimonials);

        // Fetch FAQs
        const faqsQuery = query(collection(db, 'faqs'), orderBy('order', 'asc'));
        const faqsSnap = await getDocs(faqsQuery);
        const faqsList = faqsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as FAQ));
        setFaqs(faqsList.length > 0 ? faqsList : defaultFAQs);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-cream flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-primary-yellow animate-spin mb-4" />
        <p className="text-primary-brown font-bold text-xl">Menyiapkan Cemilan Asik...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <Hero 
        headline={settings.headline}
        description={settings.description}
        image={settings.heroImage}
      />
      <Features />
      <ProductList 
        products={products} 
        whatsappNumber={settings.whatsappNumber}
      />
      <Education />
      <Testimonials testimonials={testimonials} />
      <FAQSection faqs={faqs} />
    </div>
  );
}
