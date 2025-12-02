
import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Plus, Package, Trash, LayoutDashboard, ShoppingBag, Settings, Users, CreditCard, Image as ImageIcon, X, Sparkles, MapPin, User, Phone, ChevronDown, Upload, Save } from 'lucide-react';
import { generateProductDescription } from '../services/gemini';
import { FeaturedDeal, BannerConfig } from '../types';

// --- Category Data Structure ---
const CATEGORY_HIERARCHY: any = {
  "Electronics": {
    subCategories: ["TV", "Fridge", "Washing Machine", "Watches", "Lights", "Bulbs", "Fans", "Coolers", "AC", "Inverter", "Laptops", "Computers", "Micro Oven"],
    types: {} 
  },
  "Fashion": {
    subCategories: ["Boys", "Girls"],
    types: {
      "Boys": ["Pants", "Shirts", "Shorts", "T-shirts", "Underwear", "Track Pants"],
      "Girls": ["Western Style Dresses", "Ethnic and Party Dresses"]
    },
    styles: {
      "Western Style Dresses": ["Frock / Fit-and-Flare", "A-Line", "Shift / Straight", "Maxi", "Skater / Flared", "Shirt / T-Shirt", "Bodycon / Slim-Fit", "Dungaree / Pinafore", "Jumpsuit / Playsuit"],
      "Ethnic and Party Dresses": ["Gown / Party Gown", "Anarkali Set", "Lehenga Choli", "Sharara / Gharara Set", "Kurti Set", "Indo-Western Dress"]
    }
  },
  "Gadgets": { subCategories: [], types: {} },
  "Accessories": { subCategories: [], types: {} },
  "Mobiles": { subCategories: [], types: {} },
  "Home Needs": { subCategories: [], types: {} }
};

export const Admin: React.FC = () => {
  const { products, addProduct, deleteProduct, orders, updateOrderStatus, allUsers, featuredDeal, updateFeaturedDeal, logout, banner, updateBanner } = useStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'users' | 'payments' | 'settings'>('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Banner & Deal Edit State
  const [dealForm, setDealForm] = useState<FeaturedDeal>(featuredDeal);
  const [bannerForm, setBannerForm] = useState<BannerConfig>(banner);
  
  useEffect(() => {
    setDealForm(featuredDeal);
  }, [featuredDeal]);

  useEffect(() => {
    setBannerForm(banner);
  }, [banner]);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '', // Title
    brand: '',
    model: '',
    price: '', // Selling Price
    mrp: '',   // Original MRP
    stock: '',
    image: `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 1000)}`,
    description: '',
    keywords: '',
    fulfillment: 'F-Assured'
  });

  // Category Selection State
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedProductType, setSelectedProductType] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);

  // Reset dependent fields when parent changes
  useEffect(() => { setSelectedSubCategory(''); setSelectedProductType(''); setSelectedStyle(''); }, [selectedMainCategory]);
  useEffect(() => { setSelectedProductType(''); setSelectedStyle(''); }, [selectedSubCategory]);
  useEffect(() => { setSelectedStyle(''); }, [selectedProductType]);

  const handleGenerateDescription = async () => {
    if (!newProduct.name || !newProduct.keywords) {
      alert("Please enter a title and keywords first.");
      return;
    }
    const priceVal = parseFloat(newProduct.price) || 0;
    setIsGenerating(true);
    // Construct a composite category string for better AI context
    const fullCategory = [selectedMainCategory, selectedSubCategory, selectedProductType, selectedStyle].filter(Boolean).join(' > ');
    const desc = await generateProductDescription(newProduct.name, priceVal, fullCategory, newProduct.keywords);
    setNewProduct({ ...newProduct, description: desc });
    setIsGenerating(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    addProduct({
      id: Date.now().toString(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      originalPrice: newProduct.mrp ? parseFloat(newProduct.mrp) : undefined,
      category: selectedMainCategory || 'Uncategorized', 
      image: newProduct.image,
      description: newProduct.description, 
      stock: parseInt(newProduct.stock),
      rating: 0,
      reviews: 0,
      isNew: true
    });
    setShowAddModal(false);
    // Reset Form
    setNewProduct({ name: '', brand: '', model: '', price: '', mrp: '', stock: '', image: `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 1000)}`, description: '', keywords: '', fulfillment: 'F-Assured' });
    setSelectedMainCategory('');
  };

  const handleUpdateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    updateFeaturedDeal(dealForm);
    alert("Deal updated!");
  };

  const handleUpdateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    updateBanner(bannerForm);
    alert("Banner updated!");
  };

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = orders.length;

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[80vh]">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm h-fit">
        <div className="space-y-2">
          {['dashboard', 'orders', 'products', 'users', 'payments', 'settings'].map((tab) => (
             <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors capitalize ${activeTab === tab ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'}`}
             >
                {tab === 'dashboard' && <LayoutDashboard className="w-5 h-5" />}
                {tab === 'orders' && <ShoppingBag className="w-5 h-5" />}
                {tab === 'products' && <Package className="w-5 h-5" />}
                {tab === 'users' && <Users className="w-5 h-5" />}
                {tab === 'payments' && <CreditCard className="w-5 h-5" />}
                {tab === 'settings' && <Settings className="w-5 h-5" />}
                {tab}
             </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
              <h3 className="text-blue-100 font-medium mb-1">Total Revenue</h3>
              <p className="text-3xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-500/20">
              <h3 className="text-purple-100 font-medium mb-1">Total Orders</h3>
              <p className="text-3xl font-bold">{totalOrders}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20">
              <h3 className="text-emerald-100 font-medium mb-1">Active Products</h3>
              <p className="text-3xl font-bold">{products.length}</p>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
             <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
               <h2 className="text-lg font-bold">Product Inventory</h2>
               <button onClick={() => setShowAddModal(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-700 flex items-center gap-2">
                 <Plus className="w-4 h-4" /> Add Product
               </button>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 font-medium">
                   <tr>
                     <th className="p-4">Product</th>
                     <th className="p-4">Price</th>
                     <th className="p-4">Stock</th>
                     <th className="p-4 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                   {products.map(p => (
                     <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                       <td className="p-4 flex items-center gap-3">
                         <img src={p.image} className="w-10 h-10 rounded-md object-cover" alt="" />
                         <span className="font-medium">{p.name}</span>
                       </td>
                       <td className="p-4">₹{p.price.toLocaleString('en-IN')}</td>
                       <td className="p-4">
                         <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                           {p.stock}
                         </span>
                       </td>
                       <td className="p-4 text-right">
                         <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash className="w-4 h-4" /></button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? <p className="text-center text-gray-500 py-10">No orders yet.</p> : orders.map(order => {
              const customer = allUsers.find(u => u.id === order.userId);
              return (
                <div key={order.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                     <div>
                       <h3 className="font-bold text-lg text-primary-600">#{order.id}</h3>
                       <p className="text-xs text-gray-500">{new Date(order.date).toLocaleString()}</p>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="text-right">
                          <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Order Total</p>
                          <p className="text-xl font-bold">₹{order.total.toLocaleString('en-IN')}</p>
                       </div>
                       <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value as any)} className="bg-gray-100 dark:bg-gray-700 rounded-lg border-none text-sm py-2 pl-3 pr-10 focus:ring-primary-500 font-medium">
                         <option>Confirm</option><option>Packed</option><option>Shipped</option><option>Out for Delivery</option><option>Delivered</option>
                       </select>
                     </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl mb-4 border border-gray-100 dark:border-gray-700">
                      <div>
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1"><User className="w-3 h-3" /> Customer Details</h4>
                          <p className="font-bold text-gray-900 dark:text-white text-sm">{customer ? customer.name : 'Guest User'}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1"><Phone className="w-3 h-3" /> {customer?.mobile || order.address.mobile}</p>
                      </div>
                      <div>
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1"><MapPin className="w-3 h-3" /> Delivery Address</h4>
                          <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              <p><span className="font-semibold">{order.address.type}:</span> {order.address.street}</p>
                              <p>{order.address.city}, {order.address.state} - <span className="font-mono">{order.address.zip}</span></p>
                          </div>
                      </div>
                   </div>
                   <div className="space-y-2 border-t border-gray-100 dark:border-gray-700 pt-4">
                     <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Items</h4>
                     {order.items.map(item => (
                       <div key={item.id} className="flex justify-between text-sm items-center">
                         <div className="flex items-center gap-2"><span className="font-mono bg-gray-200 dark:bg-gray-700 px-1.5 rounded text-xs">{item.quantity}x</span><span>{item.name}</span></div>
                         <span className="font-medium text-gray-500">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                       </div>
                     ))}
                   </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'users' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700"><h2 className="text-lg font-bold">Registered Users</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 font-medium"><tr><th className="p-4">Name</th><th className="p-4">Mobile</th><th className="p-4 text-center">Total Orders</th><th className="p-4 text-right">Role</th></tr></thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {allUsers.map(u => {
                                const userOrderCount = orders.filter(o => o.userId === u.id).length;
                                return (<tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50"><td className="p-4 font-medium">{u.name}</td><td className="p-4">{u.mobile}</td><td className="p-4 text-center"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">{userOrderCount}</span></td><td className="p-4 text-right"><span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>{u.role.toUpperCase()}</span></td></tr>);
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'payments' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700"><h2 className="text-lg font-bold">Payment Logs</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 font-medium"><tr><th className="p-4">Order ID</th><th className="p-4">Amount</th><th className="p-4">Method</th><th className="p-4 text-right">Status</th></tr></thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {orders.map(o => (<tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50"><td className="p-4 font-mono text-xs">{o.id}</td><td className="p-4 font-medium">₹{o.total.toLocaleString('en-IN')}</td><td className="p-4">{o.paymentMethod || 'UPI App'}</td><td className="p-4 text-right"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">PAID</span></td></tr>))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'settings' && (
            <div className="space-y-6">
                {/* Deal of the Day Editor */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary-600">
                        <Sparkles className="w-5 h-5" /> Deal of the Day Configuration
                    </h2>
                    <form onSubmit={handleUpdateDeal} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Product Title</label>
                            <input 
                                type="text" 
                                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-2 text-sm focus:ring-2 focus:ring-primary-500"
                                value={dealForm.title}
                                onChange={e => setDealForm({...dealForm, title: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Selling Price (₹)</label>
                                <input 
                                    type="number" 
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-2 text-sm focus:ring-2 focus:ring-primary-500"
                                    value={dealForm.price}
                                    onChange={e => setDealForm({...dealForm, price: parseFloat(e.target.value)})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Original MRP (₹)</label>
                                <input 
                                    type="number" 
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-2 text-sm focus:ring-2 focus:ring-primary-500"
                                    value={dealForm.originalPrice}
                                    onChange={e => setDealForm({...dealForm, originalPrice: parseFloat(e.target.value)})}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Offer Label (e.g. 20% OFF)</label>
                                <input 
                                    type="text" 
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-2 text-sm focus:ring-2 focus:ring-primary-500"
                                    value={dealForm.offerText}
                                    onChange={e => setDealForm({...dealForm, offerText: e.target.value})}
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Rating (1-5)</label>
                                <input 
                                    type="number" 
                                    step="0.1"
                                    max="5"
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-2 text-sm focus:ring-2 focus:ring-primary-500"
                                    value={dealForm.rating}
                                    onChange={e => setDealForm({...dealForm, rating: parseFloat(e.target.value)})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Image URL</label>
                            <input 
                                type="text" 
                                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-2 text-sm focus:ring-2 focus:ring-primary-500"
                                value={dealForm.image}
                                onChange={e => setDealForm({...dealForm, image: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Short Description</label>
                            <input 
                                type="text" 
                                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-2 text-sm focus:ring-2 focus:ring-primary-500"
                                value={dealForm.description}
                                onChange={e => setDealForm({...dealForm, description: e.target.value})}
                            />
                        </div>
                        
                        <div className="pt-2">
                            <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30">
                                Save Deal Settings
                            </button>
                        </div>
                    </form>
                </div>

                 {/* Banner Editor */}
                 <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-primary-600" /> Home Screen Banner
                    </h2>
                    <form onSubmit={handleUpdateBanner} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Image URL</label>
                            <input 
                                type="text" 
                                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-2 text-sm"
                                value={bannerForm.imageUrl}
                                onChange={e => setBannerForm({...bannerForm, imageUrl: e.target.value})}
                            />
                        </div>
                        <div className="pt-2">
                            <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors">
                                Update Banner
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center justify-between"><div><h3 className="font-bold">Admin Session</h3><p className="text-sm text-gray-500">Sign out of the admin panel securely.</p></div><button onClick={logout} className="px-6 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors">Logout</button></div>
            </div>
        )}
      </div>

      {/* --- REFACTORED ADD PRODUCT MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100/90 dark:bg-gray-900/90 backdrop-blur-sm p-0 md:p-6 overflow-hidden">
          <div className="bg-white dark:bg-gray-800 w-full max-w-4xl h-full md:h-auto md:max-h-[90vh] rounded-none md:rounded-3xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700">
             
             {/* Modal Header */}
             <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 z-10 sticky top-0 md:rounded-t-3xl">
               <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Product</h3>
                  <p className="text-xs text-gray-500">Fill in the details to publish a new product.</p>
               </div>
               <div className="flex items-center gap-3">
                 <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors">Cancel</button>
                 <button onClick={handleAddProduct} className="bg-primary-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-primary-700 flex items-center gap-2 shadow-lg shadow-primary-500/30">
                   <Save className="w-4 h-4" /> Save Product
                 </button>
               </div>
             </div>
             
             {/* Modal Body (Scrollable) */}
             <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-8 bg-gray-50 dark:bg-gray-900/50">
               <form id="addProductForm" onSubmit={handleAddProduct} className="space-y-8">
                  
                  {/* Section 1: Product Identification */}
                  <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                     <h4 className="text-sm font-bold text-primary-600 uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Identification</h4>
                     <div className="space-y-4">
                        <div>
                           <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Product Title <span className="text-red-500">*</span></label>
                           <input required type="text" placeholder="e.g. Samsung 4K Smart QLED TV 55-inch" className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand Name</label>
                              <input type="text" placeholder="e.g. Samsung" className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none" value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} />
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model / SKU</label>
                              <input type="text" placeholder="e.g. QA55Q60AAKLXL" className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none" value={newProduct.model} onChange={e => setNewProduct({...newProduct, model: e.target.value})} />
                           </div>
                        </div>
                     </div>
                  </section>

                  {/* Section 2: Category Selection */}
                  <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                     <h4 className="text-sm font-bold text-primary-600 uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Category Classification</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Dropdown 1: Main */}
                        <div>
                           <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Main Category <span className="text-red-500">*</span></label>
                           <div className="relative">
                              <select required className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none appearance-none" value={selectedMainCategory} onChange={e => setSelectedMainCategory(e.target.value)}>
                                 <option value="">Select Main Category</option>
                                 {Object.keys(CATEGORY_HIERARCHY).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                              </select>
                              <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
                           </div>
                        </div>

                        {/* Dropdown 2: Sub-Category */}
                        {selectedMainCategory && CATEGORY_HIERARCHY[selectedMainCategory]?.subCategories.length > 0 && (
                            <div>
                              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Sub-Category</label>
                              <div className="relative">
                                  <select className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none appearance-none" value={selectedSubCategory} onChange={e => setSelectedSubCategory(e.target.value)}>
                                    <option value="">Select Sub-Category</option>
                                    {CATEGORY_HIERARCHY[selectedMainCategory].subCategories.map((sub: string) => <option key={sub} value={sub}>{sub}</option>)}
                                  </select>
                                  <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
                              </div>
                            </div>
                        )}

                        {/* Dropdown 3: Product Type */}
                        {selectedSubCategory && CATEGORY_HIERARCHY[selectedMainCategory]?.types?.[selectedSubCategory] && (
                           <div>
                              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Product Type</label>
                              <div className="relative">
                                  <select className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none appearance-none" value={selectedProductType} onChange={e => setSelectedProductType(e.target.value)}>
                                    <option value="">Select Type</option>
                                    {CATEGORY_HIERARCHY[selectedMainCategory].types[selectedSubCategory].map((type: string) => <option key={type} value={type}>{type}</option>)}
                                  </select>
                                  <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
                              </div>
                           </div>
                        )}

                        {/* Dropdown 4: Specific Style */}
                         {selectedProductType && CATEGORY_HIERARCHY[selectedMainCategory]?.styles?.[selectedProductType] && (
                           <div>
                              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Specific Style</label>
                              <div className="relative">
                                  <select className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none appearance-none" value={selectedStyle} onChange={e => setSelectedStyle(e.target.value)}>
                                    <option value="">Select Style</option>
                                    {CATEGORY_HIERARCHY[selectedMainCategory].styles[selectedProductType].map((style: string) => <option key={style} value={style}>{style}</option>)}
                                  </select>
                                  <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
                              </div>
                           </div>
                        )}
                     </div>
                  </section>

                  {/* Section 3: Pricing & Inventory */}
                  <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                     <h4 className="text-sm font-bold text-primary-600 uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Pricing & Inventory</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selling Price (₹) <span className="text-red-500">*</span></label>
                           <input required type="number" className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Original MRP (₹)</label>
                           <input type="number" className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none" value={newProduct.mrp} onChange={e => setNewProduct({...newProduct, mrp: e.target.value})} />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Quantity <span className="text-red-500">*</span></label>
                           <input required type="number" className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fulfillment Method</label>
                           <div className="relative">
                              <select className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none appearance-none" value={newProduct.fulfillment} onChange={e => setNewProduct({...newProduct, fulfillment: e.target.value})}>
                                 <option>F-Assured</option>
                                 <option>Self-Shipped</option>
                                 <option>Dropship</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
                           </div>
                        </div>
                     </div>
                     <div className="mt-4 pt-2">
                        <button type="button" className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
                           <Plus className="w-4 h-4" /> Add Variations (Size, Color, etc.)
                        </button>
                     </div>
                  </section>

                  {/* Section 4: Description & Media */}
                  <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                     <h4 className="text-sm font-bold text-primary-600 uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Description & Media</h4>
                     
                     {/* Image Upload */}
                     <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Image</label>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-700 overflow-hidden border border-gray-200 dark:border-gray-600 flex-shrink-0 flex items-center justify-center">
                               {newProduct.image ? (
                                 <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover" />
                               ) : (
                                 <ImageIcon className="w-8 h-8 text-gray-400" />
                               )}
                            </div>
                            <div className="flex-1">
                               <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors inline-flex items-center gap-2">
                                  <Upload className="w-4 h-4" /> Upload Image
                                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                               </label>
                               <p className="text-xs text-gray-400 mt-2">Recommended: 800x800px, JPG or PNG.</p>
                            </div>
                        </div>
                     </div>

                     {/* AI Description */}
                     <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Detailed Description</label>
                        <div className="flex gap-2 mb-2">
                            <input 
                                type="text" 
                                placeholder="Keywords for AI (e.g., luxury, leather, waterproof)" 
                                className="flex-grow text-sm rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-2.5 outline-none focus:ring-2 focus:ring-primary-500"
                                value={newProduct.keywords}
                                onChange={(e) => setNewProduct({...newProduct, keywords: e.target.value})}
                            />
                            <button 
                                type="button"
                                onClick={handleGenerateDescription}
                                disabled={isGenerating || !newProduct.name}
                                className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-purple-200 disabled:opacity-50 transition-colors whitespace-nowrap"
                            >
                                {isGenerating ? <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div> : <Sparkles className="w-4 h-4" />}
                                AI Generate
                            </button>
                        </div>
                        <textarea 
                            required 
                            rows={5} 
                            placeholder="Product details, features, and specifications..."
                            className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none" 
                            value={newProduct.description} 
                            onChange={e => setNewProduct({...newProduct, description: e.target.value})} 
                        />
                     </div>
                  </section>
               </form>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
