import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import AlbertaAdvantageSection from "@/components/AlbertaAdvantageSection";
import WoodBuffaloSection from "@/components/WoodBuffaloSection";
import RockyMountainSection from "@/components/RockyMountainSection";
import CalculatorSection from "@/components/CalculatorSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="overflow-x-hidden">
    <Navbar />
    <HeroSection />
    <AboutSection />
    <ServicesSection />
    <AlbertaAdvantageSection />
    <WoodBuffaloSection />
    <RockyMountainSection />
    <CalculatorSection />
    <TestimonialsSection />
    <ContactSection />
    <Footer />
  </div>
);

export default Index;
