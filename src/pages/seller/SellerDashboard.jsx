import { useState } from 'react';
import {
  LayoutDashboard, Package, PlusCircle, Boxes, ShoppingCart, TrendingUp,
  User, CheckCircle, AlertCircle, Clock, Truck, ShieldCheck, ArrowRight,
  Trash2, Edit3, Eye, Store, Save, Search, Filter, RotateCcw, DollarSign
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { calculateFinalPrice, categories } from '../../data/products';

export default function SellerDashboard({ onNavigate }) {
  const { state, dispatch, activeSeller } = useCart();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [editingProduct, setEditingProduct] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');

  const seller = activeSeller || state.sellers[0];
  const allProducts = state.products || [];
  const allOrders = state.orders || [];

  // Seller's specific products
  const sellerProducts = allProducts.filter(p =>
    p.sellers && p.sellers.some(s => s.sellerId === seller.id)
  );

  // Seller's specific orders
  const sellerOrders = allOrders.filter(o =>
    o.items && o.items.some(it => it.sellerId === seller.id)
  );

  // Stats calculation
  const totalProducts = sellerProducts.length;
  const activeListings = sellerProducts.filter(p => {
    const offer = p.sellers.find(s => s.sellerId === seller.id);
    return offer && offer.stock > 0;
  }).length;

  const totalOrdersCount = sellerOrders.length;
  const totalRevenue = sellerOrders.reduce((sum, order) => {
    const sellerItems = order.items.filter(it => it.sellerId === seller.id);
    return sum + sellerItems.reduce((iSum, it) => iSum + ((it.finalPrice || it.price) * it.quantity), 0);
  }, 0) + (seller.revenue || 0);

  // Add Product Form State (Requirement 2)
  const initialFormState = {
    name: '',
    brand: '',
    category: 'mobiles',
    model: '',
    storageVariant: '',
    image: '',
    description: '',
    price: '',
    discount: '0',
    deliveryCharge: '0',
    deliveryTime: 'Tomorrow',
    stock: '15',
  };
  const [formData, setFormData] = useState(initialFormState);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculatedFormFinal = Number(formData.price || 0) - Number(formData.discount || 0) + Number(formData.deliveryCharge || 0);

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.brand || !formData.price) {
      alert('Please fill in product name, brand and price.');
      return;
    }

    dispatch({
      type: 'ADD_PRODUCT',
      payload: {
        ...formData,
        sellerId: seller.id,
      }
    });

    setSuccessMsg(`"${formData.name}" was successfully listed on the DealKart marketplace!`);
    setFormData(initialFormState);
    setCurrentTab('products');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Update product offer (prices, inventory, details)
  const handleSaveProductEdit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    dispatch({
      type: 'UPDATE_PRODUCT_OFFER',
      payload: {
        productId: editingProduct.id,
        sellerId: seller.id,
        updates: {
          name: editingProduct.name,
          brand: editingProduct.brand,
          category: editingProduct.category,
          storageVariant: editingProduct.storageVariant,
          description: editingProduct.description,
          price: editingProduct.price,
          discount: editingProduct.discount,
          deliveryCharge: editingProduct.deliveryCharge,
          deliveryTime: editingProduct.deliveryTime,
          stock: editingProduct.stock,
        }
      }
    });

    setEditingProduct(null);
    setSuccessMsg('Product details and pricing updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Delete product listing
  const handleDeleteListing = (productId, prodName) => {
    if (window.confirm(`Are you sure you want to remove your listing for "${prodName}"?`)) {
      dispatch({
        type: 'DELETE_PRODUCT_LISTING',
        payload: { productId, sellerId: seller.id }
      });
      setSuccessMsg(`Listing for "${prodName}" removed from your store.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  // Quick stock adjuster
  const handleQuickStockChange = (productId, currentStock, delta) => {
    const newStock = Math.max(0, Number(currentStock) + delta);
    dispatch({
      type: 'UPDATE_PRODUCT_OFFER',
      payload: {
        productId,
        sellerId: seller.id,
        updates: { stock: newStock }
      }
    });
  };

  // Order status progression
  const handleOrderStatusChange = (orderId, newStatus) => {
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { orderId, newStatus }
    });
    setSuccessMsg(`Order ${orderId} status updated to ${newStatus}! Customer was notified.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Sidebar Menu items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'My Products', icon: Package, badge: totalProducts },
    { id: 'add-product', label: 'Add Product', icon: PlusCircle },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: sellerOrders.length },
    { id: 'sales', label: 'Sales', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row text-gray-800">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-navy-950 text-white flex-shrink-0 flex flex-col justify-between shadow-xl">
        <div>
          {/* Seller Store Header */}
          <div className="p-5 border-b border-navy-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-lg">
                {seller.logo || 'SL'}
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-sm text-white truncate flex items-center gap-1.5">
                  {seller.name}
                  {seller.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                </h2>
                <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                  <span className={`px-1.5 py-0.2 rounded font-bold ${seller.status === 'Approved' ? 'bg-emerald-900/60 text-emerald-300' : 'bg-amber-900/60 text-amber-300'}`}>
                    {seller.status}
                  </span>
                  <span>★ {seller.rating}</span>
                </div>
              </div>
            </div>

            {/* Quick Switch Seller Account Dropdown (Requirement: at least 3 sample sellers) */}
            <div className="mt-4 pt-3 border-t border-navy-800/80">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Active Seller Account:
              </label>
              <select
                value={seller.id}
                onChange={(e) => dispatch({ type: 'SET_ACTIVE_SELLER', payload: e.target.value })}
                className="w-full bg-navy-900 text-xs text-white border border-navy-800 rounded-xl px-2.5 py-1.5 outline-none font-semibold cursor-pointer hover:border-blue-500"
              >
                {state.sellers.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.location})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`seller-nav-${item.id}`}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-gray-300 hover:bg-navy-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                      isActive ? 'bg-white text-blue-700' : 'bg-navy-800 text-gray-300'
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
        <div className="p-4 border-t border-navy-800 text-xs">
          <button
            onClick={() => onNavigate('listing')}
            className="w-full py-2.5 px-3 bg-navy-900 hover:bg-navy-800 text-orange-400 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <Eye className="w-4 h-4" /> View Marketplace
          </button>
          <p className="text-[10px] text-gray-500 text-center mt-2">
            DealKart Merchant v2.6.4
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Success Alert Banner */}
        {successMsg && (
          <div className="mb-6 bg-emerald-100 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              {successMsg}
            </span>
            <button onClick={() => setSuccessMsg('')} className="text-emerald-700 hover:text-emerald-900">✕</button>
          </div>
        )}

        {/* TAB 1: SELLER DASHBOARD HOME */}
        {currentTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-gray-900">Seller Dashboard</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Performance overview for <strong>{seller.name}</strong> • Real-time marketplace metrics
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('add-product')}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/25 flex items-center gap-1.5 self-start"
              >
                <PlusCircle className="w-4 h-4" /> Add New Listing
              </button>
            </div>

            {/* 4 Primary Metric Cards (Requirement 1) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-3xl p-5 border border-gray-200/70 shadow-sm">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Products</span>
                <p className="text-2xl font-black text-gray-900 mt-1">{totalProducts}</p>
                <span className="text-[11px] text-blue-600 font-semibold mt-1 block">Listed in marketplace</span>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-gray-200/70 shadow-sm">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Orders</span>
                <p className="text-2xl font-black text-gray-900 mt-1">{totalOrdersCount}</p>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Fulfillment orders</span>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-gray-200/70 shadow-sm">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Revenue</span>
                <p className="text-2xl font-black text-gray-900 mt-1">₹{totalRevenue.toLocaleString()}</p>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">+14% vs last month</span>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-gray-200/70 shadow-sm">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Active Listings</span>
                <p className="text-2xl font-black text-gray-900 mt-1">{activeListings}</p>
                <span className="text-[11px] text-purple-600 font-semibold mt-1 block">In stock & ready to ship</span>
              </div>
            </div>

            {/* Sales Overview Chart (Requirement 1) */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/70 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-gray-900">Sales Overview Chart</h3>
                  <p className="text-xs text-gray-400">Weekly sales volume & revenue distribution</p>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  This Week: ₹{(totalRevenue * 0.28).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>

              {/* Visual Bar Chart */}
              <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-gray-100">
                {[
                  { day: 'Mon', value: 45, label: '₹45K' },
                  { day: 'Tue', value: 72, label: '₹72K' },
                  { day: 'Wed', value: 60, label: '₹60K' },
                  { day: 'Thu', value: 95, label: '₹95K' },
                  { day: 'Fri', value: 85, label: '₹85K' },
                  { day: 'Sat', value: 120, label: '₹1.2L' },
                  { day: 'Sun', value: 110, label: '₹1.1L' },
                ].map((bar) => (
                  <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {bar.label}
                    </span>
                    <div
                      className="w-full max-w-[42px] bg-gradient-to-t from-blue-600 to-indigo-500 rounded-xl group-hover:from-orange-500 group-hover:to-orange-400 transition-all shadow-sm"
                      style={{ height: `${(bar.value / 120) * 100}%` }}
                    />
                    <span className="text-xs font-bold text-gray-600">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders Table (Requirement 1) */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/70 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-gray-900">Recent Customer Orders</h3>
                  <p className="text-xs text-gray-400">Latest orders routed to {seller.name}</p>
                </div>
                <button
                  onClick={() => setCurrentTab('orders')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              {sellerOrders.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-500">
                  No orders have been routed to this seller yet. Customers will order your products from the marketplace!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
                        <th className="py-2.5">Order ID</th>
                        <th className="py-2.5">Customer</th>
                        <th className="py-2.5">Product</th>
                        <th className="py-2.5">Amount</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {sellerOrders.slice(0, 5).map(o => {
                        const sItem = o.items.find(it => it.sellerId === seller.id) || o.items[0];
                        return (
                          <tr key={o.id} className="hover:bg-gray-50/60">
                            <td className="py-3 font-black text-gray-900">{o.id}</td>
                            <td className="py-3 font-semibold text-gray-800">{o.customer?.name}</td>
                            <td className="py-3 text-gray-600 max-w-xs truncate">{sItem?.name}</td>
                            <td className="py-3 font-black text-gray-900">₹{(sItem?.finalPrice * (sItem?.quantity || 1)).toLocaleString()}</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                                {o.status}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => setCurrentTab('orders')}
                                className="text-blue-600 font-bold hover:underline"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ADD PRODUCT (Requirement 2) */}
        {currentTab === 'add-product' && (
          <div className="max-w-4xl space-y-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Add Product to Marketplace</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                List an identical model to join existing price comparison groups, or create a brand-new marketplace SKU.
              </p>
            </div>

            <form onSubmit={handleAddProductSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/70 shadow-sm space-y-6">
              {/* Product General Info */}
              <div>
                <h3 className="text-xs font-black text-navy-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" /> 1. Product Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 font-bold mb-1">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="e.g. Apple iPhone 16 (128GB) or Sony WH-1000XM5"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Brand *</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleFormChange}
                      placeholder="e.g. Apple, Samsung, Sony, boAt"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white font-semibold"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Model Name</label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleFormChange}
                      placeholder="e.g. iPhone 16 or Galaxy S25"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Storage / Variant (SKU isolation)</label>
                    <input
                      type="text"
                      name="storageVariant"
                      value={formData.storageVariant}
                      onChange={handleFormChange}
                      placeholder="e.g. 128GB, 256GB, or 16GB/512GB"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 font-bold mb-1">Product Image URL</label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleFormChange}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 font-bold mb-1">Product Description</label>
                    <textarea
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      placeholder="Enter specifications, highlights, warranty conditions, and package contents..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing, Discount, Delivery & Stock */}
              <div>
                <h3 className="text-xs font-black text-navy-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" /> 2. Pricing, Shipping & Inventory
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Product Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleFormChange}
                      placeholder="e.g. 79999"
                      required
                      min={0}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Discount Amount (₹)</label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleFormChange}
                      placeholder="e.g. 3000"
                      min={0}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white font-bold text-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Delivery Charge (₹, 0 = FREE)</label>
                    <input
                      type="number"
                      name="deliveryCharge"
                      value={formData.deliveryCharge}
                      onChange={handleFormChange}
                      placeholder="0"
                      min={0}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Delivery Time</label>
                    <select
                      name="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"
                    >
                      <option value="Tomorrow">Tomorrow (1 Day)</option>
                      <option value="1-2 Days">1-2 Days</option>
                      <option value="2-3 Days">2-3 Days</option>
                      <option value="3-5 Days">3-5 Days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Available Stock (Units) *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleFormChange}
                      placeholder="e.g. 20"
                      min={1}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 bg-gray-50 focus:bg-white font-bold"
                    />
                  </div>

                  {/* Real-time Best Deal Calculation Card */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex flex-col justify-center">
                    <span className="text-[10px] font-black text-emerald-700 uppercase">Calculated Final Price:</span>
                    <span className="text-xl font-black text-emerald-800">
                      ₹{calculatedFormFinal > 0 ? calculatedFormFinal.toLocaleString() : '0'}
                    </span>
                    <span className="text-[10px] text-emerald-600">Price - Discount + Delivery</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(initialFormState)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" /> Publish Product to DealKart
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: PRODUCT MANAGEMENT (Requirement 3) */}
        {currentTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-gray-900">My Listed Products</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Manage product specifications, active seller offers, prices, and stock for <strong>{seller.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('add-product')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 self-start"
              >
                <PlusCircle className="w-4 h-4" /> Add Product
              </button>
            </div>

            {sellerProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/70 shadow-sm">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-bold text-gray-800 text-base">No Products Listed Yet</h3>
                <p className="text-xs text-gray-500 mt-1 mb-4">Start selling by adding your first product offer to DealKart.</p>
                <button onClick={() => setCurrentTab('add-product')} className="btn-primary">
                  List Your First Product
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-200/70 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-100 text-[10px] font-black uppercase text-gray-400">
                        <th className="py-3 px-4">Product</th>
                        <th className="py-3 px-3">Category</th>
                        <th className="py-3 px-3">Base Price</th>
                        <th className="py-3 px-3">Discount</th>
                        <th className="py-3 px-3">Delivery</th>
                        <th className="py-3 px-3">Final Price</th>
                        <th className="py-3 px-3">Stock</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {sellerProducts.map(p => {
                        const offer = p.sellers.find(s => s.sellerId === seller.id) || p.sellers[0];
                        const finalP = calculateFinalPrice(offer);

                        return (
                          <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img src={p.images[0]} alt="" className="w-12 h-12 object-cover rounded-xl border border-gray-200 flex-shrink-0" />
                                <div>
                                  <p className="font-bold text-gray-900 text-xs line-clamp-1">{p.name}</p>
                                  <p className="text-[10px] text-gray-400 font-semibold uppercase">{p.brand} {p.storageVariant ? `• ${p.storageVariant}` : ''}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 capitalize font-semibold text-gray-700">{p.category}</td>
                            <td className="py-3 px-3 font-bold text-gray-900">₹{offer.price?.toLocaleString()}</td>
                            <td className="py-3 px-3 text-emerald-600 font-semibold">-₹{offer.discount?.toLocaleString()}</td>
                            <td className="py-3 px-3 text-gray-600">
                              {offer.deliveryCharge === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${offer.deliveryCharge}`}
                            </td>
                            <td className="py-3 px-3 font-black text-gray-900">₹{finalP.toLocaleString()}</td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                offer.stock > 5 ? 'bg-emerald-100 text-emerald-800' : offer.stock > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {offer.stock} in stock
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setEditingProduct({ ...p, ...offer })}
                                  className="p-1.5 bg-gray-100 hover:bg-blue-100 hover:text-blue-600 rounded-lg text-gray-600 transition-colors"
                                  title="Edit Product & Pricing"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteListing(p.id, p.name)}
                                  className="p-1.5 bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded-lg text-gray-600 transition-colors"
                                  title="Delete Listing"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Edit Product Modal */}
            {editingProduct && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h3 className="font-black text-base text-gray-900">Edit Product Offer</h3>
                    <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>

                  <form onSubmit={handleSaveProductEdit} className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Product Title</label>
                      <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Price (₹)</label>
                        <input
                          type="number"
                          value={editingProduct.price}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Discount (₹)</label>
                        <input
                          type="number"
                          value={editingProduct.discount}
                          onChange={(e) => setEditingProduct({ ...editingProduct, discount: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-emerald-600 font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Delivery Charge (₹)</label>
                        <input
                          type="number"
                          value={editingProduct.deliveryCharge}
                          onChange={(e) => setEditingProduct({ ...editingProduct, deliveryCharge: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Available Stock</label>
                        <input
                          type="number"
                          value={editingProduct.stock}
                          onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Delivery Time</label>
                      <input
                        type="text"
                        value={editingProduct.deliveryTime}
                        onChange={(e) => setEditingProduct({ ...editingProduct, deliveryTime: e.target.value })}
                        placeholder="e.g. Tomorrow or 1-2 Days"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200"
                      />
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex justify-between items-center">
                      <span className="font-bold text-gray-600">Calculated Final Price:</span>
                      <span className="text-base font-black text-gray-900">
                        ₹{(Number(editingProduct.price) - Number(editingProduct.discount || 0) + Number(editingProduct.deliveryCharge || 0)).toLocaleString()}
                      </span>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-md"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: INVENTORY MANAGEMENT */}
        {currentTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-gray-900">Inventory Stock Levels</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Monitor and adjust live stock for <strong>{seller.name}</strong> listings
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Filter stock by name..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-gray-200 bg-white outline-none"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200/70 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-[10px] font-black uppercase text-gray-400">
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-3">Variant</th>
                    <th className="py-3 px-3">Price</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-center">Quick Stock Adjust</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sellerProducts
                    .filter(p => p.name.toLowerCase().includes(inventorySearch.toLowerCase()))
                    .map(p => {
                      const offer = p.sellers.find(s => s.sellerId === seller.id) || p.sellers[0];
                      const isLow = offer.stock <= 5 && offer.stock > 0;
                      const isOut = offer.stock === 0;

                      return (
                        <tr key={p.id} className="hover:bg-gray-50/60">
                          <td className="py-3 px-4 font-bold text-gray-900">{p.name}</td>
                          <td className="py-3 px-3 text-gray-500">{p.storageVariant || 'Standard'}</td>
                          <td className="py-3 px-3 font-bold text-gray-900">₹{offer.price?.toLocaleString()}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              isOut ? 'bg-red-100 text-red-700' : isLow ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {isOut ? 'Out of Stock' : isLow ? `Low Stock (${offer.stock})` : `In Stock (${offer.stock})`}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleQuickStockChange(p.id, offer.stock, -5)}
                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-gray-700"
                              >
                                -5
                              </button>
                              <button
                                onClick={() => handleQuickStockChange(p.id, offer.stock, -1)}
                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-gray-700"
                              >
                                -1
                              </button>
                              <span className="w-10 text-center font-black text-sm text-gray-900">{offer.stock}</span>
                              <button
                                onClick={() => handleQuickStockChange(p.id, offer.stock, +1)}
                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-gray-700"
                              >
                                +1
                              </button>
                              <button
                                onClick={() => handleQuickStockChange(p.id, offer.stock, +5)}
                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-gray-700"
                              >
                                +5
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: ORDER MANAGEMENT (Requirement 4) */}
        {currentTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Seller Orders</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Incoming orders, customer shipping details & fulfillment status updates for <strong>{seller.name}</strong>
              </p>
            </div>

            {sellerOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/70 shadow-sm">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-bold text-gray-800 text-base">No Orders Received Yet</h3>
                <p className="text-xs text-gray-500 mt-1">Orders placed by customers for your listings will appear here automatically.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sellerOrders.map(order => {
                  const sItems = order.items.filter(it => it.sellerId === seller.id);
                  const sTotal = sItems.reduce((acc, it) => acc + ((it.finalPrice || it.price) * it.quantity), 0);

                  return (
                    <div key={order.id} className="bg-white rounded-3xl p-6 border border-gray-200/70 shadow-sm space-y-4">
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-black text-gray-900 text-sm">{order.id}</span>
                          <span className="text-gray-400">Placed on: {order.date}</span>
                          <span className="text-gray-400">• Pay via: <strong>{order.paymentMethod}</strong></span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-black text-gray-900">Total: ₹{sTotal.toLocaleString()}</span>
                          {/* Status Updater Dropdown (Requirement 4) */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-500 font-bold">Status:</span>
                            <select
                              value={order.status}
                              onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                              className="px-2.5 py-1 rounded-xl border border-gray-200 font-bold text-xs bg-gray-50 outline-none focus:border-blue-500"
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Customer Details Card */}
                      <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 text-xs flex flex-col sm:flex-row justify-between gap-3">
                        <div>
                          <p className="font-bold text-gray-800">Customer: {order.customer?.name}</p>
                          <p className="text-gray-500 mt-0.5">Phone: {order.customer?.phone} • {order.customer?.email || 'N/A'}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-gray-600 font-medium">Ship to: {order.customer?.address}</p>
                          <p className="text-gray-500">{order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="divide-y divide-gray-50">
                        {sItems.map(it => (
                          <div key={it.productId} className="py-2 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                              <img src={it.image} alt="" className="w-10 h-10 object-cover rounded-xl border border-gray-200" />
                              <div>
                                <p className="font-bold text-gray-900">{it.name}</p>
                                <p className="text-gray-400">Qty: {it.quantity} • Delivery: {it.deliveryTime || '1-2 Days'}</p>
                              </div>
                            </div>
                            <span className="font-bold text-gray-900">₹{(it.finalPrice * it.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: SALES */}
        {currentTab === 'sales' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Sales Analytics</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Financial performance and revenue breakdown for <strong>{seller.name}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-3xl p-5 border border-gray-200/70 shadow-sm">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Gross Merchandise Value</span>
                <p className="text-2xl font-black text-gray-900 mt-1">₹{totalRevenue.toLocaleString()}</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">Calculated across all orders</p>
              </div>
              <div className="bg-white rounded-3xl p-5 border border-gray-200/70 shadow-sm">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Units Sold</span>
                <p className="text-2xl font-black text-gray-900 mt-1">
                  {sellerOrders.reduce((sum, o) => sum + o.items.filter(it => it.sellerId === seller.id).reduce((is, it) => is + it.quantity, 0), 0) + 140}
                </p>
                <p className="text-[11px] text-blue-600 font-semibold mt-1">Active customer fulfillments</p>
              </div>
              <div className="bg-white rounded-3xl p-5 border border-gray-200/70 shadow-sm">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Average Order Value</span>
                <p className="text-2xl font-black text-gray-900 mt-1">
                  ₹{sellerOrders.length > 0 ? Math.round(totalRevenue / (sellerOrders.length + 10)).toLocaleString() : '68,500'}
                </p>
                <p className="text-[11px] text-purple-600 font-semibold mt-1">Electronics benchmark</p>
              </div>
            </div>

            {/* Sales breakdown table */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/70 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-gray-900">Top Performing Listings</h3>
              <div className="divide-y divide-gray-100 text-xs">
                {sellerProducts.slice(0, 5).map((p, idx) => (
                  <div key={p.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-gray-400 w-4">{idx + 1}</span>
                      <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded-xl border border-gray-200" />
                      <div>
                        <p className="font-bold text-gray-900">{p.name}</p>
                        <p className="text-gray-400">{p.category} • Rating: ★ {p.rating}</p>
                      </div>
                    </div>
                    <span className="font-black text-gray-900">₹{p.lowestPrice?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: PROFILE */}
        {currentTab === 'profile' && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Seller Store Profile</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Official marketplace registration & business contact details
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/70 shadow-sm space-y-6 text-xs">
              <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-md">
                  {seller.logo || 'SL'}
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    {seller.name}
                    {seller.verified && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                  </h2>
                  <p className="text-gray-500">{seller.description || 'Verified electronics dealer on DealKart.'}</p>
                  <p className="text-[11px] text-gray-400 mt-1">Member since {seller.joinedDate || '2024'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Official Email</span>
                  <p className="font-bold text-gray-900">{seller.email || 'seller@dealkart.in'}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Phone Number</span>
                  <p className="font-bold text-gray-900">{seller.phone || '+91 98200 12345'}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">GSTIN Registration</span>
                  <p className="font-bold text-gray-900">{seller.gstin || '27AABCT1234A1Z5'}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Warehouse City</span>
                  <p className="font-bold text-gray-900">{seller.location || 'Mumbai'}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl sm:col-span-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Return & Replacement Policy</span>
                  <p className="font-bold text-gray-900">{seller.returnPolicy || '7 Days Replacement Policy'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
