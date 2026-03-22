import { useRef, useEffect } from "react";
import { Shield, MapPin, Award } from "lucide-react";

const features = [
  { icon: Shield, title: "Trusted Guidance", desc: "We act in your best interest, comparing options across multiple lenders to find your ideal fit." },
  { icon: MapPin, title: "Local Expertise", desc: "Deep knowledge of Edmonton's neighbourhoods and real estate market gives you a competitive edge." },
  { icon: Award, title: "RECA Licensed", desc: "Fully licensed through the Real Estate Council of Alberta, holding ourselves to the highest professional standards." },
];

const AboutSection = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("animate-fade-up"); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-24 md:py-32 bg-warm-white">
      <div className="container">
        <div ref={ref} className="opacity-0">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">About Us</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal text-balance leading-tight mb-6">
              A Personal Approach to <span className="gold-gradient-text">Every Mortgage</span>
            </h2>
            <p className="text-charcoal-light text-lg leading-relaxed">
              At Artisan Mortgages, we believe every client deserves a tailored experience. Based in Edmonton, we combine local market insight with access to a wide network of lenders to craft the perfect mortgage solution for your unique situation.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="bg-background rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gold/10"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg gold-gradient flex items-center justify-center mb-5">
                  <f.icon size={22} className="text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-charcoal mb-3">{f.title}</h3>
                <p className="text-charcoal-light leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
