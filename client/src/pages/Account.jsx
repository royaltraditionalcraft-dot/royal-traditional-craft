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

  // Profile States
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [address, setAddress] = useState({
    phone: '',
    address_line1: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [addressLoading, setAddressLoading] = useState(true);
  const [savingAddress, setSavingAddress] = useState(false);

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

  // Fetch address from database when activeTab switches to profile
  useEffect(() => {
    const fetchAddress = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (!error && data) {
          setAddress({
            phone: data.phone || '',
            address_line1: data.address_line1 || '',
            city: data.city || '',
            state: data.state || '',
            pincode: data.pincode || ''
          });
        }
      } catch (err) {
        console.error('Error fetching address:', err);
      } finally {
        setAddressLoading(false);
      }
    };

    if (activeTab === 'profile') {
      fetchAddress();
    }
  }, [user, activeTab]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      if (error) throw error;
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const { data: existing, error: checkError } = await supabase
        .from('addresses')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError) throw checkError;

      const addressData = {
        full_name: fullName || 'User',
        phone: address.phone,
        address_line1: address.address_line1,
        city: address.city,
        state: address.state,
        pincode: address.pincode
      };

      if (existing) {
        // Update existing address
        const { error } = await supabase
          .from('addresses')
          .update(addressData)
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        // Insert new address
        const { error } = await supabase
          .from('addresses')
          .insert([{ user_id: user.id, ...addressData }]);
        if (error) throw error;
      }
      alert('Address saved successfully!');
    } catch (err) {
      console.error('Error saving address:', err);
      alert('Failed to save address.');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
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
                <FiUser /> Profile Settings
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
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Form */}
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <h4 className="text-lg font-heading text-primary-dark border-b pb-2">Personal Information</h4>
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:ring-accent-gold focus:border-accent-gold" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">Email Address</label>
                    <input 
                      disabled
                      type="email" 
                      value={user?.email || ''} 
                      className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-500 cursor-not-allowed" 
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={updatingProfile}
                    className="bg-primary-dark text-white px-6 py-2 rounded font-medium hover:bg-secondary-brown transition shadow-sm"
                  >
                    {updatingProfile ? 'Saving...' : 'Update Name'}
                  </button>
                </form>

                {/* Shipping Address Form */}
                <form onSubmit={handleUpdateAddress} className="space-y-6">
                  <h4 className="text-lg font-heading text-primary-dark border-b pb-2">Default Shipping Address</h4>
                  {addressLoading ? (
                    <div className="text-sm text-text-muted">Loading address details...</div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Phone Number</label>
                        <input 
                          required
                          type="tel" 
                          name="phone"
                          value={address.phone}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border rounded-md focus:ring-accent-gold focus:border-accent-gold" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Street Address</label>
                        <input 
                          required
                          type="text" 
                          name="address_line1"
                          value={address.address_line1}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border rounded-md focus:ring-accent-gold focus:border-accent-gold" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text-muted mb-1">City</label>
                          <input 
                            required
                            type="text" 
                            name="city"
                            value={address.city}
                            onChange={handleAddressChange}
                            className="w-full px-4 py-2 border rounded-md focus:ring-accent-gold focus:border-accent-gold" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-muted mb-1">State</label>
                          <input 
                            required
                            type="text" 
                            name="state"
                            value={address.state}
                            onChange={handleAddressChange}
                            className="w-full px-4 py-2 border rounded-md focus:ring-accent-gold focus:border-accent-gold" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Pincode</label>
                        <input 
                          required
                          type="text" 
                          name="pincode"
                          value={address.pincode}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border rounded-md focus:ring-accent-gold focus:border-accent-gold" 
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={savingAddress}
                        className="bg-primary-dark text-white px-6 py-2 rounded font-medium hover:bg-secondary-brown transition shadow-sm"
                      >
                        {savingAddress ? 'Saving...' : 'Save Address'}
                      </button>
                    </>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
