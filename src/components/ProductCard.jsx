import { Star, Heart, GitCompare, ShoppingCart, Zap, Tag, Award, Store } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getSortedSellersWithFinalPrice } from '../data/products';

export default function ProductCard({ product, onNavigate, compact = false }) {
  const { state, dispatch } = useCart();
  const isWishlisted = state.wishlist.includes(product.id);
  const isInCompare = state.compareList.includes(product.id);
  const isInCart = state.items.some(item => item.productId === product.id);

  const sortedSellers = getSortedSellersWithFinalPrice(product.sellers);
  const bestSeller = sortedSellers[0] || product.sellers[0];

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        productId: product.id,
        sellerId: bestSeller.sellerId,
        sellerName: bestSeller.sellerName,
        name: product.name,
        price: bestSeller.price,
        discount: bestSeller.discount || 0,
        deliveryCharge: bestSeller.deliveryCharge || 0,
        finalPrice: bestSeller.finalPrice,
        deliveryTime: bestSeller.deliveryTime || '1-2 Days',
        image: product.images[0],
        quantity: 1,
      }
    });
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    dispatch({ type: isWishlisted ? 'REMOVE_FROM_WISHLIST' : 'ADD_TO_WISHLIST', payload: product.id });
  };

  const handleCompare = (e) => {
    e.stopPropagation();
    dispatch({ type: isInCompare ? 'REMOVE_FROM_COMPARE' : 'ADD_TO_COMPARE', payload: product.id });
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onNavigate('product', { productId: product.id })}
      className="product-card flex flex-col relative bg-white rounded-3xl border border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
    >
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.discount > 0 && (
          <span className="bg-red-500 text-white px-2 py-0.5 text-[10px] font-black rounded-lg shadow-sm">
            -{product.discount}%
          </span>
        )}
        <span className="bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-black rounded-lg shadow-sm flex items-center gap-1">
          <Award className="w-3 h-3" /> BEST DEAL
        </span>
      </div>

      {/* Wishlist Button */}
      <button
        id={`wishlist-${product.id}`}
        onClick={handleWishlist}
        title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
          isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-white'
        }`}
      >
        <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
      </button>

      {/* Product Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Multi-Seller count badge */}
        <div className="absolute bottom-2 left-2 bg-navy-900/80 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <Store className="w-3 h-3 text-orange-400" />
          {product.sellers.length} sellers matched
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-orange-600 font-black uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-md">
            {product.brand}
          </span>
          {product.storageVariant && (
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-md">
              {product.storageVariant}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 mb-1.5 group-hover:text-orange-600 transition-colors leading-snug">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
            <span>{product.rating}</span>
            <span>★</span>
          </div>
          <span className="text-[11px] text-gray-400">({product.totalReviews.toLocaleString()})</span>
        </div>

        {/* Price & Seller Note */}
        <div className="mb-3 mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-black text-gray-900">
              ₹{bestSeller.finalPrice.toLocaleString()}
            </span>
            {product.highestPrice > bestSeller.finalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.highestPrice.toLocaleString()}
              </span>
            )}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
            Best by <strong>{bestSeller.sellerName}</strong> ({bestSeller.deliveryTime})
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <button
            id={`add-cart-${product.id}`}
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isInCart
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {isInCart ? 'In Cart ✓' : 'Add to Cart'}
          </button>
          <button
            id={`compare-card-${product.id}`}
            onClick={handleCompare}
            title={isInCompare ? 'Remove from compare' : 'Add to compare'}
            className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center ${
              isInCompare ? 'border-navy-900 bg-navy-900 text-white' : 'border-gray-200 text-gray-600 hover:border-navy-800'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
