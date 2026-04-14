import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { formatDate, formatPrice, ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from "@/lib/utils";
import { Package } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  product: {
    slug: string;
    images: string[];
  };
}

interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: Date;
  trackingNumber: string;
  shippingAddress: {
    street: string;
    city: string;
    pincode: string;
  };
  items: OrderItem[];
}

export const metadata: Metadata = {
  title: "My Orders",
  description: "View all your orders from Royaltraditionalcraft.",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;

  const orders: Order[] = [
    {
      id: "ord_mock_1",
      userId: "user_mock_123",
      totalAmount: 125000,
      status: "DELIVERED",
      paymentStatus: "PAID",
      createdAt: new Date("2024-10-01"),
      trackingNumber: "RT-123456789",
      shippingAddress: { street: "123 Royal Palace Road", city: "Jaipur", pincode: "302001" },
      items: [
        {
          id: "item_1",
          name: "Maharaja King Bed",
          price: 89999,
          quantity: 1,
          product: { slug: "maharaja-king-bed", images: ["https://images.unsplash.com/photo-1505693419148-da19719f481a?q=80&w=800"] }
        },
        {
          id: "item_2",
          name: "Teak Armchair",
          price: 18500,
          quantity: 2,
          product: { slug: "teak-armchair", images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800"] }
        }
      ]
    },
    {
      id: "ord_mock_2",
      userId: "user_mock_123",
      totalAmount: 45000,
      status: "SHIPPED",
      paymentStatus: "PAID",
      createdAt: new Date("2024-10-20"),
      trackingNumber: "RT-987654321",
      shippingAddress: { street: "45 Heritage Lane", city: "Udaipur", pincode: "313001" },
      items: [
        {
          id: "item_3",
          name: "Velvet Chesterfield Sofa",
          price: 45000,
          quantity: 1,
          product: { slug: "chesterfield-sofa", images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800"] }
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tighter mb-2">My Orders</h1>
        <p className="text-muted-foreground mb-12">
          {orders.length} order{orders.length !== 1 ? "s" : ""} placed
        </p>

        {/* Success toast message */}
        {success === "true" && (
          <div className="bg-green-50 border border-green-100 rounded-2xl p-6 flex items-center gap-4 mb-12">
            <span className="text-3xl">🎉</span>
            <div>
              <p className="font-bold text-green-900 border-b border-green-200 pb-1 mb-1 inline-block">Order Success!</p>
              <p className="text-green-700 text-sm">
                Thank you for choosing Royal Crafts. We've received your order and will begin preparing it shortly.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-12">
          {orders.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-border rounded-[3rem]">
              <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center mb-6">
                <Package size={32} className="text-muted-foreground/30" />
              </div>
              <h2 className="text-2xl font-heading font-bold mb-4">No orders yet</h2>
              <Link
                href="/products"
                className="inline-flex py-4 px-8 bg-primary text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
              >
                Start Exploring
              </Link>
            </div>
          ) : (
            orders.map((order) => {
              const shippingAddr = order.shippingAddress as any;
              return (
                <div
                  key={order.id}
                  className="group relative bg-white rounded-[2.5rem] border border-border p-8 lg:p-10 transition-all hover:border-gray-300"
                >
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8 mb-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Order ID</p>
                        <p className="font-bold text-sm">#{order.id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Date</p>
                        <p className="font-bold text-sm">{formatDate(order.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total</p>
                        <p className="font-bold text-sm text-primary">{formatPrice(order.totalAmount)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                        <div className="flex gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${ORDER_STATUS_COLORS[order.status]}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {order.trackingNumber && (
                      <div className="md:text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Tracking Number</p>
                        <p className="font-mono font-bold text-xs bg-muted px-3 py-1 rounded inline-block">
                          {order.trackingNumber}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-20 h-24 rounded-2xl overflow-hidden bg-muted flex-shrink-0 border border-border">
                          {item.product.images[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.name}
                              width={80}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="text-muted-foreground/20" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 py-1">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="font-bold text-sm hover:text-primary transition-colors line-clamp-2 leading-snug"
                          >
                            {item.name}
                          </Link>
                          <p className="text-muted-foreground text-xs font-medium mt-1 uppercase tracking-widest">
                            {item.quantity} × {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Footer */}
                  {shippingAddr && (
                    <div className="bg-muted/30 rounded-2xl p-4 flex items-center gap-3 text-xs text-muted-foreground font-medium">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary">
                        <Package size={14} />
                      </div>
                      <div>
                        <span className="uppercase tracking-widest text-[9px] font-bold">Shipping to</span>
                        <p className="text-foreground">
                          {shippingAddr.street}, {shippingAddr.city} – {shippingAddr.pincode}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
