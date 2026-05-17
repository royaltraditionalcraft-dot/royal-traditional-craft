import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary-dark text-gray-300 py-12 mt-12 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.jpg" alt="RoyalTraditionalCraft Logo" className="h-10 w-10 rounded-lg object-cover border border-accent-gold/30 shadow-md" />
            <h3 className="text-2xl font-heading text-accent-gold font-bold">RoyalTraditionalCraft</h3>
          </div>
          <p className="text-sm">Premium handcrafted solid wood furniture designed with elegance and built for a lifetime. Experience luxury in every detail.</p>
        </div>
        <div>
          <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-accent-gold transition">Home</Link></li>
            <li><Link to="/products" className="hover:text-accent-gold transition">Shop Furniture</Link></li>
            <li><Link to="/cart" className="hover:text-accent-gold transition">My Cart</Link></li>
            <li><Link to="/login" className="hover:text-accent-gold transition">Admin Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold text-white mb-4">Contact Us</h4>
          <ul className="space-y-2 text-sm">
            <li>Email: support@royaltraditionalcraft.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Address: 123 Furniture Lane, Jaipur, Rajasthan, India</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-700 text-sm text-center">
        &copy; {new Date().getFullYear()} RoyalTraditionalCraft. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
