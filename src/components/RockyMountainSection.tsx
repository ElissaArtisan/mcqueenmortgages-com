import { useRef, useEffect } from "react";
import { Home, TrendingUp, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import rockyMountainPhoto from "@/assets/rocky-mountain-landscape.jpg";

const features = [
  {
    icon: Home,
    title: "Second Home Financing",
    desc: "Flexible mortgage options for vacation properties — whether it's a weekend cabin or a year-round mountain retreat.",
  },
  {
    icon: TrendingUp,
    title: "Investment Properties",
    desc: "Build wealth with rental income in Alberta's top tourist destinations, from Canmore to Lake Louise.",
  },
  {
    icon: Mountain,
    title: "Complex Financing Experience",
    desc: "Experienced with complex financing strategies including 1/4 share properties, fractional ownership, and unique vacation property structures in the Rocky Mountain market.",
  },
];

const RockyMountainSection = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("animate-fade-up");
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="rocky-mountain" className="py-24 md:py-32 bg-background">
      <div className="container">
        <div ref={ref} className="opacity-0">
          <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3 text-center">
            Rocky Mountain Vacation Properties
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal text-balance leading-tight mb-6 text-center">
            Your Rocky Mountain <span className="gold-gradient-text">Dream Awaits</span>
          </h2>
          <p className="text-charcoal-light text-lg leading-relaxed max-w-3xl mx-auto text-center mb-12">
            Whether it's a cozy cabin in Canmore or a ski chalet near Banff — I help Albertans secure financing for their dream vacation properties. From second home mortgages to investment property financing, let's make your mountain getaway a reality.
          </p>

          {/* Landscape photo */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl mb-16 border border-gold/10">
            <img
              src={rockyMountainPhoto}
              alt="Luxury mountain cabin chalet in Canmore with warm lighting and stunning Rocky Mountain peaks at dusk"
              className="w-full h-64 md:h-96 lg:h-[28rem] object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent" />
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="bg-warm-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gold/10"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg gold-gradient flex items-center justify-center mb-5">
                  <f.icon size={22} className="text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-charcoal mb-3">
                  {f.title}
                </h3>
                <p className="text-charcoal-light leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button
              onClick={scrollToContact}
              className="gold-gradient text-primary-foreground px-8 py-6 text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              Explore Vacation Property Options
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RockyMountainSection;
