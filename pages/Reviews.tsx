import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Search, ShoppingBag, PenLine } from 'lucide-react';

export const Reviews: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useStore();
  const [activeTab, setActiveTab] = useState<'pending' | 'published'>('pending');

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-blue-600 p-4 text-white sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
                <h1 className="font-medium text-lg">My Reviews</h1>
            </div>
            <div className="flex gap-4">
                <Search className="w-6 h-6" />
                <div className="relative" onClick={() => navigate('/cart')}>
                    <ShoppingBag className="w-6 h-6" />
                    {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex text-sm font-medium">
            <button 
                onClick={() => setActiveTab('pending')}
                className={`flex-1 pb-3 text-center border-b-4 transition-colors ${activeTab === 'pending' ? 'border-yellow-400 text-white' : 'border-transparent text-blue-200 hover:text-white'}`}
            >
                Pending
            </button>
            <button 
                onClick={() => setActiveTab('published')}
                className={`flex-1 pb-3 text-center border-b-4 transition-colors ${activeTab === 'published' ? 'border-yellow-400 text-white' : 'border-transparent text-blue-200 hover:text-white'}`}
            >
                Published
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center pt-20 px-4 text-center">
        {activeTab === 'pending' ? (
            <div className="animate-in zoom-in duration-300 flex flex-col items-center">
                <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <PenLine className="w-16 h-16 text-blue-500 stroke-1" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Share your opinion!</h2>
                <p className="text-gray-500 text-sm max-w-xs">
                    You have not written any product reviews yet.
                </p>
                <button 
                    onClick={() => navigate('/')}
                    className="mt-8 px-8 py-2.5 bg-white border border-blue-600 text-blue-600 font-bold rounded shadow-sm hover:bg-blue-50 transition-colors uppercase text-sm tracking-wide"
                >
                    Start Shopping
                </button>
            </div>
        ) : (
            <div className="animate-in zoom-in duration-300 flex flex-col items-center">
                <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
                        <PenLine className="w-16 h-16 text-gray-300 stroke-1" />
                    </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No reviews published</h2>
                <p className="text-gray-500 text-sm max-w-xs">
                    Reviews you write will appear here.
                </p>
            </div>
        )}
      </div>
    </div>
  );
};