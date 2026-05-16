import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiBox, FiList, FiSettings, FiLogOut } from 'react-icons/fi';
import { supabase } from '../supabase';
import { useEffect } from 'react';

const AdminLayout = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else if (user?.email !== 'royaltraditionalcraft@gmail.com') {
        navigate('/'); 
      }
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-50 font-body">
      {/* Sidebar */}
      <div className="w-64 bg-primary-dark text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-heading font-bold">WoodCraft Admin</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-brown transition">
            <FiHome /> Dashboard
          </Link>
          <Link to="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-brown transition">
            <FiBox /> Products
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-brown transition">
            <FiList /> Orders
          </Link>
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-brown transition text-gray-300">
            <FiSettings /> Storefront
          </Link>
        </nav>

        <div className="p-4">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-300 hover:bg-red-900/50 rounded-lg transition">
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-heading text-primary-dark">Control Panel</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-text-muted">Admin User</span>
            <div className="w-8 h-8 bg-accent-gold rounded-full flex items-center justify-center text-white font-bold">A</div>
          </div>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
