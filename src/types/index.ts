// ─── Re-export Prisma types ───────────────────────────────────────────────────
export type {
  User,
  Product,
  Category,
  Order,
  OrderItem,
  Address,
  Banner,
  Review,
} from "@/generated/prisma/client";

export type { Role, OrderStatus, PaymentStatus } from "@/generated/prisma/client";

// ─── Cart types ───────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  quantity: number;
  stock: number;
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
}

// ─── API response helpers ─────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Product with category ────────────────────────────────────────────────────

export interface ProductWithCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  images: string[];
  isFeatured: boolean;
  isActive: boolean;
  weight: number | null;
  dimensions: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  isNew?: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  reviews?: ReviewWithUser[];
  _count?: { reviews: number };
}

export interface ReviewWithUser {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
}

// ─── Order with items ─────────────────────────────────────────────────────────

export interface OrderWithItems {
  id: string;
  status: string;
  totalAmount: number;
  shippingAmount: number;
  taxAmount: number;
  shippingAddress: ShippingAddress;
  paymentStatus: string;
  paymentId: string | null;
  razorpayOrderId: string | null;
  trackingNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItemWithProduct[];
  user?: {
    name: string | null;
    email: string;
    image: string | null;
  };
}

export interface OrderItemWithProduct {
  id: string;
  quantity: number;
  price: number;
  name: string;
  image: string | null;
  product: {
    id: string;
    slug: string;
    images: string[];
  };
}

// ─── Address ──────────────────────────────────────────────────────────────────

export interface ShippingAddress {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  search?: string;
  sortBy?: "latest" | "price_asc" | "price_desc" | "popularity";
  page?: number;
  limit?: number;
}

// ─── Dashboard stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
}
