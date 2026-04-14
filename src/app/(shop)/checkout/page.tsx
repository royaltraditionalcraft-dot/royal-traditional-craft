import type { Metadata } from "next";
import type { Session } from "next-auth";
import { CheckoutClient } from "./CheckoutClient";
import type { Address } from "@/types";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order securely with Razorpay.",
};

export default async function CheckoutPage() {
  // TEMPORARY: Bypass auth for immediate testing
  const session: Session = {
    user: {
      id: "user_mock_123",
      name: "Guest User",
      email: "guest@example.com",
      role: "USER",
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  } as Session;

  const addresses: Address[] = [
    {
      id: "addr_1",
      name: "Home",
      userId: "user_mock_123",
      phone: "9876543210",
      street: "123 Royal Palace Road",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302001",
      isDefault: true,
    },
    {
      id: "addr_2",
      name: "Office",
      userId: "user_mock_123",
      phone: "9876543210",
      street: "45 Heritage Lane",
      city: "Udaipur",
      state: "Rajasthan",
      pincode: "313001",
      isDefault: false,
    }
  ];

  return <CheckoutClient session={session} addresses={addresses} />;
}
