import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import WoodBuffaloSection from "@/components/WoodBuffaloSection";
import RockyMountainSection from "@/components/RockyMountainSection";
import AlbertaAdvantageSection from "@/components/AlbertaAdvantageSection";
import ServicesSection from "@/components/ServicesSection";
import CalculatorSection from "@/components/CalculatorSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import RealtorPartnersSection from "@/components/RealtorPartnersSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="overflow-x-hidden">
    <Navbar />
    <HeroSection />
    <AboutSection />
    <WoodBuffaloSection />
    <RockyMountainSection />
    <AlbertaAdvantageSection />
    <ServicesSection />
    <CalculatorSection />
    <TestimonialsSection />
    <RealtorPartnersSection />
    <ContactSection />
    <Footer />
  </div>
);

export default Index;
