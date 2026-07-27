# NEVORA

NEVORA is a bilingual, cinematic specialty-coffee experience built around a
single continuous camera move. Scrolling controls a 540-frame journey from the
coffee fruit to the finished espresso, followed by the rest of the brand
homepage.

## Highlights

- Continuous F0204-F0743 scroll-driven WebP sequence
- Bounded rolling frame buffer for controlled memory and network usage
- English and Persian content with automatic LTR/RTL layout
- Responsive desktop and mobile art direction
- Reduced-motion fallback and accessible navigation
- Self-hosted Inter, Playfair Display, and Vazirmatn variable fonts
- Static metadata, Open Graph image, robots file, and sitemap

## Run locally

```bash
cd frontend
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Production checks

```bash
cd frontend
npm run lint
npm run build
npm run start
```

Set `NEXT_PUBLIC_SITE_URL` to the production origin before deployment so
canonical metadata and social previews use the correct URL.

## Production assets

The complete web-ready sequence is committed under
`frontend/public/images/journey/frames-v010`.

High-resolution storyboard masters, intermediate frame packs, proxies, and
review videos are intentionally kept outside Git because they total roughly
1.9 GB and are not required to build or run the site. See
`docs/homepage/storyboards/README.md` for details.
