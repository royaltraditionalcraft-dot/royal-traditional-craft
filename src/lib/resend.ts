import { Resend } from "resend";

let resendInstance: Resend | null = null;

export const getResend = () => {
  if (resendInstance) return resendInstance;

  const api_key = process.env.RESEND_API_KEY;

  if (!api_key) {
    // During build time, this might be missing.
    // We only throw if it's missing at runtime when we actually try to send an email.
    console.warn("RESEND_API_KEY is missing. Emails will not be sent.");
    // We still return a proxy or a dummy if we want to avoid crashing at constructor level,
    // but Resend's constructor is what's crashing.
    // So we only instantiate when we have the key.
    throw new Error("RESEND_API_KEY is mandatory to initialize Resend.");
  }

  resendInstance = new Resend(api_key);
  return resendInstance;
};
