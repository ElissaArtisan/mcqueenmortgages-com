import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-home.jpg";
import elissaHeadshot from "@/assets/elissa-headshot.jpg";

const HeroSection = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    if (pickerOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [pickerOpen]);

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    };
    const observer = new IntersectionObserver(observerCallback, { threshold: 0.1 });
    if (textRef.current) observer.observe(textRef.current);
    if (imageRef.current) observer.observe(imageRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="" className="w-full h-full object-cover" aria-hidden="true" />
        <div className="absolute inset-0 bg-charcoal/75" />
      </div>

      <div className="container relative z-10 py-24 md:py-32 lg:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy & CTAs */}
          <div
            ref={textRef}
            className="opacity-0 translate-y-5 transition-all duration-700 ease-out [&.animate-in]:opacity-100 [&.animate-in]:translate-y-0"
          >
            <p className="text-gold font-medium tracking-widest uppercase text-sm mb-4">
              Licensed Alberta Mortgage Broker
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-bold leading-[1.08] text-balance mb-6">
              <span className="text-background">Elissa McQueen,</span>
              <br />
              <span className="gold-gradient-text">Your Mortgage Strategist</span>
            </h1>
            <p className="text-lg md:text-xl text-background/80 max-w-lg mb-8 leading-relaxed">
              Personalized mortgage solutions for Fort McMurray, the Oil Sands region, and the entire province of Alberta.
            </p>
            <div className="flex flex-wrap gap-4">
              {/* Consultation picker */}
              <div className="relative" ref={pickerRef}>
                <Button
                  variant="gold"
                  size="lg"
                  className="text-base px-8 py-6"
                  onClick={() => setPickerOpen((v) => !v)}
                >
                  Book a Consultation
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transition-transform duration-200 ${pickerOpen ? "rotate-180" : ""}`}
                  />
                </Button>

                {pickerOpen && (
                  <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 rounded-xl border border-gold/20 bg-charcoal/95 backdrop-blur-lg shadow-2xl shadow-black/40 overflow-hidden animate-fade-in z-50">
                    <a
                      href="https://artisanmortgages.zohobookings.ca/#/1780000000945660"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 px-5 py-4 hover:bg-gold/10 transition-colors duration-200 group"
                      onClick={() => setPickerOpen(false)}
                    >
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold group-hover:bg-gold/25 transition-colors">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-background">Phone Meeting</p>
                        <p className="text-xs text-background/60 mt-0.5">15 Minute, One-on-one</p>
                      </div>
                    </a>
                  </div>
                )}
              </div>

              <Button
                variant="gold-outline"
                size="lg"
                className="text-base px-8 py-6 border-background/40 text-background hover:bg-background/10"
                asChild
              >
                <a href="https://r.mtg-app.com/elissamcqueen" target="_blank" rel="noopener noreferrer">Get Pre-Approved</a>
              </Button>
            </div>
          </div>

          {/* Right — Portrait */}
          <div
            ref={imageRef}
            className="flex justify-center lg:justify-end opacity-0 translate-y-5 transition-all duration-700 ease-out delay-200 [&.animate-in]:opacity-100 [&.animate-in]:translate-y-0"
          >
            <div className="relative w-72 sm:w-80 md:w-96 lg:w-full max-w-md">
              <div className="absolute -inset-3 rounded-2xl border-2 border-gold/30 -rotate-2" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-background/10">
                <img
                  src={elissaHeadshot}
                  alt="Elissa McQueen — Licensed Alberta Mortgage Broker"
                  className="w-full h-auto object-cover aspect-[3/4]"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-charcoal/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
