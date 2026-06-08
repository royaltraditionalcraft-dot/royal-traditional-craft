import React, { useState, useEffect } from 'react';
import { FiEye, FiX } from 'react-icons/fi';
import api from '../../utils/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-accent-gold hover:text-primary-dark transition p-1"
                    >
                      <FiEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-100 flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-primary-dark font-heading">
                  Order Details
                </h3>
                <p className="text-xs text-text-muted font-mono mt-0.5">ID: {selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="text-gray-400 hover:text-gray-600 transition p-2 rounded-full hover:bg-gray-50"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Status & Date */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl text-sm">
                <div>
                  <p className="text-text-muted mb-1">Order Date</p>
                  <p className="font-semibold text-primary-dark">
                    {new Date(selectedOrder.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted mb-1">Status</p>
                  <p className="font-semibold capitalize text-primary-dark">
                    {selectedOrder.status}
                  </p>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h4 className="text-sm font-bold text-primary-dark mb-3 uppercase tracking-wider">
                  Shipping Information
                </h4>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2 text-sm text-text-muted">
                  <p><strong className="text-primary-dark">Name:</strong> {selectedOrder.shipping_address?.fullName}</p>
                  <p><strong className="text-primary-dark">Phone:</strong> {selectedOrder.shipping_address?.phone}</p>
                  <p>
                    <strong className="text-primary-dark">Address:</strong> {selectedOrder.shipping_address?.addressLine1}
                  </p>
                  <p>
                    <strong className="text-primary-dark">Location:</strong> {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} - {selectedOrder.shipping_address?.pincode}
                  </p>
                </div>
              </div>

              {/* Items Purchased */}
              <div>
                <h4 className="text-sm font-bold text-primary-dark mb-3 uppercase tracking-wider">
                  Items Details
                </h4>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden bg-white">
                  {selectedOrder.order_items?.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 items-center">
                      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
                        <img 
                          src={item.products?.images?.[0] || item.products?.image || 'https://via.placeholder.com/150'} 
                          alt={item.products?.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-grow text-sm">
                        <p className="font-bold text-primary-dark line-clamp-1">
                          {item.products?.name || 'Unknown Product'}
                        </p>
                        <p className="text-text-muted">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-bold text-primary-dark text-right">
                        <p>₹{item.price_at_purchase?.toLocaleString()}</p>
                        <p className="text-xs text-text-muted font-normal">
                          Total: ₹{(item.price_at_purchase * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!selectedOrder.order_items || selectedOrder.order_items.length === 0) && (
                    <div className="p-4 text-center text-text-muted text-sm">No items found in this order.</div>
                  )}
                </div>
              </div>

              {/* Price Details */}
              <div className="border-t border-gray-100 pt-4 flex flex-col items-end text-sm space-y-1">
                <div className="flex justify-between w-64 text-text-muted">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-primary-dark">₹{selectedOrder.subtotal?.toLocaleString()}</span>
                </div>
                {selectedOrder.delivery_charge > 0 && (
                  <div className="flex justify-between w-64 text-text-muted">
                    <span>Delivery Charge:</span>
                    <span className="font-semibold text-primary-dark">₹{selectedOrder.delivery_charge?.toLocaleString()}</span>
                  </div>
                )}
                {selectedOrder.gst_amount > 0 && (
                  <div className="flex justify-between w-64 text-text-muted">
                    <span>GST Amount:</span>
                    <span className="font-semibold text-primary-dark">₹{selectedOrder.gst_amount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between w-64 pt-2 text-base font-bold text-primary-dark border-t border-dashed mt-2">
                  <span>Grand Total:</span>
                  <span className="text-lg">₹{selectedOrder.total_amount?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="bg-primary-dark text-white px-5 py-2 rounded-lg hover:bg-secondary-brown transition text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
