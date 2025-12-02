
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { 
    Search, Mic, ShoppingBag, Star, Shirt, Zap, Smartphone, Tv, Cpu, 
    Home, Heart, Baby, Coffee, Activity, Car, Armchair, 
    Coins, Plus, CreditCard, Play, Banknote, Users, Leaf, Sparkles, Camera
} from 'lucide-react';

export const Categories: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useStore();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const [activeCategory, setActiveCategory] = useState('For You');

  // Check for incoming category state from Home page navigation
  useEffect(() => {
    if (location.state && (location.state as any).category) {
        setActiveCategory((location.state as any).category);
    }
  }, [location]);

  const SIDEBAR_ITEMS = [
    { name: 'For You', icon: Star },
    { name: 'Fashion', icon: Shirt },
    { name: 'Appliances', icon: Zap },
    { name: 'Mobiles', icon: Smartphone },
    { name: 'Electronics', icon: Tv },
    { name: 'Gadgets', icon: Cpu },
    { name: 'Home', icon: Home },
    { name: 'Beauty', icon: Heart },
    { name: 'Toys & Baby', icon: Baby },
    { name: 'Food', icon: Coffee },
    { name: 'Sports', icon: Activity },
    { name: 'Auto', icon: Car },
    { name: 'Furniture', icon: Armchair },
  ];

  const POPULAR_STORES = [
    { title: 'BUY BUY DAYS', sub: 'Coming soon!', color: 'bg-blue-100 text-blue-700' },
    { title: 'EARLY BIRD', sub: 'Live now', color: 'bg-yellow-100 text-yellow-700' },
    { title: 'WEDDING', sub: 'Specials', color: 'bg-pink-100 text-pink-700' },
    { title: 'GAMING', sub: 'League', color: 'bg-purple-100 text-purple-700' },
    { title: 'KIDS ZONE', sub: 'Fun Time', color: 'bg-orange-100 text-orange-700' },
    { title: 'PREMIUM', sub: 'Luxe', color: 'bg-gray-800 text-white' },
  ];

  const RECENTLY_VIEWED = [
    { name: "Men's Jeans", img: "https://images.unsplash.com/photo-1542272617-08f083157f5d?w=200&q=80" },
    { name: "Coins", img: "https://images.unsplash.com/photo-1620288627223-537a2e24674e?w=200&q=80" },
    { name: "T-Shirts", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80" },
    { name: "Bags", img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=200&q=80" },
  ];

  const SERVICES = [
    { name: 'SuperCoin', icon: Coins, color: 'text-yellow-500' },
    { name: 'Plus Zone', icon: Plus, color: 'text-blue-500' },
    { name: 'CartPay', icon: CreditCard, color: 'text-green-600' },
    { name: 'LiveShop+', icon: Play, color: 'text-red-500' },
    { name: 'Loans', icon: Banknote, color: 'text-purple-600' },
    { name: 'Trends', icon: Users, color: 'text-pink-500' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col pb-16">
      {/* Header */}
      <div className="bg-blue-600 p-3 text-white sticky top-0 z-20 flex justify-between items-center shadow-md">
        <h1 className="text-lg font-medium">All Categories</h1>
        <div className="flex items-center gap-4">
            <Search className="w-5 h-5" />
            <Camera className="w-5 h-5" />
            <div className="relative" onClick={() => navigate('/cart')}>
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-blue-600">{cartCount}</span>}
            </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-24 bg-gray-50 dark:bg-gray-800 flex-shrink-0 overflow-y-auto no-scrollbar border-r border-gray-200 dark:border-gray-700 pb-20">
            {SIDEBAR_ITEMS.map((item) => (
                <div 
                    key={item.name}
                    onClick={() => setActiveCategory(item.name)}
                    className={`flex flex-col items-center justify-center py-4 px-1 cursor-pointer transition-colors border-l-4 ${activeCategory === item.name ? 'bg-white dark:bg-gray-900 border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                >
                    <div className={`mb-1 ${activeCategory === item.name ? 'scale-110' : ''} transition-transform`}>
                        <item.icon className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] text-center font-medium leading-tight">{item.name}</span>
                </div>
            ))}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 p-4 pb-20">
            {activeCategory === 'For You' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    
                    {/* Section 1: Popular Store */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Popular Store</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {POPULAR_STORES.map((store, i) => (
                                <div key={i} className={`${store.color} rounded-xl p-3 flex flex-col items-center justify-center text-center aspect-[4/3] shadow-sm`}>
                                    <span className="font-black text-sm md:text-base leading-tight mb-1">{store.title}</span>
                                    <span className="text-[10px] font-medium opacity-80 uppercase tracking-wide">{store.sub}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 2: Recently Viewed */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Recently Viewed Stores</h2>
                        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                            {RECENTLY_VIEWED.map((item, i) => (
                                <div key={i} className="flex-shrink-0 w-28 border border-gray-100 dark:border-gray-700 rounded-lg p-2">
                                    <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded mb-2 overflow-hidden">
                                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <p className="text-xs font-medium text-center truncate">{item.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 3: Have you tried? */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Have you tried?</h2>
                        <div className="grid grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                            {SERVICES.map((srv, i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <div className={`w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center ${srv.color}`}>
                                        <srv.icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-medium text-center">{srv.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 4: More on App */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">More on CartRush</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg flex items-center gap-3">
                                <Leaf className="w-8 h-8 text-green-600" />
                                <div>
                                    <p className="font-bold text-sm text-green-700 dark:text-green-400">Green</p>
                                    <p className="text-[10px] text-green-600">Sustainability</p>
                                </div>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg flex items-center gap-3">
                                <Sparkles className="w-8 h-8 text-purple-600" />
                                <div>
                                    <p className="font-bold text-sm text-purple-700 dark:text-purple-400">Originals</p>
                                    <p className="text-[10px] text-purple-600">Exclusive</p>
                                </div>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-center gap-3 col-span-2">
                                <Activity className="w-8 h-8 text-blue-600" />
                                <div>
                                    <p className="font-bold text-sm text-blue-700 dark:text-blue-400">Next Gen Brands</p>
                                    <p className="text-[10px] text-blue-600">Trending Now</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 animate-in fade-in zoom-in duration-300">
                    <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">{activeCategory}</p>
                    <p className="text-sm">Explore top products in {activeCategory}!</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
