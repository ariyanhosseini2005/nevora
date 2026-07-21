# Homepage Motion Specification

Version: 1.0

Status: Production Ready

---

# Motion Philosophy

Motion exists to support storytelling.

Every animation should feel intentional.

Every transition should guide attention.

Nothing should animate just because it can.

The experience should feel calm.

Elegant.

Premium.

Natural.

---

# Motion Principles

Always

✓ Slow

✓ Smooth

✓ Elegant

✓ Minimal

✓ Purposeful

Never

✗ Flashy

✗ Bouncy

✗ Aggressive

✗ Distracting

✗ Gaming Style

---

# Timing

Instant

100ms

Fast

200ms

Normal

400ms

Slow

700ms

Cinematic

1200ms

---

# Easing

Primary

easeOut

Secondary

easeInOut

Never use

linear

except loading bars.

---

# Scroll Experience

Scrolling should feel cinematic.

Sections appear naturally.

No sudden movement.

Parallax should be subtle.

---

# Navbar

Initial

Transparent

Logo fades in

Navigation slides down

On Scroll

Background blur

Dark overlay

Height reduces slightly

---

# Hero

On Page Load

Background

Scale

1.1 → 1.0

Duration

8 seconds

Headline

Fade Up

40px

Duration

800ms

Subtitle

Fade Up

Delay

200ms

CTA Buttons

Fade Up

Delay

400ms

Scroll Indicator

Fade In

Loop Animation

---

# Hero Mouse Movement

Desktop Only

Very subtle parallax.

Maximum movement

15px

Never exaggerate.

---

# Brand Section

Animation

Fade

Slide Up

Distance

40px

Delay

100ms

Image

Scale

0.96 → 1

---

# Coffee Experience

Timeline

Each item appears separately.

Connection line grows.

Icons fade.

Cards slide.

---

# Product Showcase

Section

Fade Up

Product Cards

Stagger Animation

Delay

80ms

Hover

Card lifts

Image zooms

Shadow increases

Favorite button fades in

---

# Coffee Origins

Image

Reveal

Story

Fade

Statistics

Count Up Animation

---

# Why Choose Us

Cards

Cascade Animation

Hover

Scale

1.03

Icon

Rotate slightly

---

# Testimonials

Cards

Slide

Fade

Carousel

Auto Scroll

Pause on Hover

Mobile

Swipe Support

---

# CTA

Background

Gradient moves slowly

Headline

Fade Up

Buttons

Appear sequentially

---

# Footer

Fade

Small upward movement

Social Icons

Scale on Hover

---

# Buttons

Hover

Scale

1.04

Shadow

Increase

Press

Scale

0.97

Duration

200ms

---

# Product Cards

Hover

Lift

12px

Image

Zoom

1.08

Overlay

Fade

Button

Slide Up

---

# Images

Never pop in.

Always fade.

Use blur placeholder.

---

# Loading

Skeleton UI

Fade transition

Avoid spinners where possible.

---

# Page Transition

Future Support

Opacity

0 → 1

Slide

20px

Duration

500ms

---

# Performance Rules

Only animate visible elements.

Use Intersection Observer.

Respect prefers-reduced-motion.

Avoid layout shifts.

GPU accelerated transforms only.

Use:

opacity

transform

Avoid:

top

left

width

height

for animations.

---

# Accessibility

If prefers-reduced-motion is enabled:

Disable parallax.

Disable floating effects.

Reduce durations.

Keep navigation accessible.

---

# Motion Quality Checklist

✓ Smooth at 60 FPS

✓ No animation jank

✓ No unnecessary movement

✓ Mobile optimized

✓ Elegant timing

✓ Consistent easing

✓ Story-driven motion

---

END OF DOCUMENT