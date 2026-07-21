import { homepageImages } from "./images";

export interface ExperienceStep {
  id: string;
  title: string;
  description: string;
  image: string;
}

export const experienceSteps: ExperienceStep[] = [
  {
    id: "harvest",
    title: "Harvest",
    description: "Cherries are hand-picked at peak ripeness, one row at a time.",
    image: homepageImages.coffeeExperience[0],
  },
  {
    id: "roasting",
    title: "Roasting",
    description: "Small drums, slow curves — roasted to reveal, not to mask.",
    image: homepageImages.coffeeExperience[1],
  },
  {
    id: "grinding",
    title: "Grinding",
    description: "Ground to order, matched to the way you brew at home.",
    image: homepageImages.coffeeExperience[2],
  },
  {
    id: "brewing",
    title: "Brewing",
    description: "The final ritual — where craft becomes a quiet moment.",
    image: homepageImages.coffeeExperience[3],
  },
];
