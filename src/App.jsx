import { useState, useCallback } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import PortalSwitcher from './components/PortalSwitcher';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ListingPage from './pages/ListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrdersPage from './pages/OrdersPage';
import ComparePage from './pages/ComparePage';
import LoginPage from './pages/LoginPage';
import WishlistPage from './pages/WishlistPage';
import SellerDashboard from './pages/seller/SellerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

// Compare Floating Bar (shown when products are selected for comparison)
function CompareFloatBar({ compareList, onNavigate, dispatch }) {
  if (compareList.length === 0) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-navy-950 text-white border-t-2 border-orange-500 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-gray-300">
          <span className="text-orange-400 font-black text-lg">{compareList.length}</span> product{compareList.length !== 1 ? 's' : ''} in comparison queue
          {compareList.length < 4 && (
            <span className="text-gray-400 ml-2 text-xs">· (Can add up to 4 items)</span>
          )}
        </p>
        <div className="flex items-center gap-3">
          <button
            id="compare-float-clear"
            onClick={() => dispatch({ type: 'CLEAR_COMPARE' })}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors font-semibold px-2 py-1"
          >
            Clear All
          </button>
          <button
            id="compare-float-btn"
            onClick={() => onNavigate('compare')}
            disabled={compareList.length < 2}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-6 py-2 rounded-xl text-xs sm:text-sm transition-all active:scale-95 shadow-md shadow-orange-500/20"
          >
            Compare Deals Now →
          </button>
        </div>
      </div>
    </div>
  );
}

// Inner App — has access to CartContext & handles portal routing
function AppInner() {
  const { state, dispatch } = useCart();
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState({});

  const navigate = useCallback((page, params = {}) => {
    // If navigating to portals directly
    if (page === 'seller') {
      dispatch({ type: 'SET_PORTAL', payload: 'seller' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (page === 'admin') {
      dispatch({ type: 'SET_PORTAL', payload: 'admin' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (page === 'customer') {
      dispatch({ type: 'SET_PORTAL', payload: 'customer' });
      setCurrentPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Default customer navigation
    dispatch({ type: 'SET_PORTAL', payload: 'customer' });
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch]);

  const currentPortal = state.currentPortal || 'customer';

  // Render Portal Switcher at the top of all views
  const portalHeader = (
    <PortalSwitcher
      currentPortal={currentPortal}
      onSelectPortal={(portal) => dispatch({ type: 'SET_PORTAL', payload: portal })}
    />
  );

  // If in SELLER portal
  if (currentPortal === 'seller') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        {portalHeader}
        <div className="flex-1">
          <SellerDashboard onNavigate={navigate} />
        </div>
      </div>
    );
  }

  // If in ADMIN portal
  if (currentPortal === 'admin') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        {portalHeader}
        <div className="flex-1">
          <AdminDashboard onNavigate={navigate} />
        </div>
      </div>
    );
  }

  // CUSTOMER STOREFRONT
  const noLayoutPages = ['login', 'register'];
  const showLayout = !noLayoutPages.includes(currentPage);
  const showCompareBar = state.compareList.length > 0 && currentPage !== 'compare';

  const renderCustomerPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigate} />;
      case 'listing':
      case 'categories':
      case 'deals':
        return <ListingPage onNavigate={navigate} params={pageParams} key={JSON.stringify(pageParams)} />;
      case 'product':
        return <ProductDetailPage onNavigate={navigate} params={pageParams} key={pageParams.productId || 'p1'} />;
      case 'cart':
        return <CartPage onNavigate={navigate} />;
      case 'checkout':
        return <CheckoutPage onNavigate={navigate} />;
      case 'order-confirmation':
        return <OrderConfirmationPage onNavigate={navigate} params={pageParams} />;
      case 'orders':
        return <OrdersPage onNavigate={navigate} />;
      case 'compare':
        return <ComparePage onNavigate={navigate} />;
      case 'login':
      case 'register':
        return <LoginPage onNavigate={navigate} />;
      case 'wishlist':
        return <WishlistPage onNavigate={navigate} />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  if (!showLayout) {
    return (
      <div className="min-h-screen flex flex-col">
        {portalHeader}
        <div className="flex-1">
          {renderCustomerPage()}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${showCompareBar ? 'pb-16' : ''}`}>
      {portalHeader}
      <Navbar onNavigate={navigate} currentPage={currentPage} />
      <main className="flex-1 animate-fade-in">
        {renderCustomerPage()}
      </main>
      <Footer onNavigate={navigate} />
      {showCompareBar && (
        <CompareFloatBar
          compareList={state.compareList}
          onNavigate={navigate}
          dispatch={dispatch}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppInner />
    </CartProvider>
  );
}
