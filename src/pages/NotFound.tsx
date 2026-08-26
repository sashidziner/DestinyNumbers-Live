import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Mail, Sparkles } from 'lucide-react';
import { useSEO } from '../lib/useSEO';

export default function NotFound() {
  const { pathname } = useLocation();

  useSEO({
    title: 'Page Not Found (404) | Destiny Numbers',
    description: 'The page you are looking for does not exist. Explore our numerology, Vastu, astrology and healing services.',
  });

  useEffect(() => {
    // Tell crawlers not to index 404 responses.
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'noindex, follow');

    return () => {
      // Clean up so other pages aren't accidentally noindex'd after navigation.
      robots?.setAttribute('content', 'index, follow');
    };
  }, []);

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#0D1B3E] text-white">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C9A84C]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C9A84C]/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-warm-border/40 mb-8">
          <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
          <span className="text-[10px] tracking-[0.3em] font-black uppercase text-[#C9A84C]">Error 404</span>
        </div>

        <h1 className="font-display text-[80px] md:text-[140px] leading-none font-black text-[#C9A84C] mb-4">
          404
        </h1>

        <h2 className="font-display text-2xl md:text-4xl font-medium mb-6 text-[#C9A84C]">
          This path is not written in the stars
        </h2>

        <p className="text-white/70 text-base md:text-lg mb-2 max-w-xl mx-auto">
          The page you are looking for does not exist, has been moved, or the destiny you sought is elsewhere.
        </p>

        {pathname && (
          <p className="text-white/40 text-sm font-mono mb-10 break-all">
            {pathname}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#C9A84C] text-[#0D1B3E] font-display font-black tracking-[0.2em] text-[12px] uppercase hover:scale-105 transition-transform"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center gap-3 px-8 py-4 border border-warm-border/40 text-white font-display font-black tracking-[0.2em] text-[12px] uppercase hover:bg-white/5 transition-colors"
          >
            <Compass className="w-4 h-4" />
            All Services
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 px-8 py-4 border border-warm-border/40 text-white font-display font-black tracking-[0.2em] text-[12px] uppercase hover:bg-white/5 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact
          </Link>
        </div>

        <div className="mt-16 pt-8 border-t border-warm-border/20 text-white/50 text-sm">
          Looking for something specific? Try our{' '}
          <Link to="/calculator" className="text-[#C9A84C] hover:underline">Numerology Calculator</Link>,{' '}
          <Link to="/services/tarot" className="text-[#C9A84C] hover:underline">Tarot Reading</Link>, or{' '}
          <Link to="/blog" className="text-[#C9A84C] hover:underline">Blog</Link>.
        </div>
      </div>
    </section>
  );
}
