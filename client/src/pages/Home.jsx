import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/products');
        // Just take the first 3 products for the featured section
        setFeaturedProducts(data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch featured products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-cream">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center overflow-hidden">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading text-primary-dark mb-6 tracking-tight break-words px-2">RoyalTraditionalCraft</h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Discover premium luxury handcrafted solid wood furniture. Designed with elegance, built for a lifetime.
          </p>
          <div className="mt-10">
            <Link to="/products" className="bg-primary-dark text-cream px-8 py-3 rounded-full hover:bg-secondary-brown transition shadow-md inline-block font-medium">
              Explore Collection
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Collection */}
      <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading text-primary-dark mb-4">Featured Collection</h2>
          <div className="w-24 h-1 bg-accent-gold mx-auto"></div>
        </div>
        
        {loading ? (
          <div className="text-center py-10 text-text-muted">Loading featured items...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link to="/products" className="text-accent-gold font-medium hover:text-primary-dark transition border-b-2 border-accent-gold pb-1">
            View All Furniture &rarr;
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
