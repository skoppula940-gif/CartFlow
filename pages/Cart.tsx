import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Minus, Plus, Trash2, ArrowRight, Check, PlusCircle, Smartphone, ShieldCheck, QrCode, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Address } from '../types';

export const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, placeOrder, user, addAddress } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'address' | 'payment'>('cart');
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  
  // Payment States
  const [paymentMode, setPaymentMode] = useState<'selection' | 'qr'>('selection');
  const [paymentStatus, setPaymentStatus] = useState<'waiting' | 'verifying' | 'success' | 'failed'>('waiting');
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [razorpayOrderId, setRazorpayOrderId] = useState('');

  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    type: 'Home',
    street: '',
    city: '',
    state: '',
    zip: '',
    mobile: user?.mobile || ''
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  // Handle direct Buy Now navigation
  useEffect(() => {
    if (location.state && (location.state as any).checkout && user) {
        setCheckoutStep('address');
        if (user.addresses.length > 0 && !selectedAddressId) {
            setSelectedAddressId(user.addresses[0].id);
        }
    }
  }, [location, user, selectedAddressId]);

  // Initialize simulated Razorpay Order ID when entering QR mode
  useEffect(() => {
    if (paymentMode === 'qr' && !razorpayOrderId) {
        // Simulate Order ID generation
        setRazorpayOrderId('order_' + Math.random().toString(36).substr(2, 9));
        setPaymentStatus('waiting');
        setTimeLeft(180);
    }
  }, [paymentMode]);

  // Countdown Timer & Polling Logic
  useEffect(() => {
    let timerInterval: any;
    let pollingInterval: any;

    if (paymentMode === 'qr' && paymentStatus === 'waiting') {
        // Countdown
        timerInterval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setPaymentStatus('failed');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Simulate Backend Polling (check_payment.php)
        pollingInterval = setInterval(() => {
            // In a real app, this would fetch an API.
            // Here we simulate a user paying after ~8 seconds.
            const shouldSucceed = Math.random() > 0.8; // Random simulation
            // For demo purposes, let's force success if time is between 170 and 172 (approx 8-10 seconds in)
            const isDemoSuccessTime = timeLeft < 172 && timeLeft > 168;

            if (isDemoSuccessTime) {
                setPaymentStatus('success');
            }
        }, 2000);
    }

    return () => {
        clearInterval(timerInterval);
        clearInterval(pollingInterval);
    };
  }, [paymentMode, paymentStatus, timeLeft]);

  // Handle Success Transition
  useEffect(() => {
    if (paymentStatus === 'success') {
        const address = user?.addresses.find(a => a.id === selectedAddressId);
        if (address) {
            setTimeout(() => {
                const orderId = placeOrder(address, "UPI-QR");
                if (orderId) {
                    navigate(`/order-success/${orderId}`);
                } else {
                    navigate('/profile'); // Fallback
                }
            }, 3000); // Wait 3 seconds to show success animation
        }
    }
  }, [paymentStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      alert("Please login to checkout");
      navigate('/login');
      return;
    }
    setCheckoutStep('address');
    if (user.addresses.length > 0 && !selectedAddressId) {
        setSelectedAddressId(user.addresses[0].id);
    }
  };

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
    setSelectedAddressId(address.id);
    setIsAddingAddress(false);
    setNewAddress({ type: 'Home', street: '', city: '', state: '', zip: '', mobile: user?.mobile || '' });
  };

  const handleDeepLinkPay = () => {
    const address = user?.addresses.find(a => a.id === selectedAddressId);
    if (!address) return;
    
    // Original Deep Link Logic
    const upiUrl = `upi://pay?pa=9652786674@superyes&pn=CartRush&tn=Order Payment&am=${total}&cu=INR&tr=${razorpayOrderId}`;
    window.location.href = upiUrl;

    setTimeout(() => {
        const orderId = placeOrder(address, "UPI App");
        if (orderId) {
            navigate(`/order-success/${orderId}`);
        } else {
            navigate('/profile');
        }
    }, 1000);
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <Trash2 className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/" className="px-6 py-2 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  // Address Selection View
  if (checkoutStep === 'address') {
    return (
      <div className="max-w-2xl mx-auto py-6">
        <button onClick={() => setCheckoutStep('cart')} className="mb-6 text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1">
             &larr; Back to Cart
        </button>
        <h2 className="text-2xl font-bold mb-6">Select Delivery Address</h2>
        
        <div className="space-y-4 mb-8">
            {user?.addresses.map(addr => (
                <div 
                    key={addr.id} 
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${selectedAddressId === addr.id ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
                >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${selectedAddressId === addr.id ? 'border-primary-600' : 'border-gray-400'}`}>
                        {selectedAddressId === addr.id && <div className="w-2.5 h-2.5 rounded-full bg-primary-600"></div>}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900 dark:text-white">{addr.type}</span>
                            <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{addr.mobile}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{addr.street}, {addr.city}, {addr.state} - {addr.zip}</p>
                    </div>
                </div>
            ))}

            {isAddingAddress ? (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-bold mb-4">Add New Address</h3>
                    <form onSubmit={handleAddAddress} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <select 
                                className="rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 p-2"
                                value={newAddress.type}
                                onChange={e => setNewAddress({...newAddress, type: e.target.value as any})}
                            >
                                <option>Home</option>
                                <option>Work</option>
                                <option>Other</option>
                            </select>
                            <input 
                                type="text" placeholder="Mobile" className="rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 p-2"
                                value={newAddress.mobile} onChange={e => setNewAddress({...newAddress, mobile: e.target.value})}
                                required
                            />
                        </div>
                        <input 
                            type="text" placeholder="Street Address" className="w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 p-2"
                            value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                            required
                        />
                         <div className="grid grid-cols-2 gap-4">
                            <input 
                                type="text" placeholder="City" className="rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 p-2"
                                value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                                required
                            />
                            <input 
                                type="text" placeholder="State" className="rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 p-2"
                                value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})}
                                required
                            />
                        </div>
                        <input 
                            type="text" placeholder="ZIP Code" className="w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 p-2"
                            value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})}
                            required
                        />
                        <div className="flex gap-3 pt-2">
                            <button type="submit" className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700">Save Address</button>
                            <button type="button" onClick={() => setIsAddingAddress(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600">Cancel</button>
                        </div>
                    </form>
                </div>
            ) : (
                <button 
                    onClick={() => setIsAddingAddress(true)}
                    className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 hover:text-primary-600 hover:border-primary-300 dark:hover:border-primary-800 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                    <PlusCircle className="w-5 h-5" /> Add New Address
                </button>
            )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
             <div className="flex justify-between items-center mb-4">
                 <span className="text-gray-500">Total Amount</span>
                 <span className="text-xl font-bold">₹{total.toLocaleString('en-IN')}</span>
             </div>
             <button 
                onClick={() => setCheckoutStep('payment')}
                disabled={!selectedAddressId}
                className="w-full py-3.5 bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
             >
                Proceed to Payment <ArrowRight className="w-4 h-4"/>
             </button>
        </div>
      </div>
    );
  }

  // Payment Selection View
  if (checkoutStep === 'payment') {
      // QR Payment Flow
      if (paymentMode === 'qr') {
          // Construct UPI URL with Razorpay-style params
          // upi://pay?pa=9652786674@superyes&pn=FAM&am=AMOUNT&cu=INR&tr=ORDER_ID
          const qrUpiUrl = `upi://pay?pa=9652786674@superyes&pn=CartRush&am=${total}&cu=INR&tr=${razorpayOrderId}`;
          // Generate QR Code URL using a public API
          const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrUpiUrl)}`;

          return (
            <div className="max-w-md mx-auto py-10 px-4 text-center">
                 <button onClick={() => setPaymentMode('selection')} className="absolute top-24 left-4 md:left-auto text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1">
                    &larr; Back
                 </button>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    {paymentStatus === 'success' ? (
                        <div className="py-10 animate-in zoom-in duration-300">
                            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check className="w-12 h-12" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Received</h2>
                            <p className="text-gray-500">Order successfully placed!</p>
                            <p className="text-xs text-gray-400 mt-4">Generating bill...</p>
                        </div>
                    ) : paymentStatus === 'failed' ? (
                        <div className="py-10">
                            <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-12 h-12" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Failed</h2>
                            <p className="text-gray-500 mb-6">Transaction timed out or failed.</p>
                            <button 
                                onClick={() => { setTimeLeft(180); setPaymentStatus('waiting'); }}
                                className="px-6 py-2 bg-primary-600 text-white rounded-full font-bold hover:bg-primary-700"
                            >
                                Retry Payment
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">Scan & Pay</h2>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400">Amount</p>
                                    <p className="text-lg font-bold">₹{total.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                            
                            <div className="bg-white p-4 rounded-xl border border-gray-200 inline-block mb-6 relative group">
                                <img src={qrImageUrl} alt="Payment QR" className="w-48 h-48 object-contain mix-blend-multiply" />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-10 h-10 bg-white rounded-lg p-1 shadow-md">
                                        <div className="w-full h-full bg-gradient-to-br from-primary-500 to-purple-600 rounded flex items-center justify-center text-white font-bold text-xs">
                                            UPI
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-2 mb-6">
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono font-medium ${timeLeft < 60 ? 'bg-red-50 text-red-600' : 'bg-primary-50 text-primary-600'}`}>
                                    <Clock className="w-4 h-4" />
                                    <span>{formatTime(timeLeft)}</span>
                                </div>
                                <p className="text-sm text-gray-500 animate-pulse">Waiting for payment...</p>
                            </div>

                            <div className="text-xs text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
                                <p className="mb-1">Order ID: <span className="font-mono text-gray-500">{razorpayOrderId}</span></p>
                                <p>Do not close this screen until payment completes.</p>
                            </div>
                        </>
                    )}
                    
                    {/* Progress Bar for Timer */}
                    {paymentStatus === 'waiting' && (
                         <div className="absolute bottom-0 left-0 h-1 bg-primary-600 transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft / 180) * 100}%` }}></div>
                    )}
                </div>
            </div>
          )
      }

      // Default Payment Selection Screen
      return (
        <div className="max-w-2xl mx-auto py-6">
            <button onClick={() => setCheckoutStep('address')} className="mb-6 text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1">
                &larr; Back to Address
            </button>
            <h2 className="text-2xl font-bold mb-6">Choose Payment Method</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Option 1: QR Code */}
                <button 
                    onClick={() => setPaymentMode('qr')}
                    className="flex flex-col items-center p-6 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all group text-center"
                >
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <QrCode className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">Scan QR Code</h3>
                    <p className="text-sm text-gray-500">Scan via GPay, PhonePe, Paytm</p>
                    <span className="mt-4 text-xs font-bold text-primary-600 bg-primary-100 px-3 py-1 rounded-full">Recommended</span>
                </button>

                {/* Option 2: Deep Link (App) */}
                <button 
                    onClick={handleDeepLinkPay}
                    className="flex flex-col items-center p-6 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all group text-center"
                >
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Smartphone className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">Pay with UPI App</h3>
                    <p className="text-sm text-gray-500">Directly open app on this phone</p>
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3">
                 <ShieldCheck className="w-5 h-5 text-green-500" />
                 <p className="text-sm text-gray-600 dark:text-gray-400">
                    Safe and Secure Payments. 100% Refund Policy on failed transactions.
                 </p>
            </div>
        </div>
      );
  }

  // Default Cart View
  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{item.name}</h3>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-md hover:bg-white dark:hover:bg-gray-800 shadow-sm transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-medium w-4 text-center text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-md hover:bg-white dark:hover:bg-gray-800 shadow-sm transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="font-bold text-lg">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax (5%)</span>
                <span>₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="h-px bg-gray-100 dark:bg-gray-700 my-2"></div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            <button 
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              Checkout <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};