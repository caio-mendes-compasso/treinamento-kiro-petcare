import HeroBanner from "@/components/home/HeroBanner";
import BenefitsSection from "@/components/home/BenefitsSection";
import PlansComparison from "@/components/home/PlansComparison";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <main className="break-words">
      <HeroBanner />
      <BenefitsSection />
      <PlansComparison />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}
