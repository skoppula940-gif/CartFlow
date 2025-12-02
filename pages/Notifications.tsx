import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Search, ShoppingBag, ChevronDown, Check } from 'lucide-react';

export const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useStore();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const [activeTab, setActiveTab] = useState('Push');
  const tabs = ['Push', 'In-App', 'SMS', 'Email', 'WhatsApp'];

  const [preferences, setPreferences] = useState([
    { id: 1, title: 'My Orders', desc: 'Latest updates on your orders', checked: true },
    { id: 2, title: 'Reminders', desc: 'Price Drops, Back-in-stock Products, etc.', checked: true },
    { id: 3, title: 'Recommendations by CartRush', desc: 'Products, offers and curated content based on your interest', checked: true },
    { id: 4, title: 'New Offers', desc: 'Top Deals and more', checked: true },
    { id: 5, title: 'My CartRush Community', desc: 'Profile updates, Newsletters, etc.', checked: true },
    { id: 6, title: 'Feedback and Review', desc: 'Rating and Reviews for your purchase', checked: true },
  ]);

  const togglePreference = (id: number) => {
    setPreferences(prev => prev.map(p => p.id === id ? { ...p, checked: !p.checked } : p));
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
       {/* Header */}
       <div className="bg-blue-600 p-4 text-white sticky top-0 z-10">
         {/* Top Row */}
         <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
                <h1 className="font-medium text-lg">Notification Preferences</h1>
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
         <div className="flex overflow-x-auto no-scrollbar gap-6 text-sm font-medium">
            {tabs.map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 whitespace-nowrap transition-colors border-b-4 ${activeTab === tab ? 'border-yellow-400 text-white font-bold' : 'border-transparent text-blue-200 hover:text-white'}`}
                >
                    {tab}
                </button>
            ))}
         </div>
       </div>

       {/* Content */}
       <div className="p-4">
         <p className="text-xs text-gray-500 mb-4">Get notifications from CartRush on your mobile</p>

         <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-gray-100 dark:border-gray-700">
            {activeTab === 'Push' ? (
                preferences.map(pref => (
                    <div key={pref.id} className="flex items-start gap-4 p-4 border-b border-gray-100 dark:border-gray-700 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors" onClick={() => togglePreference(pref.id)}>
                        <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${pref.checked ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-400 bg-white dark:bg-gray-700'}`}>
                            {pref.checked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{pref.title}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">{pref.desc}</p>
                        </div>
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    </div>
                ))
            ) : (
                <div className="p-8 text-center text-gray-500 text-sm">
                    Settings for {activeTab} coming soon.
                </div>
            )}
         </div>
       </div>
    </div>
  );
};
