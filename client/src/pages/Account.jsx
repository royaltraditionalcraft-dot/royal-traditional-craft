import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FiLogOut, FiPackage, FiUser } from 'react-icons/fi';
import { supabase } from '../supabase';

const Account = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my');
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return <div className="p-20 text-center text-primary-dark">Loading your account...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="mb-6">
              <h2 className="text-xl font-heading text-primary-dark">{user?.user_metadata?.full_name || 'My Account'}</h2>
              <p className="text-sm text-text-muted truncate">{user?.email}</p>
            </div>
            
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-primary-dark text-white' : 'text-text-muted hover:bg-cream hover:text-primary-dark'}`}
              >
                <FiPackage /> Orders
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-primary-dark text-white' : 'text-text-muted hover:bg-cream hover:text-primary-dark'}`}
              >
                <FiUser /> Profile
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-red-500 hover:bg-red-50 mt-4"
              >
                <FiLogOut /> Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow">
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 min-h-[500px]">
              <h3 className="text-2xl font-heading text-primary-dark mb-6">Order History</h3>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-text-muted mb-4">You haven't placed any orders yet.</p>
                  <button onClick={() => navigate('/products')} className="text-accent-gold hover:underline">Start Shopping</button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4 pb-4 border-b">
                        <div>
                          <p className="text-sm text-text-muted font-mono">Order #{order.id.split('-')[0]}</p>
                          <p className="text-xs text-text-muted">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                          <p className="font-bold text-primary-dark mt-1">₹{order.total_amount.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="flex gap-4 items-center">
                            <div className="w-12 h-12 bg-cream rounded overflow-hidden flex-shrink-0 border border-gray-100"></div>
                            <div className="text-sm">
                              <p className="font-medium text-primary-dark">Product ID: {item.product_id.split('-')[0]}</p>
                              <p className="text-text-muted">Qty: {item.quantity} × ₹{item.price_at_purchase.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 min-h-[500px]">
              <h3 className="text-2xl font-heading text-primary-dark mb-6">Profile Settings</h3>
              <p className="text-text-muted">Profile updates and address management coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
