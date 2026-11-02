import { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Zap, TrendingUp, Star, Shield, Truck, RotateCcw, Headphones, Percent, Gift, Clock } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { categories, popularBrands, products as initialProducts } from '../data/products';

const heroSlides = [
  {
    id: 1,
    title: 'Compare More.',
    titleAccent: 'Save More.',
    subtitle: 'Shop from multiple sellers, compare prices, and always get the best deal on electronics.',
    cta: 'Start Comparing',
    ctaPage: 'listing',
    bgGradient: 'from-navy-950 via-navy-800 to-blue-900',
    accentColor: 'orange',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80',
    badge: '🔥 iPhone 16 from ₹79,999',
  },
  {
    id: 2,
    title: 'Best Deals on',
    titleAccent: 'Laptops & More',
    subtitle: 'MacBook Air M3, HP Pavilion, Dell XPS — compare prices from verified sellers instantly.',
    cta: 'Shop Laptops',
    ctaPage: 'listing',
    ctaParams: { category: 'laptops' },
    bgGradient: 'from-slate-900 via-blue-950 to-indigo-900',
    accentColor: 'blue',
    image: 'https://images.unsplash.com/photo-1611186871525-9d9a8af6e5c7?w=500&q=80',
    badge: '💻 MacBook Air from ₹1,14,900',
  },
  {
    id: 3,
    title: 'Premium Audio',
    titleAccent: 'At Best Prices',
    subtitle: 'Sony, boAt, JBL — find the lowest price from multiple sellers in seconds.',
    cta: 'Explore Audio',
    ctaPage: 'listing',
    ctaParams: { category: 'audio' },
    bgGradient: 'from-gray-900 via-purple-950 to-navy-900',
    accentColor: 'purple',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    badge: '🎧 Sony WH-1000XM5 from ₹26,990',
  },
];

function HeroBanner({ onNavigate }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      goNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [current]);

  const goNext = () => {
    if (!animating) {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % heroSlides.length);
        setAnimating(false);
      }, 300);
    }
  };

  const goPrev = () => {
    if (!animating) {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
        setAnimating(false);
      }, 300);
    }
  };

  const slide = heroSlides[current];

  return (
    <div className={`relative bg-gradient-to-br ${slide.bgGradient} overflow-hidden transition-all duration-700`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-blue-400 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 md:py-20 relative">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Left Content */}
          <div className={`flex-1 text-white transition-all duration-300 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium text-white mb-6">
              <span>{slide.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4">
              {slide.title}
              <br />
              <span className="text-orange-400">{slide.titleAccent}</span>
            </h1>

            <p className="text-gray-300 text-lg mb-8 max-w-lg leading-relaxed">
              {slide.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <button
                id={`hero-cta-${slide.id}`}
                onClick={() => onNavigate(slide.ctaPage, slide.ctaParams || {})}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-orange-500/30 hover:shadow-xl active:scale-95"
              >
                {slide.cta} <ArrowRight className="w-5 h-5" />
              </button>
              <button
                id={`hero-compare-${slide.id}`}
                onClick={() => onNavigate('compare')}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-200"
              >
                Compare Products
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-8">
              {[
                { value: '10L+', label: 'Happy Customers' },
                { value: '500+', label: 'Verified Sellers' },
                { value: '50K+', label: 'Products' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-black text-orange-400">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className={`flex-1 flex justify-center transition-all duration-300 ${animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-blue-500/20 rounded-3xl blur-2xl scale-110"></div>
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 float-animation">
                <img
                  src={slide.image}
                  alt="Featured Product"
                  className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl shadow-2xl"
                />
                {/* Price tag */}
                <div className="absolute -top-4 -right-4 bg-orange-500 text-white rounded-2xl p-3 shadow-xl">
                  <p className="text-xs font-medium">Starting from</p>
                  <p className="text-lg font-black">Best Price</p>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Verified</p>
                      <p className="text-sm font-bold text-gray-800">Sellers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <button
        id="hero-prev-btn"
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm border border-white/20"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        id="hero-next-btn"
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm border border-white/20"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-2 bg-orange-400' : 'w-2 h-2 bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
}

function CategorySection({ onNavigate }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="section-title">Shop by Category</h2>
          <p className="text-gray-500 text-sm mt-1">Explore our wide range of electronics</p>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`home-cat-${cat.id}`}
            onClick={() => onNavigate('listing', { category: cat.id })}
            className="group flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-100 transition-all duration-300"
          >
            <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-orange-600 transition-colors">{cat.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function OfferStrip() {
  const offers = [
    { icon: Percent, text: 'Up to 50% OFF', sub: 'on top brands', color: 'text-orange-500' },
    { icon: Truck, text: 'Free Delivery', sub: 'on orders ₹499+', color: 'text-blue-600' },
    { icon: Gift, text: 'Exchange Offers', sub: 'old for new', color: 'text-purple-600' },
    { icon: Clock, text: 'Flash Deals', sub: 'every 6 hours', color: 'text-red-500' },
  ];

  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-3">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {offers.map(({ icon: Icon, text, sub, color }) => (
            <div key={text} className="flex items-center justify-center gap-2 text-white">
              <Icon className="w-5 h-5 opacity-80" />
              <div>
                <p className="text-sm font-bold">{text}</p>
                <p className="text-xs opacity-80">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturedDealsSection({ onNavigate }) {
  const { state } = useCart();
  const allProducts = state.products || initialProducts;
  const featuredDeals = allProducts.filter(p => p.isFeatured).slice(0, 8);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-orange-500" />
            <span className="text-orange-500 text-sm font-semibold uppercase tracking-wide">Hot Deals</span>
          </div>
          <h2 className="section-title">Featured Deals</h2>
          <p className="text-gray-500 text-sm mt-1">Handpicked offers from verified sellers</p>
        </div>
        <button
          id="featured-see-all-btn"
          onClick={() => onNavigate('listing')}
          className="hidden md:flex items-center gap-1 text-orange-500 font-semibold hover:gap-2 transition-all duration-200"
        >
          See All <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {featuredDeals.map((product) => (
          <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
        ))}
      </div>

      <div className="mt-6 text-center md:hidden">
        <button
          onClick={() => onNavigate('listing')}
          className="btn-outline"
        >
          See All Deals <ArrowRight className="w-4 h-4 inline-block ml-1" />
        </button>
      </div>
    </section>
  );
}

function TrendingSection({ onNavigate }) {
  const { state } = useCart();
  const allProducts = state.products || initialProducts;
  const trendingProducts = allProducts.filter(p => p.isTrending).slice(0, 8);

  return (
    <section className="bg-gradient-to-br from-navy-950 to-navy-800 py-14">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              <span className="text-orange-400 text-sm font-semibold uppercase tracking-wide">Trending Now</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Top Picks This Week</h2>
            <p className="text-gray-400 text-sm mt-1">Most compared and bought by customers</p>
          </div>
          <button
            id="trending-see-all-btn"
            onClick={() => onNavigate('listing')}
            className="hidden md:flex items-center gap-1 text-orange-400 font-semibold hover:gap-2 transition-all duration-200"
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PopularBrandsSection({ onNavigate }) {
  const brandData = [
    { name: 'Apple', emoji: '🍎', bg: 'bg-gray-900', count: 4, description: 'iPhone, MacBook & More' },
    { name: 'Samsung', emoji: '🔷', bg: 'bg-blue-900', count: 3, description: 'Galaxy Series' },
    { name: 'Sony', emoji: '🎵', bg: 'bg-slate-800', count: 2, description: 'Audio & Electronics' },
    { name: 'OnePlus', emoji: '⚡', bg: 'bg-red-800', count: 1, description: 'Flagship Phones' },
    { name: 'boAt', emoji: '⛵', bg: 'bg-indigo-800', count: 3, description: 'Audio Products' },
    { name: 'HP', emoji: '💻', bg: 'bg-blue-800', count: 1, description: 'Laptops & PCs' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      <div className="text-center mb-10">
        <h2 className="section-title">Popular Brands</h2>
        <p className="text-gray-500 text-sm mt-2">Shop from world's leading technology brands</p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {brandData.map((brand) => (
          <button
            key={brand.name}
            id={`brand-${brand.name.toLowerCase()}`}
            onClick={() => onNavigate('listing', { brand: brand.name })}
            className={`group ${brand.bg} rounded-2xl p-5 flex flex-col items-center gap-3 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
          >
            <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{brand.emoji}</span>
            <div className="text-center">
              <p className="text-white font-bold text-sm">{brand.name}</p>
              <p className="text-gray-400 text-xs mt-0.5">{brand.description}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function WhyDealKart() {
  const features = [
    {
      icon: '🔍',
      title: 'Compare Instantly',
      description: 'See prices from 500+ verified sellers side by side in real-time.',
    },
    {
      icon: '💰',
      title: 'Always Best Price',
      description: 'Our algorithm ensures you always find the lowest available price.',
    },
    {
      icon: '✅',
      title: 'Verified Sellers Only',
      description: 'Every seller on DealKart is thoroughly vetted for quality and reliability.',
    },
    {
      icon: '🚀',
      title: 'Fast & Free Delivery',
      description: 'Get your products delivered quickly with multiple shipping options.',
    },
  ];

  return (
    <section className="bg-orange-50 py-14">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="section-title">Why Choose DealKart?</h2>
          <p className="text-gray-500 text-sm mt-2">The smarter way to shop electronics online</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 text-center">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage({ onNavigate }) {
  return (
    <div>
      <HeroBanner onNavigate={onNavigate} />
      <OfferStrip />
      <CategorySection onNavigate={onNavigate} />
      <FeaturedDealsSection onNavigate={onNavigate} />
      <TrendingSection onNavigate={onNavigate} />
      <PopularBrandsSection onNavigate={onNavigate} />
      <WhyDealKart />
    </div>
  );
}
