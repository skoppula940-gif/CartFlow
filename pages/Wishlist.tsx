
import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Wishlist: React.FC = () => {
  const { products, wishlist } = useStore();
  const navigate = useNavigate();

  // Filter products that are in the wishlist
  const likedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="pb-10">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center text-sm text-gray-500 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full text-red-500">
            <Heart className="w-6 h-6 fill-current" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Liked Products</h1>
        <span className="ml-2 text-sm text-gray-500 font-medium">({likedProducts.length} items)</span>
      </div>

      {likedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-in fade-in duration-500">
          {likedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-gray-300 dark:text-gray-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 max-w-xs mx-auto mb-8">
            Tap the heart icon on any product to save it here for later.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-primary-600 text-white rounded-full font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30"
          >
            Explore Products
          </button>
        </div>
      )}
    </div>
  );
};
