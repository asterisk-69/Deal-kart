import { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function LoginPage({ onNavigate }) {
  const { dispatch } = useCart();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
      if (isRegister && !formData.name) {
        setError('Please enter your name');
        setLoading(false);
        return;
      }
      dispatch({
        type: 'SET_USER',
        payload: {
          name: isRegister ? formData.name : 'Rahul Sharma',
          email: formData.email,
          phone: formData.phone || '+91 98765 43210',
        }
      });
      setLoading(false);
      onNavigate('home');
    }, 1000);
  };

  const handleGuestLogin = () => {
    dispatch({
      type: 'SET_USER',
      payload: { name: 'Guest User', email: 'guest@dealkart.in', phone: '' }
    });
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-800 to-blue-900 flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 mb-2"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white font-black text-2xl">D</span>
            </div>
            <span className="text-3xl font-black">
              <span className="text-white">Deal</span>
              <span className="text-orange-400">Kart</span>
            </span>
          </button>
          <p className="text-gray-400 text-sm">Compare More. Save More.</p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            <button
              id="signin-tab"
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${!isRegister ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Sign In
            </button>
            <button
              id="register-tab"
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${isRegister ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Register
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {isRegister ? 'Create Account' : 'Welcome Back!'}
          </h2>

          <form id="auth-form" onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input
                  id="name-input"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Rahul Sharma"
                  className="input-field"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                id="email-input"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="rahul@example.com"
                className="input-field"
              />
            </div>

            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <input
                  id="phone-input"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="input-field"
                />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                {!isRegister && (
                  <button type="button" className="text-xs text-orange-500 hover:underline">Forgot password?</button>
                )}
              </div>
              <div className="relative">
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isRegister ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <button
            id="guest-login-btn"
            onClick={handleGuestLogin}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-orange-400 hover:text-orange-600 transition-all"
          >
            <Zap className="w-4 h-4" />
            Continue as Guest
          </button>

          <p className="text-center text-xs text-gray-400 mt-5">
            By continuing, you agree to DealKart's{' '}
            <button className="text-orange-500 hover:underline">Terms</button> &{' '}
            <button className="text-orange-500 hover:underline">Privacy Policy</button>
          </p>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="mt-4 w-full text-center text-gray-400 hover:text-white text-sm transition-colors"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
