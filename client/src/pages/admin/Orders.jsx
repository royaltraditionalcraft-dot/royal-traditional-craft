import React, { useState, useEffect } from 'react';
import { FiEye } from 'react-icons/fi';
import api from '../../utils/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/orders/${id}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading text-primary-dark">Orders</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium text-text-muted">Order ID</th>
                <th className="px-6 py-4 font-medium text-text-muted">Customer</th>
                <th className="px-6 py-4 font-medium text-text-muted">Date</th>
                <th className="px-6 py-4 font-medium text-text-muted">Total</th>
                <th className="px-6 py-4 font-medium text-text-muted">Status</th>
                <th className="px-6 py-4 font-medium text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length === 0 && (
                <tr><td colSpan="6" className="text-center py-8 text-text-muted">No orders found.</td></tr>
              )}
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-primary-dark font-medium">{order.id.split('-')[0]}</td>
                  <td className="px-6 py-4 text-text-muted">{order.shipping_address?.fullName || 'Guest'}</td>
                  <td className="px-6 py-4 text-text-muted">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold">₹{order.total_amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <select 
                      className={`text-xs font-bold rounded-full px-2 py-1 border-0 focus:ring-0 ${
                        order.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-blue-100 text-blue-700'
                      }`}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-accent-gold hover:text-primary-dark transition p-1"><FiEye /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
