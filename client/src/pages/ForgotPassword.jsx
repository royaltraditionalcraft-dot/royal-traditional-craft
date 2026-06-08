import { useState } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setMessage('A password reset link has been sent to your email address!');
      setEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cream font-body">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md border border-gray-100">
        <h2 className="text-3xl font-heading text-primary-dark text-center mb-6">Forgot Password</h2>
        <p className="text-sm text-text-muted mb-6 text-center">
          Enter your registered email address and we'll send you a link to reset your password.
        </p>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {message && <p className="text-green-600 text-sm mb-4 text-center font-medium">{message}</p>}

        <form onSubmit={handleResetRequest} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-accent-gold focus:border-accent-gold outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white bg-primary-dark rounded-md hover:bg-secondary-brown transition duration-200 font-medium ${
              loading ? 'bg-gray-400 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Sending link...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Back to <Link to="/login" className="text-accent-gold hover:underline font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
