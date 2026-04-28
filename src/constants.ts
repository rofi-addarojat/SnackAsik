import { SiteSettings, Product, FAQ, Testimonial } from './types';

export const defaultSettings: SiteSettings = {
  headline: "Keripik Bawang Paling Kriuk! Gurihnya Bikin Susah Berhenti.",
  description: "Rahasia resep warisan dengan bahan pilihan. Sekali gigit, sensasi renyah dan gurihnya bakal bikin kamu ketagihan. Teman paling pas buat segala suasana!",
  heroImage: "https://images.unsplash.com/photo-1613919113166-704944fd6ab9?auto=format&fit=crop&q=80&w=800",
  whatsappNumber: "089652074866",
  location: "Jl. Kubang Welingi",
};

export const defaultProducts: Product[] = [
  {
    id: 'p1',
    name: "Pouch Praktis 50g",
    price: "Rp 5.000",
    description: "Porsi pas buat nemenin nugas atau drakoran. Gak bikin eneg, renyahnya awet!",
    weight: "50g",
    imageUrl: "https://images.unsplash.com/photo-1599490659213-e2b9527bb087?auto=format&fit=crop&q=80&w=400",
    order: 1
  }
];

export const defaultFAQs: FAQ[] = [
  {
    id: 'f1',
    question: "Tahan berapa lama kerenyahannya?",
    answer: "Sangat awet! Simpan di wadah rapat dan tertutup, kerenyahannya bisa tahan berminggu-minggu di suhu ruang.",
    order: 1
  }
];

export const defaultTestimonials: Testimonial[] = [
  {
    id: 't1',
    name: "Sinta Rahmawati",
    text: "Gila sih ini keripik ter-kriuk yang pernah aku coba. Bawangnya berasa banget, tapi ga lebay. Buat temen nonton Netflix emang paling the best!",
    role: "Pecinta Cemilan Asin",
    order: 1
  }
];
