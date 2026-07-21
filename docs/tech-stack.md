# NEVORA Tech Stack

Version: 1.0

Status: Approved

---

# Philosophy

Choose technologies that are:

- Production Ready
- Well Maintained
- Type Safe
- High Performance
- Scalable
- Developer Friendly

Avoid unnecessary dependencies.

---

# Frontend

Framework

Next.js 15 (App Router)

Language

TypeScript (Strict Mode)

Runtime

React 19

Package Manager

pnpm

---

# Styling

Tailwind CSS v4

CSS Variables

Design Tokens

clsx

tailwind-merge

---

# UI

Lucide React

shadcn/ui (Base Components)

Radix UI Primitives

---

# Animations

Framer Motion

Lenis (Smooth Scroll)

GSAP (Only if required)

Preferred:

Framer Motion

---

# Forms

React Hook Form

Zod

---

# State Management

Zustand

Rules

Global state only.

UI state stays local.

---

# Data Fetching

TanStack Query

Server Components first.

Client fetching only when necessary.

---

# Backend Ready

REST API

tRPC Ready

GraphQL Compatible

---

# Authentication (Future)

Better Auth

NextAuth Compatible

JWT Ready

OAuth Ready

---

# Database (Future)

PostgreSQL

Prisma ORM

---

# CMS (Future)

Sanity

Payload CMS

---

# Images

Next/Image

AVIF

WebP

Blur Placeholder

---

# Fonts

next/font

Google Fonts

Local Fonts Supported

---

# SEO

Metadata API

OpenGraph

Twitter Cards

JSON-LD

robots.txt

sitemap.xml

---

# Testing

Vitest

React Testing Library

Playwright

---

# Code Quality

ESLint

Prettier

Husky

lint-staged

Commitlint

---

# Deployment

Vercel

Cloudflare CDN

GitHub Actions

---

# Monitoring

Sentry

Vercel Analytics

Web Vitals

---

# Performance Targets

Lighthouse >95

CLS <0.1

LCP <2.5s

INP <200ms

---

# Dependency Rules

Before installing a package ask:

Is it maintained?

Is it tree-shakable?

Does Next.js already solve this?

Can it be implemented manually?

Never install packages unnecessarily.