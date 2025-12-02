
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Star, Truck, ShieldCheck, Heart, ArrowLeft, Sparkles, Send, ZoomIn } from 'lucide-react';
import { getSmartProductInsights } from '../services/gemini';
import { Review } from '../types';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, cart, user, orders, addReview, wishlist, toggleWishlist } = useStore();
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews'>('desc');
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  
  // Image Zoom State
  const [zoomState, setZoomState] = useState({ show: false, x: 0, y: 0 });
  
  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const product = products.find(p => p.id === id);
  const isInCart = product ? cart.some(item => item.id === product.id) : false;
  const isWishlisted = product ? wishlist.includes(product.id) : false;

  // Check if user has purchased this product
  const hasPurchased = user && orders.some(order => 
    order.userId === user.id && 
    order.items.some(item => item.id === product?.id)
  );

  useEffect(() => {
    if (product) {
      setLoadingAi(true);
      getSmartProductInsights(product.name, product.description)
        .then(setAiInsight)
        .finally(() => setLoadingAi(false));
    }
  }, [product]);

  const getEstimatedDelivery = () => {
    const date = new Date();
    date.setDate(date.getDate() + 4); 
    return date.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !user) return;
    
    const newReview: Review = {
        id: Date.now().toString(),
        user: user.name,
        rating: reviewRating,
        comment: reviewComment,
        date: new Date().toISOString().split('T')[0]
    };
    
    addReview(product.id, newReview);
    setReviewComment('');
    setReviewRating(5);
    alert("Review submitted successfully!");
  };

  const handleBuyNow = () => {
    if (!product || product.stock === 0) return;
    
    if (!isInCart) {
        addToCart(product);
    }
    // Navigate to cart with state to trigger checkout flow
    navigate('/cart', { state: { checkout: true } });
  };

  const handleImageMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomState({ show: true, x, y });
  };

  if (!product) return <div className="p-10 text-center">Product not found</div>;

  return (
    <div className="pb-20">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center text-sm text-gray-500 hover:text-primary-600">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-2 shadow-sm border border-gray-100 dark:border-gray-700 h-fit sticky top-24 z-10">
          <div 
            className="aspect-square rounded-2xl overflow-hidden bg-gray-100 relative cursor-crosshair group"
            onMouseMove={handleImageMove}
            onMouseLeave={() => setZoomState(prev => ({ ...prev, show: false }))}
            onClick={() => setZoomState(prev => ({ ...prev, show: !prev.show }))}
          >
            <img 
                src={product.image} 
                alt={product.name} 
                className={`w-full h-full object-cover transition-transform duration-100 ease-out ${zoomState.show ? 'scale-[2.5]' : 'scale-100'}`}
                style={{
                    transformOrigin: zoomState.show ? `${zoomState.x}% ${zoomState.y}%` : 'center center'
                }}
            />
            {/* Zoom Hint Icon */}
            <div className={`absolute bottom-4 right-4 bg-white/90 dark:bg-gray-900/90 p-2 rounded-full shadow-lg backdrop-blur-sm transition-opacity duration-300 pointer-events-none ${zoomState.show ? 'opacity-0' : 'opacity-100'}`}>
                <ZoomIn className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-sm text-primary-600 font-semibold uppercase tracking-wide">{product.category}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">{product.name}</h1>
            </div>
            <button 
                onClick={() => toggleWishlist(product.id)}
                className={`p-2 rounded-full transition-colors ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-500'}`}
            >
              <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-red-500' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold">{product.rating}</span>
              <span className="text-gray-500 text-sm underline">({product.reviews} reviews)</span>
            </div>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <div className="flex items-end gap-3 mb-6">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
               <span className="text-lg text-gray-400 line-through mb-1">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            )}
             {product.originalPrice && (
              <span className="text-sm font-bold text-green-600 mb-2">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>

          {/* AI Insight */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-4 mb-6">
             <div className="flex items-center gap-2 mb-2">
               <Sparkles className="w-4 h-4 text-primary-600" />
               <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">AI Summary</span>
             </div>
             <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
               {loadingAi ? "Analyzing product..." : `"${aiInsight}"`}
             </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="p-2 bg-primary-50 text-primary-600 dark:bg-primary-900/30 rounded-full"><Truck className="w-5 h-5" /></div>
              <div>
                <span className="block font-bold text-gray-900 dark:text-gray-100">Estimated delivery by {getEstimatedDelivery()}</span>
                <span className="text-xs">Free delivery on orders over ₹1000</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full"><ShieldCheck className="w-4 h-4" /></div>
              <span>2 year warranty included</span>
            </div>
          </div>

          <div className="flex gap-4 sticky bottom-0 md:relative bg-white dark:bg-gray-900 md:bg-transparent p-4 md:p-0 border-t md:border-t-0 border-gray-100 dark:border-gray-800 z-10">
            <button 
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className={`flex-1 py-3.5 rounded-full font-bold shadow-lg shadow-primary-500/30 transition-all transform active:scale-95 ${
                isInCart 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              {isInCart ? 'In Cart (Add More)' : 'Add to Cart'}
            </button>
            <button 
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 py-3.5 rounded-full font-bold border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-white transition-colors"
            >
              Buy Now
            </button>
          </div>

          <div className="mt-10">
            <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
              <button 
                onClick={() => setActiveTab('desc')}
                className={`pb-3 pr-6 font-medium text-sm transition-colors relative ${activeTab === 'desc' ? 'text-primary-600' : 'text-gray-500'}`}
              >
                Description
                {activeTab === 'desc' && <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-primary-600 rounded-full"></span>}
              </button>
              <button 
                 onClick={() => setActiveTab('reviews')}
                 className={`pb-3 px-6 font-medium text-sm transition-colors relative ${activeTab === 'reviews' ? 'text-primary-600' : 'text-gray-500'}`}
              >
                Reviews ({product.reviews})
                {activeTab === 'reviews' && <span className="absolute bottom-0 left-6 w-8 h-0.5 bg-primary-600 rounded-full"></span>}
              </button>
            </div>
            
            <div className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
              {activeTab === 'desc' ? (
                <p>{product.description}</p>
              ) : (
                <div className="space-y-6">
                  {/* Add Review Section */}
                  {hasPurchased ? (
                     <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 mb-6">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-3">Write a Review</h3>
                        <form onSubmit={handleSubmitReview}>
                            <div className="flex gap-2 mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button 
                                        key={star} 
                                        type="button"
                                        onClick={() => setReviewRating(star)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                    </button>
                                ))}
                            </div>
                            <div className="relative">
                                <textarea 
                                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                                    rows={3}
                                    placeholder="Share your thoughts about this product..."
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    required
                                ></textarea>
                                <button type="submit" className="absolute bottom-3 right-3 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                     </div>
                  ) : !user ? (
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl mb-6">
                          <p className="text-sm">Please <span className="font-bold cursor-pointer text-primary-600" onClick={() => navigate('/login')}>login</span> to write a review.</p>
                      </div>
                  ) : null}

                  {/* Reviews List */}
                  {product.reviewsList && product.reviewsList.length > 0 ? (
                      product.reviewsList.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold text-xs">
                                        {review.user[0]}
                                    </div>
                                    <span className="font-bold text-gray-900 dark:text-white text-sm">{review.user}</span>
                                </div>
                                <span className="text-xs text-gray-400">{review.date}</span>
                            </div>
                            <div className="flex text-yellow-400 w-3 h-3 gap-0.5 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200 dark:text-gray-700'}`} />
                                ))}
                            </div>
                            <p className="text-sm mt-3">{review.comment}</p>
                        </div>
                      ))
                  ) : (
                      <div className="text-center py-8 text-gray-400">
                          <p>No reviews yet. Be the first to review!</p>
                      </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
