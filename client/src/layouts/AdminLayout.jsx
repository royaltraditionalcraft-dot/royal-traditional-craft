import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiBox, FiList, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { supabase } from '../supabase';
import Loader from '../components/Loader';

const AdminLayout = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  if (loading) return <Loader />;

  return (
    <div className="flex h-screen bg-gray-50 font-body overflow-hidden">
      {/* Sidebar Backdrop Overlay on Mobile */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-primary-dark text-white flex flex-col z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 flex justify-between items-center border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-lg object-cover border border-white/20" />
            <h2 className="text-lg font-heading font-bold tracking-wide">RoyalTraditionalCraft</h2>
          </div>
          {/* Close Sidebar Button on Mobile */}
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="md:hidden text-white hover:text-accent-gold p-1"
          >
            <FiX size={22} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-6">
          <Link to="/admin" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-brown transition">
            <FiHome /> Dashboard
          </Link>
          <Link to="/admin/products" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-brown transition">
            <FiBox /> Products
          </Link>
          <Link to="/admin/orders" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-brown transition">
            <FiList /> Orders
          </Link>
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-brown transition text-gray-300">
            <FiSettings /> Storefront
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-300 hover:bg-red-900/50 rounded-lg transition">
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden h-screen">
        <header className="bg-white shadow-sm px-4 md:px-8 py-4 flex justify-between items-center z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Open Sidebar Button */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-primary-dark hover:bg-gray-100 p-2 rounded-lg transition"
            >
              <FiMenu size={22} />
            </button>
            <h1 className="text-xl font-heading text-primary-dark">Control Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-text-muted hidden sm:inline">Admin User</span>
            <div className="w-8 h-8 bg-accent-gold rounded-full flex items-center justify-center text-white font-bold">A</div>
          </div>
        </header>
        <main className="p-4 md:p-8 overflow-y-auto flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
