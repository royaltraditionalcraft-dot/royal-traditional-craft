import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export type RazorpayOrderOptions = {
  amount: number; // in paise (INR × 100)
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
};
