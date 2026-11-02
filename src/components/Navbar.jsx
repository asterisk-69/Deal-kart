import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Search, MapPin, User, Menu, X, ChevronDown, Heart, Package, Bell, Store } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { categories, searchProducts } from '../data/products';

export default function Navbar({ onNavigate, currentPage }) {
  const { cartCount, state, dispatch } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [location, setLocation] = useState('Mumbai');
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'];

  const ordersCount = state.orders ? state.orders.length : 0;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const q = query.trim().toLowerCase();
      const allProducts = state.products || [];
      const results = allProducts.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.storageVariant || '').toLowerCase().includes(q) ||
        (p.shortDescription || '').toLowerCase().includes(q) ||
        p.sellers.some(s => (s.sellerName || '').toLowerCase().includes(q))
      ).slice(0, 6);
      setSearchResults(results);
      setShowSearch(true);
    } else {
      setShowSearch(false);
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('listing', { search: searchQuery.trim() });
      setShowSearch(false);
    }
  };

  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'All Products', page: 'listing' },
    { label: 'Compare', page: 'compare', badge: state.compareList.length },
    { label: 'My Orders', page: 'orders', badge: ordersCount },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      {/* Top Bar Announcement */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white text-xs py-1.5 px-4 text-center">
        ⚡ <strong>MULTI-SELLER PRICE ENGINE</strong> · Compare verified prices, discounts & delivery charges in real-time!
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3 md:gap-5">
          {/* Logo */}
          <button
            id="nav-logo"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-white font-black text-xl">D</span>
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-2xl font-black tracking-tight">
                <span className="text-navy-900">Deal</span>
                <span className="text-orange-500">Kart</span>
              </span>
              <span className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase -mt-1">
                Marketplace
              </span>
            </div>
          </button>

          {/* Location Selector */}
          <div className="hidden md:flex items-center gap-1.5 cursor-pointer flex-shrink-0 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
            <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold">Deliver to</p>
              <div className="flex items-center gap-0.5">
                <select
                  id="location-selector"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="text-xs font-bold text-gray-800 bg-transparent border-none outline-none cursor-pointer"
                >
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Dynamic Search Bar (Requirement 1) */}
          <div className="flex-1 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center bg-gray-100/80 rounded-2xl overflow-hidden border-2 border-transparent focus-within:border-orange-500 focus-within:bg-white transition-all shadow-inner">
                <input
                  id="main-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => { if (searchQuery.trim().length > 0) setShowSearch(true); }}
                  placeholder="Search products, brands, or categories (e.g. iPhone, Samsung, Sony)..."
                  className="flex-1 px-4 py-2.5 bg-transparent text-xs sm:text-sm outline-none text-gray-900 placeholder-gray-400"
                />
                <button
                  id="search-btn"
                  type="submit"
                  className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white transition-colors flex items-center justify-center"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Dynamic Search Dropdown */}
            {showSearch && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-slide-up">
                {searchResults.length > 0 ? (
                  <>
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 flex items-center justify-between">
                      <span>Matching Products ({searchResults.length})</span>
                      <span className="text-orange-600">Multi-Seller Compared</span>
                    </div>

                    <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => {
                            onNavigate('product', { productId: product.id });
                            setShowSearch(false);
                            setSearchQuery('');
                          }}
                          className="w-full flex items-center gap-3.5 px-4 py-3 hover:bg-orange-50/70 transition-colors text-left group"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-11 h-11 object-cover rounded-xl border border-gray-100 flex-shrink-0 group-hover:scale-105 transition-transform"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-bold text-gray-900 truncate group-hover:text-orange-600">
                              {product.name}
                            </p>
                            <p className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                              <span className="uppercase font-semibold text-gray-400">{product.brand}</span>
                              <span>•</span>
                              <span>{product.sellers.length} seller deals</span>
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs sm:text-sm font-black text-gray-900">
                              ₹{product.lowestPrice.toLocaleString()}
                            </span>
                            <span className="block text-[10px] text-emerald-600 font-bold">Lowest Final</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        onNavigate('listing', { search: searchQuery });
                        setShowSearch(false);
                      }}
                      className="w-full px-4 py-3 bg-orange-50 text-orange-600 text-xs font-bold hover:bg-orange-100 transition-colors text-center border-t border-orange-100"
                    >
                      See all search results for "{searchQuery}" →
                    </button>
                  </>
                ) : (
                  /* No products found dynamic feedback */
                  <div className="p-6 text-center">
                    <div className="text-3xl mb-2">🔍</div>
                    <p className="text-sm font-bold text-gray-800">No products found for "{searchQuery}"</p>
                    <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                      Try searching for iPhone 16, Samsung Galaxy, OnePlus, Sony Headphones, boAt, or MacBook.
                    </p>
                    <button
                      onClick={() => {
                        onNavigate('listing');
                        setShowSearch(false);
                        setSearchQuery('');
                      }}
                      className="mt-3 text-xs font-bold text-orange-600 hover:underline"
                    >
                      Browse full product catalog
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Header Navigation Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* My Orders Direct Link */}
            <button
              id="nav-orders-btn"
              onClick={() => onNavigate('orders')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl hover:bg-gray-100 text-gray-700 transition-colors relative"
              title="My Orders"
            >
              <Package className="w-5 h-5 text-gray-600" />
              {ordersCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-navy-900 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {ordersCount}
                </span>
              )}
              <span className="hidden xl:inline text-xs font-bold">Orders</span>
            </button>

            {/* Wishlist */}
            <button
              id="wishlist-btn"
              onClick={() => onNavigate('wishlist')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl hover:bg-gray-100 text-gray-700 transition-colors relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
              {state.wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {state.wishlist.length}
                </span>
              )}
              <span className="hidden xl:inline text-xs font-bold">Wishlist</span>
            </button>

            {/* Cart Icon */}
            <button
              id="cart-btn"
              onClick={() => onNavigate('cart')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-600 transition-colors relative"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-orange-500 text-white text-[11px] rounded-full flex items-center justify-center font-black px-1 shadow-sm">
                  {cartCount}
                </span>
              )}
              <span className="hidden lg:inline text-xs font-bold">Cart</span>
            </button>

            {/* User Profile / Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                id="user-menu-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-navy-800 to-navy-950 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {state.user ? state.user.name[0] : <User className="w-4 h-4" />}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden sm:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-slide-up">
                  {state.user ? (
                    <>
                      <div className="px-5 py-4 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200/50">
                        <p className="font-bold text-gray-900 text-sm">{state.user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{state.user.email}</p>
                      </div>
                      <div className="p-2 space-y-1 text-xs font-semibold text-gray-700">
                        <button
                          onClick={() => { onNavigate('orders'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-left"
                        >
                          <Package className="w-4 h-4 text-orange-500" /> My Orders ({ordersCount})
                        </button>
                        <button
                          onClick={() => { onNavigate('wishlist'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-left"
                        >
                          <Heart className="w-4 h-4 text-red-500" /> My Wishlist ({state.wishlist.length})
                        </button>
                        <button
                          onClick={() => { onNavigate('compare'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-left"
                        >
                          <Store className="w-4 h-4 text-blue-500" /> Compare List ({state.compareList.length})
                        </button>
                        <div className="border-t border-gray-100 my-1 pt-1">
                          <button
                            onClick={() => { onNavigate('seller'); setShowUserMenu(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-blue-50 text-blue-700 text-left font-bold"
                          >
                            <Store className="w-4 h-4 text-blue-600" /> Seller Dashboard
                          </button>
                          <button
                            onClick={() => { onNavigate('admin'); setShowUserMenu(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-purple-50 text-purple-700 text-left font-bold"
                          >
                            <Bell className="w-4 h-4 text-purple-600" /> Admin Panel
                          </button>
                        </div>
                        <button
                          onClick={() => { dispatch({ type: 'LOGOUT' }); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 text-left border-t border-gray-100 mt-1"
                        >
                          <X className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Welcome to DealKart</p>
                        <p className="text-xs text-gray-500">Sign in to track orders and save deals</p>
                      </div>
                      <button
                        id="signin-btn"
                        onClick={() => { onNavigate('login'); setShowUserMenu(false); }}
                        className="w-full btn-primary text-xs py-2.5"
                      >
                        Sign In
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Sub Navigation: Categories & Compare */}
      <nav className="hidden md:block bg-gray-50/70 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between text-xs font-bold text-gray-700 overflow-x-auto py-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => onNavigate('listing')}
                className="px-3 py-1.5 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center gap-1.5"
              >
                <span>📦</span> All Deals
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onNavigate('listing', { category: cat.id })}
                  className="px-3 py-1.5 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>{cat.icon}</span> {cat.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('compare')}
                className="flex items-center gap-1.5 text-navy-800 hover:text-orange-600 transition-colors bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs"
              >
                <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {state.compareList.length}
                </span>
                Compare Sellers
              </button>
              <button
                onClick={() => onNavigate('orders')}
                className="text-navy-800 hover:text-orange-600 transition-colors flex items-center gap-1"
              >
                <Package className="w-3.5 h-3.5 text-orange-500" />
                Track Orders
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => { onNavigate(link.page); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-gray-800 hover:bg-orange-50"
              >
                <span>{link.label}</span>
                {link.badge > 0 && (
                  <span className="w-4 h-4 bg-orange-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Categories</p>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { onNavigate('listing', { category: cat.id }); setMobileMenuOpen(false); }}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl bg-gray-50 text-[11px] font-bold text-gray-700"
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
