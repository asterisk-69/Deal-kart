import { useState, useEffect } from 'react';
import {
  Star, ShoppingCart, Heart, Share2, GitCompare, ChevronLeft, ChevronRight,
  Shield, Truck, RotateCcw, Zap, CheckCircle, XCircle, Tag, Award,
  Package, Clock, MapPin, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown,
  Sparkles, Layers, Send, AlertCircle
} from 'lucide-react';
import { getProductById, getSellerById, getSortedSellersWithFinalPrice, calculateFinalPrice } from '../data/products';
import { useCart } from '../context/CartContext';

const StarRatingDisplay = ({ rating, size = 'md' }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const filled = i <= Math.floor(rating);
    const half = !filled && i === Math.ceil(rating) && rating % 1 !== 0;
    stars.push(
      <span key={i} className={`${size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-xs' : 'text-base'} ${filled || half ? 'text-yellow-400' : 'text-gray-200'}`}>
        ★
      </span>
    );
  }
  return <div className="flex items-center">{stars}</div>;
};

const initialMockReviews = [
  { id: 1, user: 'Rahul M.', rating: 5, date: '2 days ago', title: 'Saved ₹3,000 with DealKart\'s Best Deal!', text: 'The price comparison table made it so easy to see that Smart Deals had the lowest final price when factoring in free delivery. Arrived next day in mint condition.', helpful: 48, verified: true },
  { id: 2, user: 'Priya Sharma', rating: 4, date: '5 days ago', title: 'Clear seller comparison', text: 'I love how DealKart shows all 5 sellers side-by-side with exact delivery charges and discounts. Selected TechWorld because of their 1-day delivery and it was seamless.', helpful: 32, verified: true },
  { id: 3, user: 'Amit K.', rating: 5, date: '1 week ago', title: 'Genuine sellers & great pricing', text: 'Checked local market and other apps, DealKart\'s grouped seller pricing helped me find the best rate immediately without opening 10 browser tabs.', helpful: 27, verified: true },
  { id: 4, user: 'Sneha Roy', rating: 4, date: '2 weeks ago', title: 'Very useful multi-seller marketplace', text: 'Original manufacturer warranty confirmed by seller. Comparison engine calculates delivery charge into final price accurately.', helpful: 19, verified: true },
];

export default function ProductDetailPage({ onNavigate, params = {} }) {
  const { state, dispatch } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSellerId, setSelectedSellerId] = useState(null);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  // Review submission state
  const [userRating, setUserRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const p = state.products?.find(item => item.id === params.productId) || getProductById(params.productId) || state.products?.[0];
    if (p) {
      setProduct(p);
      const sorted = getSortedSellersWithFinalPrice(p.sellers);
      // Default to best deal seller (lowest final price)
      setSelectedSellerId(sorted[0]?.sellerId || p.sellers[0]?.sellerId);
      setSelectedImageIndex(0);
    }
    window.scrollTo(0, 0);
  }, [params.productId, state.products]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-md">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-800">Product Not Found</h2>
          <p className="text-gray-500 text-sm mt-2 mb-6">The product you're looking for doesn't exist or has been moved.</p>
          <button onClick={() => onNavigate('listing')} className="btn-primary w-full">
            Browse All Products
          </button>
        </div>
      </div>
    );
  }

  // Sorted sellers with Best Deal Engine
  const sortedSellers = getSortedSellersWithFinalPrice(product.sellers);
  const bestDealSeller = sortedSellers[0];
  const highestPriceSeller = sortedSellers[sortedSellers.length - 1];
  const maxSavings = highestPriceSeller.finalPrice - bestDealSeller.finalPrice;

  // Selected seller details
  const selectedSellerOffer = product.sellers.find(s => s.sellerId === selectedSellerId) || bestDealSeller;
  const sellerInfo = getSellerById(selectedSellerId) || selectedSellerOffer.sellerInfo;
  const selectedFinalPrice = calculateFinalPrice(selectedSellerOffer);

  const isWishlisted = state.wishlist.includes(product.id);
  const isInCompare = state.compareList.includes(product.id);

  // Reviews list combined with local context reviews
  const productCustomReviews = state.reviews?.[product.id] || [];
  const allReviews = [...productCustomReviews, ...initialMockReviews];

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        productId: product.id,
        sellerId: selectedSellerOffer.sellerId,
        sellerName: selectedSellerOffer.sellerName || sellerInfo?.name,
        name: product.name,
        price: selectedSellerOffer.price,
        discount: selectedSellerOffer.discount || 0,
        deliveryCharge: selectedSellerOffer.deliveryCharge || 0,
        finalPrice: selectedFinalPrice,
        deliveryTime: selectedSellerOffer.deliveryTime || '1-2 Days',
        image: product.images[0],
        quantity,
      }
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    onNavigate('checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) return;

    const newRev = {
      id: Date.now(),
      user: state.user?.name || 'Customer',
      rating: userRating,
      date: 'Just now',
      title: reviewTitle.trim(),
      text: reviewComment.trim(),
      helpful: 0,
      verified: true,
    };

    dispatch({
      type: 'ADD_REVIEW',
      payload: { productId: product.id, review: newRev }
    });

    setReviewTitle('');
    setReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
            <button onClick={() => onNavigate('home')} className="hover:text-orange-500 transition-colors">Home</button>
            <span>›</span>
            <button onClick={() => onNavigate('listing', { category: product.category })} className="hover:text-orange-500 capitalize transition-colors">
              {product.category}
            </button>
            <span>›</span>
            <span className="text-gray-800 font-medium truncate max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Main Grid: Images + Product Summary + Buy Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">

          {/* Left Column: Image Gallery (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden aspect-square relative group shadow-sm">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Best Deal Floating Tag */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    BEST DEAL: ₹{bestDealSeller.finalPrice.toLocaleString()}
                  </div>
                  {product.discount > 0 && (
                    <div className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-xl shadow-md w-fit">
                      Save up to {product.discount}%
                    </div>
                  )}
                </div>

                {/* Image controls */}
                {product.images.length > 1 && (
                  <>
                    <button
                      id="prev-img-btn"
                      onClick={() => setSelectedImageIndex(prev => (prev - 1 + product.images.length) % product.images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      id="next-img-btn"
                      onClick={() => setSelectedImageIndex(prev => (prev + 1) % product.images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIndex(i)}
                      className={`flex-1 aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                        i === selectedImageIndex ? 'border-orange-500 shadow-md ring-2 ring-orange-100' : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Actions: Wishlist, Compare, Share */}
              <div className="flex gap-2 pt-2">
                <button
                  id="detail-wishlist-btn"
                  onClick={() => dispatch({ type: isWishlisted ? 'REMOVE_FROM_WISHLIST' : 'ADD_TO_WISHLIST', payload: product.id })}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 font-semibold text-xs uppercase tracking-wider transition-all ${
                    isWishlisted ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-500 bg-white'
                  }`}
                >
                  <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
                  {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </button>
                <button
                  id="detail-compare-btn"
                  onClick={() => dispatch({ type: isInCompare ? 'REMOVE_FROM_COMPARE' : 'ADD_TO_COMPARE', payload: product.id })}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 font-semibold text-xs uppercase tracking-wider transition-all ${
                    isInCompare ? 'border-navy-800 text-navy-800 bg-navy-50' : 'border-gray-200 text-gray-600 hover:border-navy-700 bg-white'
                  }`}
                >
                  <GitCompare className="w-4 h-4" />
                  {isInCompare ? 'In Compare' : 'Add Compare'}
                </button>
                <button
                  id="share-btn"
                  onClick={handleShare}
                  title="Share Product"
                  className="px-4 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 hover:border-gray-400 bg-white transition-all flex items-center justify-center"
                >
                  <Share2 className="w-4 h-4" />
                  {copiedLink && <span className="text-xs ml-1 font-bold text-green-600">Copied!</span>}
                </button>
              </div>
            </div>
          </div>

          {/* Center Column: Product Specs & Overview (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg">
                  {product.brand}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-blue-500" /> Multi-Seller Verified
                </span>
              </div>
              <h1 className="text-2xl font-black text-gray-900 mt-1.5 leading-snug">{product.name}</h1>
              <p className="text-gray-500 text-xs mt-2 leading-relaxed">{product.shortDescription}</p>
            </div>

            {/* Ratings & Verification */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1 rounded-xl text-sm font-bold shadow-sm">
                <span>{product.rating}</span>
                <span>★</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">({product.totalReviews.toLocaleString()} ratings & reviews)</span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> 100% Genuine
              </span>
            </div>

            {/* Product Matching & Storage Variant Selector (Requirement 2) */}
            {product.variantOptions && product.variantOptions.length > 0 && (
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-600" /> Exact Storage Variant:
                  </span>
                  <span className="text-xs text-blue-600 font-medium">Separated Matching</span>
                </div>
                <div className="flex items-center gap-2">
                  {product.variantOptions.map((opt) => {
                    const isCurrent = opt.productId === product.id;
                    return (
                      <button
                        key={opt.productId}
                        id={`variant-btn-${opt.storage}`}
                        onClick={() => onNavigate('product', { productId: opt.productId })}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          isCurrent
                            ? 'bg-navy-900 text-white shadow-md ring-2 ring-navy-800'
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                      >
                        {opt.label}
                        {isCurrent && <span className="ml-1 text-emerald-400">✓</span>}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-gray-500 mt-2">
                  ℹ️ Sellers are grouped strictly for the <strong>{product.storageVariant || 'selected'}</strong> variant. Different capacities are never mixed.
                </p>
              </div>
            )}

            {/* Best Deal Highlight Banner */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 border-2 border-emerald-500/50 rounded-2xl p-4 shadow-sm relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-black tracking-wider uppercase text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded-md">
                    <Sparkles className="w-3 h-3 text-emerald-700" /> DealKart Engine Recommendation
                  </span>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    Lowest Final Price: <span className="text-emerald-700 font-black text-lg">₹{bestDealSeller.finalPrice.toLocaleString()}</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Offered by <strong>{bestDealSeller.sellerName}</strong> with {bestDealSeller.deliveryTime} delivery
                  </p>
                </div>
                {maxSavings > 0 && (
                  <div className="text-right bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-emerald-200">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">You Save</p>
                    <p className="text-sm font-black text-emerald-600">₹{maxSavings.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400">vs other sellers</p>
                  </div>
                )}
              </div>
            </div>

            {/* Key Specifications Preview */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-sm">Key Specifications</h3>
                <button
                  onClick={() => setShowAllSpecs(!showAllSpecs)}
                  className="text-xs text-orange-600 font-semibold flex items-center gap-0.5 hover:underline"
                >
                  {showAllSpecs ? 'Less' : 'All'} {showAllSpecs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="divide-y divide-gray-50 mt-2 text-xs">
                {Object.entries(product.specifications).slice(0, showAllSpecs ? undefined : 4).map(([key, value]) => (
                  <div key={key} className="py-2 flex justify-between">
                    <span className="text-gray-500">{key}</span>
                    <span className="font-semibold text-gray-800 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Active Seller Buy Box (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 shadow-md sticky top-24 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <span className="text-xs text-gray-400">Selected Seller:</span>
                  <h4 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                    {selectedSellerOffer.sellerName}
                    {sellerInfo?.verified && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                    <span className="text-yellow-500 font-bold">★ {sellerInfo?.rating || 4.7}</span>
                    <span>• {sellerInfo?.reviews?.toLocaleString() || '10,000+'} orders</span>
                  </div>
                </div>

                {selectedSellerOffer.sellerId === bestDealSeller.sellerId && (
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-black px-2.5 py-1 rounded-xl shadow-sm uppercase tracking-wider">
                    ★ Best Deal
                  </span>
                )}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-2 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Product Price:</span>
                  <span className="font-semibold">₹{selectedSellerOffer.price.toLocaleString()}</span>
                </div>
                {selectedSellerOffer.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Seller Discount:</span>
                    <span>-₹{selectedSellerOffer.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge:</span>
                  <span>{selectedSellerOffer.deliveryCharge === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${selectedSellerOffer.deliveryCharge}`}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-gray-900">Final Price:</span>
                  <span className="text-2xl font-black text-gray-900">₹{selectedFinalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Delivery info & stock */}
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Delivery: <strong>{selectedSellerOffer.deliveryTime}</strong> (to Mumbai 400001)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>{selectedSellerOffer.warranty || '1 Year Manufacturer Warranty'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-purple-600" />
                  <span>{sellerInfo?.returnPolicy || '7 Days Replacement Policy'}</span>
                </div>
                <div className="flex items-center gap-2 pt-1 font-medium text-emerald-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>In Stock ({selectedSellerOffer.stock} units ready to ship)</span>
                </div>
              </div>

              {/* Quantity selector */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="w-9 text-center text-xs font-bold text-gray-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(selectedSellerOffer.stock, q + 1))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  id="add-to-cart-btn"
                  onClick={handleAddToCart}
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {addedToCart ? 'Added to Cart! ✓' : 'Add to Cart'}
                </button>
                <button
                  id="buy-now-btn"
                  onClick={handleBuyNow}
                  className="w-full py-3.5 bg-navy-900 hover:bg-navy-800 active:scale-[0.98] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Buy Now with this Seller
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 3 & 4: PRICE COMPARISON TABLE & BEST DEAL ENGINE
            Visually Impressive Multi-Seller Comparison Table (Core DealKart Feature)
        ========================================================================= */}
        <section id="price-comparison-section" className="mb-14">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
            {/* Table Header Banner */}
            <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-orange-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Core Engine
                  </span>
                  <span className="text-xs text-gray-300">Verified Seller Listings</span>
                </div>
                <h2 className="text-2xl font-black mt-1 text-white flex items-center gap-2">
                  Multi-Seller Price Comparison
                </h2>
                <p className="text-gray-300 text-xs mt-1 max-w-2xl">
                  Compare offers from sample certified merchants for this identical <strong>{product.name}</strong>.
                  The <strong>Final Price</strong> is automatically computed as:
                  <span className="text-orange-400 font-semibold ml-1">Final Price = Product Price - Discount + Delivery Charge</span>.
                </p>
              </div>

              {/* Best Deal Summary Card in Banner */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-emerald-400">Lowest Final Price</p>
                  <p className="text-2xl font-black text-white">₹{bestDealSeller.finalPrice.toLocaleString()}</p>
                  <p className="text-xs text-gray-300">by {bestDealSeller.sellerName}</p>
                </div>
              </div>
            </div>

            {/* Desktop & Tablet Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className="bg-gray-100/80 border-b border-gray-200 text-xs font-black uppercase text-gray-600 tracking-wider">
                    <th className="py-4 px-6">Seller Name</th>
                    <th className="py-4 px-4">Product Price</th>
                    <th className="py-4 px-4">Discount</th>
                    <th className="py-4 px-4">Delivery Charge</th>
                    <th className="py-4 px-4">Delivery Time</th>
                    <th className="py-4 px-4">Final Price</th>
                    <th className="py-4 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {sortedSellers.map((s, index) => {
                    const isBest = s.sellerId === bestDealSeller.sellerId;
                    const isSelected = s.sellerId === selectedSellerOffer.sellerId;
                    const info = s.sellerInfo || getSellerById(s.sellerId);

                    return (
                      <tr
                        key={s.sellerId}
                        id={`comparison-row-${s.sellerId}`}
                        onClick={() => setSelectedSellerId(s.sellerId)}
                        className={`transition-all cursor-pointer ${
                          isBest
                            ? 'bg-emerald-50/60 hover:bg-emerald-50 font-medium'
                            : isSelected
                            ? 'bg-orange-50/50 hover:bg-orange-50'
                            : 'hover:bg-gray-50/80'
                        }`}
                      >
                        {/* Seller Name Column */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black shadow-sm ${
                              isBest ? 'bg-emerald-600 text-white' : 'bg-navy-900 text-white'
                            }`}>
                              {info?.logo || 'SE'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900">{s.sellerName}</span>
                                {isBest && (
                                  <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wide">
                                    <Award className="w-3 h-3" /> BEST DEAL
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                <span className="text-yellow-500 font-semibold">★ {info?.rating || 4.5}</span>
                                <span>({info?.reviews?.toLocaleString() || '5,000+'} reviews)</span>
                                {info?.verified && <span className="text-emerald-600 font-semibold">• Verified</span>}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Product Price */}
                        <td className="py-4 px-4 font-semibold text-gray-700">
                          ₹{s.price.toLocaleString()}
                        </td>

                        {/* Discount */}
                        <td className="py-4 px-4 font-bold text-emerald-600">
                          {s.discount > 0 ? `-₹${s.discount.toLocaleString()}` : <span className="text-gray-400 font-normal">₹0</span>}
                        </td>

                        {/* Delivery Charge */}
                        <td className="py-4 px-4">
                          {s.deliveryCharge === 0 ? (
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-lg text-xs">
                              FREE
                            </span>
                          ) : (
                            <span className="font-semibold text-gray-700 text-xs">
                              ₹{s.deliveryCharge}
                            </span>
                          )}
                        </td>

                        {/* Delivery Time */}
                        <td className="py-4 px-4 text-xs font-semibold text-gray-700">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            {s.deliveryTime}
                          </div>
                        </td>

                        {/* Final Price */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className={`text-lg font-black ${isBest ? 'text-emerald-700' : 'text-gray-900'}`}>
                              ₹{s.finalPrice.toLocaleString()}
                            </span>
                            {index > 0 && (
                              <span className="text-[11px] text-red-500 font-semibold">
                                +₹{(s.finalPrice - bestDealSeller.finalPrice).toLocaleString()} higher
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Action Column */}
                        <td className="py-4 px-6 text-center">
                          <button
                            id={`select-seller-${s.sellerId}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSellerId(s.sellerId);
                              handleAddToCart();
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                                : 'bg-gray-100 hover:bg-orange-50 hover:text-orange-600 text-gray-800'
                            }`}
                          >
                            {isSelected ? 'Selected ✓' : 'Select Deal'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer info banner */}
            <div className="bg-gray-50 border-t border-gray-100 p-4 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                All sellers are certified by DealKart. Final Price includes all applicable discounts and shipping charges.
              </span>
              <span className="font-semibold text-gray-700">
                Found {sortedSellers.length} verified sellers for this SKU
              </span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 8: WISHLIST & CUSTOMER RATINGS AND REVIEWS
        ========================================================================= */}
        <section id="reviews-and-ratings-section" className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Customer Ratings & Reviews</h2>
              <p className="text-xs text-gray-500 mt-0.5">Real verified buyer feedback on products and seller fulfillment</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                id="wishlist-toggle-bottom"
                onClick={() => dispatch({ type: isWishlisted ? 'REMOVE_FROM_WISHLIST' : 'ADD_TO_WISHLIST', payload: product.id })}
                className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isWishlisted ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-200 text-gray-700 hover:border-red-400'
                }`}
              >
                <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
                {isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Rating Breakdown Chart (4 cols) */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center">
                <div className="text-5xl font-black text-gray-900">{product.rating}</div>
                <div className="flex justify-center my-2">
                  <StarRatingDisplay rating={product.rating} size="lg" />
                </div>
                <p className="text-xs text-gray-500">{allReviews.length + 4200} ratings and reviews</p>
              </div>

              {/* Star Progress Bars */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const pct = star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 6 : star === 2 ? 3 : 1;
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-6 text-gray-600 font-bold">{star} ★</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-right text-gray-400">{pct}%</span>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Review Form */}
              <div className="bg-orange-50/60 rounded-2xl p-5 border border-orange-200/80">
                <h4 className="text-sm font-bold text-gray-900 mb-1">Write a Customer Review</h4>
                <p className="text-xs text-gray-500 mb-3">Share your experience with this deal</p>

                {reviewSubmitted && (
                  <div className="bg-emerald-100 text-emerald-800 text-xs font-bold p-3 rounded-xl mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Thank you! Your review has been published.
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Your Rating:</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setUserRating(star)}
                          className={`text-xl ${star <= userRating ? 'text-yellow-400' : 'text-gray-300'} transition-transform active:scale-125`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <input
                      id="review-title-input"
                      type="text"
                      placeholder="Headline (e.g., Best deal online!)"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-gray-200 outline-none focus:border-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <textarea
                      id="review-comment-input"
                      rows={3}
                      placeholder="Describe delivery speed, packaging, and product authenticity..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-gray-200 outline-none focus:border-orange-500"
                      required
                    />
                  </div>

                  <button
                    id="submit-review-btn"
                    type="submit"
                    className="w-full py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Review
                  </button>
                </form>
              </div>
            </div>

            {/* Reviews Feed (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <h3 className="font-bold text-sm text-gray-900">Recent Customer Reviews ({allReviews.length})</h3>

              {allReviews.map((rev) => (
                <div key={rev.id} className="bg-gray-50/70 border border-gray-100 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-xs font-black">
                        {rev.user[0]}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-800">{rev.user}</span>
                        {rev.verified && (
                          <span className="ml-2 text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md font-bold">
                            ✓ Verified Buyer
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{rev.date}</span>
                  </div>

                  <div className="flex text-yellow-400 text-xs">
                    {'★'.repeat(rev.rating)}
                  </div>

                  <h5 className="text-xs font-bold text-gray-900">{rev.title}</h5>
                  <p className="text-xs text-gray-600 leading-relaxed">{rev.text}</p>

                  <div className="pt-1 flex items-center gap-3 text-xs text-gray-400">
                    <span>Helpful?</span>
                    <button className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
                      <ThumbsUp className="w-3 h-3" /> {rev.helpful}
                    </button>
                    <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
