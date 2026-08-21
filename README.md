# Destiny Numbers

Production website for **Dr. Arun Poovaiah** — Bangalore-based numerology, Vastu, astrology, tarot and energy-healing consultancy.

**Live:** https://www.destinynumbers.in
**Stack:** React 19 · React Router 7 · Vite 6 · TypeScript · Tailwind CSS 4 · Supabase

---

## Features

- Home, About, Services (25+ service pages across Numerology, Vastu, Astrology, Energy Healing)
- Interactive tools — Numerology Calculator, Compatibility Calculator, Mobile Numerology, Brand Auditor, Free Tarot Reading
- Products catalogue with Supabase-backed CMS + admin panel
- Blog listing and article pages
- Consultation plans + contact form (PHP mailer on cPanel)
- Full SEO: per-route `<title>`/`<meta>`/canonical, sitemap.xml, robots.txt, noscript nav for crawlers
- Route-level code-splitting via Vite; deploy targets Apache/cPanel with a single `.htaccess`

---

## Local development

**Prerequisites:** Node.js 20+

```bash
npm install
cp .env.example .env      # then fill in the values below
npm run dev               # http://localhost:3000
```

### Required env vars (`.env`)

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL (products / CMS) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key |
| `GEMINI_API_KEY` | Google Generative AI key (used by tarot / analyser AI features) |
| `VITE_MAILER_URL` | *Dev only* — point at `https://www.destinynumbers.in/send-mail.php` to test the contact form against the live PHP mailer (Vite doesn't execute PHP locally) |

`.env.production` (checked in) empties `VITE_MAILER_URL` so production builds POST to `/send-mail.php` on the same origin.

---

## Scripts

```bash
npm run dev        # Vite dev server on :3000
npm run build      # production build → dist/
npm run preview    # preview the production build
npm run lint       # ESLint + tsc --noEmit
```

---

## Project structure

```
src/
  App.tsx                 # router + providers
  main.tsx                # entry
  components/             # shared UI (Nav, Footer, HomeSections, calculators)
  pages/                  # one file per route (60+ pages)
  lib/
    constants.ts          # SERVICES, NAV, BRAND_DATA, TESTIMONIALS
    useSEO.ts             # per-route title / meta / canonical
    supabase.ts           # Supabase client
    productService.ts     # products CRUD
    initialArticles.ts    # blog seed data
    utils.ts              # imgUrl(), cn(), date helpers
public/
  .htaccess               # Apache rewrite rules, security headers, canonical
  send-mail.php           # contact form handler (uses PHP mail() via cPanel)
  sitemap.xml, robots.txt
  assets/img/             # all static images (arun-profile, tarot deck, hero, testimonials)
```

---

## Deployment (cPanel / Apache shared hosting)

1. `npm run build` → produces `dist/`
2. Upload the **contents** of `dist/` (not the folder itself) to `public_html/`
3. The bundled `.htaccess` handles:
   - React Router deep-link rewrites to `index.html`
   - 301 redirect for legacy `/demo/*` URLs to `/*`
   - `https://` + `www.` canonical enforcement
   - Per-URL `Link: <...>; rel="canonical"` HTTP header (for non-JS crawlers)
   - Security headers: HSTS, X-Frame-Options, Referrer-Policy, CSP
4. Verify:
   - `https://www.destinynumbers.in/` loads
   - A deep link like `/services/vastu` loads (not 404)
   - `https://www.destinynumbers.in/send-mail.php?debug=1` shows PHP mailer status
   - Any old `/demo/*` URL 301s to `/*`

### Contact form gotcha

`send-mail.php` calls PHP `mail()`. On this cPanel host, DKIM signing only happens when the `From:` address is a real **Email Account** in cPanel. If `$MAIL_FROM` is ever changed to a new sender, first create that mailbox under cPanel → Email Accounts, or Gmail will silently drop the message with no bounce.

Debug endpoints (production):
- `?debug=1` → PHP version, `mail()` availability, sendmail path
- `?viewlog=1` → dumps `mail-error.log`

---

## Repo

https://github.com/sashidziner/DestinyNumbers-Live


## Live Track
21 Aug 2026 new design live