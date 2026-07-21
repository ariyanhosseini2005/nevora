export const sectionIds = {
  hero: "hero",
  coffeeExperience: "coffee-experience",
  products: "products",
  story: "story",
  whyUs: "why-us",
  testimonials: "testimonials",
  cta: "join-us",
} as const;

export type SectionId = (typeof sectionIds)[keyof typeof sectionIds];
