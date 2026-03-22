import { useRef, useEffect } from "react";
import { DollarSign, Briefcase, Mountain, Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const communities = [
  "Fort McMurray",
  "Edmonton",
  "Calgary",
  "Red Deer",
  "Cochrane",
  "Grande Prairie",
  "Canmore",
  "Sylvan Lake",
];

const advantages = [
  {
    icon: DollarSign,
    title: "Lower Taxes",
    desc: "No provincial sales tax means more money stays in your pocket — giving you greater purchasing power for your home.",
  },
  {
    icon: Briefcase,
    title: "High-Paying Careers",
    desc: "Oil sands, tech, skilled trades, and professional opportunities that fuel Alberta's high standard of living.",
  },
  {
    icon: Mountain,
    title: "Mountain Retreats",
    desc: "World-class Rocky Mountain lifestyle right at your doorstep — ski, hike, and explore year-round.",
  },
  {
    icon: Building2,
    title: "Growing Communities",
    desc: "Thriving cities with booming opportunity, excellent amenities, and an unmatched quality of life.",
  },
];

const AlbertaAdvantageSection = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("animate-fade-up");
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="alberta" className="py-24 md:py-32 bg-warm-white">
      <div className="container">
        <div ref={ref} className="opacity-0">
          {/* Header */}
          <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3 text-center">
            The Alberta Advantage
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal text-balance leading-tight mb-6 text-center">
            Your Alberta Dream{" "}
            <span className="gold-gradient-text">Starts Here</span>
          </h2>
          <p className="text-charcoal-light text-lg leading-relaxed max-w-2xl mx-auto text-center mb-16">
            Based in Fort McMurray, I proudly serve clients across all of
            Alberta. Whether you're relocating to this incredible province for
            the first time or already call it home, I'm here to help make your
            Alberta dream a reality with tailored mortgage solutions.
          </p>

          {/* Advantage cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {advantages.map((item, i) => (
              <div
                key={item.title}
                className="bg-background rounded-xl p-7 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gold/10"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-lg gold-gradient flex items-center justify-center mb-5">
                  <item.icon size={22} className="text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-charcoal mb-2">
                  {item.title}
                </h3>
                <p className="text-charcoal-light text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Communities served */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <MapPin size={20} className="text-gold" />
              <p className="text-gold font-medium tracking-widest uppercase text-sm">
                Communities I Serve
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {communities.map((city) => (
                <span
                  key={city}
                  className="px-5 py-2.5 rounded-full border border-gold/20 bg-background font-display text-sm md:text-base font-medium text-charcoal hover:border-gold/50 hover:shadow-sm transition-all duration-200"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button variant="gold" size="lg" asChild>
              <a href="#contact">Start Your Alberta Journey</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlbertaAdvantageSection;
