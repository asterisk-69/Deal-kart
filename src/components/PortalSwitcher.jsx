import { ShoppingBag, Store, ShieldCheck, RotateCcw, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function PortalSwitcher({ currentPortal, onSelectPortal }) {
  const { state, dispatch } = useCart();
  const sellers = state.sellers || [];

  const handleResetData = () => {
    if (window.confirm('Reset all demo data (products, sample orders, sellers) to default populated state?')) {
      dispatch({ type: 'RESET_DEMO_DATA' });
      alert('Demo data restored to default populated state!');
    }
  };

  return (
    <div className="bg-navy-950 text-white border-b border-navy-800 text-xs py-2 px-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Left: Portal Label & Main Selling Point */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-extrabold uppercase tracking-wider text-orange-400">DealKart Ecosystem:</span>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 bg-navy-900/90 text-amber-300 font-extrabold px-2.5 py-0.5 rounded-full border border-amber-500/30 text-[11px] tracking-wide">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>SEARCH ONCE. COMPARE EVERYTHING. GET THE BEST DEAL.</span>
          </div>
        </div>

        {/* Right: Switcher Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 1. Customer Storefront */}
          <button
            id="portal-customer-btn"
            onClick={() => onSelectPortal('customer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              currentPortal === 'customer'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30 ring-2 ring-orange-300'
                : 'bg-navy-900 text-gray-300 hover:bg-navy-800 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Customer View</span>
          </button>

          {/* 2. Seller Dashboard */}
          <div className="flex items-center bg-navy-900 rounded-xl overflow-hidden border border-navy-800">
            <button
              id="portal-seller-btn"
              onClick={() => onSelectPortal('seller')}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-bold transition-all ${
                currentPortal === 'seller'
                  ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300'
                  : 'text-gray-300 hover:text-white hover:bg-navy-800'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-blue-300" />
              <span>Seller View</span>
            </button>

            {/* Quick Seller Account Switcher */}
            <select
              id="active-seller-switcher"
              value={state.activeSellerId || 's1'}
              onChange={(e) => {
                dispatch({ type: 'SET_ACTIVE_SELLER', payload: e.target.value });
                onSelectPortal('seller');
              }}
              className="bg-navy-950 text-blue-300 font-bold px-2 py-1.5 outline-none text-[11px] cursor-pointer hover:text-white border-l border-navy-800"
              title="Switch Active Seller Account"
            >
              {sellers.map((s) => (
                <option key={s.id} value={s.id} className="bg-navy-900 text-white">
                  👤 {s.name} ({s.status})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Admin Panel */}
          <button
            id="portal-admin-btn"
            onClick={() => onSelectPortal('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              currentPortal === 'admin'
                ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-300'
                : 'bg-navy-900 text-gray-300 hover:bg-navy-800 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
            <span>Admin View</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            id="reset-demo-data-btn"
            onClick={handleResetData}
            title="Reset data back to sample defaults"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-navy-900 transition-all text-[11px] border border-navy-800"
          >
            <RotateCcw className="w-3 h-3 text-gray-400" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
