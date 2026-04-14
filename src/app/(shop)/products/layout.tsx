import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Furniture — Royaltraditionalcraft",
  description:
    "Explore our full collection of premium Indian handcrafted furniture — beds, tables, chairs, sofas, and more.",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
