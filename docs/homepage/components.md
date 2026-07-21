# Homepage Components Specification

Version: 1.0

---

# Philosophy

Every component must have a single responsibility.

Components must be:

- Reusable
- Typed
- Accessible
- Responsive
- Animated
- Independent

Business logic must never live inside UI components.

---

# Component Tree

Homepage

├── Navbar
├── Hero
├── BrandSection
├── CoffeeExperience
├── ProductShowcase
├── CoffeeOrigins
├── WhyChooseUs
├── Testimonials
├── CTA
└── Footer

---

# Navbar

Purpose

Provide navigation across the website.

Children

Logo

NavigationMenu

ActionButtons

MobileMenu

Props

None

Behavior

Transparent on Hero

Solid after scrolling

Sticky

Responsive

---

# Hero

Purpose

Create the strongest emotional first impression.

Children

HeroBackground

HeroContent

HeroButtons

ScrollIndicator

Props

title

subtitle

background

buttons

Behavior

Fullscreen

Centered

Animated

---

# HeroBackground

Purpose

Display cinematic media.

Supports

Image

Video

Gradient Overlay

Must

Fill screen

Optimize loading

Support lazy loading

---

# HeroContent

Contains

Headline

Description

CTA Buttons

Max Width

720px

---

# HeroButtons

Primary Button

Explore Collection

Secondary Button

Our Story

---

# BrandSection

Purpose

Introduce the philosophy of NEVORA.

Children

TextBlock

ImageBlock

Quote

Statistics

---

# CoffeeExperience

Purpose

Explain the journey from bean to cup.

Children

Timeline

TimelineItem

TimelineConnector

Each TimelineItem

Icon

Title

Description

Image

---

# ProductShowcase

Purpose

Display featured products.

Children

SectionHeader

ProductGrid

---

# ProductGrid

Desktop

4 columns

Tablet

2 columns

Mobile

1 column

---

# ProductCard

Props

id

name

origin

price

image

rating

description

slug

Features

Hover Animation

Favorite Button

Quick View

Add To Cart

---

# CoffeeOrigins

Purpose

Tell the sourcing story.

Children

Image

Content

CountryBadge

Story

Statistics

---

# WhyChooseUs

Children

FeatureCard

FeatureCard

FeatureCard

Each FeatureCard

Icon

Title

Description

---

# Testimonials

Purpose

Build trust.

Children

SectionHeader

Carousel

TestimonialCard

---

# TestimonialCard

Props

avatar

name

country

rating

comment

Features

Responsive

Animated

---

# CTA

Purpose

Final conversion section.

Children

Headline

Description

PrimaryButton

SecondaryButton

BackgroundPattern

---

# Footer

Children

Brand

Navigation

Support

Social

Newsletter

Copyright

---

# Shared Components

Button

Card

Section

Container

Heading

Paragraph

Badge

Icon

Divider

Modal

Drawer

Tooltip

Accordion

Carousel

LoadingSpinner

---

# Component Rules

Every component must:

Use TypeScript

Have a single purpose

Be reusable

Support dark mode

Support responsive layouts

Use semantic HTML

Avoid duplicated code

---

# Accessibility

Keyboard Navigation

ARIA Labels

Focus States

Screen Reader Support

Color Contrast AA

---

# Performance

Lazy Load

Memoize when needed

Dynamic imports

Image optimization

Avoid unnecessary re-renders

---

# Naming Convention

Hero.tsx

ProductCard.tsx

TimelineItem.tsx

SectionHeader.tsx

FeatureCard.tsx

Never use vague names like:

Component.tsx

Card2.tsx

NewSection.tsx

Temp.tsx

---

# Folder Structure

components/

ui/

Button

Card

Badge

Modal

Drawer

Section

layout/

Navbar

Footer

Container

homepage/

Hero

BrandSection

CoffeeExperience

ProductShowcase

CoffeeOrigins

WhyChooseUs

Testimonials

CTA

shared/

Loading

EmptyState

ErrorBoundary
