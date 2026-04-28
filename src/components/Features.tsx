import { motion } from 'motion/react';
import { Wheat, Zap, ChefHat, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: Wheat,
    title: "Bahan Premium",
    desc: "Tepung pilihan & bawang merah lokal terbaik.",
    color: "bg-amber-100 text-amber-700"
  },
  {
    icon: Zap,
    title: "Kriuk Maksimal",
    desc: "Tekstur super renyah, gak bikin gigi ngilu.",
    color: "bg-yellow-100 text-yellow-700"
  },
  {
    icon: ChefHat,
    title: "Bumbu Meresap",
    desc: "Racikan rahasia turun temurun yang bikin nagih.",
    color: "bg-orange-100 text-orange-700"
  },
  {
    icon: ShieldCheck,
    title: "100% Higienis",
    desc: "Digoreng dengan minyak baru, bersih & aman.",
    color: "bg-stone-100 text-stone-700"
  }
];

export default function Features() {
  return (
    <section className="py-20 relative bg-bg-cream">
      {/* Decorative bg element */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[300px] bg-primary-yellow/5 skew-y-3 -z-10" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: "spring" }}
              viewport={{ once: true }}
              className="p-8 rounded-[40px] bg-white border-2 border-transparent shadow-sm hover:shadow-2xl hover:border-primary-yellow/20 hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className={`w-16 h-16 rounded-3xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner`}>
                <feature.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-primary-brown mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-primary-brown/60 text-sm leading-relaxed font-medium">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
