import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { user } = useAuth();
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="sticky top-0 z-50 w-full bg-cream border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img src="/logo.jpg" alt="RoyalTraditionalCraft Logo" className="h-10 w-10 rounded-lg object-cover border border-accent-gold/20 shadow-sm" />
            <span className="text-base sm:text-xl font-heading font-bold text-primary-dark tracking-wide hidden sm:inline">
              RoyalTraditionalCraft
            </span>
            <span className="text-base font-heading font-bold text-primary-dark tracking-wide sm:hidden">
              Royal Craft
            </span>
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-text-muted hover:text-primary-dark transition font-medium">Home</Link>
            <Link to="/products" className="text-text-muted hover:text-primary-dark transition font-medium">Shop</Link>
          </div>
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link to="/cart" className="text-primary-dark hover:text-secondary-brown transition relative flex items-center p-2">
              <FiShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-gold text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <Link to="/account" className="text-primary-dark hover:text-secondary-brown transition p-2">
                <FiUser className="w-6 h-6" />
              </Link>
            ) : (
              <Link to="/login" className="text-sm font-medium bg-primary-dark text-white px-4 py-2 rounded-md hover:bg-secondary-brown transition shadow-sm">
                Login
              </Link>
            )}
            
            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="md:hidden text-primary-dark hover:bg-gray-100 p-2 rounded-lg transition"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Drawer Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-cream border-t border-gray-200 px-6 py-4 space-y-4 shadow-inner">
          <Link to="/" onClick={() => setIsOpen(false)} className="block text-text-muted hover:text-primary-dark transition font-medium text-lg py-1">Home</Link>
          <Link to="/products" onClick={() => setIsOpen(false)} className="block text-text-muted hover:text-primary-dark transition font-medium text-lg py-1">Shop</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
