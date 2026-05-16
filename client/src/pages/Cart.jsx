import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <h2 className="text-3xl font-heading text-primary-dark mb-4">Your Cart is Empty</h2>
        <p className="text-text-muted mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="px-8 py-3 bg-primary-dark text-white rounded hover:bg-secondary-brown transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[70vh]">
      <h1 className="text-4xl font-heading text-primary-dark mb-10">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <ul className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <motion.li layout key={item.product_id} className="p-6 flex flex-col sm:flex-row gap-6 items-center">
                  <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-50">
                    <img 
                      src={item.product.images ? item.product.images[0] : item.product.image} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow flex flex-col sm:flex-row justify-between w-full">
                    <div className="mb-4 sm:mb-0">
                      <Link to={`/products/${item.product.slug || item.product.id}`} className="text-lg font-heading font-medium text-primary-dark hover:text-secondary-brown transition">
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-text-muted mt-1">{item.product.category}</p>
                      <p className="font-bold text-primary-dark mt-2">₹{item.product.price?.toLocaleString()}</p>
                    </div>
                    
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-4">
                      <div className="flex items-center border border-gray-200 rounded-md">
                        <button 
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="p-2 text-text-muted hover:text-primary-dark transition"
                        >
                          <FiMinus />
                        </button>
                        <span className="w-10 text-center font-medium text-primary-dark">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="p-2 text-text-muted hover:text-primary-dark transition"
                        >
                          <FiPlus />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-red-500 hover:text-red-700 transition flex items-center gap-1 text-sm font-medium"
                      >
                        <FiTrash2 /> <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="text-xl font-heading text-primary-dark mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-text-muted">
                <span>Subtotal</span>
                <span className="font-medium text-primary-dark">₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="text-base font-bold text-primary-dark">Total</span>
                <span className="text-2xl font-bold text-primary-dark">₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-primary-dark text-white rounded hover:bg-secondary-brown transition flex justify-center items-center gap-2 font-medium"
            >
              Proceed to Checkout <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
