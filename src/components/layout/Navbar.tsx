import { getCategories } from "@/lib/categories";
import { NavbarClient } from "./NavbarClient";

interface NavbarProps {
  session: any; // From next-auth
}

export async function Navbar({ session }: NavbarProps) {
  let categories: Array<{ id: string; name: string; slug: string }> = [];

  try {
    categories = await getCategories();
  } catch (error) {
    console.error("Failed to load categories for navbar:", error);
    // Fallback to empty array - NavbarClient will handle empty categories gracefully
  }

  return <NavbarClient session={session} categories={categories} />;
}