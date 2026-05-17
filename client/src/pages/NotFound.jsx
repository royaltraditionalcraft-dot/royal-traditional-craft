import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { FiAlertCircle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <MainLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <FiAlertCircle className="text-accent-gold text-6xl mb-6" />
        <h1 className="text-5xl font-heading text-primary-dark mb-4">404</h1>
        <h2 className="text-2xl font-body text-text-dark font-medium mb-6">Page Not Found</h2>
        <p className="text-text-muted max-w-md mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="bg-primary-dark text-white px-8 py-3 rounded-full hover:bg-secondary-brown transition shadow-md font-medium">
          Return to Home
        </Link>
      </div>
    </MainLayout>
  );
};

export default NotFound;
