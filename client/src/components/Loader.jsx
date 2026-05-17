import React from 'react';
import './Loader.css';

export default function Loader() {
  return (
    <div className="loader-overlay" role="status" aria-label="Loading Royal Traditional Craft">
      <div className="wood-ring">
        <div className="ring ring-1" />
        <div className="ring ring-2" />
        <div className="ring ring-3" />
        <div className="ring-core overflow-hidden">
          <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-full" />
        </div>
      </div>
      <p className="loader-text">Royal<span>Traditional</span>Craft</p>
      <div className="progress-wrap">
        <div className="progress-bar" />
      </div>
      <div className="loader-dots">
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
      </div>
    </div>
  );
}
