"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { MapPin, Plus, Loader2, ShieldCheck, Tag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useCouponStore } from "@/store/couponStore";
import { formatPrice, toPaise, generateReceiptId } from "@/lib/utils";
import type { Session } from "next-auth";
import type { Address } from "@/types";

interface CheckoutClientProps {
  session: Session;
  addresses: Address[];
}

interface AddressFormData {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function CheckoutClient({ session, addresses }: CheckoutClientProps) {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const { appliedCoupon, discountAmount } = useCouponStore();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    addresses.find((a) => a.isDefault) ?? addresses[0] ?? null
  );
  const [showNewAddress, setShowNewAddress] = useState(addresses.length === 0);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<AddressFormData>();

  const baseShipping = totalPrice >= 999 ? 0 : 99;
  const shippingAfterCoupon = appliedCoupon?.type === "free_shipping" ? 0 : baseShipping;
  const discount = appliedCoupon ? discountAmount : 0;
  const shipping = shippingAfterCoupon;
  const total = Math.max(0, totalPrice + shipping - discount);

  const loadRazorpay = () => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (formData?: AddressFormData) => {
    const address = formData
      ? { ...formData }
      : selectedAddress
      ? {
          name: selectedAddress.name,
          phone: selectedAddress.phone,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
        }
      : null;

    if (!address) {
      toast.error("Please select or add a delivery address.");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setPaymentLoading(true);

    try {
      // Load Razorpay SDK
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Failed to load Razorpay SDK.");

      // Create Razorpay order
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: toPaise(total),
          receipt: generateReceiptId(),
        }),
      });
      const { orderId, error } = await res.json();
      if (error) throw new Error(error);

      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: toPaise(total),
        currency: "INR",
        name: "Royaltraditionalcraft",
        description: `Order for ${items.length} item(s)`,
        order_id: orderId,
        prefill: {
          name: session.user.name ?? address.name,
          email: session.user.email ?? "",
          contact: address.phone,
        },
        theme: { color: "#7B1E2E" },
        handler: async (response: any) => {
          try {
            // Verify payment + create order
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: {
                  items,
                  address,
                  totalAmount: total,
                  discountAmount: discount,
                  couponCode: appliedCoupon?.code ?? null,
                  shippingAmount: shipping,
                },
              }),
            });
            const result = await verifyRes.json();
            if (result.success) {
              clearCart();
              toast.success("🎉 Order placed successfully!");
              router.push("/orders?success=true");
            } else {
              throw new Error(result.error ?? "Payment verification failed.");
            }
          } catch (err: any) {
            toast.error(err.message ?? "Payment verification failed.");
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
            toast.info("Payment cancelled.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong. Please try again.");
      setPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tighter mb-12">Checkout</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-20">
          {/* Left: Address */}
          <div className="lg:col-span-7 space-y-12">
            <section>
              <h2 className="text-xl font-bold font-heading uppercase tracking-widest mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs">1</span>
                Delivery Address
              </h2>

              {/* Saved addresses */}
              {addresses.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`relative flex flex-col p-6 rounded-2xl border transition-all cursor-pointer group ${
                        selectedAddress?.id === addr.id
                          ? "border-primary bg-primary/[0.02]"
                          : "border-border hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress?.id === addr.id}
                        onChange={() => {
                          setSelectedAddress(addr);
                          setShowNewAddress(false);
                        }}
                        className="absolute top-6 right-6 accent-primary"
                      />
                      <div className="pr-8">
                        <p className="font-bold text-lg mb-1">{addr.name}</p>
                        <p className="text-sm text-muted-foreground mb-4">{addr.phone}</p>
                        <p className="text-sm leading-relaxed text-gray-600">
                          {addr.street}<br />
                          {addr.city}, {addr.state} – {addr.pincode}
                        </p>
                        {addr.isDefault && (
                          <span className="mt-4 inline-block text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* Add new address toggle */}
              <button
                onClick={() => setShowNewAddress(!showNewAddress)}
                className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                <div className="w-5 h-5 rounded-full border border-muted-foreground group-hover:border-primary flex items-center justify-center transition-colors">
                  <Plus size={10} />
                </div>
                {showNewAddress ? "Cancel" : "Add New Address"}
              </button>

              {/* New address form */}
              {showNewAddress && (
                <form
                  onSubmit={handleSubmit((data) => handlePayment(data))}
                  className="mt-8 grid grid-cols-2 gap-6"
                  id="address-form"
                >
                  {[
                    { name: "name" as const, label: "Full Name", col: "col-span-2" },
                    { name: "phone" as const, label: "Phone Number", col: "col-span-2" },
                    { name: "street" as const, label: "Street Address", col: "col-span-2" },
                    { name: "city" as const, label: "City", col: "" },
                    { name: "state" as const, label: "State", col: "" },
                    { name: "pincode" as const, label: "Pincode", col: "col-span-2" },
                  ].map(({ name, label, col }) => (
                    <div key={name} className={col}>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">
                        {label}
                      </label>
                      <input
                        {...register(name, { required: `${label} is required` })}
                        className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary transition-colors placeholder:text-gray-300"
                        placeholder={label}
                      />
                      {errors[name] && (
                        <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-wider">
                          {errors[name]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                </form>
              )}
            </section>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-muted/30 rounded-[2.5rem] p-8 lg:p-12 sticky top-32 space-y-10">
              <section>
                <h2 className="text-2xl font-heading font-bold tracking-tight mb-8">
                  Order Summary
                </h2>

                <ul className="space-y-6 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center gap-4">
                      <div className="w-14 h-18 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-border">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Totals */}
              <div className="space-y-4 pt-8 border-t border-border">
                <div className="flex justify-between text-muted-foreground font-medium text-sm">
                  <span>Subtotal</span>
                  <span className="text-foreground">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground font-medium text-sm">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600 font-bold">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between font-medium text-sm text-green-600">
                    <span className="flex items-center gap-1.5">
                      <Tag size={11} />
                      {appliedCoupon.type === "free_shipping" ? "Free Shipping" : `Discount (${appliedCoupon.code})`}
                    </span>
                    <span>
                      {appliedCoupon.type === "free_shipping" ? "Free" : `−${formatPrice(discount)}`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-4 border-t border-border text-lg font-bold">
                  <span>Total</span>
                  <div className="text-right">
                    {(discount > 0 || appliedCoupon?.type === "free_shipping") && (
                      <p className="text-xs text-muted-foreground line-through">{formatPrice(totalPrice + baseShipping)}</p>
                    )}
                    <span className="text-3xl text-primary font-heading tracking-tight">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <button
                id="razorpay-pay-btn"
                onClick={() =>
                  showNewAddress
                    ? document
                        .getElementById("address-form")
                        ?.dispatchEvent(
                          new Event("submit", { bubbles: true, cancelable: true })
                        )
                    : handlePayment()
                }
                disabled={paymentLoading || items.length === 0}
                className="w-full py-6 bg-primary text-white font-bold rounded-full flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {paymentLoading ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    Processing Receipt…
                  </>
                ) : (
                  <>
                    <ShieldCheck size={24} />
                    Complete Purchase
                  </>
                )}
              </button>

              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3 grayscale opacity-50">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-4" />
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] text-center">
                  Encrypted & Secure Transaction
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
