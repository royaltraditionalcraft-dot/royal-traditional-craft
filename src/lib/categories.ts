import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

const getCategoriesFromDB = async () => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });
  return categories;
};

export const getCategories = unstable_cache(
  getCategoriesFromDB,
  ["navbar-categories"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["categories"],
  }
);