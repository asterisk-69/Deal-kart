import { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Search, Star, Grid3x3, List, ArrowUpDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { products as initialProducts, categories, brands } from '../data/products';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'discount', label: 'Biggest Discount' },
  { value: 'reviews', label: 'Most Reviewed' },
];

function PriceRangeSlider({ min, max, value, onChange }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm text-gray-600">
        <span>₹{value[0].toLocaleString()}</span>
        <span>₹{value[1].toLocaleString()}</span>
      </div>
      <div className="relative h-2 bg-gray-200 rounded-full">
        <div
          className="absolute h-2 bg-orange-500 rounded-full"
          style={{
            left: `${((value[0] - min) / (max - min)) * 100}%`,
            right: `${100 - ((value[1] - min) / (max - min)) * 100}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={(e) => onChange([Number(e.target.value), value[1]])}
          className="absolute w-full h-2 opacity-0 cursor-pointer"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={(e) => onChange([value[0], Number(e.target.value)])}
          className="absolute w-full h-2 opacity-0 cursor-pointer"
        />
      </div>
      <div className="flex gap-2">
        <input
          type="number"
          value={value[0]}
          onChange={(e) => onChange([Number(e.target.value), value[1]])}
          className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center outline-none focus:border-orange-400"
          placeholder="Min"
        />
        <span className="text-gray-400 self-center">—</span>
        <input
          type="number"
          value={value[1]}
          onChange={(e) => onChange([value[0], Number(e.target.value)])}
          className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center outline-none focus:border-orange-400"
          placeholder="Max"
        />
      </div>
    </div>
  );
}

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <span className="font-semibold text-gray-800 text-sm">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>
      {open && children}
    </div>
  );
}

export default function ListingPage({ onNavigate, params = {} }) {
  const { state } = useCart();
  const products = state.products || initialProducts;
  const [selectedCategory, setSelectedCategory] = useState(params.category || 'all');
  const [selectedBrands, setSelectedBrands] = useState(params.brand ? [params.brand] : []);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');
  const [searchQuery, setSearchQuery] = useState(params.search || '');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);

  useEffect(() => {
    if (params.category) setSelectedCategory(params.category);
    if (params.brand) setSelectedBrands([params.brand]);
    if (params.search) setSearchQuery(params.search);
  }, [params.category, params.brand, params.search]);

  const uniqueBrands = [...new Set(products.map(p => p.brand))].sort();
  const categoryProducts = selectedCategory === 'all' ? products : products.filter(p => p.category === selectedCategory);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.storageVariant || '').toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.sellers.some(s => s.sellerName.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    }

    filtered = filtered.filter(p => p.lowestPrice >= priceRange[0] && p.lowestPrice <= priceRange[1]);

    if (minRating > 0) {
      filtered = filtered.filter(p => p.rating >= minRating);
    }

    if (onlyDiscounted) {
      filtered = filtered.filter(p => p.discount >= 10);
    }

    switch (sortBy) {
      case 'price_low': filtered.sort((a, b) => a.lowestPrice - b.lowestPrice); break;
      case 'price_high': filtered.sort((a, b) => b.lowestPrice - a.lowestPrice); break;
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
      case 'discount': filtered.sort((a, b) => b.discount - a.discount); break;
      case 'reviews': filtered.sort((a, b) => b.totalReviews - a.totalReviews); break;
      default: break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedBrands, priceRange, minRating, sortBy, onlyDiscounted]);

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedBrands([]);
    setPriceRange([0, 200000]);
    setMinRating(0);
    setSortBy('relevance');
    setSearchQuery('');
    setOnlyDiscounted(false);
  };

  const activeFilterCount = [
    selectedCategory !== 'all',
    selectedBrands.length > 0,
    priceRange[0] > 0 || priceRange[1] < 200000,
    minRating > 0,
    onlyDiscounted,
  ].filter(Boolean).length;

  const SidebarFilters = () => (
    <aside className="w-72 flex-shrink-0">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-gray-800">Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button
              id="clear-filters-btn"
              onClick={clearAllFilters}
              className="text-xs text-red-500 font-medium hover:underline"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Category Filter */}
        <FilterSection title="Category">
          <div className="space-y-1">
            <button
              id="filter-cat-all"
              onClick={() => setSelectedCategory('all')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedCategory === 'all' ? 'bg-orange-50 text-orange-600 font-semibold' : 'hover:bg-gray-50 text-gray-700'}`}
            >
              All Products ({products.length})
            </button>
            {categories.map((cat) => {
              const count = products.filter(p => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  id={`filter-cat-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${selectedCategory === cat.id ? 'bg-orange-50 text-orange-600 font-semibold' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  <span>{cat.icon} {cat.name}</span>
                  <span className="text-xs text-gray-400">{count}</span>
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Brand Filter */}
        <FilterSection title="Brand">
          <div className="space-y-1">
            {uniqueBrands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 py-1.5 cursor-pointer group">
                <input
                  type="checkbox"
                  id={`filter-brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-400"
                />
                <span className={`text-sm transition-colors ${selectedBrands.includes(brand) ? 'text-orange-600 font-medium' : 'text-gray-700 group-hover:text-orange-600'}`}>
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range">
          <PriceRangeSlider
            min={0}
            max={200000}
            value={priceRange}
            onChange={setPriceRange}
          />
        </FilterSection>

        {/* Rating Filter */}
        <FilterSection title="Minimum Rating">
          <div className="space-y-1">
            {[4.5, 4, 3.5, 3].map((rating) => (
              <button
                key={rating}
                id={`filter-rating-${rating}`}
                onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${minRating === rating ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-50 text-gray-700'}`}
              >
                <div className="flex text-yellow-400 text-sm">{'★'.repeat(Math.floor(rating))}</div>
                <span>{rating}+ stars</span>
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Other Filters */}
        <FilterSection title="Offers & Discounts" defaultOpen={false}>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              id="filter-discounted"
              checked={onlyDiscounted}
              onChange={(e) => setOnlyDiscounted(e.target.checked)}
              className="w-4 h-4 text-orange-500 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">10%+ Discount Only</span>
          </label>
        </FilterSection>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-3">
            <button onClick={() => onNavigate('home')} className="hover:text-orange-500">Home</button>
            <span className="mx-2">›</span>
            <span className="text-gray-800 font-medium capitalize">
              {params.search ? `Search: "${params.search}"` : selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name}
            </span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 capitalize">
                {params.search ? `Results for "${params.search}"` : selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">{filteredProducts.length} products found</p>
            </div>

            {/* Search within listing */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="listing-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 w-48 bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Sort & View Controls */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Sort:</span>
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  id={`sort-${opt.value}`}
                  onClick={() => setSortBy(opt.value)}
                  className={`filter-chip whitespace-nowrap ${sortBy === opt.value ? 'filter-chip-active' : 'filter-chip-inactive'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <button
                id="grid-view-btn"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                id="list-view-btn"
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                id="mobile-filter-btn"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:border-orange-400 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedBrands.length > 0 || selectedCategory !== 'all') && (
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-2">
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
              {categories.find(c => c.id === selectedCategory)?.name}
              <button onClick={() => setSelectedCategory('all')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedBrands.map(brand => (
            <span key={brand} className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
              {brand}
              <button onClick={() => toggleBrand(brand)}><X className="w-3 h-3" /></button>
            </span>
          ))}
          {activeFilterCount > 1 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-500 font-medium hover:underline px-2"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <SidebarFilters />
          </div>

          {/* Mobile Filters Overlay */}
          {showFilters && (
            <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
              <div
                className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto p-5 slide-in-right"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-800">Filters</h2>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <SidebarFilters />
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  🔍
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {searchQuery ? `No products found for "${searchQuery}"` : 'No matching products found'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-6 max-w-md mx-auto">
                  {searchQuery
                    ? 'Check your spelling or try searching for popular terms like "iPhone", "Samsung", "OnePlus", "Sony", "boAt", or "MacBook".'
                    : 'Try clearing your category, brand or price filters to view all available marketplace deals.'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                  {['iPhone', 'Samsung', 'Sony', 'OnePlus', 'boAt', 'Apple'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-orange-50 hover:text-orange-600 text-xs font-semibold text-gray-700 transition-colors"
                    >
                      Search "{term}"
                    </button>
                  ))}
                </div>
                <button onClick={clearAllFilters} className="btn-primary">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
                : 'flex flex-col gap-4'
              }>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onNavigate={onNavigate}
                    compact={viewMode === 'list'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
