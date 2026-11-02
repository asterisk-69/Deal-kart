import { Heart, ShoppingCart, Trash2, ArrowRight, GitCompare } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getProductById, getSortedSellersWithFinalPrice } from '../data/products';

export default function WishlistPage({ onNavigate }) {
  const { state, dispatch } = useCart();
  const wishlistProducts = state.wishlist.map(id => getProductById(id)).filter(Boolean);

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-20 px-4">
          <div className="w-28 h-28 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-14 h-14 text-red-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8">Save items you love and compare prices later</p>
          <button
            id="wishlist-browse-btn"
            onClick={() => onNavigate('listing')}
            className="btn-primary"
          >
            Discover Products <ArrowRight className="w-4 h-4 inline ml-1" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="text-sm text-gray-500 mb-1">
            <button onClick={() => onNavigate('home')} className="hover:text-orange-500">Home</button>
            <span className="mx-2">›</span>
            <span className="text-gray-800 font-medium">My Wishlist ({wishlistProducts.length})</span>
          </nav>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">My Wishlist</h1>
            <button
              id="clear-wishlist-btn"
              onClick={() => wishlistProducts.forEach(p => dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: p.id }))}
              className="text-red-500 text-sm hover:underline"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  onClick={() => onNavigate('product', { productId: product.id })}
                  className="w-full aspect-square object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  id={`wishlist-remove-${product.id}`}
                  onClick={() => dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id })}
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-3">
                <p className="text-xs text-orange-600 font-semibold">{product.brand}</p>
                <button
                  onClick={() => onNavigate('product', { productId: product.id })}
                  className="text-sm font-semibold text-gray-800 hover:text-orange-600 line-clamp-2 text-left leading-snug mt-0.5"
                >
                  {product.name}
                </button>
                <p className="text-base font-black text-gray-900 mt-2">₹{product.lowestPrice.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{product.sellers.length} sellers</p>
                <div className="flex gap-1.5 mt-3">
                  <button
                    id={`wishlist-cart-${product.id}`}
                    onClick={() => {
                      const sorted = getSortedSellersWithFinalPrice(product.sellers);
                      const best = sorted[0];
                      dispatch({
                        type: 'ADD_TO_CART',
                        payload: {
                          productId: product.id,
                          sellerId: best.sellerId,
                          sellerName: best.sellerName,
                          name: product.name,
                          price: best.price,
                          discount: best.discount || 0,
                          deliveryCharge: best.deliveryCharge || 0,
                          finalPrice: best.finalPrice,
                          image: product.images[0],
                          quantity: 1
                        }
                      });
                    }}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1 transition-colors"
                  >
                    <ShoppingCart className="w-3 h-3" /> Add to Cart
                  </button>
                  <button
                    id={`wishlist-compare-${product.id}`}
                    onClick={() => dispatch({ type: state.compareList.includes(product.id) ? 'REMOVE_FROM_COMPARE' : 'ADD_TO_COMPARE', payload: product.id })}
                    className={`px-2 rounded-xl border text-xs font-semibold transition-all ${state.compareList.includes(product.id) ? 'bg-navy-700 text-white border-navy-700' : 'border-gray-300 text-gray-600 hover:border-navy-700'}`}
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
