"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate subscription
    alert(`Thank you for joining the Royal Circle! Subscribed with: ${email}`);
    setEmail("");
  };

  return (
    <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={handleSubmit}>
      <input 
        type="email" 
        placeholder="Your email address" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 bg-white border border-cream-300 text-gray-900 rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm placeholder:text-gray-400"
        required
      />
      <button 
        type="submit"
        className="bg-primary text-white rounded-full px-8 py-4 font-bold hover:bg-primary/90 transition-all whitespace-nowrap shadow-md"
      >
        Subscribe Now
      </button>
    </form>
  );
}
