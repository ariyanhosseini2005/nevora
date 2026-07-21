import { MainLayout } from "@/layouts/MainLayout";
import { Hero } from "@/features/homepage/components/Hero/Hero";
import { CoffeeExperience } from "@/features/homepage/components/CoffeeExperience/CoffeeExperience";
import { ProductShowcase } from "@/features/homepage/components/Products/ProductShowcase";
import { StorySection } from "@/features/homepage/components/Story/StorySection";
import { WhyUs } from "@/features/homepage/components/WhyUs/WhyUs";
import { Testimonials } from "@/features/homepage/components/Testimonials/Testimonials";
import { CTASection } from "@/features/homepage/components/CTA/CTASection";

export default function Home() {
  return (
    <MainLayout>
      <Hero />
      <CoffeeExperience />
      <ProductShowcase />
      <StorySection />
      <WhyUs />
      <Testimonials />
      <CTASection />
    </MainLayout>
  );
}
