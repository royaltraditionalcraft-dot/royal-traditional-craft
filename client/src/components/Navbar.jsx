import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const { user } = useAuth();
  const { cartCount } = useCart();
  
  return (
    <nav className="sticky top-0 z-50 w-full bg-cream border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-heading font-bold text-primary-dark">
            WoodCraft
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-text-muted hover:text-primary-dark transition font-medium">Home</Link>
            <Link to="/products" className="text-text-muted hover:text-primary-dark transition font-medium">Shop</Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/cart" className="text-primary-dark hover:text-secondary-brown transition relative flex items-center">
              <FiShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-gold text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <Link to="/account" className="text-primary-dark hover:text-secondary-brown transition">
                <FiUser className="w-6 h-6" />
              </Link>
            ) : (
              <Link to="/login" className="text-sm font-medium bg-primary-dark text-white px-5 py-2.5 rounded-md hover:bg-secondary-brown transition shadow-sm">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
