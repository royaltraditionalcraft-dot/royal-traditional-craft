import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import api from '../../utils/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    price: '',
    original_price: '',
    stock: '',
    description: '',
    images: ''
  });

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
        alert('Failed to delete product. ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-generate slug from name
    if (name === 'name' && !formData.slug) {
      setFormData(prev => ({ 
        ...prev, 
        name: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      category: product.category || '',
      price: product.price || '',
      original_price: product.original_price || '',
      stock: product.stock || '',
      description: product.description || '',
      images: product.images ? product.images.join(', ') : ''
    });
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingId(null);
    setFormData({
      name: '', slug: '', category: '', price: '', original_price: '', stock: '', description: '', images: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        original_price: parseFloat(formData.original_price) || 0,
        stock: parseInt(formData.stock) || 0,
        images: formData.images ? formData.images.split(',').map(s => s.trim()) : []
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post('/products', payload);
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product', error);
      alert('Failed to save product. ' + (error.response?.data?.error || error.message));
    }
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading text-primary-dark">Products</h2>
        <button 
          onClick={handleAddNewClick}
          className="flex items-center gap-2 bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-secondary-brown transition"
        >
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
                    <button onClick={() => handleEditClick(product)} className="text-accent-gold hover:text-primary-dark transition p-1"><FiEdit2 /></button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 transition p-1 ml-2"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-xl font-heading font-bold text-primary-dark">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-red-500">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">Product Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">Slug (URL)</label>
                  <input required type="text" name="slug" value={formData.slug} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">Category</label>
                  <input required type="text" name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">Stock Quantity</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">Price (₹)</label>
                  <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">Original Price (₹)</label>
                  <input type="number" name="original_price" value={formData.original_price} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Description</label>
                <textarea rows="3" name="description" value={formData.description} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Image URLs (Comma separated)</label>
                <input type="text" name="images" value={formData.images} onChange={handleInputChange} placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none" />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-text-muted hover:text-text-dark font-medium transition">Cancel</button>
                <button type="submit" className="bg-accent-gold text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition font-medium">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
