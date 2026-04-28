import { motion } from 'motion/react';
import { ShoppingBasket, ArrowRight, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductListProps {
  products: Product[];
  whatsappNumber: string;
}

export default function ProductList({ products, whatsappNumber }: ProductListProps) {
  const handleOrder = (productName: string) => {
    const message = encodeURIComponent(`Halo Snack Asik! Saya mau pesan ${productName}. Bisa dibantu?`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <section id="produk" className="py-20 bg-bg-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-display font-black text-primary-brown tracking-tighter">
              Pilih Porsi <span className="text-primary-yellow">Ngemilmu!</span>
            </h2>
            <p className="text-lg text-primary-brown/70 max-w-xl font-medium">
              Dari yang pas di kantong sampai yang puas buat sharing. Bebas pilih sesuai sikonmu hari ini.
            </p>
          </div>
          <a href="#" className="flex items-center gap-2 text-primary-brown font-bold hover:gap-4 transition-all">
            Lihat Katalog Lengkap <ArrowRight size={20} className="text-primary-yellow" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: "spring" }}
              viewport={{ once: true }}
              className="bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group border-2 border-transparent hover:border-primary-yellow/20"
            >
              <div className="aspect-[4/3] overflow-hidden relative p-4 bg-gradient-to-t from-gray-50 to-white">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded-[32px] group-hover:scale-110 transition-transform duration-700 shadow-sm"
                />
                
                <div className="absolute top-8 right-8 bg-primary-yellow text-primary-brown font-black px-4 py-1.5 rounded-full text-sm shadow-md flex items-center gap-1">
                  <Star size={14} className="fill-primary-brown" /> 
                  {product.weight || '50g'}
                </div>
              </div>
              
              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-primary-brown mb-2 tracking-tight group-hover:text-primary-yellow transition-colors">{product.name}</h3>
                  <p className="text-primary-brown/60 text-sm line-clamp-2 leading-relaxed font-medium">
                    {product.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-3xl font-display font-black text-primary-brown">
                    {product.price}
                  </span>
                  <button 
                    onClick={() => handleOrder(product.name)}
                    className="flex items-center gap-2 bg-primary-yellow text-primary-brown px-6 py-3.5 rounded-2xl hover:bg-primary-brown hover:text-white transition-all group-hover:scale-105 shadow-md hover:shadow-xl"
                  >
                    <ShoppingBasket size={20} />
                    <span className="font-bold">Beli</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
