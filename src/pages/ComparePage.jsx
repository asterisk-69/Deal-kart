import { useState } from 'react';
import { GitCompare, X, ChevronDown, ChevronUp, ShoppingCart, ArrowRight, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getProductById, getSellerById, getSortedSellersWithFinalPrice } from '../data/products';

export default function ComparePage({ onNavigate }) {
  const { state, dispatch } = useCart();
  const [expandedSections, setExpandedSections] = useState(['price', 'specs', 'sellers']);

  const compareProducts = state.compareList.map(id => getProductById(id)).filter(Boolean);

  const toggleSection = (section) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  if (compareProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-20 px-4 max-w-md">
          <div className="w-28 h-28 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <GitCompare className="w-14 h-14 text-navy-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No products to compare</h2>
          <p className="text-gray-500 mb-8">Add up to 4 products to compare prices, specs, and seller offers side by side.</p>
          <button
            id="compare-browse-btn"
            onClick={() => onNavigate('listing')}
            className="btn-primary"
          >
            Browse Products <ArrowRight className="w-4 h-4 inline ml-1" />
          </button>
        </div>
      </div>
    );
  }

  const allSpecKeys = [...new Set(compareProducts.flatMap(p => Object.keys(p.specifications)))];

  const CompareSection = ({ title, id, children }) => {
    const isExpanded = expandedSections.includes(id);
    return (
      <div className="mb-4">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between bg-navy-800 text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-navy-700 transition-colors"
        >
          {title}
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {isExpanded && children}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <nav className="text-sm text-gray-500 mb-1">
                <button onClick={() => onNavigate('home')} className="hover:text-orange-500">Home</button>
                <span className="mx-2">›</span>
                <span className="text-gray-800 font-medium">Product Comparison</span>
              </nav>
              <h1 className="text-xl font-bold text-gray-900">
                Comparing {compareProducts.length} Product{compareProducts.length !== 1 ? 's' : ''}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {compareProducts.length < 4 && (
                <button
                  id="add-more-compare-btn"
                  onClick={() => onNavigate('listing')}
                  className="flex items-center gap-2 border-2 border-dashed border-orange-300 text-orange-500 px-4 py-2 rounded-xl text-sm font-medium hover:border-orange-500 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              )}
              <button
                id="clear-compare-btn"
                onClick={() => dispatch({ type: 'CLEAR_COMPARE' })}
                className="text-red-500 text-sm font-medium hover:underline flex items-center gap-1"
              >
                <X className="w-4 h-4" /> Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {/* Product Header Row */}
            <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `240px repeat(${compareProducts.length}, 1fr)` }}>
              <div className="flex items-end pb-4">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Product</span>
              </div>
              {compareProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl border border-gray-100 p-4 relative shadow-sm">
                  <button
                    id={`remove-compare-${product.id}`}
                    onClick={() => dispatch({ type: 'REMOVE_FROM_COMPARE', payload: product.id })}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-100 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-36 object-cover rounded-xl mb-3 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => onNavigate('product', { productId: product.id })}
                  />
                  <p className="text-xs text-orange-600 font-bold">{product.brand}</p>
                  <button
                    onClick={() => onNavigate('product', { productId: product.id })}
                    className="text-sm font-bold text-gray-800 hover:text-orange-600 text-left leading-snug line-clamp-2 mt-0.5"
                  >
                    {product.name}
                  </button>
                </div>
              ))}
            </div>

            {/* Price Comparison */}
            <CompareSection title="💰 Price Comparison" id="price">
              <div className="grid gap-4 mt-3" style={{ gridTemplateColumns: `240px repeat(${compareProducts.length}, 1fr)` }}>
                <div className="flex items-center text-sm font-semibold text-gray-600 px-2">Best Price</div>
                {compareProducts.map((product) => {
                  const minPrice = Math.min(...compareProducts.map(p => p.lowestPrice));
                  const isBest = product.lowestPrice === minPrice;
                  return (
                    <div key={product.id} className={`rounded-xl p-4 ${isBest ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border border-gray-200'}`}>
                      {isBest && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full mb-2 inline-block">🏆 Lowest Price</span>}
                      <p className="text-2xl font-black text-gray-900">₹{product.lowestPrice.toLocaleString()}</p>
                      <p className="text-xs text-gray-400 line-through">₹{product.highestPrice.toLocaleString()}</p>
                      <p className="text-sm font-bold text-red-500">-{product.discount}% OFF</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-4 mt-3" style={{ gridTemplateColumns: `240px repeat(${compareProducts.length}, 1fr)` }}>
                <div className="flex items-center text-sm font-semibold text-gray-600 px-2">Available Sellers</div>
                {compareProducts.map((product) => (
                  <div key={product.id} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-navy-800">{product.sellers.length}</p>
                    <p className="text-xs text-gray-500">Sellers</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 mt-3" style={{ gridTemplateColumns: `240px repeat(${compareProducts.length}, 1fr)` }}>
                <div className="flex items-center text-sm font-semibold text-gray-600 px-2">Rating</div>
                {compareProducts.map((product) => {
                  const maxRating = Math.max(...compareProducts.map(p => p.rating));
                  const isBest = product.rating === maxRating;
                  return (
                    <div key={product.id} className={`rounded-xl p-3 text-center ${isBest ? 'bg-yellow-50' : 'bg-gray-50'}`}>
                      <p className="text-xl font-black text-gray-800">⭐ {product.rating}</p>
                      <p className="text-xs text-gray-400">{product.totalReviews.toLocaleString()} reviews</p>
                      {isBest && <span className="text-xs font-bold text-yellow-600">Highest Rated</span>}
                    </div>
                  );
                })}
              </div>
            </CompareSection>

            {/* Specifications */}
            <CompareSection title="📋 Specifications" id="specs">
              {allSpecKeys.map((key) => (
                <div key={key} className="grid gap-4 mt-3" style={{ gridTemplateColumns: `240px repeat(${compareProducts.length}, 1fr)` }}>
                  <div className="flex items-center text-sm font-semibold text-gray-600 bg-gray-50 px-3 py-2 rounded-xl">{key}</div>
                  {compareProducts.map((product) => (
                    <div key={product.id} className="bg-white border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700">
                      {product.specifications[key] || <span className="text-gray-300">N/A</span>}
                    </div>
                  ))}
                </div>
              ))}
            </CompareSection>

            {/* Sellers */}
            <CompareSection title="🏪 Seller Offers" id="sellers">
              {compareProducts.map((product) => {
                const sorted = getSortedSellersWithFinalPrice(product.sellers);
                const best = sorted[0];

                return (
                  <div key={product.id} className="mt-3">
                    <p className="text-xs font-semibold text-gray-500 mb-2">{product.name}</p>
                    <div className="grid gap-4" style={{ gridTemplateColumns: `240px repeat(${compareProducts.length}, 1fr)` }}>
                      <div></div>
                      <div className="space-y-2">
                        {sorted.map((s, idx) => {
                          const isBest = idx === 0;
                          return (
                            <div key={s.sellerId} className={`rounded-xl p-3 text-xs ${isBest ? 'bg-emerald-50 border border-emerald-300' : 'bg-gray-50 border border-gray-100'}`}>
                              <div className="flex items-center justify-between">
                                <p className="font-bold text-gray-800">{s.sellerName}</p>
                                {isBest && <span className="text-[10px] bg-emerald-600 text-white font-black px-1.5 py-0.2 rounded">BEST DEAL</span>}
                              </div>
                              <p className="text-gray-900 font-black text-sm mt-0.5">₹{s.finalPrice.toLocaleString()}</p>
                              <p className="text-gray-500 text-[11px]">Price: ₹{s.price.toLocaleString()} | Delivery: {s.deliveryTime} ({s.deliveryCharge === 0 ? 'FREE' : `₹${s.deliveryCharge}`})</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CompareSection>

            {/* Action Row */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `240px repeat(${compareProducts.length}, 1fr)` }}>
              <div></div>
              {compareProducts.map((product) => {
                const sorted = getSortedSellersWithFinalPrice(product.sellers);
                const best = sorted[0];

                return (
                  <div key={product.id} className="space-y-2">
                    <button
                      id={`compare-view-${product.id}`}
                      onClick={() => onNavigate('product', { productId: product.id })}
                      className="w-full btn-primary text-xs py-2.5 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" /> View Product Deal
                    </button>
                    <button
                      onClick={() => {
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
                            quantity: 1,
                          }
                        });
                      }}
                      className="w-full text-xs py-2.5 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded-xl font-bold transition-all"
                    >
                      Add Best Deal to Cart
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
