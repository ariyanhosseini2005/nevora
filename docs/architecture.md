# PROJECT_ARCHITECTURE.md

# NEVORA Architecture

Version: 1.0

---

# Philosophy

The project must be built using a scalable architecture.

Goals:

- Clean
- Modular
- Maintainable
- Reusable
- Scalable
- Production Ready

Every feature should be isolated.

No business logic inside UI components.

---

# Tech Stack

Framework

Next.js 15 (App Router)

Language

TypeScript

Styling

TailwindCSS

Animation

Framer Motion

Icons

Lucide React

Validation

Zod

Future API

tRPC / REST Ready

---

# Folder Structure

src/

app/
components/
features/
layouts/
hooks/
lib/
services/
store/
types/
utils/
constants/
styles/
assets/
data/

---

# App Structure

app/

layout.tsx

page.tsx

loading.tsx

error.tsx

not-found.tsx

---

# Components

components/

ui/
layout/
navigation/
cards/
buttons/
sections/
forms/
animations/

Rules:

Components here must remain generic.

No coffee-specific logic.

---

# Features

features/

homepage/

components/

Hero

Story

CoffeeExperience

Products

Testimonials

CTA

Footer

hooks/

types/

constants/

data/

Features own their own logic.

---

# Layouts

layouts/

MainLayout

ShopLayout

DashboardLayout

---

# Hooks

hooks/

useScroll

useParallax

useIntersection

useWindowSize

useMediaQuery

---

# Services

services/

api/

products

auth

checkout

users

newsletter

---

# Store

store/

cart

wishlist

theme

user

Use Zustand.

---

# Types

types/

product.ts

user.ts

order.ts

review.ts

navigation.ts

---

# Constants

constants/

colors.ts

routes.ts

animations.ts

spacing.ts

typography.ts

---

# Utils

utils/

currency.ts

slug.ts

formatDate.ts

validation.ts

helpers.ts

---

# Assets

assets/

images/

icons/

videos/

fonts/

---

# Data

Temporary JSON data

data/

products.ts

testimonials.ts

navigation.ts

---

# Naming Convention

Components

PascalCase

HeroSection.tsx

ProductCard.tsx

Button.tsx

Files

camelCase

Hooks

useSomething

Interfaces

Product

User

Order

Enums

ProductCategory

ButtonVariant

---

# Component Rules

Each component:

One responsibility only.

Reusable.

Typed.

No duplicated logic.

No inline styles.

Minimal props.

---

# Import Order

1 Libraries

2 Components

3 Hooks

4 Utils

5 Types

6 Styles

---

# Styling Rules

Tailwind Only

Avoid CSS Modules unless necessary.

No inline styles.

Use design tokens.

---

# State Management

Global

Zustand

Server

React Query (future)

Local

useState

---

# Performance Rules

Lazy load sections

Dynamic imports

Image optimization

Code splitting

Memoization when needed

---

# SEO Structure

Semantic HTML

Metadata API

Structured Data

OpenGraph

Twitter Cards

Sitemap

Robots.txt

---

# Accessibility

Keyboard navigation

ARIA labels

Visible focus states

Color contrast

Screen reader friendly

---

# Code Quality

ESLint

Prettier

Strict TypeScript

Absolute imports

Reusable utilities

---

# Git Strategy

main

develop

feature/*

bugfix/*

hotfix/*

---

# Commit Convention

feat:

fix:

refactor:

style:

docs:

test:

chore:

---

# Future Ready

The architecture must support:

Authentication

Shopping Cart

Checkout

Payment Gateway

Admin Dashboard

CMS

Blog

Wishlist

Product Reviews

Multi-language

Dark Mode

Without major refactoring.