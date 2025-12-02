
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  description: string;
  stock: number;
  rating: number;
  reviews: number;
  isNew?: boolean;
  reviewsList?: Review[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  street: string;
  city: string;
  state: string;
  zip: string;
  mobile: string;
}

export interface User {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  role: 'user' | 'admin';
  avatar?: string;
  wishlist: string[];
  addresses: Address[];
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'Confirm' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  date: string;
  address: Address;
  paymentMethod: string;
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface BannerConfig {
  imageUrl: string;
  badgeText: string;
  title: string;
  subtitle: string;
  buttonText: string;
}

export interface FeaturedDeal {
  image: string;
  title: string;
  price: number;
  originalPrice: number;
  offerText: string;
  rating: number;
  description: string;
}

export type SortOption = 'price-asc' | 'price-desc' | 'rating' | 'newest';
