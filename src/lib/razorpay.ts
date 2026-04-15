import Razorpay from "razorpay";

let razorpayInstance: Razorpay | null = null;

export const getRazorpay = () => {
  if (razorpayInstance) return razorpayInstance;

  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error("Razorpay keys are missing. Please check your environment variables.");
  }

  razorpayInstance = new Razorpay({
    key_id,
    key_secret,
  });

  return razorpayInstance;
};

export type RazorpayOrderOptions = {
  amount: number; // in paise (INR × 100)
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
};
