# NEVORA Coding Standards

Version: 1.0

Status: Production Ready

---

# Philosophy

Code is written for humans first.

Readable code is better than clever code.

Consistency is more important than personal preference.

Always optimize for maintainability.

---

# General Principles

Always

- Write self-explanatory code
- Prefer composition over inheritance
- Prefer explicit over implicit
- Keep components small
- Avoid duplication (DRY)
- Follow SOLID principles when applicable

Never

- Use magic numbers
- Hardcode strings repeatedly
- Create deeply nested components
- Mix UI with business logic

---

# Naming Convention

Folders

kebab-case

Example

product-card

coffee-experience

---

Files

PascalCase

HeroSection.tsx

ProductCard.tsx

NavigationBar.tsx

---

Hooks

useSomething

Examples

useScroll.ts

useTheme.ts

useProducts.ts

---

Types

Product

User

Order

Review

Never prefix with "I"

Avoid

IProduct

IUser

---

Constants

UPPER_SNAKE_CASE

Example

MAX_CART_ITEMS

DEFAULT_LANGUAGE

---

Functions

camelCase

formatPrice()

calculateDiscount()

createSlug()

---

Booleans

Always start with

is

has

can

should

Examples

isLoading

hasError

canCheckout

shouldAnimate

---

# Folder Rules

Each feature owns its files.

Example

features/

products/

components/

hooks/

types/

utils/

constants/

No unrelated files inside a feature.

---

# Component Rules

One component = One responsibility

Maximum file length

≈200 lines

If larger

Split into smaller components.

---

# Props

Always type props.

Use interfaces.

Avoid any.

Example

interface ProductCardProps {
  product: Product;
}

---

# State Management

Local UI State

useState

Global State

Zustand

Server State

TanStack Query

Never store server data inside Zustand.

---

# TypeScript Rules

Strict Mode

Enabled

Never use

any

Prefer

unknown

or proper types.

Use enums only when necessary.

Prefer union types.

---

# Imports

Order

1. React / Next

2. External libraries

3. Internal modules

4. Components

5. Hooks

6. Types

7. Utils

8. Styles

---

# Styling

Tailwind only.

Never inline styles unless dynamic.

Reuse utility classes.

Extract repeated patterns.

---

# Error Handling

Never ignore errors.

Always

try/catch

Handle loading

Handle empty state

Handle error state

---

# Async Code

Always use async/await.

Avoid nested promises.

Cancel requests when necessary.

---

# Forms

React Hook Form

Validation with Zod

Never validate manually if schema exists.

---

# Comments

Comments explain WHY.

Not WHAT.

Bad

// increment i

Good

// Prevent duplicate API requests while scrolling

---

# Logging

Development

console.log allowed

Production

No console.*

Use proper logger when needed.

---

# Performance

Memoize expensive calculations.

Lazy load heavy components.

Optimize images.

Avoid unnecessary re-renders.

---

# Accessibility

Semantic HTML

Keyboard navigation

ARIA labels

Visible focus

Screen reader support

---

# Git Commit Convention

feat:

fix:

docs:

style:

refactor:

perf:

test:

chore:

Examples

feat: add hero section

fix: resolve navbar scroll issue

refactor: simplify product card

---

# Pull Request Checklist

✓ TypeScript passes

✓ ESLint passes

✓ Responsive verified

✓ Accessibility checked

✓ No duplicated code

✓ Performance acceptable

✓ Design System respected

---

# Definition of Done

A feature is complete only if:

- It follows the Design System
- It follows the Architecture
- It is responsive
- It is accessible
- It is typed
- It is tested (where applicable)
- It is production ready

---

END OF DOCUMENT