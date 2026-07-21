# CLAUDE_CODE_PROMPT.md

# ROLE

You are a senior frontend architect and UI engineer.

Your task:
Build NEVORA premium coffee website homepage.

Follow:
- IMPLEMENT_HOMEPAGE.md
- homepage-storyboard.md


# PROJECT OBJECTIVE

Create a luxury coffee brand experience.

The website must feel:

- Premium
- Modern
- Minimal
- Emotional
- High quality


# TECH STACK

Use:

Framework:
Next.js 15

Language:
TypeScript

Styling:
Tailwind CSS

Animation:
Framer Motion

Icons:
Lucide React


# PROJECT SETUP

Create:

src/
├── app/
├── components/
├── data/
├── lib/
├── styles/


# COMPONENT CREATION

Create:

components/

Navbar.tsx
Hero.tsx
CoffeeExperience.tsx
ProductShowcase.tsx
StorySection.tsx
WhyUs.tsx
Testimonials.tsx
CTASection.tsx
Footer.tsx


# DEVELOPMENT ORDER

Build in this order:

1. Project setup

2. Design system

3. Navbar

4. Hero section

5. Product showcase

6. Story sections

7. Animation layer

8. Responsive optimization

9. SEO optimization


# DESIGN DIRECTION


Colors:

Primary:
#1B120D

Gold:
#C8A45D

Cream:
#F6F1EA


Style:

Luxury coffee brand.

Avoid:

- Generic templates
- Excessive gradients
- Cheap animations
- Overcrowded UI


# HERO REQUIREMENTS


Create cinematic hero:

Elements:

- Full screen background
- Coffee atmosphere
- Strong headline
- CTA buttons


Animation:

- Fade up text
- Slow background zoom
- Smooth parallax


# PRODUCT COMPONENT


Create reusable ProductCard:


Props:

```ts
{
name:string
origin:string
price:number
rating:number
image:string
}