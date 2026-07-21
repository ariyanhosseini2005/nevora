export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "amara",
    name: "Amara Reyes",
    role: "Café Owner, Lisbon",
    quote:
      "NEVORA's Yirgacheffe changed how our regulars think about a morning cup. It tastes intentional.",
  },
  {
    id: "daniel",
    name: "Daniel Voss",
    role: "Home Barista",
    quote:
      "Every batch arrives roasted days before, not months. The difference in the cup is obvious.",
  },
  {
    id: "sana",
    name: "Sana Khalid",
    role: "Food Writer",
    quote: "Quiet, precise, unhurried — NEVORA feels like the opposite of fast coffee.",
  },
];
