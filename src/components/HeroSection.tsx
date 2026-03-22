import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-home.jpg";

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("animate-fade-up"); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="Beautiful Edmonton home at golden hour" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-charcoal/60" />
      </div>
      <div className="container relative z-10 py-32 md:py-40">
        <div ref={ref} className="max-w-2xl opacity-0">
          <p className="text-gold font-medium tracking-widest uppercase text-sm mb-4">Edmonton's Trusted Mortgage Broker</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-balance mb-6">
            <span className="text-background">Your Dream Home</span>
            <br />
            <span className="gold-gradient-text">Starts Here</span>
          </h1>
          <p className="text-lg md:text-xl text-background/80 max-w-lg mb-8 leading-relaxed">
            Personalized mortgage solutions crafted with care. We navigate the complexities so you can focus on finding your perfect home.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="gold" size="lg" className="text-base px-8 py-6" asChild>
              <a href="#contact">Get Started Today</a>
            </Button>
            <Button variant="gold-outline" size="lg" className="text-base px-8 py-6 border-background/40 text-background hover:bg-background/10" asChild>
              <a href="#calculator">Calculate Payments</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
