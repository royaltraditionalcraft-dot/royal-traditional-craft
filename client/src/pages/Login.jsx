import { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cream">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-heading text-primary-dark text-center mb-6">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-accent-gold focus:border-accent-gold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-text-muted">Password</label>
              <Link to="/forgot-password" className="text-xs text-accent-gold hover:underline">Forgot Password?</Link>
            </div>
            <input
              type="password"
              required
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-accent-gold focus:border-accent-gold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-primary-dark rounded-md hover:bg-secondary-brown transition-colors"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-text-muted">
          Don't have an account? <Link to="/register" className="text-accent-gold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
