import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FaStar, FaRegStar } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= roundedRating ? (
          <FaStar key={i} className="text-yellow-500" />
        ) : (
          <FaRegStar key={i} className="text-gray-300" />
        )
      );
    }
    return stars;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col border border-transparent hover:border-accent-gold/20 animate-fade-in"
    >
      <Link to={`/products/${product.slug || product.id}`} className="block h-72 overflow-hidden relative">
        <img 
          src={product.images ? product.images[0] : product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-accent-gold rounded-full uppercase tracking-wider">
          {product.category}
        </div>
        {product.original_price && (
          <div className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white rounded-full">
            Sale
          </div>
        )}
      </Link>
      
      <div className="p-6 flex flex-col flex-grow bg-white z-10 relative">
        <Link to={`/products/${product.slug || product.id}`}>
          <h3 className="text-xl font-heading text-primary-dark mb-1 group-hover:text-secondary-brown transition-colors line-clamp-1">{product.name}</h3>
        </Link>

        {/* Stars rating below name */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-yellow-500 text-sm">
            {renderStars(product.rating)}
          </div>
          {product.review_count > 0 && (
            <span className="text-xs text-text-muted">({product.review_count})</span>
          )}
        </div>
        
        <p className="text-sm text-text-muted mb-4 line-clamp-2">{product.description || 'Premium handcrafted solid wood furniture.'}</p>
        
        <div className="flex items-center space-x-3 mb-6 mt-auto">
          <span className="text-2xl font-bold text-primary-dark">₹{product.price?.toLocaleString()}</span>
          {product.original_price && (
            <span className="text-sm text-text-muted line-through">₹{product.original_price?.toLocaleString()}</span>
          )}
        </div>
        
        <button 
          onClick={() => addToCart(product)}
          className="w-full py-3 bg-cream text-primary-dark hover:bg-primary-dark hover:text-cream transition-all duration-300 rounded-lg font-medium border border-primary-dark/20 hover:border-primary-dark flex justify-center items-center space-x-2"
        >
          <span>Add to Cart</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
