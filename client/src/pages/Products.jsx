import { useState, useEffect } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { FiSearch, FiSliders, FiRefreshCw } from 'react-icons/fi';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleReset = () => {
    setSearch('');
    setCategory('All');
    setMinPrice('');
    setMaxPrice('');
  };

  // Get unique categories
  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];

  // Dynamic Filtering
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCategory = category === 'All' || product.category === category;
    
    const matchesMinPrice = minPrice === '' || product.price >= parseFloat(minPrice);
    const matchesMaxPrice = maxPrice === '' || product.price <= parseFloat(maxPrice);

    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-body">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-heading text-primary-dark mb-4">Our Exquisite Collection</h1>
        <p className="text-text-muted max-w-2xl mx-auto">Explore our premium range of handcrafted solid wood furniture, curated specially for modern Indian homes.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <h3 className="font-heading font-bold text-primary-dark flex items-center gap-2">
              <FiSliders /> Filters
            </h3>
            <button 
              onClick={handleReset}
              className="text-xs text-accent-gold hover:text-primary-dark transition flex items-center gap-1 font-medium"
            >
              <FiRefreshCw /> Reset All
            </button>
          </div>

          <div className="space-y-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-primary-dark mb-2">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-accent-gold outline-none transition"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-semibold text-primary-dark mb-2">Price Range (₹)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-accent-gold outline-none transition"
                />
                <span className="text-gray-400 text-xs">to</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-accent-gold outline-none transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Products Area */}
        <div className="flex-grow">
          {/* Search Bar */}
          <div className="relative mb-8 bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <FiSearch size={18} />
            </span>
            <input 
              type="text" 
              placeholder="Search premium furniture (e.g. Bed, Luxury Sofa...)" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-text-dark placeholder-gray-400 text-base"
            />
          </div>

          {/* Results Summary */}
          <div className="mb-6 flex justify-between items-center text-sm text-text-muted">
            <p>Showing {filteredProducts.length} of {products.length} products</p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-lg text-text-muted mb-2 font-heading font-medium">No matches found</p>
              <p className="text-sm text-gray-400">Try adjusting your keywords or price filters.</p>
              <button 
                onClick={handleReset}
                className="mt-4 bg-primary-dark text-white px-6 py-2 rounded-full hover:bg-secondary-brown transition text-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
