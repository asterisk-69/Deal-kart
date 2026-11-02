import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Shield, Truck, ChevronRight, Store, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage({ onNavigate }) {
  const { state, dispatch, subtotal, totalDiscount, deliveryCharge, cartTotal } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-md w-full">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-orange-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Your DealKart cart is empty</h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Search products, compare seller offers, and add the best deals directly to your cart!
          </p>
          <div className="space-y-3">
            <button
              id="cart-shop-now-btn"
              onClick={() => onNavigate('listing')}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3.5"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="view-orders-from-empty-cart"
              onClick={() => onNavigate('orders')}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-2xl transition-all"
            >
              View My Past Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="text-sm text-gray-500 flex items-center gap-2">
            <button onClick={() => onNavigate('home')} className="hover:text-orange-500">Home</button>
            <span>›</span>
            <span className="text-gray-800 font-medium">Shopping Cart ({state.items.length} items)</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h1 className="text-2xl font-black text-gray-900">Shopping Cart</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Products matched with your preferred marketplace sellers
                </p>
              </div>
              <button
                id="clear-cart-btn"
                onClick={() => dispatch({ type: 'CLEAR_CART' })}
                className="text-red-500 text-xs font-bold hover:underline flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-xl transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Cart
              </button>
            </div>

            {state.items.map((item) => {
              const itemFinalUnit = item.finalPrice || (item.price - (item.discount || 0) + (item.deliveryCharge || 0));
              const itemTotal = itemFinalUnit * item.quantity;

              return (
                <div
                  key={`${item.productId}-${item.sellerId}`}
                  className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow relative"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <button
                      onClick={() => onNavigate('product', { productId: item.productId })}
                      className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 group"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </button>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                          <button
                            onClick={() => onNavigate('product', { productId: item.productId })}
                            className="text-left font-bold text-gray-900 text-sm hover:text-orange-600 transition-colors line-clamp-2"
                          >
                            {item.name}
                          </button>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-navy-800 bg-navy-50 px-2 py-0.5 rounded-md">
                              <Store className="w-3 h-3 text-orange-500" />
                              Seller: {item.sellerName || 'Marketplace Seller'}
                            </span>
                            {item.deliveryTime && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Truck className="w-3 h-3 text-emerald-600" /> {item.deliveryTime}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price Breakdown for this item */}
                        <div className="text-left sm:text-right">
                          <p className="text-lg font-black text-gray-900">
                            ₹{itemTotal.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-400">
                            (₹{itemFinalUnit.toLocaleString()} × {item.quantity})
                          </p>
                        </div>
                      </div>

                      {/* Item level discounts & charges */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-50">
                        <span>Original: ₹{item.price.toLocaleString()}</span>
                        {item.discount > 0 && (
                          <span className="text-emerald-600 font-semibold">
                            Discount: -₹{(item.discount * item.quantity).toLocaleString()}
                          </span>
                        )}
                        <span>
                          Shipping: {item.deliveryCharge === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${item.deliveryCharge * item.quantity}`}
                        </span>
                      </div>

                      {/* Controls: Quantity & Remove */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                          <button
                            id={`cart-minus-${item.productId}`}
                            onClick={() => dispatch({
                              type: 'UPDATE_QUANTITY',
                              payload: { productId: item.productId, sellerId: item.sellerId, quantity: item.quantity - 1 }
                            })}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-9 text-center text-xs font-black text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            id={`cart-plus-${item.productId}`}
                            onClick={() => dispatch({
                              type: 'UPDATE_QUANTITY',
                              payload: { productId: item.productId, sellerId: item.sellerId, quantity: item.quantity + 1 }
                            })}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          id={`cart-remove-${item.productId}`}
                          onClick={() => dispatch({
                            type: 'REMOVE_FROM_CART',
                            payload: { productId: item.productId, sellerId: item.sellerId }
                          })}
                          className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 font-semibold transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary & Proceed to Checkout */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm sticky top-24 space-y-5">
              <h3 className="font-black text-gray-900 text-lg">Order Summary</h3>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Product Subtotal</span>
                  <span className="font-semibold text-gray-800">₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Seller Discounts</span>
                  <span>-₹{totalDiscount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${deliveryCharge.toLocaleString()}`
                    )}
                  </span>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-baseline">
                  <div>
                    <span className="text-base font-black text-gray-900">Total Payable</span>
                    <p className="text-[11px] text-gray-400">Inclusive of all taxes & shipping</p>
                  </div>
                  <span className="text-2xl font-black text-gray-900">₹{cartTotal.toLocaleString()}</span>
                </div>

                {totalDiscount > 0 && (
                  <div className="bg-emerald-50 text-emerald-800 text-xs font-bold p-3 rounded-xl flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    You are saving ₹{totalDiscount.toLocaleString()} with DealKart seller offers!
                  </div>
                )}
              </div>

              {/* Checkout Action Button */}
              <button
                id="checkout-btn"
                onClick={() => onNavigate('checkout')}
                className="w-full btn-primary py-4 text-base font-bold flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 active:scale-[0.98] transition-all"
              >
                Proceed to Checkout <ChevronRight className="w-5 h-5" />
              </button>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
                <div className="flex flex-col items-center">
                  <Shield className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="text-[11px] text-gray-500 font-semibold">100% Safe</span>
                </div>
                <div className="flex flex-col items-center">
                  <Truck className="w-4 h-4 text-blue-600 mb-1" />
                  <span className="text-[11px] text-gray-500 font-semibold">Fast Dispatch</span>
                </div>
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-4 h-4 text-purple-600 mb-1" />
                  <span className="text-[11px] text-gray-500 font-semibold">Easy Return</span>
                </div>
              </div>

              {/* Continue Shopping Link */}
              <button
                onClick={() => onNavigate('listing')}
                className="w-full text-center text-xs text-gray-500 hover:text-orange-500 font-bold transition-colors pt-1"
              >
                ← Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
