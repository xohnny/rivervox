import { useEffect } from 'react';
import { useSiteContent } from '@/hooks/useSiteContent';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  ogType?: string;
  noindex?: boolean;
  pageKey?: string;
}

interface SEOContent {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
}

const SITE_NAME = 'Rivervox';
const BASE_URL = 'https://rivervox.lovable.app';
const DEFAULT_OG_IMAGE = 'https://storage.googleapis.com/gpt-engineer-file-uploads/FqnKB5xaC9c11k64ANJR4BzdL2D3/social-images/social-1769162893875-Screenshot 2026-01-23 160806.jpg';

export const SEO = ({
  title,
  description,
  keywords,
  canonicalPath,
  ogType = 'website',
  noindex = false,
  pageKey,
}: SEOProps) => {
  const { content: seoOverrides } = useSiteContent<SEOContent | null>(
    'seo',
    pageKey || '__none__',
    null
  );

  const finalTitle = seoOverrides?.title || title;
  const finalDescription = seoOverrides?.description || description;
  const finalKeywords = seoOverrides?.keywords || keywords;
  const finalOgImage = seoOverrides?.ogImage || DEFAULT_OG_IMAGE;

  useEffect(() => {
    const fullTitle = finalTitle === SITE_NAME ? finalTitle : `${finalTitle} | ${SITE_NAME}`;
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

    setMeta('description', finalDescription);
    if (finalKeywords) setMeta('keywords', finalKeywords);

    // Open Graph
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', finalDescription, true);
    setMeta('og:type', ogType, true);
    setMeta('og:image', finalOgImage, true);
    if (canonicalPath) {
      setMeta('og:url', `${BASE_URL}${canonicalPath}`, true);
    }

    // Twitter
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', finalDescription);

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
  }, [finalTitle, finalDescription, finalKeywords, finalOgImage, canonicalPath, ogType, noindex]);

  return null;
};
