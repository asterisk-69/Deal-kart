import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Shield, Truck, RotateCcw, Headphones } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const footerLinks = {
    'About DealKart': ['About Us', 'Careers', 'Press', 'Blog', 'Investor Relations'],
    'Help & Support': ['Help Center', 'How to Order', 'Track Your Order', 'Returns & Refunds', 'FAQs'],
    'Policies': ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Seller Policy', 'Accessibility'],
    'Connect': ['Partner with Us', 'Sell on DealKart', 'Advertise', 'Affiliate Program'],
  };

  const features = [
    { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹499' },
    { icon: RotateCcw, title: 'Easy Returns', desc: '10-day return policy' },
    { icon: Shield, title: 'Secure Payments', desc: '100% safe & encrypted' },
    { icon: Headphones, title: '24/7 Support', desc: 'Dedicated customer care' },
  ];

  return (
    <footer className="bg-navy-950 text-gray-300 mt-20">
      {/* Features Bar */}
      <div className="border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{title}</p>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-lg">D</span>
              </div>
              <span className="text-2xl font-black">
                <span className="text-white">Deal</span>
                <span className="text-orange-500">Kart</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              India's fastest-growing multi-seller marketplace. Compare prices, discover deals, and shop smarter from thousands of verified sellers.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-orange-400" />
                <span>1800-123-4567 (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-orange-400" />
                <span>support@dealkart.in</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { Icon: Facebook, label: 'Facebook' },
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Youtube, label: 'YouTube' },
              ].map(({ Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 bg-navy-800 hover:bg-orange-500 rounded-xl flex items-center justify-center transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-semibold text-sm mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link}>
                    <button
                      onClick={() => {
                        if (link === 'Track Your Order') onNavigate('orders');
                        else if (link === 'Sell on DealKart' || link === 'Partner with Us') onNavigate('seller');
                        else if (link === 'Investor Relations') onNavigate('admin');
                        else if (link === 'How to Order' || link === 'Help Center') onNavigate('listing');
                        else onNavigate('home');
                      }}
                      className="text-gray-400 hover:text-orange-400 text-sm transition-colors duration-200"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-10 pt-8 border-t border-navy-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-semibold text-lg">Stay Updated with the Best Deals</h3>
              <p className="text-gray-400 text-sm mt-1">Subscribe to our newsletter and never miss a deal</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 bg-navy-800 border border-navy-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
              <button id="newsletter-btn" className="btn-primary whitespace-nowrap text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-navy-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 DealKart Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/100px-Visa_Inc._logo.svg.png" alt="Visa" className="h-5 opacity-50 hover:opacity-80 transition-opacity" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/100px-Mastercard-logo.svg.png" alt="Mastercard" className="h-5 opacity-50 hover:opacity-80 transition-opacity" />
            <div className="text-xs text-gray-500 bg-navy-800 px-2 py-1 rounded">UPI</div>
            <div className="text-xs text-gray-500 bg-navy-800 px-2 py-1 rounded">EMI</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
