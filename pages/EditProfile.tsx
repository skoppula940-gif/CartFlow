
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ShoppingBag } from 'lucide-react';

export const EditProfile: React.FC = () => {
  const { user, updateUserProfile, cart } = useStore();
  const navigate = useNavigate();

  // Split name into First and Last for the form
  const [firstName, setFirstName] = useState(user?.name.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.name.split(' ').slice(1).join(' ') || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [email, setEmail] = useState(user?.email || '');

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSubmit = () => {
    updateUserProfile({
        name: `${firstName} ${lastName}`.trim(),
        mobile,
        email
    });
    alert("Profile Updated Successfully!");
    navigate('/profile');
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header */}
      <div className="bg-blue-600 p-4 flex items-center justify-between text-white sticky top-0 z-10">
        <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6" /></button>
        <h1 className="font-medium text-lg">Edit Profile</h1>
        <div className="flex gap-4">
            <Search className="w-6 h-6" />
            <div className="relative">
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
            </div>
        </div>
      </div>

      {/* Avatar Section */}
      <div className="bg-blue-600 pb-8 rounded-b-[2.5rem] relative mb-12">
        <div className="flex justify-center items-center gap-4 pt-4">
            <div className="w-24 h-24 bg-white rounded-full p-1 cursor-pointer hover:scale-105 transition-transform">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Male" className="w-full h-full rounded-full" />
            </div>
            <span className="text-white/80 font-medium">or</span>
            <div className="w-24 h-24 bg-white rounded-full p-1 cursor-pointer hover:scale-105 transition-transform">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="Female" className="w-full h-full rounded-full" />
            </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="px-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="First Name" 
                    className="w-full border-b border-gray-300 py-2 focus:border-blue-600 outline-none transition-colors"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <label className="absolute -top-2 left-0 text-xs text-gray-500">First Name</label>
            </div>
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Last Name" 
                    className="w-full border-b border-gray-300 py-2 focus:border-blue-600 outline-none transition-colors"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <label className="absolute -top-2 left-0 text-xs text-gray-500">Last Name</label>
            </div>
        </div>

        <button 
            onClick={handleSubmit} 
            className="w-full py-3 bg-white border border-blue-600 text-blue-600 font-bold rounded shadow-sm uppercase tracking-wide hover:bg-blue-50 transition-colors"
        >
            Submit
        </button>

        <div className="pt-4 space-y-6">
            <div className="relative">
                <input 
                    type="tel" 
                    placeholder="Mobile Number" 
                    className="w-full border-b border-gray-300 py-2 focus:border-blue-600 outline-none transition-colors pr-16"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                />
                <label className="absolute -top-2 left-0 text-xs text-gray-500">Mobile Number</label>
                <button className="absolute right-0 bottom-2 text-blue-600 text-sm font-medium hover:underline">Update</button>
            </div>

            <div className="relative">
                <input 
                    type="email" 
                    placeholder="Email ID" 
                    className="w-full border-b border-gray-300 py-2 focus:border-blue-600 outline-none transition-colors pr-16"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label className="absolute -top-2 left-0 text-xs text-gray-500">Email ID</label>
                <button className="absolute right-0 bottom-2 text-blue-600 text-sm font-medium hover:underline">Verify</button>
            </div>
        </div>
      </div>
      
      {/* Deactivate Link */}
      <div className="mt-12 text-center">
        <button className="text-blue-600 text-sm font-medium hover:underline">Deactivate Account</button>
      </div>
    </div>
  );
};
