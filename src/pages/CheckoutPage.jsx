import { useState } from 'react';
import {
  ShieldCheck, Truck, CreditCard, Smartphone, Banknote, CheckCircle,
  ArrowRight, Store, AlertCircle, Lock, ChevronLeft, MapPin
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CheckoutPage({ onNavigate }) {
  const { state, dispatch, subtotal, totalDiscount, deliveryCharge, cartTotal } = useCart();

  // Customer details form
  const [formData, setFormData] = useState({
    name: state.user?.name || 'Paritosh Sharma',
    phone: state.user?.phone || '9876543210',
    email: state.user?.email || 'paritosh@example.com',
    address: '402 Sea Green Apts, Worli Sea Face',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400018',
  });

  // Payment method: 'upi' | 'card' | 'cod'
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('paritosh@okhdfcbank');
  const [cardData, setCardData] = useState({
    number: '4532 8901 2345 6789',
    name: 'Paritosh Sharma',
    expiry: '09/28',
    cvv: '842',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // If cart is empty and not submitting, prompt user
  if (state.items.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-md w-full">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Items to Checkout</h2>
          <p className="text-gray-500 text-xs mb-6">Add products from your favorite sellers before proceeding to checkout.</p>
          <button onClick={() => onNavigate('listing')} className="btn-primary w-full">
            Browse Marketplace
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setFormError('');

    // Basic Validation
    if (!formData.name.trim() || !formData.address.trim() || !formData.city.trim() || !formData.pincode.trim()) {
      setFormError('Please fill in all mandatory delivery address fields.');
      return;
    }
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    // Simulate payment authorization & order creation
    setTimeout(() => {
      const uniqueOrderId = `DK-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      });

      const paymentMethodNames = {
        upi: `UPI (${upiId || 'Instant UPI'})`,
        card: `Credit/Debit Card (Ending in ${cardData.number.slice(-4)})`,
        cod: 'Cash on Delivery (COD)',
      };

      const newOrder = {
        id: uniqueOrderId,
        date: currentDate,
        status: 'Confirmed',
        customer: { ...formData },
        paymentMethod: paymentMethodNames[paymentMethod],
        subtotal,
        totalDiscount,
        deliveryCharge,
        totalAmount: cartTotal,
        items: [...state.items],
        timeline: [
          { status: 'Confirmed', time: 'Just now', completed: true },
          { status: 'Processing', time: 'Expected by tomorrow', completed: false },
          { status: 'Shipped', time: 'Expected in 1-2 days', completed: false },
          { status: 'Delivered', time: 'Expected in 2-3 days', completed: false },
        ],
      };

      dispatch({ type: 'ADD_ORDER', payload: newOrder });
      setIsSubmitting(false);

      // Navigate to order confirmation
      onNavigate('order-confirmation', { order: newOrder });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => onNavigate('cart')}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Cart
          </button>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> 256-Bit SSL Encrypted Checkout
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">Checkout & Order Placement</h1>
          <p className="text-xs text-gray-500 mt-1">
            Complete your order details and choose your preferred mock payment option.
          </p>
        </div>

        {formError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Delivery Address & Payment Options (7 cols) */}
            <div className="lg:col-span-7 space-y-6">

              {/* 1. Customer & Delivery Address Card */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-100 mb-4">
                  <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black">
                    1
                  </div>
                  <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500" /> Delivery Address & Contact
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Full Customer Name *</label>
                    <input
                      id="checkout-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Paritosh Sharma"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-orange-500 bg-gray-50 focus:bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Mobile Number (10 digits) *</label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 9876543210"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-orange-500 bg-gray-50 focus:bg-white text-gray-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 font-bold mb-1">Email Address</label>
                    <input
                      id="checkout-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. customer@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-orange-500 bg-gray-50 focus:bg-white text-gray-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 font-bold mb-1">Street Address / House No. *</label>
                    <input
                      id="checkout-address"
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="e.g. Flat 402, Sea Green Heights, Worli"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-orange-500 bg-gray-50 focus:bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">City *</label>
                    <input
                      id="checkout-city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Mumbai"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-orange-500 bg-gray-50 focus:bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">State / Province *</label>
                    <input
                      id="checkout-state"
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="e.g. Maharashtra"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-orange-500 bg-gray-50 focus:bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">PIN Code *</label>
                    <input
                      id="checkout-pincode"
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="e.g. 400018"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-orange-500 bg-gray-50 focus:bg-white text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Payment Options Card */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-100 mb-4">
                  <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black">
                    2
                  </div>
                  <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-orange-500" /> Payment Options (Mock Payment)
                  </h2>
                </div>

                <div className="space-y-3">
                  {/* Option 1: UPI */}
                  <label
                    className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'upi' ? 'border-orange-500 bg-orange-50/50' : 'border-gray-200 hover:border-orange-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value="upi"
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                          className="accent-orange-500 w-4 h-4"
                        />
                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">UPI Instant Payment</p>
                          <p className="text-xs text-gray-500">Google Pay, PhonePe, Paytm, BHIM</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">
                        Fastest
                      </span>
                    </div>

                    {paymentMethod === 'upi' && (
                      <div className="mt-4 pt-3 border-t border-orange-200/60 flex flex-col sm:flex-row gap-3">
                        <input
                          id="upi-id-input"
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="Enter your UPI ID (e.g. mobile@upi)"
                          className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white outline-none focus:border-orange-500"
                        />
                        <div className="text-[11px] text-gray-500 self-center">
                          ✓ Verified DealKart UPI Gateway
                        </div>
                      </div>
                    )}
                  </label>

                  {/* Option 2: Card */}
                  <label
                    className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'card' ? 'border-orange-500 bg-orange-50/50' : 'border-gray-200 hover:border-orange-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="accent-orange-500 w-4 h-4"
                        />
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Credit or Debit Card</p>
                          <p className="text-xs text-gray-500">Visa, Mastercard, RuPay, Amex</p>
                        </div>
                      </div>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="mt-4 pt-3 border-t border-orange-200/60 grid grid-cols-2 gap-3 text-xs">
                        <div className="col-span-2">
                          <label className="text-[11px] font-bold text-gray-600">Card Number</label>
                          <input
                            type="text"
                            value={cardData.number}
                            onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white outline-none mt-0.5"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white outline-none mt-0.5"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">CVV</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white outline-none mt-0.5"
                          />
                        </div>
                      </div>
                    )}
                  </label>

                  {/* Option 3: COD */}
                  <label
                    className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50/50' : 'border-gray-200 hover:border-orange-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="accent-orange-500 w-4 h-4"
                        />
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <Banknote className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Cash on Delivery (COD)</p>
                          <p className="text-xs text-gray-500">Pay cash or scan QR when delivery agent arrives</p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Selected Seller & Order Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-6">

              {/* Selected Sellers Box */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-gray-900 pb-3 border-b border-gray-100 flex items-center justify-between">
                  <span>Selected Sellers ({state.items.length} items)</span>
                  <span className="text-xs text-orange-600 font-semibold">Matched Offers</span>
                </h3>

                <div className="space-y-3">
                  {state.items.map((item) => (
                    <div key={`${item.productId}-${item.sellerId}`} className="flex gap-3 text-xs bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <img src={item.image} alt="" className="w-14 h-14 object-cover rounded-xl border border-gray-200 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{item.name}</p>
                        <p className="text-gray-500 flex items-center gap-1 mt-0.5">
                          <Store className="w-3 h-3 text-orange-500" /> Sold by: <strong>{item.sellerName || 'Marketplace Seller'}</strong>
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-gray-500">Qty: {item.quantity}</span>
                          <span className="font-black text-gray-900">₹{(item.finalPrice * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary Card */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
                <h3 className="font-black text-gray-900 text-base">Order Summary</h3>

                <div className="space-y-2.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Product Subtotal</span>
                    <span className="font-bold text-gray-800">₹{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Total Seller Discounts</span>
                    <span>-₹{totalDiscount.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span>{deliveryCharge === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${deliveryCharge}`}</span>
                  </div>

                  <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-baseline">
                    <span className="text-sm font-black text-gray-900">Final Payable Amount</span>
                    <span className="text-2xl font-black text-gray-900">₹{cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Place Order CTA */}
                <button
                  id="place-order-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] disabled:opacity-50 text-white font-bold rounded-2xl shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 text-base"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating Order & Confirming...
                    </span>
                  ) : (
                    <>
                      <span>Place Order</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-gray-400 text-center">
                  By placing this order, you confirm acceptance of DealKart's buyer protection and sample marketplace terms.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
