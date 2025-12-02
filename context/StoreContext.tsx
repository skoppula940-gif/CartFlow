
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, User, Order, Address, Review, BannerConfig, FeaturedDeal } from '../types';
import { INITIAL_PRODUCTS } from '../constants';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  user: User | null;
  wishlist: string[];
  orders: Order[];
  banner: BannerConfig;
  featuredDeal: FeaturedDeal;
  darkMode: boolean;
  allUsers: User[];
  toggleDarkMode: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  login: (mobile: string, role?: 'user' | 'admin') => void;
  logout: () => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  placeOrder: (address: Address, paymentMethod: string) => string | undefined;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addAddress: (address: Address) => void;
  deleteAddress: (addressId: string) => void;
  addReview: (productId: string, review: Review) => void;
  grantAdminAccess: () => void;
  updateBanner: (config: BannerConfig) => void;
  updateFeaturedDeal: (config: FeaturedDeal) => void;
  updateUserProfile: (data: Partial<User>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [banner, setBanner] = useState<BannerConfig>({
    imageUrl: "https://picsum.photos/1200/400?grayscale",
    badgeText: "Summer Sale",
    title: "Minimalist Collection",
    subtitle: "Upgrade your essentials with up to 50% off on selected items.",
    buttonText: "Shop Now"
  });
  
  // Initial Featured Deal
  const [featuredDeal, setFeaturedDeal] = useState<FeaturedDeal>({
    title: "Samsung Galaxy S25+",
    price: 79999,
    originalPrice: 99999,
    description: "16.91cm Dynamic AMOLED 2X",
    image: "https://images.unsplash.com/photo-1610945265078-38584e12e8dc?w=800&q=80",
    offerText: "20% OFF",
    rating: 4.8
  });

  // Initialize from local storage if available
  useEffect(() => {
    const savedCart = localStorage.getItem('lumina_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    
    const savedUser = localStorage.getItem('lumina_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (!parsedUser.addresses) parsedUser.addresses = [];
      if (!parsedUser.wishlist) parsedUser.wishlist = [];
      setUser(parsedUser);
      setWishlist(parsedUser.wishlist || []);
    }

    const savedAllUsers = localStorage.getItem('lumina_all_users');
    if (savedAllUsers) setAllUsers(JSON.parse(savedAllUsers));

    const savedOrders = localStorage.getItem('lumina_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    const savedBanner = localStorage.getItem('lumina_banner');
    if (savedBanner) setBanner(JSON.parse(savedBanner));

    const savedDeal = localStorage.getItem('lumina_featured_deal');
    if (savedDeal) setFeaturedDeal(JSON.parse(savedDeal));

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lumina_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('lumina_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('lumina_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    if (user) localStorage.setItem('lumina_user', JSON.stringify(user));
    else localStorage.removeItem('lumina_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('lumina_banner', JSON.stringify(banner));
  }, [banner]);

  useEffect(() => {
    localStorage.setItem('lumina_featured_deal', JSON.stringify(featuredDeal));
  }, [featuredDeal]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const toggleWishlist = (productId: string) => {
    const newWishlist = wishlist.includes(productId) 
      ? wishlist.filter(id => id !== productId) 
      : [...wishlist, productId];
    
    setWishlist(newWishlist);

    if (user) {
        const updatedUser = { ...user, wishlist: newWishlist };
        setUser(updatedUser);
        setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    }
  };

  const login = (mobile: string, role: 'user' | 'admin' = 'user') => {
    let existingUser = allUsers.find(u => u.mobile === mobile);
    
    if (!existingUser) {
        existingUser = {
            id: 'u_' + Date.now(),
            name: 'User ' + mobile.slice(-4),
            mobile,
            role,
            wishlist: [],
            addresses: []
        };
        setAllUsers(prev => [...prev, existingUser!]);
    } else {
        if (role === 'admin') existingUser.role = 'admin';
    }

    setUser(existingUser);
    setWishlist(existingUser.wishlist || []);
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setWishlist([]);
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const addAddress = (address: Address) => {
    if (!user) return;
    const updatedUser = { ...user, addresses: [...user.addresses, address] };
    setUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
  };

  const deleteAddress = (addressId: string) => {
    if (!user) return;
    const updatedUser = { ...user, addresses: user.addresses.filter(a => a.id !== addressId) };
    setUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
  };

  const placeOrder = (address: Address, paymentMethod: string) => {
    if (!user) return;
    const orderId = 'ORD-' + Math.floor(Math.random() * 100000);
    const newOrder: Order = {
      id: orderId,
      userId: user.id,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'Confirm',
      date: new Date().toISOString(),
      address,
      paymentMethod 
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    return orderId;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const addReview = (productId: string, review: Review) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const currentReviews = p.reviewsList || [];
        const newReviewsList = [review, ...currentReviews];
        const newReviewCount = newReviewsList.length;
        const newRating = newReviewsList.reduce((acc, r) => acc + r.rating, 0) / newReviewCount;
        
        return {
          ...p,
          reviewsList: newReviewsList,
          reviews: newReviewCount,
          rating: parseFloat(newRating.toFixed(1))
        };
      }
      return p;
    }));
  };

  const grantAdminAccess = () => {
    if (user) {
        const updatedUser = { ...user, role: 'admin' as const };
        setUser(updatedUser);
        setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    }
  };

  const updateBanner = (config: BannerConfig) => {
    setBanner(config);
  };

  const updateFeaturedDeal = (config: FeaturedDeal) => {
    setFeaturedDeal(config);
  };

  const updateUserProfile = (updatedData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
  };

  return (
    <StoreContext.Provider value={{
      products, cart, user, wishlist, orders, banner, featuredDeal, darkMode, allUsers, toggleDarkMode,
      addToCart, removeFromCart, updateQuantity, toggleWishlist,
      login, logout, addProduct, updateProduct, deleteProduct, placeOrder, updateOrderStatus,
      addAddress, deleteAddress, addReview, grantAdminAccess, updateBanner, updateFeaturedDeal, updateUserProfile
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
