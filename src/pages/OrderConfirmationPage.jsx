import { CheckCircle, Truck, Package, ArrowRight, Store, ShieldCheck, MapPin, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function OrderConfirmationPage({ onNavigate, params = {} }) {
  const order = params.order;
  const [copied, setCopied] = useState(false);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-md w-full">
          <h2 className="text-xl font-bold text-gray-800 mb-4">No Recent Order Found</h2>
          <button onClick={() => onNavigate('orders')} className="btn-primary w-full">
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  const handleCopyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(order.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Success Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
            <CheckCircle className="w-12 h-12" />
          </div>

          <span className="bg-emerald-100 text-emerald-800 text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
            Order Confirmed
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-3">
            Thank you for your order! 🎉
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            Your order has been routed to the respective sellers. We have sent a confirmation email & SMS receipt.
          </p>

          {/* Unique Order ID banner */}
          <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-4 mt-6 inline-flex flex-col sm:flex-row items-center gap-3">
            <div className="text-left">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Unique Order ID</span>
              <p className="text-base font-black text-navy-900">{order.id}</p>
            </div>
            <button
              onClick={handleCopyId}
              className="px-3 py-1.5 bg-white border border-orange-300 rounded-xl text-xs font-bold text-orange-600 hover:bg-orange-50 transition-colors flex items-center gap-1 shadow-sm"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? 'Copied! ✓' : 'Copy ID'}
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <button
              id="view-in-my-orders-btn"
              onClick={() => onNavigate('orders')}
              className="px-6 py-3.5 bg-navy-900 hover:bg-navy-800 text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4 text-orange-400" />
              Track in My Orders
            </button>
            <button
              id="continue-shopping-btn"
              onClick={() => onNavigate('listing')}
              className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Order Details Breakdown Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
          <h2 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3">
            Order Summary & Fulfillment Details
          </h2>

          {/* Delivery & Payment Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <span className="font-bold text-gray-500 uppercase text-[10px] flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5 text-orange-500" /> Shipping Address:
              </span>
              <p className="font-bold text-gray-900">{order.customer?.name}</p>
              <p className="text-gray-600 mt-0.5">{order.customer?.address}</p>
              <p className="text-gray-600">{order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}</p>
              <p className="text-gray-500 mt-1">Phone: {order.customer?.phone}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <span className="font-bold text-gray-500 uppercase text-[10px] flex items-center gap-1 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Payment & Status:
              </span>
              <p className="font-bold text-gray-900">{order.paymentMethod}</p>
              <p className="text-emerald-700 font-bold mt-1">Status: Confirmed</p>
              <p className="text-gray-500 mt-1">Order Date: {order.date}</p>
              <p className="text-gray-500">Estimated Delivery: 2-3 Business Days</p>
            </div>
          </div>

          {/* Ordered Items with Sellers */}
          <div>
            <h3 className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">
              Ordered Products ({order.items?.length})
            </h3>
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
              {order.items?.map((item) => (
                <div key={`${item.productId}-${item.sellerId}`} className="p-4 flex gap-4 items-center">
                  <img src={item.image} alt="" className="w-16 h-16 object-cover rounded-xl border border-gray-100 flex-shrink-0" />
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
                    <p className="text-gray-500 flex items-center gap-1 mt-0.5">
                      <Store className="w-3.5 h-3.5 text-orange-500" />
                      Fulfilling Seller: <strong>{item.sellerName || 'Marketplace Seller'}</strong>
                    </p>
                    <p className="text-gray-400 mt-0.5">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900 text-sm">
                      ₹{((item.finalPrice || item.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Totals */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-semibold">₹{order.subtotal?.toLocaleString()}</span>
            </div>
            {order.totalDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Seller Discounts:</span>
                <span>-₹{order.totalDiscount?.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Delivery Charge:</span>
              <span>{order.deliveryCharge === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${order.deliveryCharge}`}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-black text-gray-900">
              <span>Total Paid:</span>
              <span>₹{order.totalAmount?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
