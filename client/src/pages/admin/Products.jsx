import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '../../utils/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Failed to delete product', error);
      }
    }
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading text-primary-dark">Products</h2>
        <button className="flex items-center gap-2 bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-secondary-brown transition">
          <FiPlus /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium text-text-muted">Product Name</th>
                <th className="px-6 py-4 font-medium text-text-muted">Category</th>
                <th className="px-6 py-4 font-medium text-text-muted">Price</th>
                <th className="px-6 py-4 font-medium text-text-muted">Stock</th>
                <th className="px-6 py-4 font-medium text-text-muted">Status</th>
                <th className="px-6 py-4 font-medium text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.length === 0 && (
                <tr><td colSpan="6" className="text-center py-8 text-text-muted">No products found. Add one above.</td></tr>
              )}
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-primary-dark">{product.name}</td>
                  <td className="px-6 py-4 text-text-muted">{product.category}</td>
                  <td className="px-6 py-4 font-bold">₹{product.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-text-muted">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-accent-gold hover:text-primary-dark transition p-1"><FiEdit2 /></button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 transition p-1 ml-2"><FiTrash2 /></button>
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

export default AdminProducts;
