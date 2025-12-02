
import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Smartphone, Shirt, Tv, Home as HomeIcon, Watch, Zap, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const { products, featuredDeal } = useStore();
  const navigate = useNavigate();
  
  // Custom Indian E-commerce Style Categories
  const TOP_CATEGORIES = [
    { name: 'For You', icon: <Star className="w-6 h-6 text-blue-500" /> },
    { name: 'Mobiles', icon: <Smartphone className="w-6 h-6 text-gray-700" /> },
    { name: 'Fashion', icon: <Shirt className="w-6 h-6 text-green-600" /> },
    { name: 'Electronics', icon: <Tv className="w-6 h-6 text-purple-600" /> },
    { name: 'Home', icon: <HomeIcon className="w-6 h-6 text-orange-500" /> },
    { name: 'Appliances', icon: <Zap className="w-6 h-6 text-yellow-500" /> },
    { name: 'Beauty', icon: <Watch className="w-6 h-6 text-pink-500" /> },
  ];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      
      {/* 1. Category Navigation Bar (Horizontal Scroll) */}
      <div className="bg-white dark:bg-gray-800 py-3 shadow-sm mb-2 overflow-x-auto no-scrollbar">
        <div className="flex px-4 gap-6 min-w-max">
          {TOP_CATEGORIES.map((cat, index) => (
            <div 
                key={index} 
                className="flex flex-col items-center gap-1 cursor-pointer group"
                onClick={() => navigate('/categories', { state: { category: cat.name } })}
            >
              <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                 {cat.icon}
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Hero Banner (Big Billion Style) */}
      <div className="relative bg-gradient-to-r from-blue-700 to-blue-500 text-white overflow-hidden mb-2">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="p-6 md:p-10 flex flex-col items-center text-center relative z-10">
          <div className="animate-in zoom-in duration-700">
             <h2 className="text-yellow-400 font-black text-4xl md:text-6xl italic tracking-tighter drop-shadow-lg transform -rotate-2">
                BIG BILLION
             </h2>
             <h2 className="text-white font-black text-3xl md:text-5xl italic tracking-tighter drop-shadow-md mb-2">
                DAYS SALE
             </h2>
             <div className="inline-block bg-white text-blue-700 px-4 py-1 rounded-sm font-bold text-sm uppercase tracking-widest shadow-lg">
                Live Now
             </div>
          </div>
          
          {/* Decorative Elements */}
          <Zap className="absolute top-4 right-4 w-12 h-12 text-yellow-400 fill-yellow-400 animate-pulse" />
          <Zap className="absolute bottom-4 left-4 w-8 h-8 text-yellow-300 fill-yellow-300" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 space-y-2 pb-6">
        
        {/* 3. Featured Product (Deal of the Day) */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-sm shadow-sm">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Deal of the Day</h3>
                <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-sm animate-pulse">
                    Ends in 12h 04m
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 border border-blue-100 dark:border-gray-700 rounded-lg p-4 bg-blue-50/50 dark:bg-gray-900/50">
                <div className="w-full md:w-1/3 aspect-video md:aspect-square bg-white rounded-lg p-4 flex items-center justify-center relative overflow-hidden">
                    <img src={featuredDeal.image} alt="Product" className="h-full object-contain hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-sm shadow-sm">
                        {featuredDeal.offerText}
                    </div>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                         <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{featuredDeal.title}</h2>
                         <div className="bg-green-100 text-green-800 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                             {featuredDeal.rating} <Star className="w-2.5 h-2.5 fill-current" />
                         </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-3">{featuredDeal.description}</p>
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{featuredDeal.price.toLocaleString('en-IN')}</span>
                        <span className="text-gray-400 line-through text-sm">₹{featuredDeal.originalPrice.toLocaleString('en-IN')}</span>
                        <span className="text-green-600 font-bold text-sm">Price Drop Alert</span>
                    </div>
                    <Link to="/product/1" className="w-full md:w-fit bg-blue-600 text-white text-center py-3 px-8 rounded-sm font-bold shadow-md hover:bg-blue-700 transition-colors">
                        Buy Now
                    </Link>
                </div>
            </div>
        </div>

        {/* 4. Trending Grid (Existing Products) */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-sm shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold italic text-gray-800 dark:text-white">Trending Now</h3>
                <Link to="/search" className="text-blue-600 text-sm font-bold">View All</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};
