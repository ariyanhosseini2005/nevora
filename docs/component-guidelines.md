# NEVORA Component Guidelines

Version: 1.0

Status: Production Ready

---

# Philosophy

Components are the building blocks of NEVORA.

Every component should be:

- Reusable
- Predictable
- Accessible
- Composable
- Easy to test
- Easy to maintain

Never create components that solve multiple unrelated problems.

---

# Component Categories

UI Components

Examples

Button

Badge

Card

Input

Modal

Tooltip

Avatar

Divider

---

Layout Components

Navbar

Footer

Container

Section

Sidebar

Grid

---

Feature Components

Hero

ProductCard

CoffeeTimeline

Testimonials

ProductGallery

CartSummary

---

Shared Components

Empty State

Loading

Error Boundary

Skeleton

Pagination

---

# Folder Structure

Example

components/

Button/
├── Button.tsx
├── Button.types.ts
├── Button.styles.ts
├── Button.test.tsx
├── Button.stories.tsx
└── index.ts

---

# Component Anatomy

Every component should contain:

- Props
- Internal state (if needed)
- UI
- Events
- Accessibility

Business logic belongs elsewhere.

---

# Props

Always type props.

Example

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

Avoid

any

Object

Unknown props without documentation.

---

# Variants

Every reusable component should support variants.

Example

Button

Primary

Secondary

Outline

Ghost

Danger

Link

---

# Sizes

Support consistent sizes.

sm

md

lg

xl

Never invent custom sizes per component.

---

# States

Every interactive component should support:

Default

Hover

Focus

Pressed

Disabled

Loading

Success (when applicable)

Error (when applicable)

---

# Composition

Prefer composition over large prop APIs.

Good

<Card>
  <Card.Header />
  <Card.Content />
  <Card.Footer />
</Card>

Avoid

<Card
title=""
description=""
footer=""
icon=""
button=""
...

/>

---

# Accessibility

Every component must include:

Semantic HTML

Keyboard support

Focus state

ARIA labels

Reduced motion support

Color contrast

---

# Styling

Use Tailwind CSS.

No inline styles.

Reuse utility classes.

Extract repeated patterns.

Use design tokens.

---

# Animation

Use Framer Motion.

Animations should be:

Subtle

Consistent

Fast

Purposeful

Never animate layout unnecessarily.

---

# Performance

Memoize only when needed.

Lazy load heavy components.

Avoid unnecessary renders.

Optimize images.

---

# Error Handling

Components should fail gracefully.

Never crash the page.

Provide meaningful fallbacks.

---

# Documentation

Every shared component should include:

Purpose

Props

Example usage

Accessibility notes

---

# Testing

Shared components should include:

Render tests

Interaction tests

Accessibility tests

---

# Naming Convention

Good

ProductCard

HeroSection

SectionHeader

CoffeeOriginCard

Bad

Card2

Component

Test

NewButton

---

# Import Rules

External libraries

↓

Shared utilities

↓

Types

↓

Local files

---

# Anti Patterns

Never

Huge components (>200 lines)

Inline business logic

Duplicated UI

Nested ternary operators

Excessive props

Prop drilling across many levels

---

# Definition of Done

A component is complete only if:

✓ Typed

✓ Responsive

✓ Accessible

✓ Reusable

✓ Documented

✓ Tested (where applicable)

✓ Follows the Design System

✓ Follows Coding Standards

---

END OF DOCUMENT