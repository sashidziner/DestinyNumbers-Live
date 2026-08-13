import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type SEOInput = {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
};

function setMeta(name: string, content: string) {
  if (!content) return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  if (!href) return;
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function useSEO({ title, description, keywords, canonical }: SEOInput) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (title) document.title = title;
    setMeta('description', description);
    if (keywords) setMeta('keywords', keywords);

    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    const href = canonical || `${window.location.origin}${base}${pathname}`;
    setCanonical(href);
  }, [title, description, keywords, canonical, pathname]);
}
