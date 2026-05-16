import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiPackage, FiUsers, FiTrendingUp } from 'react-icons/fi';
import api from '../../utils/api';

const StatCard = ({ title, value, icon, trend }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-text-muted mb-1">{title}</p>
      <h4 className="text-2xl font-bold text-primary-dark">{value}</h4>
      <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
        <FiTrendingUp /> {trend}
      </p>
    </div>
    <div className="w-12 h-12 bg-cream text-secondary-brown rounded-lg flex items-center justify-center text-xl">
      {icon}
    </div>
  </div>
);

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const totalRevenue = orders.reduce((sum, order) => sum + (order.status !== 'cancelled' ? order.total_amount : 0), 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  
  // Get unique customers (basic approximation by shipping address name or user_id)
  const uniqueCustomers = new Set(orders.map(o => o.user_id || o.shipping_address?.phone)).size;

  return (
    <div>
      <h2 className="text-2xl font-heading text-primary-dark mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={<FiDollarSign />} trend="Overall" />
        <StatCard title="Orders" value={orders.length} icon={<FiPackage />} trend="Overall" />
        <StatCard title="Customers" value={uniqueCustomers} icon={<FiUsers />} trend="Overall" />
        <StatCard title="Avg. Order Value" value={`₹${Math.round(avgOrderValue).toLocaleString()}`} icon={<FiTrendingUp />} trend="Overall" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-heading text-primary-dark mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-text-muted">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td className="py-4 font-mono">{order.id.split('-')[0]}</td>
                  <td className="py-4">{order.shipping_address?.fullName || 'Guest'}</td>
                  <td className="py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="py-4 font-bold">₹{order.total_amount.toLocaleString()}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan="5" className="py-4 text-center text-text-muted">No recent orders</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
