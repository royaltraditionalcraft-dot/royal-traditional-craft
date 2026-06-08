import { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;
      
      setSuccess(true);
      // Wait 3 seconds and redirect to login
      setTimeout(() => {
        supabase.auth.signOut();
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cream font-body">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md border border-gray-100">
        <h2 className="text-3xl font-heading text-primary-dark text-center mb-6">Reset Password</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4 text-center text-sm font-medium">
            Password updated successfully! Redirecting you to login...
          </div>
        )}

        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted">New Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-accent-gold focus:border-accent-gold outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              disabled={loading || success}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted">Confirm Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-accent-gold focus:border-accent-gold outline-none transition"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              disabled={loading || success}
            />
          </div>
          <button
            type="submit"
            disabled={loading || success}
            className={`w-full px-4 py-2 text-white bg-primary-dark rounded-md hover:bg-secondary-brown transition duration-200 font-medium ${
              loading || success ? 'bg-gray-400 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Updating password...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
