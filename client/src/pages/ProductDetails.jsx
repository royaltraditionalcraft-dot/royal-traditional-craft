import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiArrowLeft, FiShoppingCart } from 'react-icons/fi';
import api from '../utils/api';

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${slug}`);
        setProduct(data);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <div className="p-20 text-center font-heading text-xl">Loading product details...</div>;
  if (error || !product) return <div className="p-20 text-center font-heading text-xl text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 font-body">
      <Link to="/products" className="inline-flex items-center text-text-muted hover:text-primary-dark transition mb-8">
        <FiArrowLeft className="mr-2" /> Back to Products
      </Link>
      
      <div className="flex flex-col md:flex-row gap-12">
        {/* Product Image & Gallery */}
        <div className="w-full md:w-1/2 space-y-4">
          <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-sm aspect-square flex items-center justify-center relative group">
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              />
            ) : (
              <div className="text-text-muted">No Image Available</div>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 bg-gray-50 transition ${
                    activeImage === index ? 'border-accent-gold shadow-md' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumb ${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <p className="text-accent-gold text-sm font-bold tracking-widest uppercase mb-2">{product.category}</p>
          <h1 className="text-4xl font-heading text-primary-dark mb-4">{product.name}</h1>
          <p className="text-2xl font-body text-text-dark font-medium mb-6">₹{product.price.toLocaleString()}</p>
          
          <div className="prose prose-sm text-text-muted mb-8 whitespace-pre-wrap">
            <p>{product.description || 'No description available for this product.'}</p>
          </div>

          <button 
            onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.images?.[0] })}
            className="w-full bg-primary-dark text-white px-8 py-4 rounded-xl hover:bg-secondary-brown transition shadow-md flex items-center justify-center gap-3 font-medium text-lg"
          >
            <FiShoppingCart /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
