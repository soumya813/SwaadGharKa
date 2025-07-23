import { Hero } from "@/components/Hero";
import { FeaturedDishes } from "@/components/FeaturedDishes";
import { HowItWorks } from "@/components/HowItWorks";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedDishes />
      <HowItWorks />
      <About />
      <Contact />
    </div>
  );
};

export default Index;