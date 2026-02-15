import { useEffect } from 'react';
import { Product } from '@/types';
import { getAverageRating, getProductReviews } from '@/data/reviews';

const BASE_URL = 'https://rivervox.lovable.app';

interface ProductJsonLdProps {
  product: Product;
}

export const ProductJsonLd = ({ product }: ProductJsonLdProps) => {
  useEffect(() => {
    const reviews = getProductReviews(product.id);
    const avgRating = getAverageRating(product.id);

    const jsonLd: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images[0],
      sku: product.id,
      brand: { '@type': 'Brand', name: 'Rivervox' },
      url: `${BASE_URL}/product/${product.id}`,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'AED',
        availability: product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        url: `${BASE_URL}/product/${product.id}`,
        seller: { '@type': 'Organization', name: 'Rivervox' },
      },
    };

    if (reviews.length > 0) {
      jsonLd.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: avgRating.toFixed(1),
        reviewCount: reviews.length,
        bestRating: 5,
        worstRating: 1,
      };
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `jsonld-product-${product.id}`;
    script.textContent = JSON.stringify(jsonLd);

    // Remove previous if exists
    const existing = document.getElementById(`jsonld-product-${product.id}`);
    if (existing) existing.remove();

    document.head.appendChild(script);

    return () => {
      const el = document.getElementById(`jsonld-product-${product.id}`);
      if (el) el.remove();
    };
  }, [product]);

  return null;
};
