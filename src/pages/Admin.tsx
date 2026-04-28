import { useState, useEffect, FormEvent } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut, 
  User 
} from 'firebase/auth';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy,
  updateDoc
} from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { SiteSettings, Product, Testimonial, FAQ } from '../types';
import { defaultSettings } from '../constants';
import { 
  LayoutDashboard, 
  Settings as SettingsIcon, 
  ShoppingBasket, 
  MessageSquare, 
  HelpCircle, 
  LogOut, 
  Plus, 
  Trash2, 
  Save, 
  Loader2,
  Trash
} from 'lucide-react';

const ADMIN_EMAIL = 'masroficom@gmail.com';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'settings' | 'products' | 'testimonials' | 'faqs'>('settings');
  
  // Data States
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u && u.email === ADMIN_EMAIL) {
        fetchAdminData();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Settings
      const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
      if (settingsDoc.exists()) setSettings(settingsDoc.data() as SiteSettings);

      // Products
      const pSnap = await getDocs(query(collection(db, 'products'), orderBy('order', 'asc')));
      setProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));

      // Testimonials
      const tSnap = await getDocs(query(collection(db, 'testimonials'), orderBy('order', 'asc')));
      setTestimonials(tSnap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial)));

      // FAQ
      const fSnap = await getDocs(query(collection(db, 'faqs'), orderBy('order', 'asc')));
      setFaqs(fSnap.docs.map(d => ({ id: d.id, ...d.data() } as FAQ)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => signOut(auth);

  const saveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const path = 'settings/general';
    try {
      await setDoc(doc(db, 'settings', 'general'), settings);
      alert('Settings saved!');
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    } finally {
      setIsSaving(false);
    }
  };

  const addProduct = async () => {
    const newProd = {
      name: 'Produk Baru',
      price: 'Rp 0',
      description: 'Deskripsi produk baru',
      weight: '50g',
      imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bb087?auto=format&fit=crop&q=80&w=400',
      order: products.length + 1
    };
    const path = 'products';
    try {
      const docRef = await addDoc(collection(db, path), newProd);
      setProducts([...products, { ...newProd, id: docRef.id }]);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  };

  const deleteItem = async (col: string, id: string) => {
    if (!confirm('Yakin ingin menghapus?')) return;
    try {
      await deleteDoc(doc(db, col, id));
      if (col === 'products') setProducts(products.filter(p => p.id !== id));
      if (col === 'testimonials') setTestimonials(testimonials.filter(p => p.id !== id));
      if (col === 'faqs') setFaqs(faqs.filter(p => p.id !== id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, col);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-bg-cream"><Loader2 className="animate-spin text-primary-brown" /></div>;

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-cream px-4">
        <Helmet>
          <title>Admin Login - Snack Asik</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="bg-white p-10 rounded-[40px] shadow-2xl max-w-md w-full text-center space-y-8">
          <div className="bg-primary-yellow w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
            <LayoutDashboard size={40} className="text-primary-brown" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-extrabold text-primary-brown">Admin Dashboard</h1>
            <p className="text-primary-brown/60 mt-2">Silakan login dengan akun yang terdaftar untuk mengelola website.</p>
          </div>
          <button 
            onClick={handleLogin}
            className="w-full bg-primary-brown text-white font-bold py-4 rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-3"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5 invert" alt="Google" />
            Login dengan Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-cream flex">
      <Helmet>
        <title>Admin Dashboard - Snack Asik</title>
        <meta name="robots" content="noindex, nofollow" />
        {settings.faviconUrl && <link rel="icon" href={settings.faviconUrl} />}
      </Helmet>
      {/* Sidebar */}
      <aside className="w-20 md:w-64 bg-primary-brown text-white p-4 flex flex-col items-center md:items-start gap-8">
        <div className="flex items-center gap-3 md:px-4 py-8">
          <div className="bg-primary-yellow p-2 rounded-xl">
            <LayoutDashboard size={24} className="text-primary-brown" />
          </div>
          <span className="hidden md:block font-display font-bold text-xl">Dashboard</span>
        </div>

        <nav className="flex-grow w-full space-y-2">
          {[
            { id: 'settings', icon: SettingsIcon, label: 'Settings' },
            { id: 'products', icon: ShoppingBasket, label: 'Products' },
            { id: 'testimonials', icon: MessageSquare, label: 'Testimonials' },
            { id: 'faqs', icon: HelpCircle, label: 'FAQ' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id ? 'bg-white/10 text-primary-yellow' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={20} />
              <span className="hidden md:block font-bold">{tab.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all mt-auto"
        >
          <LogOut size={20} />
          <span className="hidden md:block font-bold">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 md:p-12 overflow-y-auto max-h-screen">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-display font-extrabold text-primary-brown uppercase tracking-tight">
              {activeTab} Management
            </h2>
            <p className="text-primary-brown/40">Kelola konten website Anda dengan mudah.</p>
          </div>
          {activeTab !== 'settings' && (
            <button 
              onClick={activeTab === 'products' ? addProduct : undefined}
              className="bg-primary-brown text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all"
            >
              <Plus size={20} /> Tambah {activeTab.slice(0, -1)}
            </button>
          )}
        </header>

        <div className="bg-white rounded-[40px] shadow-sm p-8 md:p-10 border border-gray-100">
          {activeTab === 'settings' && (
            <form onSubmit={saveSettings} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">Headline</label>
                  <input 
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.headline}
                    onChange={e => setSettings({...settings, headline: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">Hero Image URL</label>
                  <input 
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.heroImage}
                    onChange={e => setSettings({...settings, heroImage: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">Description</label>
                  <textarea 
                    rows={3}
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.description}
                    onChange={e => setSettings({...settings, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">WhatsApp Number</label>
                  <input 
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.whatsappNumber}
                    onChange={e => setSettings({...settings, whatsappNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">Shopee Link</label>
                  <input 
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.shopeeLink || ''}
                    onChange={e => setSettings({...settings, shopeeLink: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">Tokopedia Link</label>
                  <input 
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.tokopediaLink || ''}
                    onChange={e => setSettings({...settings, tokopediaLink: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">Location</label>
                  <input 
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.location || ''}
                    onChange={e => setSettings({...settings, location: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">Favicon URL</label>
                  <input 
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.faviconUrl || ''}
                    onChange={e => setSettings({...settings, faviconUrl: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">Instagram Link</label>
                  <input 
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.instagramLink || ''}
                    onChange={e => setSettings({...settings, instagramLink: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">TikTok Link</label>
                  <input 
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.tiktokLink || ''}
                    onChange={e => setSettings({...settings, tiktokLink: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">Facebook Link</label>
                  <input 
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.facebookLink || ''}
                    onChange={e => setSettings({...settings, facebookLink: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">YouTube Link</label>
                  <input 
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.youtubeLink || ''}
                    onChange={e => setSettings({...settings, youtubeLink: e.target.value})}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isSaving}
                className="bg-primary-yellow text-primary-brown font-extrabold px-10 py-4 rounded-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                Simpan Perubahan
              </button>
            </form>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              {products.map(product => (
                <div key={product.id} className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-3xl bg-bg-cream hover:bg-primary-yellow/5 transition-all">
                  <img src={product.imageUrl} className="w-24 h-24 rounded-2xl object-cover" alt="" />
                  <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input 
                      className="bg-white p-3 rounded-xl outline-none focus:ring-2 ring-primary-yellow"
                      value={product.name}
                      onChange={e => {
                        const newProds = products.map(p => p.id === product.id ? {...p, name: e.target.value} : p);
                        setProducts(newProds);
                        updateDoc(doc(db, 'products', product.id), { name: e.target.value });
                      }}
                    />
                    <input 
                      className="bg-white p-3 rounded-xl outline-none focus:ring-2 ring-primary-yellow"
                      value={product.price}
                      onChange={e => {
                        const newProds = products.map(p => p.id === product.id ? {...p, price: e.target.value} : p);
                        setProducts(newProds);
                        updateDoc(doc(db, 'products', product.id), { price: e.target.value });
                      }}
                    />
                    <div className="flex gap-2">
                       <input 
                        className="flex-grow bg-white p-3 rounded-xl outline-none focus:ring-2 ring-primary-yellow"
                        placeholder="Image URL"
                        value={product.imageUrl}
                        onChange={e => {
                          const newProds = products.map(p => p.id === product.id ? {...p, imageUrl: e.target.value} : p);
                          setProducts(newProds);
                          updateDoc(doc(db, 'products', product.id), { imageUrl: e.target.value });
                        }}
                      />
                      <button 
                        onClick={() => deleteItem('products', product.id)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              {testimonials.map(item => (
                <div key={item.id} className="p-6 rounded-3xl bg-bg-cream space-y-4">
                  <div className="flex justify-between items-start">
                    <input 
                      className="text-xl font-bold bg-transparent outline-none border-b border-transparent focus:border-primary-yellow"
                      value={item.name}
                      onChange={e => {
                        const newItems = testimonials.map(t => t.id === item.id ? {...t, name: e.target.value} : t);
                        setTestimonials(newItems);
                        updateDoc(doc(db, 'testimonials', item.id), { name: e.target.value });
                      }}
                    />
                    <button onClick={() => deleteItem('testimonials', item.id)} className="text-red-500 p-2"><Trash size={20} /></button>
                  </div>
                  <textarea 
                    className="w-full bg-white p-4 rounded-xl outline-none focus:ring-2 ring-primary-yellow"
                    value={item.text}
                    onChange={e => {
                      const newItems = testimonials.map(t => t.id === item.id ? {...t, text: e.target.value} : t);
                      setTestimonials(newItems);
                      updateDoc(doc(db, 'testimonials', item.id), { text: e.target.value });
                    }}
                  />
                </div>
              ))}
              <button 
                onClick={async () => {
                  const newItem = { name: 'Nama Pelanggan', text: 'Ulasan pelanggan...', order: testimonials.length + 1 };
                  const docRef = await addDoc(collection(db, 'testimonials'), newItem);
                  setTestimonials([...testimonials, { ...newItem, id: docRef.id }]);
                }}
                className="w-full border-2 border-dashed border-gray-200 p-8 rounded-3xl text-gray-400 hover:border-primary-yellow hover:text-primary-yellow transition-all flex items-center justify-center gap-2"
              >
                <Plus size={24} /> Tambah Testimoni Baru
              </button>
            </div>
          )}

          {activeTab === 'faqs' && (
            <div className="space-y-6">
              {faqs.map(faq => (
                <div key={faq.id} className="p-6 rounded-3xl bg-bg-cream space-y-4">
                  <div className="flex justify-between items-start">
                    <input 
                      className="font-bold w-full bg-transparent outline-none border-b border-transparent focus:border-primary-yellow"
                      value={faq.question}
                      onChange={e => {
                        const newItems = faqs.map(f => f.id === faq.id ? {...f, question: e.target.value} : f);
                        setFaqs(newItems);
                        updateDoc(doc(db, 'faqs', faq.id), { question: e.target.value });
                      }}
                    />
                    <button onClick={() => deleteItem('faqs', faq.id)} className="text-red-500 p-2"><Trash size={20} /></button>
                  </div>
                  <textarea 
                    className="w-full bg-white p-4 rounded-xl outline-none focus:ring-2 ring-primary-yellow"
                    value={faq.answer}
                    onChange={e => {
                      const newItems = faqs.map(f => f.id === faq.id ? {...f, answer: e.target.value} : f);
                      setFaqs(newItems);
                      updateDoc(doc(db, 'faqs', faq.id), { answer: e.target.value });
                    }}
                  />
                </div>
              ))}
              <button 
                onClick={async () => {
                  const newItem = { question: 'Pertanyaan baru?', answer: 'Jawaban baru...', order: faqs.length + 1 };
                  const docRef = await addDoc(collection(db, 'faqs'), newItem);
                  setFaqs([...faqs, { ...newItem, id: docRef.id }]);
                }}
                className="w-full border-2 border-dashed border-gray-200 p-8 rounded-3xl text-gray-400 hover:border-primary-yellow hover:text-primary-yellow transition-all flex items-center justify-center gap-2"
              >
                <Plus size={24} /> Tambah FAQ Baru
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
