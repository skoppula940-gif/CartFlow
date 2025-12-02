import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Search, ShoppingBag, MessageCircle } from 'lucide-react';

export const Questions: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useStore();
  const [activeTab, setActiveTab] = useState<'questions' | 'answers'>('questions');

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-blue-600 p-4 text-white sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
                <h1 className="font-medium text-lg">My Questions & Answers</h1>
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
                onClick={() => setActiveTab('questions')}
                className={`flex-1 pb-3 text-center border-b-4 transition-colors uppercase tracking-wide ${activeTab === 'questions' ? 'border-yellow-400 text-white font-bold' : 'border-transparent text-blue-200 hover:text-white'}`}
            >
                Questions
            </button>
            <button 
                onClick={() => setActiveTab('answers')}
                className={`flex-1 pb-3 text-center border-b-4 transition-colors uppercase tracking-wide ${activeTab === 'answers' ? 'border-yellow-400 text-white font-bold' : 'border-transparent text-blue-200 hover:text-white'}`}
            >
                Answers
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center pt-32 px-4 text-center">
        {activeTab === 'questions' ? (
            <div className="animate-in fade-in zoom-in duration-300 flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                   <MessageCircle className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-gray-500 font-medium">
                    You haven't posted any questions yet
                </p>
            </div>
        ) : (
            <div className="animate-in fade-in zoom-in duration-300 flex flex-col items-center">
                 <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                   <MessageCircle className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-gray-500 font-medium">
                    You haven't answered any questions yet
                </p>
            </div>
        )}
      </div>
    </div>
  );
};