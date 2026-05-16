import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';

const Home = () => (
  <MainLayout>
    <div className="p-8 text-center py-20">
      <h1 className="text-5xl md:text-6xl font-heading text-primary-dark mb-6">WoodCraft India</h1>
      <p className="text-lg text-text-muted max-w-2xl mx-auto">
        Discover premium luxury handcrafted solid wood furniture. Designed with elegance, built for a lifetime.
      </p>
      <div className="mt-10">
        <a href="/products" className="bg-primary-dark text-cream px-8 py-3 rounded-full hover:bg-secondary-brown transition shadow-md inline-block">
          Explore Collection
        </a>
      </div>
    </div>
  </MainLayout>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Storefront Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<MainLayout><Products /></MainLayout>} />
            <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
            <Route path="/checkout" element={<MainLayout><Checkout /></MainLayout>} />
            
            {/* Protected Customer Routes */}
            <Route path="/account" element={<MainLayout><Account /></MainLayout>} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
            <Route path="/admin/orders" element={<AdminLayout><AdminOrders /></AdminLayout>} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
