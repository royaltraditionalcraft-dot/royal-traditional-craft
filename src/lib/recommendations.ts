import { MOCK_PRODUCTS } from "./data";

/**
 * Smart recommendation logic for products.
 * Categorizes and scores products based on:
 * 1. Category match (Weight: 5)
 * 2. Tag match (Weight: 2 per tag)
 * 3. Excluding the current product
 */
export function getRecommendations(currentProductId: string, limit: number = 3) {
  const currentProduct = MOCK_PRODUCTS.find((p) => p.id === currentProductId);
  
  if (!currentProduct) {
    // Return most recent/popular if no current product
    return MOCK_PRODUCTS.slice(0, limit);
  }

  const scoredProducts = MOCK_PRODUCTS
    .filter((p) => p.id !== currentProductId && p.isActive)
    .map((p) => {
      let score = 0;

      // Category match
      if (p.categoryId === currentProduct.categoryId) {
        score += 5;
      }

      // Tag overlap
      if (p.tags && currentProduct.tags) {
        const matchingTags = p.tags.filter((tag) => 
          currentProduct.tags.includes(tag)
        );
        score += matchingTags.length * 2;
      }

      // Random jitter to keep recommendations fresh but relevant
      score += Math.random();

      return { ...p, score };
    })
    .sort((a, b) => b.score - a.score);

  return scoredProducts.slice(0, limit);
}

/**
 * Returns popular products for general recommendations (e.g. empty cart)
 */
export function getPopularProducts(limit: number = 4) {
  return [...MOCK_PRODUCTS]
    .sort((a, b) => (b._count?.reviews || 0) - (a._count?.reviews || 0))
    .slice(0, limit);
}
