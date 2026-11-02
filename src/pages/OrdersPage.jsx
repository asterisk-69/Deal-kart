import { useState } from 'react';
import {
  Package, Truck, CheckCircle2, Clock, Store, ChevronRight, Search,
  ExternalLink, Copy, AlertCircle, ArrowRight, ShieldCheck, MapPin, RefreshCw, X
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const STATUS_STEPS = ['Confirmed', 'Processing', 'Shipped', 'Delivered'];

export default function OrdersPage({ onNavigate }) {
  const { state, dispatch } = useCart();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const orders = state.orders || [];

  // Filter orders by tab and search
  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === 'all' || order.status.toLowerCase() === activeTab.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      order.id.toLowerCase().includes(q) ||
      order.items?.some(it => it.name.toLowerCase().includes(q) || (it.sellerName || '').toLowerCase().includes(q));
    return matchesTab && matchesSearch;
  });

  const handleCopyId = (id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Interactive Demo tool: simulate advancing order status
  const handleAdvanceStatus = (orderId, currentStatus) => {
    const currentIndex = STATUS_STEPS.indexOf(currentStatus);
    if (currentIndex < STATUS_STEPS.length - 1) {
      const nextStatus = STATUS_STEPS[currentIndex + 1];
      dispatch({
        type: 'UPDATE_ORDER_STATUS',
        payload: { orderId, newStatus: nextStatus }
      });
      if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
        setSelectedOrderDetails(prev => ({
          ...prev,
          status: nextStatus,
        }));
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Processing': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="text-sm text-gray-500 flex items-center gap-2">
            <button onClick={() => onNavigate('home')} className="hover:text-orange-500">Home</button>
            <span>›</span>
            <span className="text-gray-800 font-medium">My Orders</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <Package className="w-7 h-7 text-orange-500" /> My Orders ({orders.length})
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Track shipments, view seller fulfillment status, and order details
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID or item..."
              className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-2xl bg-white border border-gray-200 outline-none focus:border-orange-500 shadow-sm"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {['all', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map((tab) => {
            const count = tab === 'all'
              ? orders.length
              : orders.filter(o => o.status.toLowerCase() === tab.toLowerCase()).length;
            const isActive = activeTab.toLowerCase() === tab.toLowerCase();

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-navy-900 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
                }`}
              >
                <span className="capitalize">{tab}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">No Orders Found</h3>
            <p className="text-xs text-gray-500 mt-1 mb-6">
              {searchQuery ? `No orders matched "${searchQuery}".` : 'You have no orders in this category yet.'}
            </p>
            <button onClick={() => onNavigate('listing')} className="btn-primary">
              Explore Deals & Shop
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const currentStepIndex = STATUS_STEPS.indexOf(order.status);
              const isLastStep = currentStepIndex === STATUS_STEPS.length - 1;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Top Bar */}
                  <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Order ID</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-gray-900">{order.id}</span>
                          <button
                            onClick={() => handleCopyId(order.id)}
                            className="text-gray-400 hover:text-orange-500 transition-colors"
                            title="Copy Order ID"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          {copiedId === order.id && (
                            <span className="text-[10px] font-bold text-emerald-600">Copied!</span>
                          )}
                        </div>
                      </div>

                      <div className="hidden sm:block border-l border-gray-200 pl-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Placed On</span>
                        <p className="font-semibold text-gray-800">{order.date}</p>
                      </div>

                      <div className="hidden md:block border-l border-gray-200 pl-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Payment</span>
                        <p className="font-semibold text-gray-800 truncate max-w-[140px]">{order.paymentMethod}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Total Amount</span>
                        <p className="font-black text-sm text-gray-900">₹{order.totalAmount?.toLocaleString()}</p>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* 4-Step Visual Tracker (Confirmed -> Processing -> Shipped -> Delivered) */}
                  <div className="px-6 py-6 border-b border-gray-100 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Shipment Progress Tracker
                      </span>
                      {/* Interactive Demo Control to test status transitions */}
                      {!isLastStep && (
                        <button
                          onClick={() => handleAdvanceStatus(order.id, order.status)}
                          className="text-[11px] font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 shadow-sm"
                          title="Advance order status for demonstration"
                        >
                          <RefreshCw className="w-3 h-3" /> Simulate: Move to {STATUS_STEPS[currentStepIndex + 1]}
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-3 relative">
                      {STATUS_STEPS.map((step, idx) => {
                        const isDone = idx <= currentStepIndex;
                        const isCurrent = idx === currentStepIndex;

                        return (
                          <div key={step} className="flex flex-col items-center text-center relative z-10">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                isDone
                                  ? 'bg-emerald-600 text-white shadow-md'
                                  : 'bg-gray-200 text-gray-500'
                              } ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}
                            >
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span className={`text-[11px] font-bold mt-2 ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                              {step}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {order.timeline?.[idx]?.time || (isDone ? 'Completed' : 'Pending')}
                            </span>
                          </div>
                        );
                      })}
                      {/* Connecting Line */}
                      <div className="absolute top-7 left-12 right-12 h-1 bg-gray-200 z-0">
                        <div
                          className="h-full bg-emerald-600 transition-all duration-500"
                          style={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Order Items with Selected Seller */}
                  <div className="p-6 divide-y divide-gray-100">
                    {order.items?.map((item) => (
                      <div key={`${item.productId}-${item.sellerId}`} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={item.image} alt="" className="w-14 h-14 object-cover rounded-xl border border-gray-100 flex-shrink-0" />
                          <div className="min-w-0 text-xs">
                            <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
                            <p className="text-gray-500 flex items-center gap-1 mt-0.5">
                              <Store className="w-3.5 h-3.5 text-orange-500" />
                              Fulfilling Seller: <strong>{item.sellerName || 'Marketplace Seller'}</strong>
                            </p>
                            <p className="text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-black text-gray-900">
                            ₹{((item.finalPrice || item.price) * item.quantity).toLocaleString()}
                          </p>
                          <button
                            onClick={() => onNavigate('product', { productId: item.productId })}
                            className="text-[11px] font-bold text-orange-600 hover:underline mt-1 block"
                          >
                            Buy Again
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Card Footer */}
                  <div className="bg-gray-50 px-6 py-3.5 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      Delivery to: <strong>{order.customer?.city || 'Customer Address'}</strong>
                    </span>
                    <button
                      id={`view-order-${order.id}`}
                      onClick={() => setSelectedOrderDetails(order)}
                      className="px-4 py-2 bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-xl font-bold text-gray-800 hover:text-orange-600 transition-all shadow-sm"
                    >
                      View Order Details →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: View Full Order Details */}
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedOrderDetails(null)}>
            <div
              className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Order Details</span>
                  <h3 className="text-lg font-black text-gray-900">{selectedOrderDetails.id}</h3>
                </div>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Banner */}
              <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Current Status</p>
                  <p className="text-sm font-bold text-gray-900">{selectedOrderDetails.status}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(selectedOrderDetails.status)}`}>
                  {selectedOrderDetails.status}
                </span>
              </div>

              {/* Delivery Address */}
              <div className="bg-gray-50 p-4 rounded-2xl text-xs space-y-1">
                <p className="font-bold text-gray-700 uppercase text-[10px] flex items-center gap-1 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" /> Delivery Address
                </p>
                <p className="font-bold text-gray-900">{selectedOrderDetails.customer?.name}</p>
                <p className="text-gray-600">{selectedOrderDetails.customer?.address}</p>
                <p className="text-gray-600">{selectedOrderDetails.customer?.city}, {selectedOrderDetails.customer?.state} - {selectedOrderDetails.customer?.pincode}</p>
                <p className="text-gray-500">Phone: {selectedOrderDetails.customer?.phone}</p>
              </div>

              {/* Items & Seller Information */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-700 uppercase">Fulfillment Breakdown</p>
                {selectedOrderDetails.items?.map((item) => (
                  <div key={`${item.productId}-${item.sellerId}`} className="flex gap-3 text-xs p-3 rounded-2xl border border-gray-100 bg-gray-50">
                    <img src={item.image} alt="" className="w-12 h-12 object-cover rounded-xl border border-gray-200 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">{item.name}</p>
                      <p className="text-gray-500 mt-0.5">Seller: <strong>{item.sellerName}</strong></p>
                      <div className="flex justify-between items-center mt-1">
                        <span>Qty: {item.quantity}</span>
                        <span className="font-black text-gray-900">₹{((item.finalPrice || item.price) * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment & Price Summary */}
              <div className="border-t border-gray-100 pt-3 text-xs space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Payment Method:</span>
                  <span className="font-bold text-gray-800">{selectedOrderDetails.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>₹{selectedOrderDetails.subtotal?.toLocaleString()}</span>
                </div>
                {selectedOrderDetails.totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Seller Discounts:</span>
                    <span>-₹{selectedOrderDetails.totalDiscount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges:</span>
                  <span>{selectedOrderDetails.deliveryCharge === 0 ? 'FREE' : `₹${selectedOrderDetails.deliveryCharge}`}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-black text-sm text-gray-900">
                  <span>Grand Total:</span>
                  <span>₹{selectedOrderDetails.totalAmount?.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="w-full py-3 bg-navy-900 text-white rounded-2xl text-xs font-bold transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
