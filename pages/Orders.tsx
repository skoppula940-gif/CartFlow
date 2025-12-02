import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Package, Check, Navigation, Truck, Star, Phone, MapPin, X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Order } from '../types';

const ORDER_STEPS = ['Confirm', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

export const Orders: React.FC = () => {
  const { user, orders } = useStore();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (!user) {
    navigate('/login');
    return null;
  }

  const userOrders = orders.filter(o => o.userId === user.id);

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 pb-20">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">My Orders</h1>
      </div>

      <div className="space-y-4">
        {userOrders.length === 0 ? (
           <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-1">No orders yet</h3>
                <p className="text-gray-500 mb-6">Start shopping to see your orders here.</p>
                <button 
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-primary-600 text-white rounded-full font-bold hover:bg-primary-700"
                >
                    Browse Products
                </button>
           </div>
        ) : (
            userOrders.map(order => (
                <div 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm active:scale-[0.99] transition-transform cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Order #{order.id}</h3>
                                <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                            {order.status}
                        </span>
                    </div>
                    
                    <div className="space-y-2 pl-[52px]">
                        {order.items.slice(0, 2).map(item => (
                            <p key={item.id} className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                                {item.quantity}x {item.name}
                            </p>
                        ))}
                        {order.items.length > 2 && (
                            <p className="text-xs text-gray-400 font-medium">
                                + {order.items.length - 2} more items
                            </p>
                        )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-50 dark:border-gray-700 flex justify-between items-center pl-[52px]">
                        <span className="font-bold text-gray-900 dark:text-white">₹{order.total.toLocaleString('en-IN')}</span>
                        <div className="flex items-center text-xs font-bold text-primary-600">
                            View Details <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col">
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur z-10">
                    <div>
                        <h2 className="text-xl font-bold">Order Details</h2>
                        <span className="text-sm text-gray-500">#{selectedOrder.id}</span>
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-6 space-y-8">
                    {/* Status Tracker */}
                    <div>
                        <h3 className="font-bold mb-6 text-xs uppercase tracking-wider text-gray-400">Order Status</h3>
                        <div className="relative mb-2">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full -z-10"></div>
                            <div 
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-500 rounded-full -z-10 transition-all duration-500" 
                                style={{ width: `${(ORDER_STEPS.indexOf(selectedOrder.status) / (ORDER_STEPS.length - 1)) * 100}%` }}
                            ></div>
                            <div className="flex justify-between w-full">
                                {ORDER_STEPS.map((step, index) => {
                                    const statusIndex = ORDER_STEPS.indexOf(selectedOrder.status);
                                    const isCompleted = statusIndex >= index;
                                    
                                    return (
                                        <div key={step} className="flex flex-col items-center gap-2">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-300'}`}>
                                                {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                                </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="flex justify-between w-full mt-2">
                                    {ORDER_STEPS.map((step, index) => {
                                    const isCurrent = ORDER_STEPS.indexOf(selectedOrder.status) === index;
                                    return (
                                        <span key={step} className={`text-[10px] md:text-xs font-medium text-center w-14 ${isCurrent ? 'text-primary-600' : 'text-gray-400'}`}>
                                            {step}
                                        </span>
                                    )
                                    })}
                            </div>
                        </div>
                    </div>

                    {/* Live Tracking & Partner (Only for Out for Delivery) */}
                    {selectedOrder.status === 'Out for Delivery' && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm ring-1 ring-primary-100 dark:ring-primary-900/30">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/20">
                                <h3 className="font-bold flex items-center gap-2 text-primary-700 dark:text-primary-300">
                                    <Navigation className="w-4 h-4"/> Live Tracking
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                    </span>
                                    <span className="text-xs font-bold text-green-600 dark:text-green-400">Live Updates</span>
                                </div>
                            </div>
                            
                            {/* Simulated Map */}
                            <div className="relative h-64 w-full bg-[#f0f4f7] dark:bg-gray-700/30 group overflow-hidden">
                                {/* Abstract Map Background Pattern */}
                                <div className="absolute inset-0 opacity-10 dark:opacity-5" style={{
                                    backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
                                    backgroundSize: '20px 20px'
                                }}></div>
                                {/* Roads Simulation */}
                                <div className="absolute top-1/2 left-0 right-0 h-3 bg-white/50 transform -rotate-6"></div>
                                <div className="absolute top-0 bottom-0 left-1/3 w-4 bg-white/50 transform rotate-12"></div>
                                
                                {/* Pulse Marker */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                    <div className="relative">
                                        <span className="absolute -inset-6 rounded-full bg-primary-500/20 animate-ping duration-1000"></span>
                                        <span className="absolute -inset-2 rounded-full bg-primary-500/40 animate-pulse"></span>
                                        <div className="bg-primary-600 text-white p-2.5 rounded-full shadow-lg border-2 border-white dark:border-gray-800 transform transition-transform hover:scale-110">
                                            <Truck className="w-5 h-5" />
                                        </div>
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-gray-900 text-white px-3 py-1.5 rounded-lg shadow-xl text-xs font-bold whitespace-nowrap animate-bounce">
                                            Arriving in 12 mins
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Partner Info */}
                            <div className="p-4 flex items-center gap-4 bg-white dark:bg-gray-800 relative z-20">
                                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden ring-2 ring-gray-100 dark:ring-gray-700">
                                        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Partner" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow">
                                    <h4 className="font-bold text-gray-900 dark:text-white">Rahul Kumar</h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                        <div className="flex items-center gap-0.5 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded text-yellow-700 dark:text-yellow-400 font-bold">
                                            <span>4.8</span> <Star className="w-3 h-3 fill-current" />
                                        </div>
                                        <span>•</span>
                                        <span>Delivery Partner</span>
                                    </div>
                                </div>
                                <button className="p-3 rounded-full bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30 transition-colors">
                                    <Phone className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Items */}
                    <div>
                            <h3 className="font-bold mb-4 text-xs uppercase tracking-wider text-gray-400">Items Ordered</h3>
                            <div className="space-y-3">
                                {selectedOrder.items.map(item => (
                                    <div key={item.id} className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-gray-200" />
                                        <div className="flex-grow">
                                            <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                                            <p className="text-xs text-gray-500">{item.category}</p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-sm">Qty: {item.quantity}</span>
                                                <span className="font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Address */}
                        <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                            <h4 className="font-bold mb-3 flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                                <MapPin className="w-4 h-4 text-primary-600"/> Delivery Address
                            </h4>
                            <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pl-6">
                                <span className="font-semibold text-gray-900 dark:text-gray-200">{selectedOrder.address.type}</span><br/>
                                {selectedOrder.address.street}<br/>
                                {selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.zip}<br/>
                                <span className="text-xs mt-1 block">Phone: {selectedOrder.address.mobile}</span>
                            </div>
                        </div>
                        {/* Payment Info */}
                        <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                            <h4 className="font-bold mb-3 text-sm text-gray-900 dark:text-white">Payment Summary</h4>
                            <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-500">
                                    <span>Subtotal</span>
                                    <span>₹{(selectedOrder.total / 1.05).toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                    <span>Tax (5%)</span>
                                    <span>₹{(selectedOrder.total - (selectedOrder.total / 1.05)).toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                                    <span>Total Paid</span>
                                    <span>₹{selectedOrder.total.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="mt-2 text-xs bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded inline-block font-medium">
                                    Paid via {selectedOrder.paymentMethod}
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};