import { useRef, useEffect } from "react";
import { Shield, Cpu, Award } from "lucide-react";
import elissaPhoto from "@/assets/elissa-headshot.jpg";

const features = [
  { icon: Shield, title: "Trusted Guidance", desc: "I act in your best interest, comparing options against multiple lenders to find your ideal fit." },
  { icon: Cpu, title: "Technology Driven", desc: "Using the most up-to-date technology to simplify and expedite the mortgage process for my clients." },
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
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal text-balance leading-tight mb-16 text-center">About <span className="gold-gradient-text">Me</span></h2>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
            {/* Photo */}
            <div className="relative mx-auto md:mx-0 max-w-sm">
              <div className="absolute -inset-3 rounded-2xl gold-gradient opacity-20 blur-sm" />
              <div className="relative overflow-hidden rounded-2xl border-2 border-gold/20 shadow-xl">
                <img
                  src={elissaPhoto}
                  alt="Elissa McQueen — Licensed Alberta Mortgage Broker"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-xl gold-gradient flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-display text-xs font-semibold text-center leading-tight px-2">RECA<br/>Licensed</span>
              </div>
            </div>

            {/* Bio */}
            <div>
              <p className="text-charcoal-light text-lg leading-relaxed mb-6">
                Elissa McQueen is a licensed Alberta mortgage broker and proud member of the Artisan Mortgages team. Based in Fort McMurray — the heart of Canada's Oil Sands — she is dedicated to helping families and workers in the region achieve homeownership.
              </p>
              <p className="text-charcoal-light text-lg leading-relaxed">
                With deep local market knowledge and access to a wide network of lenders, Elissa crafts personalized mortgage solutions for every client.
              </p>
            </div>
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