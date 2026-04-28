import { motion } from 'motion/react';
import { ShoppingCart, ArrowDown } from 'lucide-react';

interface HeroProps {
  headline: string;
  description: string;
  image: string;
}

export default function Hero({ headline, description, image }: HeroProps) {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 -z-10 w-2/3 h-full bg-gradient-to-bl from-primary-yellow/20 to-transparent rounded-bl-[150px]" />
      <div className="absolute top-40 left-10 -z-10 w-48 h-48 bg-primary-yellow/30 rounded-full blur-[80px]" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 bg-white text-primary-brown px-5 py-2 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm border border-primary-yellow/30">
            <span>🔥</span> Camilan Viral 2024
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black text-primary-brown leading-[1.1] tracking-tighter">
            {headline}
          </h1>
          <p className="text-xl md:text-2xl text-primary-brown/80 leading-relaxed max-w-xl font-medium">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <a 
              href="#produk"
              className="flex items-center justify-center gap-3 bg-primary-brown text-white text-center text-lg font-bold px-10 py-4 rounded-full hover:bg-accent-brown transition-all shadow-xl hover:-translate-y-1 hover:shadow-2xl"
            >
              <ShoppingCart size={22} />
              Beli Sekarang
            </a>
            <a 
              href="#tentang"
              className="flex items-center justify-center gap-3 bg-white text-primary-brown border-2 border-primary-brown/10 text-center text-lg font-bold px-10 py-4 rounded-full hover:bg-primary-yellow/10 transition-all hover:-translate-y-1"
            >
              Kepoin Dulu
              <ArrowDown size={20} />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: 'spring' }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-yellow/40 to-primary-yellow/10 rounded-[40px] rotate-6 -z-10 blur-md" />
          <div className="absolute inset-0 bg-primary-yellow rounded-[40px] rotate-3 -z-10 shadow-inner" />
          <div className="bg-white p-3 rounded-[40px] shadow-2xl overflow-hidden border-4 border-white/50 backdrop-blur-sm">
            <img 
              src={image} 
              alt="Keripik Bawang"
              className="w-full h-auto aspect-[4/5] object-cover rounded-[32px] hover:scale-110 transition-transform duration-1000 origin-center"
            />
          </div>
          
          {/* Decorative badges */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-6 -right-6 bg-white p-4 rounded-3xl shadow-xl flex items-center gap-4 border border-primary-yellow/30"
          >
            <div className="w-12 h-12 bg-primary-yellow rounded-2xl flex items-center justify-center text-primary-brown font-display font-black text-xl shadow-inner">
              100%
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kualitas</p>
              <p className="text-base font-black text-primary-brown">Bahan Premium</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
