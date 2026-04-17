"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function WhatsAppButton() {
  const phoneNumber = "+917742627542";
  const pathname = usePathname();
  const [message, setMessage] = useState("Hello! I have a query about your furniture collection.");
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    // Set current URL
    setCurrentUrl(window.location.href);

    // Check if we're on a product detail page
    if (pathname.startsWith('/products/') && pathname !== '/products') {
      // Try to get product name from page title (set by metadata)
      const pageTitle = document.title;
      const productName = pageTitle.split(' | ')[0]; // Remove " | Royaltraditionalcraft"

      if (productName && productName !== "Royaltraditionalcraft") {
        setMessage(`Hello! I'm interested in the ${productName}. Here is the link: ${window.location.href}. Can you provide more details?`);
      } else {
        setMessage(`Hello! I'm interested in this product. Here is the link: ${window.location.href}. Can you provide more details?`);
      }
    } else {
      setMessage("Hello! I have a query about your furniture collection.");
    }
  }, [pathname]);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-24 right-4 md:bottom-24 md:right-6 z-50",
        "w-14 h-14 md:w-16 md:h-16",
        "bg-green-500 hover:bg-green-600",
        "rounded-full shadow-lg hover:shadow-xl",
        "flex items-center justify-center",
        "transition-all duration-300 ease-in-out",
        "animate-pulse hover:animate-none",
        "group"
      )}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle
        size={28}
        className="text-white group-hover:scale-110 transition-transform duration-200"
      />
    </a>
  );
}