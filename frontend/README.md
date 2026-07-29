# NEVORA frontend

The production application is built with Next.js 16, React 19, TypeScript,
Tailwind CSS 4, and Framer Motion.

## Commands

```bash
npm ci
npm run dev
npm run lint
npm run build
npm run start
```

The application is fully bilingual in English and Persian. The frame-by-frame
hero uses the full-quality sequence in `public/images/journey/frames-v010`,
with responsive 1024px and constrained-network 768px tiers alongside it. The
runtime keeps only a small rolling window of decoded frames in memory.

Regenerate the responsive tiers after replacing the source frames with:

```bash
npm run frames:tiers
```

For project details and asset policy, see the repository root `README.md`.
