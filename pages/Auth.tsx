import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Phone, ArrowRight } from 'lucide-react';

export const Auth: React.FC = () => {
  const { login } = useStore();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length >= 10) {
      login(mobile, isAdminLogin ? 'admin' : 'user');
      navigate(isAdminLogin ? '/admin' : '/');
    } else {
      alert("Please enter a valid mobile number");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Welcome
          </h1>
          <p className="text-gray-500 mt-2">
            Login to your {isAdminLogin ? 'Seller' : 'CartRush'} account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input 
                type="tel" 
                placeholder="Mobile Number" 
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                maxLength={10}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 rounded-xl bg-primary-600 text-white font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            Login <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
          <button 
            onClick={() => { setIsAdminLogin(!isAdminLogin); setMobile(''); }}
            className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
          >
            {isAdminLogin ? "Switch to User Login" : "Switch to Seller/Admin Login"}
          </button>
        </div>
      </div>
      
      <p className="mt-6 text-center text-gray-400 text-xs">
        Demo Credentials: Use any 10-digit number.
      </p>
    </div>
  );
};