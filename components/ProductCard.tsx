
import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import { Star, Plus, Check, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, cart, toggleWishlist, wishlist } = useStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  const isInCart = cart.some(item => item.id === product.id);
  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    
    addToCart(product);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 300);
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full relative">
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-900">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            New
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            Few Left
          </span>
        )}
      </Link>
      
      {/* Wishlist Button */}
      <button 
        onClick={handleToggleWishlist}
        className="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:bg-white dark:hover:bg-gray-700 transition-colors z-10"
      >
        <Heart 
            className={`w-4 h-4 transition-all duration-300 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-gray-600'} ${isHeartAnimating ? 'scale-150' : 'scale-100'}`} 
        />
      </button>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link to={`/product/${product.id}`} className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            {product.name}
          </Link>
        </div>
        
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{product.rating}</span>
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900 dark:text-white">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`p-2 rounded-full transition-all duration-300 transform ${
              isAnimating 
                ? 'scale-110 bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                : isInCart 
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-gray-100 text-gray-900 hover:bg-primary-600 hover:text-white dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-primary-600'
            }`}
          >
            <div className={`transition-transform duration-200 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
               {isInCart || isAnimating ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
