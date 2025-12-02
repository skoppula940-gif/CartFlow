
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, MessageCircle, Share2, ShoppingBag, Music2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Play: React.FC = () => {
  const navigate = useNavigate();
  // Mock Feed Data
  const FEED_ITEMS = [
    {
      id: 1,
      user: 'Anish.Walla',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anish',
      image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80', // Man in stylish clothes
      caption: 'Must try this look this summer #OOTD #SummerVibes',
      likes: '12.4K',
      comments: '128',
      productId: '4' // Organic Cotton T-Shirt
    },
    {
      id: 2,
      user: 'sneakerheads',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneaker',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', // Sneakers
      caption: 'Fresh kicks just dropped! 🔥 Limited stock.',
      likes: '45.2K',
      comments: '892',
      productId: '7' // Yoga Mat (Placeholder for sports item)
    },
    {
      id: 3,
      user: 'fashionista',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fashion',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80', // Denim texture
      caption: 'Premium Denim Lab quality. Feel the difference.',
      likes: '8.9K',
      comments: '45',
      productId: '2' // Watch (Placeholder)
    },
    {
      id: 4,
      user: 'styleguru',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Style',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80', // Outfit laydown
      caption: 'Layering game strong. Orange pop! 🍊',
      likes: '15.1K',
      comments: '320',
      productId: '4'
    }
  ];

  return (
    <div className="bg-black h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] overflow-y-scroll snap-y snap-mandatory no-scrollbar relative">
       {/* Top Overlay - Minimal Header */}
       <div className="fixed top-0 left-0 right-0 p-4 z-30 flex justify-between items-center text-white bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
          <div className="flex items-center gap-4 pointer-events-auto">
             <h1 className="font-bold text-lg drop-shadow-md">Explore</h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-red-600 px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">LIVE</div>
          </div>
       </div>

       {FEED_ITEMS.map((item) => (
         <div key={item.id} className="relative w-full h-full snap-start shrink-0">
            {/* Content (Image simulating video) */}
            <img src={item.image} alt="Feed" className="w-full h-full object-cover" />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80"></div>

            {/* Right Side Interaction Bar */}
            <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6 z-20">
                <div className="flex flex-col items-center gap-1">
                    <div className="p-3 bg-gray-800/50 backdrop-blur-sm rounded-full text-white hover:bg-red-500/80 transition-colors cursor-pointer">
                        <Heart className="w-7 h-7" />
                    </div>
                    <span className="text-white text-xs font-medium shadow-black drop-shadow-md">{item.likes}</span>
                </div>
                
                <div className="flex flex-col items-center gap-1">
                    <div className="p-3 bg-gray-800/50 backdrop-blur-sm rounded-full text-white cursor-pointer">
                        <MessageCircle className="w-7 h-7" />
                    </div>
                    <span className="text-white text-xs font-medium shadow-black drop-shadow-md">{item.comments}</span>
                </div>

                <div className="p-3 bg-gray-800/50 backdrop-blur-sm rounded-full text-white cursor-pointer">
                    <Share2 className="w-7 h-7" />
                </div>

                <div className="relative mt-2">
                    <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden animate-[spin_5s_linear_infinite]">
                        <img src={item.avatar} alt="music" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-2 -right-1 bg-gray-900 rounded-full p-1">
                        <Music2 className="w-3 h-3 text-white" />
                    </div>
                </div>
            </div>

            {/* Bottom Left Info */}
            <div className="absolute left-4 bottom-20 right-20 z-20 text-white">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full border border-white/50 overflow-hidden bg-gray-800">
                        <img src={item.avatar} alt={item.user} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm shadow-black drop-shadow-md">@{item.user}</h3>
                        <button className="text-[10px] border border-white/50 px-2 py-0.5 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors">Follow</button>
                    </div>
                </div>
                
                <p className="text-sm mb-4 line-clamp-2 drop-shadow-md font-medium text-gray-100">{item.caption}</p>
                
                {/* Product Link CTA */}
                <button 
                    onClick={() => navigate(`/product/${item.productId}`)}
                    className="bg-white/95 text-black px-4 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-white transition-all shadow-lg animate-bounce"
                >
                    <ShoppingBag className="w-4 h-4" /> Shop Now
                </button>
            </div>
         </div>
       ))}
    </div>
  );
};
