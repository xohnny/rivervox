import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  ogType?: string;
  noindex?: boolean;
}

const SITE_NAME = 'Rivervox';
const BASE_URL = 'https://rivervox.lovable.app';
const OG_IMAGE = 'https://storage.googleapis.com/gpt-engineer-file-uploads/FqnKB5xaC9c11k64ANJR4BzdL2D3/social-images/social-1769162893875-Screenshot 2026-01-23 160806.jpg';

export const SEO = ({
  title,
  description,
  keywords,
  canonicalPath,
  ogType = 'website',
  noindex = false,
}: SEOProps) => {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', description);
    if (keywords) setMeta('keywords', keywords);

    // Open Graph
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:type', ogType, true);
    setMeta('og:image', OG_IMAGE, true);
    if (canonicalPath) {
      setMeta('og:url', `${BASE_URL}${canonicalPath}`, true);
    }

    // Twitter
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);

    // Robots
    if (noindex) {
      setMeta('robots', 'noindex, nofollow');
    } else {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) robotsMeta.remove();
    }

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonicalPath) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', `${BASE_URL}${canonicalPath}`);
    } else if (canonical) {
      canonical.remove();
    }
  }, [title, description, keywords, canonicalPath, ogType, noindex]);

  return null;
};
