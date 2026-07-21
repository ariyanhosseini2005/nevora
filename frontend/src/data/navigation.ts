import { sectionIds } from "@/constants/routes";
import type { NavLink } from "@/types/navigation";

export const navLinks: NavLink[] = [
  { label: "Experience", href: `#${sectionIds.coffeeExperience}` },
  { label: "Shop", href: `#${sectionIds.products}` },
  { label: "Story", href: `#${sectionIds.story}` },
  { label: "Why Us", href: `#${sectionIds.whyUs}` },
  { label: "Reviews", href: `#${sectionIds.testimonials}` },
];
