import { Leaf, Flame, Truck, Award } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface WhyUsItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const whyUsItems: WhyUsItem[] = [
  {
    icon: Leaf,
    title: "Ethically Sourced",
    description: "Direct relationships with growers who share our standard for quality.",
  },
  {
    icon: Flame,
    title: "Small-Batch Roasted",
    description: "Roasted in limited batches to preserve each origin's character.",
  },
  {
    icon: Award,
    title: "Award-Level Craft",
    description: "Every blend is cupped and refined until it earns its place in the collection.",
  },
  {
    icon: Truck,
    title: "Roasted to Order",
    description: "Beans ship within days of roasting, never from a warehouse shelf.",
  },
];
