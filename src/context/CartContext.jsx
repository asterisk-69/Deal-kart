import { createContext, useContext, useReducer, useEffect } from 'react';
import { products as initialProducts, sellers as initialSellers, initialCustomers, calculateFinalPrice } from '../data/products';

const CartContext = createContext(null);

const initialSampleOrders = [
  {
    id: 'DK-2026-482019',
    date: 'Oct 31, 2026',
    status: 'Shipped',
    customer: {
      name: 'Paritosh Sharma',
      phone: '9876543210',
      address: 'Flat 402, Sea Green Heights, Worli',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400018',
    },
    paymentMethod: 'UPI (GPay)',
    subtotal: 27999,
    totalDiscount: 3000,
    deliveryCharge: 0,
    totalAmount: 24999,
    items: [
      {
        productId: 'p6',
        name: 'Sony WH-1000XM5 Wireless Headphones',
        sellerId: 's5',
        sellerName: 'Smart Deals',
        price: 26999,
        discount: 2500,
        deliveryCharge: 0,
        finalPrice: 24499,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        deliveryTime: 'Tomorrow',
      },
    ],
    timeline: [
      { status: 'Confirmed', time: 'Oct 31, 10:30 AM', completed: true },
      { status: 'Processing', time: 'Oct 31, 04:15 PM', completed: true },
      { status: 'Shipped', time: 'Nov 01, 09:00 AM', completed: true },
      { status: 'Delivered', time: 'Expected by tomorrow', completed: false },
    ],
  },
  {
    id: 'DK-2026-918234',
    date: 'Nov 01, 2026',
    status: 'Processing',
    customer: {
      name: 'Priya Patel',
      phone: '9823456789',
      address: 'B-12 Shivalik Villa, Bodakdev',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380054',
    },
    paymentMethod: 'Credit Card (Ending in 4521)',
    subtotal: 79999,
    totalDiscount: 3000,
    deliveryCharge: 0,
    totalAmount: 76999,
    items: [
      {
        productId: 'p1',
        name: 'Apple iPhone 16 (128GB)',
        sellerId: 's1',
        sellerName: 'TechWorld',
        price: 79999,
        discount: 3000,
        deliveryCharge: 0,
        finalPrice: 76999,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
        deliveryTime: 'Tomorrow',
      },
    ],
    timeline: [
      { status: 'Confirmed', time: 'Nov 01, 02:15 PM', completed: true },
      { status: 'Processing', time: 'Nov 01, 05:00 PM', completed: true },
      { status: 'Shipped', time: 'Expected tomorrow', completed: false },
      { status: 'Delivered', time: 'Expected in 2 days', completed: false },
    ],
  },
  {
    id: 'DK-2026-627190',
    date: 'Nov 02, 2026',
    status: 'Confirmed',
    customer: {
      name: 'Rahul Mehta',
      phone: '9811223344',
      address: '77 Golf Links, New Delhi',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110003',
    },
    paymentMethod: 'Cash on Delivery (COD)',
    subtotal: 109900,
    totalDiscount: 5000,
    deliveryCharge: 0,
    totalAmount: 104900,
    items: [
      {
        productId: 'p4',
        name: 'Apple MacBook Air M3 (16GB / 256GB)',
        sellerId: 's1',
        sellerName: 'TechWorld',
        price: 109900,
        discount: 5000,
        deliveryCharge: 0,
        finalPrice: 104900,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
        deliveryTime: 'Tomorrow',
      },
    ],
    timeline: [
      { status: 'Confirmed', time: 'Nov 02, 11:20 AM', completed: true },
      { status: 'Processing', time: 'Expected today', completed: false },
      { status: 'Shipped', time: 'Expected in 1-2 days', completed: false },
      { status: 'Delivered', time: 'Expected in 2-3 days', completed: false },
    ],
  },
];

const cartReducer = (state, action) => {
  switch (action.type) {
    // Portal navigation
    case 'SET_PORTAL':
      return { ...state, currentPortal: action.payload };

    case 'SET_ACTIVE_SELLER':
      return { ...state, activeSellerId: action.payload };

    // Cart actions
    case 'ADD_TO_CART': {
      const existingIndex = state.items.findIndex(
        item => item.productId === action.payload.productId && item.sellerId === action.payload.sellerId
      );
      if (existingIndex >= 0) {
        const updated = [...state.items];
        updated[existingIndex].quantity += action.payload.quantity || 1;
        return { ...state, items: updated };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }]
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(
          item => !(item.productId === action.payload.productId && item.sellerId === action.payload.sellerId)
        )
      };
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            item => !(item.productId === action.payload.productId && item.sellerId === action.payload.sellerId)
          )
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.productId === action.payload.productId && item.sellerId === action.payload.sellerId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };

    // Compare & Wishlist
    case 'ADD_TO_COMPARE': {
      if (state.compareList.includes(action.payload) || state.compareList.length >= 4) return state;
      return { ...state, compareList: [...state.compareList, action.payload] };
    }
    case 'REMOVE_FROM_COMPARE':
      return { ...state, compareList: state.compareList.filter(id => id !== action.payload) };
    case 'CLEAR_COMPARE':
      return { ...state, compareList: [] };

    case 'ADD_TO_WISHLIST': {
      if (state.wishlist.includes(action.payload)) return state;
      return { ...state, wishlist: [...state.wishlist, action.payload] };
    }
    case 'REMOVE_FROM_WISHLIST':
      return { ...state, wishlist: state.wishlist.filter(id => id !== action.payload) };

    // Order placement & status management
    case 'ADD_ORDER': {
      const newOrders = [action.payload, ...state.orders];

      // Decrease product stock for all ordered items across matching sellers
      const updatedProducts = state.products.map(prod => {
        let modified = false;
        const updatedSellers = prod.sellers.map(s => {
          const orderedItem = action.payload.items?.find(
            it => it.productId === prod.id && it.sellerId === s.sellerId
          );
          if (orderedItem) {
            modified = true;
            const currentStock = Number(s.stock) || 0;
            const newStock = Math.max(0, currentStock - (orderedItem.quantity || 1));
            return { ...s, stock: newStock };
          }
          return s;
        });

        if (!modified) return prod;
        return {
          ...prod,
          sellers: updatedSellers,
          inStock: updatedSellers.some(s => (s.stock || 0) > 0),
        };
      });

      return {
        ...state,
        orders: newOrders,
        products: updatedProducts,
        items: []
      };
    }
    case 'UPDATE_ORDER_STATUS': {
      const { orderId, newStatus } = action.payload;
      const statusOrder = ['Confirmed', 'Processing', 'Shipped', 'Delivered'];
      const targetIndex = statusOrder.indexOf(newStatus);

      const updatedOrders = state.orders.map(order => {
        if (order.id !== orderId) return order;
        const updatedTimeline = order.timeline.map((step, idx) => ({
          ...step,
          completed: idx <= targetIndex,
          time: idx <= targetIndex ? (step.time.includes('Expected') ? 'Updated just now' : step.time) : step.time,
        }));
        return { ...order, status: newStatus, timeline: updatedTimeline };
      });
      return { ...state, orders: updatedOrders };
    }

    // Product Management (Seller & Admin Shared)
    case 'ADD_PRODUCT': {
      const {
        name, brand, category, model, storageVariant, image,
        description, price, discount, deliveryCharge, deliveryTime, stock, sellerId
      } = action.payload;

      const sid = sellerId || state.activeSellerId || 's1';
      const sellerObj = state.sellers.find(s => s.id === sid);

      const sellerOffer = {
        sellerId: sid,
        sellerName: sellerObj?.name || 'Seller',
        price: Number(price),
        discount: Number(discount || 0),
        deliveryCharge: Number(deliveryCharge || 0),
        deliveryTime: deliveryTime || '1-2 Days',
        stock: Number(stock || 10),
        warranty: '1 Year Manufacturer Warranty',
        offers: ['Special DealKart Marketplace offer'],
      };

      // Check if product with identical name and storageVariant already exists
      const existingProductIndex = state.products.findIndex(
        p => p.name.trim().toLowerCase() === name.trim().toLowerCase() &&
             (p.storageVariant || '').trim().toLowerCase() === (storageVariant || '').trim().toLowerCase()
      );

      let updatedProducts = [...state.products];

      if (existingProductIndex >= 0) {
        const prod = { ...updatedProducts[existingProductIndex] };
        // Replace or add seller offer
        const existingOfferIndex = prod.sellers.findIndex(s => s.sellerId === sid);
        let updatedSellers = [...prod.sellers];
        if (existingOfferIndex >= 0) {
          updatedSellers[existingOfferIndex] = sellerOffer;
        } else {
          updatedSellers.push(sellerOffer);
        }
        prod.sellers = updatedSellers;
        const finalPrices = updatedSellers.map(s => calculateFinalPrice(s));
        prod.lowestPrice = Math.min(...finalPrices);
        prod.highestPrice = Math.max(...updatedSellers.map(s => s.price));
        prod.inStock = updatedSellers.some(s => s.stock > 0);
        updatedProducts[existingProductIndex] = prod;
      } else {
        const newProdId = 'p-' + Date.now();
        const finalPrice = calculateFinalPrice(sellerOffer);
        const newProduct = {
          id: newProdId,
          name: name.trim(),
          brand: brand.trim(),
          category: category || 'mobiles',
          storageVariant: storageVariant || '',
          modelGroup: (model || name).toLowerCase().replace(/\s+/g, '-'),
          shortDescription: description ? description.slice(0, 100) : `${name} - Authentic multi-seller listing on DealKart`,
          description: description || `Experience excellence with the all-new ${name}. Available now with fast delivery and genuine warranty.`,
          rating: 4.7,
          totalReviews: 14,
          images: [
            image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
          ],
          specifications: {
            Brand: brand,
            Category: category,
            Model: model || name,
            Storage: storageVariant || 'Standard',
            Condition: 'Brand New (Factory Sealed)',
          },
          tags: [brand, category, storageVariant].filter(Boolean),
          lowestPrice: finalPrice,
          highestPrice: Number(price),
          discount: Number(discount) > 0 ? Math.round((Number(discount) / Number(price)) * 100) : 0,
          sellers: [sellerOffer],
          isFeatured: true,
          isTrending: true,
          inStock: Number(stock) > 0,
        };
        updatedProducts = [newProduct, ...updatedProducts];
      }

      return { ...state, products: updatedProducts };
    }

    case 'UPDATE_PRODUCT_OFFER': {
      const { productId, sellerId, updates } = action.payload;
      const updatedProducts = state.products.map(prod => {
        if (prod.id !== productId) return prod;
        const updatedSellers = prod.sellers.map(s => {
          if (s.sellerId !== sellerId) return s;
          return {
            ...s,
            price: updates.price !== undefined ? Number(updates.price) : s.price,
            discount: updates.discount !== undefined ? Number(updates.discount) : s.discount,
            deliveryCharge: updates.deliveryCharge !== undefined ? Number(updates.deliveryCharge) : s.deliveryCharge,
            deliveryTime: updates.deliveryTime !== undefined ? updates.deliveryTime : s.deliveryTime,
            stock: updates.stock !== undefined ? Number(updates.stock) : s.stock,
          };
        });

        const finalPrices = updatedSellers.map(s => calculateFinalPrice(s));
        return {
          ...prod,
          name: updates.name || prod.name,
          brand: updates.brand || prod.brand,
          category: updates.category || prod.category,
          storageVariant: updates.storageVariant !== undefined ? updates.storageVariant : prod.storageVariant,
          shortDescription: updates.description ? updates.description.slice(0, 100) : prod.shortDescription,
          description: updates.description || prod.description,
          sellers: updatedSellers,
          lowestPrice: Math.min(...finalPrices),
          highestPrice: Math.max(...updatedSellers.map(s => s.price)),
          inStock: updatedSellers.some(s => s.stock > 0),
        };
      });
      return { ...state, products: updatedProducts };
    }

    case 'DELETE_PRODUCT_LISTING': {
      const { productId, sellerId } = action.payload;
      const updatedProducts = state.products
        .map(prod => {
          if (prod.id !== productId) return prod;
          const remainingSellers = prod.sellers.filter(s => s.sellerId !== sellerId);
          if (remainingSellers.length === 0) return null; // remove product completely if no sellers left
          const finalPrices = remainingSellers.map(s => calculateFinalPrice(s));
          return {
            ...prod,
            sellers: remainingSellers,
            lowestPrice: Math.min(...finalPrices),
            highestPrice: Math.max(...remainingSellers.map(s => s.price)),
          };
        })
        .filter(Boolean);
      return { ...state, products: updatedProducts };
    }

    case 'ADMIN_DELETE_PRODUCT': {
      const { productId } = action.payload;
      return { ...state, products: state.products.filter(p => p.id !== productId) };
    }

    // Seller Management (Admin)
    case 'UPDATE_SELLER_STATUS': {
      const { sellerId, status, verified } = action.payload;
      const updatedSellers = state.sellers.map(s => {
        if (s.id !== sellerId) return s;
        return {
          ...s,
          status: status || s.status,
          verified: verified !== undefined ? verified : s.verified,
        };
      });
      return { ...state, sellers: updatedSellers };
    }

    case 'UPDATE_SELLER_PROFILE': {
      const { sellerId, profileData } = action.payload;
      const updatedSellers = state.sellers.map(s => {
        if (s.id !== sellerId) return s;
        return { ...s, ...profileData };
      });
      return { ...state, sellers: updatedSellers };
    }

    // Customer Reviews
    case 'ADD_REVIEW': {
      const { productId, review } = action.payload;
      const existing = state.reviews[productId] || [];
      return {
        ...state,
        reviews: {
          ...state.reviews,
          [productId]: [review, ...existing],
        },
      };
    }

    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'RESET_DEMO_DATA': {
      localStorage.removeItem('dealkart_state');
      return {
        items: [],
        compareList: [],
        wishlist: [],
        user: { name: 'Paritosh Sharma', email: 'paritosh@example.com' },
        currentPortal: state.currentPortal || 'customer',
        activeSellerId: 's1',
        products: initialProducts,
        sellers: initialSellers,
        customers: initialCustomers,
        orders: initialSampleOrders,
        reviews: {},
      };
    }
    default:
      return state;
  }
};

const loadState = () => {
  try {
    const serialized = localStorage.getItem('dealkart_state');
    if (!serialized) return null;
    const parsed = JSON.parse(serialized);
    if (!parsed.products || parsed.products.length === 0) {
      parsed.products = initialProducts;
    }
    if (!parsed.sellers || parsed.sellers.length === 0) {
      parsed.sellers = initialSellers;
    }
    if (!parsed.customers || parsed.customers.length === 0) {
      parsed.customers = initialCustomers;
    }
    if (!parsed.orders || parsed.orders.length === 0) {
      parsed.orders = initialSampleOrders;
    }
    if (!parsed.reviews) {
      parsed.reviews = {};
    }
    if (!parsed.activeSellerId) {
      parsed.activeSellerId = 's1';
    }
    if (!parsed.currentPortal) {
      parsed.currentPortal = 'customer';
    }
    return parsed;
  } catch {
    return null;
  }
};

const saveState = (state) => {
  try {
    localStorage.setItem('dealkart_state', JSON.stringify(state));
  } catch { }
};

const initialState = {
  currentPortal: 'customer', // 'customer' | 'seller' | 'admin'
  activeSellerId: 's1',      // TechWorld default
  products: initialProducts,
  sellers: initialSellers,
  customers: initialCustomers,
  items: [],
  compareList: [],
  wishlist: [],
  orders: initialSampleOrders,
  reviews: {},
  user: { name: 'Paritosh Sharma', email: 'paritosh@example.com', phone: '9876543210' },
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, loadState() || initialState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculations for subtotal, total discount, delivery charges, and final payable amount
  const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDiscount = state.items.reduce((sum, item) => sum + ((item.discount || 0) * item.quantity), 0);
  const deliveryCharge = state.items.reduce((sum, item) => sum + ((item.deliveryCharge || 0) * item.quantity), 0);
  const cartTotal = state.items.reduce((sum, item) => {
    const finalItemPrice = item.finalPrice || (item.price - (item.discount || 0) + (item.deliveryCharge || 0));
    return sum + (finalItemPrice * item.quantity);
  }, 0);

  // Active seller helper
  const activeSeller = state.sellers.find(s => s.id === state.activeSellerId) || state.sellers[0];

  return (
    <CartContext.Provider value={{
      state,
      dispatch,
      cartCount,
      subtotal,
      totalDiscount,
      deliveryCharge,
      cartTotal,
      activeSeller,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
