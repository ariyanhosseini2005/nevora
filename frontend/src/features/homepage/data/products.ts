import type { Product } from "@/types/product";
import { homepageImages } from "./images";

export const products: Product[] = [
  {
    id: "ethiopia-yirgacheffe",
    name: "Yirgacheffe Reserve",
    origin: "Ethiopia",
    price: 24,
    rating: 4.9,
    image: homepageImages.products[0],
    weightGrams: 250,
  },
  {
    id: "colombia-huila",
    name: "Huila Single Origin",
    origin: "Colombia",
    price: 21,
    rating: 4.7,
    image: homepageImages.products[1],
    weightGrams: 250,
  },
  {
    id: "sumatra-mandheling",
    name: "Mandheling Dark Roast",
    origin: "Indonesia",
    price: 22,
    rating: 4.8,
    image: homepageImages.products[2],
    weightGrams: 250,
  },
];
