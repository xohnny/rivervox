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

    const productJsonLd: Record<string, unknown> = {
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
      productJsonLd.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: avgRating.toFixed(1),
        reviewCount: reviews.length,
        bestRating: 5,
        worstRating: 1,
      };
    }

    const categoryLabel = product.category.charAt(0).toUpperCase() + product.category.slice(1);
    const breadcrumbJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Shop', item: `${BASE_URL}/shop` },
        { '@type': 'ListItem', position: 3, name: categoryLabel, item: `${BASE_URL}/shop?category=${product.category}` },
        { '@type': 'ListItem', position: 4, name: product.name },
      ],
    };

    const entries: [string, unknown][] = [
      [`jsonld-product-${product.id}`, productJsonLd],
      [`jsonld-breadcrumb-${product.id}`, breadcrumbJsonLd],
    ];

    entries.forEach(([id, data]) => {
      const existing = document.getElementById(id as string);
      if (existing) existing.remove();
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id as string;
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });

    return () => {
      entries.forEach(([id]) => {
        const el = document.getElementById(id as string);
        if (el) el.remove();
      });
    };
  }, [product]);

  return null;
};
