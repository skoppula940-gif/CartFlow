
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Admin } from './pages/Admin';
import { Auth } from './pages/Auth';
import { AdminLogin } from './pages/AdminLogin';
import { Wishlist } from './pages/Wishlist';
import { OrderSuccess } from './pages/OrderSuccess';
import { Orders } from './pages/Orders';
import { EditProfile } from './pages/EditProfile';
import { Reviews } from './pages/Reviews';
import { Questions } from './pages/Questions';
import { Notifications } from './pages/Notifications';
import { Categories } from './pages/Categories';
import { Play } from './pages/Play';
import { Address } from './types';
import { 
    Trash2, MapPin, Package, Heart, Gift, Headphones, Shield, 
    User, Bell, Edit3, MessageCircle, Store, FileText, HelpCircle, 
    ChevronRight, LogOut, Lock 
} from 'lucide-react';

const Profile = () => {
    const { logout, user, addAddress, deleteAddress } = useStore();
    const navigate = useNavigate();
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [showAddresses, setShowAddresses] = useState(false);
    const [newAddress, setNewAddress] = useState<Partial<Address>>({
        type: 'Home',
        street: '',
        city: '',
        state: '',
        zip: '',
        mobile: user?.mobile || ''
    });

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const handleAddAddress = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAddress.street || !newAddress.city || !newAddress.zip) return;
        
        const address: Address = {
            id: Date.now().toString(),
            type: newAddress.type as 'Home' | 'Work' | 'Other',
            street: newAddress.street!,
            city: newAddress.city!,
            state: newAddress.state!,
            zip: newAddress.zip!,
            mobile: newAddress.mobile!
        };
        addAddress(address);
        setIsAddingAddress(false);
        setNewAddress({ type: 'Home', street: '', city: '', state: '', zip: '', mobile: user?.mobile || '' });
    };

    const MenuItem = ({ icon: Icon, label, onClick, subtitle }: { icon: any, label: string, onClick?: () => void, subtitle?: string }) => (
        <button 
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700 last:border-0"
        >
            <div className="flex items-center gap-4">
                <div className="text-blue-600 dark:text-blue-400">
                    <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">{label}</span>
                    {subtitle && <span className="block text-xs text-gray-500">{subtitle}</span>}
                </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
    );

    return (
        <div className="max-w-xl mx-auto py-6 px-4 pb-24 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-2xl font-bold">
                        {user.name[0].toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white">{user.name}</h1>
                        <p className="text-sm text-gray-500">{user.mobile}</p>
                    </div>
                </div>
                <button onClick={() => navigate('/edit-profile')} className="text-blue-600 text-sm font-medium">Edit</button>
            </div>
            
            {/* Quick Actions 2x2 Grid */}
            <div className="grid grid-cols-4 gap-2 mb-6">
                {[
                    { icon: Package, label: 'Orders', action: () => navigate('/orders') },
                    { icon: Heart, label: 'Wishlist', action: () => navigate('/wishlist') },
                    { icon: Gift, label: 'Coupons', action: () => alert("No coupons yet") },
                    { icon: Headphones, label: 'Help', action: () => window.location.href = "mailto:support@cartrush.com" },
                ].map((item, idx) => (
                    <button 
                        key={idx} 
                        onClick={item.action}
                        className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all active:scale-95"
                    >
                        <div className="text-blue-600 dark:text-blue-400">
                            <item.icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Section 1: Account Settings */}
            <div className="mb-4 overflow-hidden rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="bg-gray-100 dark:bg-gray-800/50 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                    Account Settings
                </div>
                <MenuItem icon={User} label="Edit Profile" onClick={() => navigate('/edit-profile')} />
                <MenuItem 
                    icon={MapPin} 
                    label="Saved Addresses" 
                    subtitle={`${user.addresses.length} saved`}
                    onClick={() => setShowAddresses(!showAddresses)} 
                />
                
                {/* Collapsible Address Section */}
                {showAddresses && (
                    <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 p-4 animate-in slide-in-from-top-2">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-sm">Manage Addresses</h3>
                            <button onClick={() => setIsAddingAddress(!isAddingAddress)} className="text-xs text-blue-600 font-bold hover:underline">
                                {isAddingAddress ? 'Cancel' : '+ Add New'}
                            </button>
                        </div>

                        {isAddingAddress && (
                            <form onSubmit={handleAddAddress} className="space-y-3 mb-4 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="grid grid-cols-2 gap-3">
                                    <select 
                                        className="rounded border-gray-300 dark:bg-gray-700 dark:border-gray-600 p-2 text-xs w-full"
                                        value={newAddress.type}
                                        onChange={e => setNewAddress({...newAddress, type: e.target.value as any})}
                                    >
                                        <option>Home</option>
                                        <option>Work</option>
                                        <option>Other</option>
                                    </select>
                                    <input 
                                        type="text" placeholder="Mobile" className="rounded border-gray-300 dark:bg-gray-700 dark:border-gray-600 p-2 text-xs w-full"
                                        value={newAddress.mobile} onChange={e => setNewAddress({...newAddress, mobile: e.target.value})}
                                        required
                                    />
                                </div>
                                <input 
                                    type="text" placeholder="Street Address" className="w-full rounded border-gray-300 dark:bg-gray-700 dark:border-gray-600 p-2 text-xs"
                                    value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                                    required
                                />
                                <div className="grid grid-cols-3 gap-2">
                                    <input 
                                        type="text" placeholder="City" className="rounded border-gray-300 dark:bg-gray-700 dark:border-gray-600 p-2 text-xs w-full"
                                        value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                                        required
                                    />
                                    <input 
                                        type="text" placeholder="State" className="rounded border-gray-300 dark:bg-gray-700 dark:border-gray-600 p-2 text-xs w-full"
                                        value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})}
                                        required
                                    />
                                    <input 
                                        type="text" placeholder="ZIP" className="rounded border-gray-300 dark:bg-gray-700 dark:border-gray-600 p-2 text-xs w-full"
                                        value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})}
                                        required
                                    />
                                </div>
                                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded text-xs font-bold hover:bg-blue-700">Save</button>
                            </form>
                        )}

                        <div className="space-y-2">
                            {user.addresses.map(addr => (
                                <div key={addr.id} className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded border border-gray-100 dark:border-gray-700">
                                    <div className="text-xs">
                                        <span className="font-bold text-gray-900 dark:text-white mr-2">{addr.type}</span>
                                        <span className="text-gray-500">{addr.city}, {addr.zip}</span>
                                    </div>
                                    <button onClick={() => deleteAddress(addr.id)} className="text-gray-400 hover:text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {user.addresses.length === 0 && !isAddingAddress && (
                                <div className="text-center text-xs text-gray-400 py-2">No addresses saved</div>
                            )}
                        </div>
                    </div>
                )}

                <MenuItem icon={Bell} label="Notification Settings" onClick={() => navigate('/notifications')} />
            </div>

            {/* Section 2: My Activity */}
            <div className="mb-4 overflow-hidden rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="bg-gray-100 dark:bg-gray-800/50 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                    My Activity
                </div>
                <MenuItem icon={Edit3} label="Reviews" onClick={() => navigate('/reviews')} />
                <MenuItem icon={MessageCircle} label="Questions & Answers" onClick={() => navigate('/questions')} />
            </div>

            {/* Section 3: Earn with CartRush */}
            <div className="mb-4 overflow-hidden rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="bg-gray-100 dark:bg-gray-800/50 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                    Earn with CartRush
                </div>
                <MenuItem 
                    icon={Store} 
                    label="Sell on CartRush" 
                    subtitle="Admin / Seller Dashboard"
                    onClick={() => navigate('/admin-login')} 
                />
            </div>

            {/* Section 4: Feedback & Information */}
            <div className="mb-6 overflow-hidden rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="bg-gray-100 dark:bg-gray-800/50 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                    Feedback & Information
                </div>
                <MenuItem icon={FileText} label="Terms, Policies and Licenses" onClick={() => alert("Coming Soon")} />
                <MenuItem icon={HelpCircle} label="Browse FAQs" onClick={() => alert("Coming Soon")} />
            </div>

            {/* Logout Button */}
            <button 
                onClick={logout}
                className="w-full py-3.5 bg-white dark:bg-gray-800 text-red-500 dark:text-red-400 font-bold rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
                <LogOut className="w-5 h-5" /> Log Out
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-6 mb-4">
                CartRush App Version 1.0.0
            </p>
        </div>
    );
};

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/play" element={<Play />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </StoreProvider>
  );
}
