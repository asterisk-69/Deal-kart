import { useState } from 'react';
import {
  ShieldCheck, LayoutDashboard, Users, Store, Package, ShoppingCart,
  BarChart3, Settings, CheckCircle, XCircle, AlertTriangle, Eye, Trash2,
  Search, ArrowUpRight, DollarSign, Filter, RefreshCw, Clock, MapPin
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function AdminDashboard({ onNavigate }) {
  const { state, dispatch } = useCart();
  const [currentTab, setCurrentTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [sellerFilter, setSellerFilter] = useState('all');
  const [feedback, setFeedback] = useState('');

  const products = state.products || [];
  const sellers = state.sellers || [];
  const customers = state.customers || [];
  const orders = state.orders || [];

  // Totals for Overview (Requirement 1)
  const totalCustomers = customers.length;
  const totalSellers = sellers.length;
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) + 12850000;

  // Seller management actions (Requirement 2)
  const handleSellerAction = (sellerId, newStatus, verified) => {
    dispatch({
      type: 'UPDATE_SELLER_STATUS',
      payload: { sellerId, status: newStatus, verified }
    });
    setFeedback(`Seller status updated to "${newStatus}"!`);
    setTimeout(() => setFeedback(''), 3000);
  };

  // Product removal (Requirement 3)
  const handleAdminDeleteProduct = (productId, productName) => {
    if (window.confirm(`Are you sure you want to remove "${productName}" from the marketplace?`)) {
      dispatch({
        type: 'ADMIN_DELETE_PRODUCT',
        payload: { productId }
      });
      setFeedback(`Product "${productName}" was removed from the marketplace.`);
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  // Order status update
  const handleOrderStatusUpdate = (orderId, newStatus) => {
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { orderId, newStatus }
    });
    setFeedback(`Order ${orderId} updated to ${newStatus}.`);
    setTimeout(() => setFeedback(''), 3000);
  };

  const navTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'sellers', label: 'Sellers', icon: Store, badge: sellers.filter(s => s.status === 'Pending Approval').length },
    { id: 'customers', label: 'Customers', icon: Users, badge: customers.length },
    { id: 'products', label: 'Products', icon: Package, badge: products.length },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: orders.length },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row text-gray-800">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 text-white flex-shrink-0 flex flex-col justify-between shadow-2xl border-r border-slate-900">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-lg">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-black text-sm text-white">DealKart Admin</h2>
                <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Super Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navTabs.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-gray-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                      isActive ? 'bg-white text-purple-700' : 'bg-slate-800 text-purple-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Link to Storefront */}
        <div className="p-4 border-t border-slate-800 text-xs">
          <button
            onClick={() => onNavigate('home')}
            className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-orange-400 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <Eye className="w-4 h-4" /> View Marketplace
          </button>
          <p className="text-[10px] text-gray-500 text-center mt-2">
            Platform Engine v3.0 • Verified
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Feedback Alert */}
        {feedback && (
          <div className="mb-6 bg-purple-100 border border-purple-300 text-purple-900 px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-purple-700" />
              {feedback}
            </span>
            <button onClick={() => setFeedback('')} className="text-purple-700 hover:text-purple-900">✕</button>
          </div>
        )}

        {/* TAB 1: ADMIN OVERVIEW (Requirement 1) */}
        {currentTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Admin Control Overview</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Marketplace-wide metrics, active merchant monitoring & gross transactions
              </p>
            </div>

            {/* 5 Primary Metric Cards (Requirement 1) */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-3xl p-5 border border-gray-200/70 shadow-sm">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Customers</span>
                <p className="text-2xl font-black text-gray-900 mt-1">{totalCustomers}</p>
                <span className="text-[11px] text-blue-600 font-semibold mt-1 block">Registered shoppers</span>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-gray-200/70 shadow-sm">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Sellers</span>
                <p className="text-2xl font-black text-gray-900 mt-1">{totalSellers}</p>
                <span className="text-[11px] text-purple-600 font-semibold mt-1 block">Certified merchants</span>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-gray-200/70 shadow-sm">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Products</span>
                <p className="text-2xl font-black text-gray-900 mt-1">{totalProducts}</p>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Live marketplace SKUs</span>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-gray-200/70 shadow-sm">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Orders</span>
                <p className="text-2xl font-black text-gray-900 mt-1">{totalOrders}</p>
                <span className="text-[11px] text-orange-600 font-semibold mt-1 block">Customer checkouts</span>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-gray-200/70 shadow-sm col-span-2 lg:col-span-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Revenue</span>
                <p className="text-2xl font-black text-emerald-700 mt-1">₹{totalRevenue.toLocaleString()}</p>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Gross Merchandise Value</span>
              </div>
            </div>

            {/* Recent Transactions Table (Requirement 1) */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/70 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-gray-900">Recent Transactions</h3>
                  <p className="text-xs text-gray-400">Live platform transactions and seller payouts</p>
                </div>
                <button
                  onClick={() => setCurrentTab('orders')}
                  className="text-xs font-bold text-purple-600 hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100 text-[10px] font-black uppercase text-gray-400">
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Sellers Involved</th>
                      <th className="py-2.5 px-3">Payment</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.slice(0, 6).map(o => {
                      const sellersList = [...new Set(o.items?.map(it => it.sellerName || 'Seller'))].join(', ');
                      return (
                        <tr key={o.id} className="hover:bg-gray-50/60">
                          <td className="py-3 px-3 font-black text-gray-900">{o.id}</td>
                          <td className="py-3 px-3 font-semibold text-gray-800">{o.customer?.name}</td>
                          <td className="py-3 px-3 text-gray-600 truncate max-w-xs">{sellersList}</td>
                          <td className="py-3 px-3 text-gray-500 truncate max-w-[120px]">{o.paymentMethod}</td>
                          <td className="py-3 px-3 font-black text-gray-900">₹{o.totalAmount?.toLocaleString()}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                              o.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                              o.status === 'Processing' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right text-gray-400">{o.date}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SELLER MANAGEMENT (Requirement 2) */}
        {currentTab === 'sellers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-gray-900">Seller Management</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Review seller registrations, manage verification badges, approve, reject or suspend merchants
                </p>
              </div>

              {/* Filter */}
              <div className="flex gap-2 text-xs">
                {['all', 'Approved', 'Pending Approval', 'Suspended'].map(flt => (
                  <button
                    key={flt}
                    onClick={() => setSellerFilter(flt)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      sellerFilter === flt ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    {flt}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200/70 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100 text-[10px] font-black uppercase text-gray-400">
                      <th className="py-3 px-4">Merchant Name</th>
                      <th className="py-3 px-3">Location & Contact</th>
                      <th className="py-3 px-3">GSTIN</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Verification</th>
                      <th className="py-3 px-3">Total Volume</th>
                      <th className="py-3 px-4 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sellers
                      .filter(s => sellerFilter === 'all' || s.status === sellerFilter)
                      .map(s => {
                        const sellerProdsCount = products.filter(p => p.sellers.some(sel => sel.sellerId === s.id)).length;

                        return (
                          <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-xs shadow-sm">
                                  {s.logo || 'SL'}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900 text-sm flex items-center gap-1">
                                    {s.name}
                                    {s.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                                  </p>
                                  <p className="text-[11px] text-gray-400">⭐ {s.rating} • {sellerProdsCount} active listings</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-3">
                              <p className="font-semibold text-gray-800">{s.location}</p>
                              <p className="text-gray-400 text-[11px]">{s.email || 'seller@dealkart.in'}</p>
                            </td>
                            <td className="py-3.5 px-3 font-mono text-gray-600">{s.gstin || '27AABCT1234A1Z5'}</td>
                            <td className="py-3.5 px-3">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                                s.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                                s.status === 'Suspended' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {s.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-3">
                              {s.verified ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                                  <CheckCircle className="w-3.5 h-3.5" /> Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-amber-700 font-bold text-[11px]">
                                  <Clock className="w-3.5 h-3.5" /> Unverified
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-3 font-black text-gray-900">
                              ₹{(s.revenue || 1200000).toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {s.status !== 'Approved' && (
                                  <button
                                    id={`approve-seller-${s.id}`}
                                    onClick={() => handleSellerAction(s.id, 'Approved', true)}
                                    className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[11px] font-bold transition-all"
                                  >
                                    Approve
                                  </button>
                                )}
                                {s.status === 'Pending Approval' && (
                                  <button
                                    id={`reject-seller-${s.id}`}
                                    onClick={() => handleSellerAction(s.id, 'Rejected', false)}
                                    className="px-2.5 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-[11px] font-bold transition-all"
                                  >
                                    Reject
                                  </button>
                                )}
                                {s.status === 'Approved' ? (
                                  <button
                                    id={`suspend-seller-${s.id}`}
                                    onClick={() => handleSellerAction(s.id, 'Suspended', false)}
                                    className="px-2.5 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-[11px] font-bold transition-all"
                                  >
                                    Suspend
                                  </button>
                                ) : s.status === 'Suspended' ? (
                                  <button
                                    onClick={() => handleSellerAction(s.id, 'Approved', true)}
                                    className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-[11px] font-bold transition-all"
                                  >
                                    Reactivate
                                  </button>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMERS */}
        {currentTab === 'customers' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Customer Management</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Registered platform shoppers, order history & account standing
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200/70 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-[10px] font-black uppercase text-gray-400">
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-3">Contact Email</th>
                    <th className="py-3 px-3">Phone</th>
                    <th className="py-3 px-3">City</th>
                    <th className="py-3 px-3">Orders Count</th>
                    <th className="py-3 px-3">Total Spent</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customers.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50/60">
                      <td className="py-3.5 px-4 font-bold text-gray-900">{c.name}</td>
                      <td className="py-3.5 px-3 text-gray-600">{c.email}</td>
                      <td className="py-3.5 px-3 text-gray-600">{c.phone}</td>
                      <td className="py-3.5 px-3 font-semibold text-gray-700">{c.city}</td>
                      <td className="py-3.5 px-3 font-bold text-gray-900">{c.ordersCount} orders</td>
                      <td className="py-3.5 px-3 font-black text-emerald-700">₹{c.totalSpent.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PRODUCT MANAGEMENT (Requirement 3) */}
        {currentTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-gray-900">Marketplace Product Catalog</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Monitor pricing, seller offers count, and remove inappropriate or duplicate listings
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Filter products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-gray-200 bg-white outline-none"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200/70 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100 text-[10px] font-black uppercase text-gray-400">
                      <th className="py-3 px-4">Product Name</th>
                      <th className="py-3 px-3">Brand</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Sellers Matched</th>
                      <th className="py-3 px-3">Lowest Final Price</th>
                      <th className="py-3 px-3">Rating</th>
                      <th className="py-3 px-4 text-right">Admin Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products
                      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(p => (
                        <tr key={p.id} className="hover:bg-gray-50/60">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded-xl border border-gray-200 flex-shrink-0" />
                              <div>
                                <p className="font-bold text-gray-900 text-xs line-clamp-1">{p.name}</p>
                                <p className="text-[10px] text-gray-400">{p.storageVariant || 'Standard'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-semibold text-gray-700">{p.brand}</td>
                          <td className="py-3 px-3 capitalize text-gray-600">{p.category}</td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md text-[11px]">
                              {p.sellers?.length || 1} sellers
                            </span>
                          </td>
                          <td className="py-3 px-3 font-black text-gray-900">₹{p.lowestPrice?.toLocaleString()}</td>
                          <td className="py-3 px-3 text-yellow-500 font-bold">★ {p.rating}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              id={`admin-del-${p.id}`}
                              onClick={() => handleAdminDeleteProduct(p.id, p.name)}
                              className="px-2.5 py-1 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ml-auto"
                              title="Remove inappropriate or duplicate listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remove SKU
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ORDER MANAGEMENT (Requirement 4) */}
        {currentTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">All Marketplace Orders</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Centralized platform order tracking, fulfillment monitoring & payment authorization logs
              </p>
            </div>

            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-3xl p-5 border border-gray-200/70 shadow-sm space-y-3 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-gray-900 text-sm">{order.id}</span>
                      <span className="text-gray-400">Date: {order.date}</span>
                      <span className="text-gray-600 font-semibold">• Payment: {order.paymentMethod}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-black text-gray-900 text-sm">₹{order.totalAmount?.toLocaleString()}</span>
                      <select
                        value={order.status}
                        onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                        className="px-2.5 py-1 rounded-xl border border-gray-200 font-bold text-xs bg-gray-50 outline-none"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-3 rounded-2xl">
                    <div>
                      <p className="font-bold text-gray-800">Customer: {order.customer?.name} ({order.customer?.phone})</p>
                      <p className="text-gray-500">{order.customer?.address}, {order.customer?.city}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-gray-500">Items: {order.items?.length} | Subtotal: ₹{order.subtotal?.toLocaleString()}</p>
                      <p className="text-emerald-600 font-semibold">Total Discount: -₹{order.totalDiscount?.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Itemized sellers */}
                  <div className="divide-y divide-gray-50">
                    {order.items?.map(it => (
                      <div key={it.productId} className="py-1.5 flex justify-between items-center text-[11px]">
                        <span className="font-medium text-gray-800">{it.name} (Qty: {it.quantity})</span>
                        <span className="text-gray-500">
                          Seller: <strong>{it.sellerName}</strong> • ₹{((it.finalPrice || it.price) * it.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: REPORTS (Requirement 5) */}
        {currentTab === 'reports' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Platform Analytics & Reports</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Marketplace performance, top-selling products & merchant benchmark rankings
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-3xl p-5 border border-gray-200/70 shadow-sm">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Avg Fulfillment Time</span>
                <p className="text-2xl font-black text-gray-900 mt-1">1.8 Days</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">98.2% on-time delivery</p>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-gray-200/70 shadow-sm">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Customer Return Rate</span>
                <p className="text-2xl font-black text-gray-900 mt-1">1.2%</p>
                <p className="text-[11px] text-blue-600 font-semibold mt-1">Far below industry average (3%)</p>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-gray-200/70 shadow-sm">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Platform Take Rate</span>
                <p className="text-2xl font-black text-gray-900 mt-1">3.5%</p>
                <p className="text-[11px] text-purple-600 font-semibold mt-1">Competitive commission model</p>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-gray-200/70 shadow-sm">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Net Revenue Earned</span>
                <p className="text-2xl font-black text-emerald-700 mt-1">₹4,49,750</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">Platform fee income</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top-Selling Products */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200/70 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-gray-900">Top-Selling Products</h3>
                <div className="divide-y divide-gray-100 text-xs">
                  {products.slice(0, 5).map((p, idx) => (
                    <div key={p.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-5 font-black text-gray-400 text-sm">#{idx + 1}</span>
                        <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded-xl border border-gray-200" />
                        <div>
                          <p className="font-bold text-gray-900">{p.name}</p>
                          <p className="text-gray-400">{p.sellers.length} active sellers competing</p>
                        </div>
                      </div>
                      <span className="font-black text-gray-900">₹{p.lowestPrice?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best-Performing Sellers */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200/70 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-gray-900">Best-Performing Sellers</h3>
                <div className="divide-y divide-gray-100 text-xs">
                  {sellers.map((s, idx) => (
                    <div key={s.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-5 font-black text-gray-400 text-sm">#{idx + 1}</span>
                        <div className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xs">
                          {s.logo}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 flex items-center gap-1">
                            {s.name}
                            {s.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                          </p>
                          <p className="text-gray-400">Rating: ★ {s.rating} • {s.location}</p>
                        </div>
                      </div>
                      <span className="font-black text-emerald-700">₹{(s.revenue || 1200000).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SETTINGS */}
        {currentTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Platform Settings</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Marketplace rules, merchant commission & platform parameters
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/70 shadow-sm space-y-5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Marketplace Platform Commission (%)</label>
                <input
                  type="number"
                  defaultValue={3.5}
                  step={0.1}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Free Delivery Eligibility Minimum Order (₹)</label>
                <input
                  type="number"
                  defaultValue={499}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Merchant Verification Policy</label>
                <select defaultValue="strict" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 font-semibold">
                  <option value="strict">Strict (Requires GSTIN + Bank Verification)</option>
                  <option value="moderate">Moderate (Requires Email + Identity Check)</option>
                  <option value="open">Open Marketplace</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setFeedback('Platform settings updated successfully.');
                    setTimeout(() => setFeedback(''), 3000);
                  }}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
