import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: user?.user_metadata?.full_name || '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
    
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, [cartItems, navigate]);

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const initPayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create order on backend
      const items = cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price
      }));

      const { data: orderResponse } = await api.post('/orders', {
        user_id: user?.id,
        items,
        total_amount: cartTotal,
        subtotal: cartTotal,
        shipping_address: address
      });

      // 2. Initialize Razorpay Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: "WoodCraft India",
        description: "Premium Furniture Purchase",
        order_id: orderResponse.razorpayOrderId,
        handler: async function (response) {
          try {
            // 3. Verify payment on backend
            const { data: verifyData } = await api.post('/orders/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: orderResponse.order.id
            });
            
            if (verifyData.message === "Payment verified successfully") {
              clearCart();
              // Navigate to success page
              alert("Payment Successful! Order Confirmed.");
              navigate('/account');
            }
          } catch (error) {
            console.error("Payment verification failed", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: address.fullName,
          email: user?.email || "",
          contact: address.phone
        },
        theme: {
          color: "#3D2B1F"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        alert("Payment Failed. Reason: " + response.error.description);
      });
      rzp1.open();

    } catch (error) {
      console.error("Order creation failed", error);
      alert("Something went wrong while creating the order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-cream min-h-screen">
      <h1 className="text-3xl font-heading text-primary-dark mb-8 text-center">Secure Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3">
          <form onSubmit={initPayment} className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-xl font-heading text-primary-dark mb-6 border-b pb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Full Name</label>
                <input required type="text" name="fullName" value={address.fullName} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md focus:ring-accent-gold focus:border-accent-gold" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Phone Number</label>
                <input required type="tel" name="phone" value={address.phone} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md focus:ring-accent-gold focus:border-accent-gold" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-muted mb-1">Address Line 1</label>
                <input required type="text" name="addressLine1" value={address.addressLine1} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md focus:ring-accent-gold focus:border-accent-gold" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">City</label>
                <input required type="text" name="city" value={address.city} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md focus:ring-accent-gold focus:border-accent-gold" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">State</label>
                <input required type="text" name="state" value={address.state} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md focus:ring-accent-gold focus:border-accent-gold" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Pincode</label>
                <input required type="text" name="pincode" value={address.pincode} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md focus:ring-accent-gold focus:border-accent-gold" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full mt-8 py-4 text-white rounded font-medium transition flex justify-center items-center ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-dark hover:bg-secondary-brown'}`}
            >
              {loading ? 'Processing...' : `Pay ₹${cartTotal.toLocaleString()}`}
            </button>
          </form>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-24">
            <h3 className="text-xl font-heading text-primary-dark mb-4 border-b pb-4">Order Summary</h3>
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.product_id} className="flex gap-4">
                  <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-50">
                    <img src={item.product.images ? item.product.images[0] : item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-sm flex-grow">
                    <p className="font-medium text-primary-dark line-clamp-1">{item.product.name}</p>
                    <p className="text-text-muted">Qty: {item.quantity}</p>
                    <p className="font-bold text-primary-dark">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="text-base font-bold text-primary-dark">Total</span>
              <span className="text-2xl font-bold text-primary-dark">₹{cartTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
