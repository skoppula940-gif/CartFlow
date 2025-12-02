
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Search, Menu, Sun, Moon, Home, Grid, X, ChevronRight, Camera, Mic, PlayCircle, User } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cart, user, darkMode, toggleDarkMode, logout, products } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isAdmin = user?.role === 'admin';
  const isPlayPage = location.pathname === '/play';

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(searchQuery.trim()) {
        setIsFocused(false);
    }
  };

  // Optimized Filtering using useMemo
  const filteredProducts = useMemo(() => {
    if (!debouncedQuery) return [];
    const lowerQuery = debouncedQuery.toLowerCase();
    return products.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
      ).slice(0, 5); // Limit results
  }, [debouncedQuery, products]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isPlayPage ? 'bg-black' : 'bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100'} pb-20 md:pb-0`}>
      {/* Header - Hidden on Play Page for Immersion */}
      {!isPlayPage && (
        <header className="sticky top-0 z-40 bg-blue-600 dark:bg-gray-900 shadow-md">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
            
            {/* Logo & Mobile Menu */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <Link to="/" className="text-xl md:text-2xl font-bold text-white italic tracking-tighter">
                CartRush<span className="text-yellow-400 text-3xl leading-3 text-right inline-block">.</span>
                </Link>
            </div>

            {/* Search Bar Container */}
            <div className="flex-1 max-w-2xl relative" ref={searchRef}>
                <form onSubmit={handleSearchSubmit} className="relative w-full">
                <div className="relative flex items-center w-full bg-white rounded-md overflow-hidden h-10 shadow-sm">
                    <div className="pl-3 text-gray-400">
                    <Search className="w-5 h-5" />
                    </div>
                    <input 
                    type="text" 
                    placeholder="Search for products, brands and more" 
                    className="w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    />
                    <div className="flex items-center gap-3 pr-3 text-blue-600 bg-blue-50 h-full pl-2">
                    <Mic className="w-5 h-5 cursor-pointer" />
                    <Camera className="w-5 h-5 cursor-pointer" />
                    </div>
                </div>

                {/* Clear Button */}
                {searchQuery && (
                    <button 
                    type="button"
                    onClick={() => { setSearchQuery(''); setDebouncedQuery(''); setIsFocused(true); }}
                    className="absolute right-20 top-2.5 p-0.5 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
                </form>
                
                {/* Search Dropdown */}
                {isFocused && searchQuery && (
                <div className="absolute top-11 left-0 w-full bg-white dark:bg-gray-800 rounded-b-lg shadow-xl border-x border-b border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                    {filteredProducts.length > 0 ? (
                    <div className="py-2">
                            {filteredProducts.map(p => (
                                <Link 
                                to={`/product/${p.id}`} 
                                key={p.id} 
                                className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group border-b border-gray-50 dark:border-gray-700 last:border-0" 
                                onClick={() => {
                                    setSearchQuery('');
                                    setIsFocused(false);
                                }}
                                >
                                <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover bg-gray-100" />
                                <div className="flex-grow min-w-0">
                                    <div className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                                        {p.name}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate">in {p.category}</div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                </Link>
                            ))}
                    </div>
                    ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                        No results found
                    </div>
                    )}
                </div>
                )}
            </div>

            {/* Desktop Right Icons */}
            <div className="flex items-center gap-4 text-white">
                <button onClick={toggleDarkMode} className="p-1 hover:bg-blue-700 rounded-full transition-colors hidden md:block">
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                
                {isAdmin && (
                <Link to="/admin" className="hidden md:flex items-center gap-1 text-sm font-medium hover:text-yellow-300">
                    Admin
                </Link>
                )}

                <div className="hidden md:block">
                    {user ? (
                    <Link to="/profile" className="font-medium text-sm hover:text-yellow-300">
                        {user.name.split(' ')[0]}
                    </Link>
                    ) : (
                    <Link to="/login" className="font-medium text-sm bg-white text-blue-600 px-4 py-1 rounded-sm hover:bg-gray-100">Login</Link>
                    )}
                </div>

                <Link to="/cart" className="relative p-1 hover:bg-blue-700 rounded-full transition-colors">
                <ShoppingBag className="h-6 w-6" />
                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-blue-600">
                    {cartCount}
                    </span>
                )}
                </Link>
            </div>
            </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-grow w-full">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className={`md:hidden fixed bottom-0 left-0 w-full flex justify-between px-2 py-2 z-50 safe-area-pb shadow-[0_-2px_10px_rgba(0,0,0,0.05)] transition-all ${isPlayPage ? 'bg-black/90 backdrop-blur-md border-t border-white/10 text-gray-300' : 'bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800'}`}>
        <Link to="/" className={`flex flex-col items-center gap-1 flex-1 ${location.pathname === '/' ? 'text-blue-600' : isPlayPage ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
          <div className="relative">
             <Home className={`h-6 w-6 ${location.pathname === '/' ? 'fill-blue-100' : ''}`} />
          </div>
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        
        <Link to="/play" className={`flex flex-col items-center gap-1 flex-1 ${location.pathname === '/play' ? 'text-white' : isPlayPage ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
          <PlayCircle className={`h-6 w-6 ${location.pathname === '/play' ? 'fill-white text-white' : ''}`} />
          <span className="text-[10px] font-medium">Play</span>
        </Link>

        <Link to="/categories" className={`flex flex-col items-center gap-1 flex-1 ${location.pathname === '/categories' ? 'text-blue-600' : isPlayPage ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
           <Grid className={`h-6 w-6 ${location.pathname === '/categories' ? 'fill-blue-100' : ''}`} />
           <span className="text-[10px] font-medium">Categories</span>
        </Link>

        <Link to={user ? "/profile" : "/login"} className={`flex flex-col items-center gap-1 flex-1 ${location.pathname === '/profile' ? 'text-blue-600' : isPlayPage ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
          <User className={`h-6 w-6 ${location.pathname === '/profile' ? 'fill-blue-100' : ''}`} />
          <span className="text-[10px] font-medium">Account</span>
        </Link>

        <Link to="/cart" className={`flex flex-col items-center gap-1 flex-1 relative ${location.pathname === '/cart' ? 'text-blue-600' : isPlayPage ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
          <div className="relative">
            <ShoppingBag className={`h-6 w-6 ${location.pathname === '/cart' ? 'fill-blue-100' : ''}`} />
            {cartCount > 0 && <span className={`absolute -top-1 -right-1 text-white text-[9px] font-bold px-1 rounded-full border ${isPlayPage ? 'bg-red-600 border-black' : 'bg-red-600 border-white'}`}>
                {cartCount}
            </span>}
          </div>
          <span className="text-[10px] font-medium">Cart</span>
        </Link>
      </div>
    </div>
  );
};
