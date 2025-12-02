
import { Product, Review } from './types';

export const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home",
  "Beauty",
  "Sports"
];

const COMMON_REVIEWS: Review[] = [
  { id: '1', user: 'Alex D.', rating: 5, comment: 'Absolutely amazing quality!', date: '2023-10-15' },
  { id: '2', user: 'Sam K.', rating: 4, comment: 'Good value for money.', date: '2023-10-12' },
  { id: '3', user: 'Jordan P.', rating: 5, comment: 'Fast delivery and great packaging.', date: '2023-10-10' }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wireless Noise Cancelling Headphones',
    price: 14999,
    originalPrice: 19999,
    category: 'Electronics',
    image: 'https://picsum.photos/400/400?random=1',
    description: 'Immerse yourself in music with industry-leading noise cancellation. Features 30-hour battery life and touch controls.',
    stock: 15,
    rating: 4.8,
    reviews: 124,
    isNew: true,
    reviewsList: COMMON_REVIEWS
  },
  {
    id: '2',
    name: 'Minimalist Leather Watch',
    price: 3499,
    category: 'Fashion',
    image: 'https://picsum.photos/400/400?random=2',
    description: 'Elegant design meets everyday functionality. Genuine leather strap with water-resistant casing.',
    stock: 50,
    rating: 4.5,
    reviews: 89,
    reviewsList: [COMMON_REVIEWS[0]]
  },
  {
    id: '3',
    name: 'Smart Home Speaker Mini',
    price: 2999,
    originalPrice: 4999,
    category: 'Electronics',
    image: 'https://picsum.photos/400/400?random=3',
    description: 'Compact smart speaker with big sound. Control your smart home, play music, and get answers.',
    stock: 120,
    rating: 4.2,
    reviews: 450,
    reviewsList: []
  },
  {
    id: '4',
    name: 'Organic Cotton T-Shirt',
    price: 899,
    category: 'Fashion',
    image: 'https://picsum.photos/400/400?random=4',
    description: 'Soft, breathable, and sustainably sourced. The perfect staple for any wardrobe.',
    stock: 200,
    rating: 4.7,
    reviews: 67,
    reviewsList: [COMMON_REVIEWS[1], COMMON_REVIEWS[2]]
  },
  {
    id: '5',
    name: 'Ceramic Coffee Pour-Over Set',
    price: 1599,
    category: 'Home',
    image: 'https://picsum.photos/400/400?random=5',
    description: 'Brew cafe-quality coffee at home. Hand-glazed ceramic with heat-retention properties.',
    stock: 30,
    rating: 4.9,
    reviews: 210,
    reviewsList: COMMON_REVIEWS
  },
  {
    id: '6',
    name: 'Hydrating Face Serum',
    price: 1299,
    category: 'Beauty',
    image: 'https://picsum.photos/400/400?random=6',
    description: 'Restore your skin\'s natural glow with Hyaluronic acid and Vitamin C.',
    stock: 85,
    rating: 4.6,
    reviews: 34,
    reviewsList: []
  },
  {
    id: '7',
    name: 'Yoga Mat Non-Slip',
    price: 1899,
    originalPrice: 2499,
    category: 'Sports',
    image: 'https://picsum.photos/400/400?random=7',
    description: 'Extra thick, non-slip texture for stability. Eco-friendly material.',
    stock: 40,
    rating: 4.4,
    reviews: 156,
    reviewsList: [COMMON_REVIEWS[2]]
  },
  {
    id: '8',
    name: '4K Action Camera',
    price: 12499,
    originalPrice: 15999,
    category: 'Electronics',
    image: 'https://picsum.photos/400/400?random=8',
    description: 'Capture your adventures in stunning 4K. Waterproof up to 10m without a case.',
    stock: 10,
    rating: 4.3,
    reviews: 50,
    reviewsList: []
  }
];

export const MOCK_REVIEWS = COMMON_REVIEWS;
