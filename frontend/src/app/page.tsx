import { MainLayout } from "@/layouts/MainLayout";
import { CinematicJourney } from "@/features/homepage/components/CinematicJourney/CinematicJourney";
import { CoffeeExperience } from "@/features/homepage/components/CoffeeExperience/CoffeeExperience";
import { ProductShowcase } from "@/features/homepage/components/Products/ProductShowcase";
import { StorySection } from "@/features/homepage/components/Story/StorySection";
import { WhyUs } from "@/features/homepage/components/WhyUs/WhyUs";
import { Testimonials } from "@/features/homepage/components/Testimonials/Testimonials";
import { CTASection } from "@/features/homepage/components/CTA/CTASection";

export default function Home() {
  return (
    <MainLayout>
      <CinematicJourney />
      <CoffeeExperience />
      <ProductShowcase />
      <StorySection />
      <WhyUs />
      <Testimonials />
      <CTASection />
    </MainLayout>
  );
}
