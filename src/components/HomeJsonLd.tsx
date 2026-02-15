import { useEffect } from 'react';

const BASE_URL = 'https://rivervox.lovable.app';

export const HomeJsonLd = () => {
  useEffect(() => {
    const orgJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Rivervox',
      url: BASE_URL,
      logo: `${BASE_URL}/favicon.ico`,
      description: 'Premium Islamic fashion for men, women & kids. Elegant thobes, abayas, hijabs and modest fashion accessories.',
      sameAs: [],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        url: `${BASE_URL}/contact`,
      },
    };

    const websiteJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Rivervox',
      url: BASE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/shop?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };

    const ids = ['jsonld-organization', 'jsonld-website'];
    const data = [orgJsonLd, websiteJsonLd];

    ids.forEach((id, i) => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      script.textContent = JSON.stringify(data[i]);
      document.head.appendChild(script);
    });

    return () => {
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
    };
  }, []);

  return null;
};
