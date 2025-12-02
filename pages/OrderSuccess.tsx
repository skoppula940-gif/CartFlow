import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Check, Printer, Home, ShoppingBag, ArrowRight } from 'lucide-react';

export const OrderSuccess: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders } = useStore();
  const navigate = useNavigate();
  
  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
             <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
             <p className="text-gray-500 mb-6">We couldn't find the order details you're looking for.</p>
             <Link to="/" className="text-primary-600 font-bold hover:underline">Return Home</Link>
        </div>
    );
  }

  const subtotal = order.total / 1.05;
  const tax = order.total - subtotal;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* Success Animation Header */}
      <div className="text-center mb-8 animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
          <Check className="w-10 h-10 stroke-[3]" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order Successful!</h1>
        <p className="text-gray-500">Thank you for your purchase.</p>
      </div>

      {/* Bill / Invoice Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden print:shadow-none print:border-none">
        
        {/* Bill Header */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-1">CartRush</h2>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Official Receipt</p>
            </div>
            <div className="text-right">
                <p className="font-mono font-bold text-gray-900 dark:text-white">#{order.id}</p>
                <p className="text-xs text-gray-500">{new Date(order.date).toLocaleString()}</p>
            </div>
        </div>

        {/* Bill Body */}
        <div className="p-6">
            
            {/* Items Table */}
            <div className="mb-8">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-gray-500 border-b border-gray-100 dark:border-gray-700">
                            <th className="text-left py-2 font-medium">Item</th>
                            <th className="text-center py-2 font-medium">Qty</th>
                            <th className="text-right py-2 font-medium">Price</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                        {order.items.map((item, idx) => (
                            <tr key={`${item.id}-${idx}`}>
                                <td className="py-3 pr-2">
                                    <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.category}</p>
                                </td>
                                <td className="py-3 text-center text-gray-600 dark:text-gray-400">x{item.quantity}</td>
                                <td className="py-3 text-right font-medium text-gray-900 dark:text-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Breakdown */}
            <div className="flex justify-end mb-8">
                <div className="w-full sm:w-1/2 space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Tax (5%)</span>
                        <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-3 border-t border-gray-100 dark:border-gray-700">
                        <span>Total Paid</span>
                        <span>₹{order.total.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-right mt-1">
                         <span className="text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded">
                            {order.paymentMethod}
                         </span>
                    </div>
                </div>
            </div>

            {/* Address */}
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl text-sm border border-gray-100 dark:border-gray-700">
                <p className="font-bold text-gray-900 dark:text-white mb-1">Delivered To:</p>
                <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{order.address.type}:</span> {order.address.street}, {order.address.city}, {order.address.state} - {order.address.zip}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Phone: {order.address.mobile}</p>
            </div>

        </div>

        {/* Footer Actions (Hidden when printing) */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 print:hidden flex flex-col sm:flex-row gap-3">
             <button 
                onClick={handlePrint}
                className="flex-1 py-3 border border-gray-200 dark:border-gray-600 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
             >
                <Printer className="w-4 h-4" /> Print Receipt
             </button>
             <Link 
                to="/"
                className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
             >
                Continue Shopping <ArrowRight className="w-4 h-4" />
             </Link>
        </div>
      </div>
    </div>
  );
};