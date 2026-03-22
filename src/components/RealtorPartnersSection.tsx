import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Zap, HeadphonesIcon, Handshake } from "lucide-react";

const benefits = [
  { icon: Zap, title: "Fast Pre-Approvals", desc: "Get your clients pre-approved quickly so they can shop with confidence. A smooth start sets the tone for the entire home-buying journey." },
  { icon: HeadphonesIcon, title: "Dedicated Support", desc: "Your clients deserve clear communication at every step. I keep both you and your buyers informed so nothing falls through the cracks." },
  { icon: Handshake, title: "Seamless Collaboration", desc: "From first showing to final closing, we work as one team — ensuring your clients feel guided, supported, and taken care of throughout." },
];

const RealtorPartnersSection = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("animate-fade-up"); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="partners" className="py-24 md:py-32 bg-warm-white">
      <div className="container">
        <div ref={ref} className="opacity-0">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">Partner With Me</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal text-balance leading-tight mb-6">
              Realtors, Let's Help Our <span className="gold-gradient-text">Clients Together</span>
            </h2>
            <p className="text-charcoal-light text-lg leading-relaxed">
              Buying a home is one of the biggest decisions your clients will make. When we work together as a team, we create a seamless experience — guiding them through the home search and mortgage process hand in hand. I partner with realtors across the Fort McMurray and Wood Buffalo region to ensure every client feels supported from start to finish.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {benefits.map((b, i) => (
              <div
                key={b.title}
                className="bg-background rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gold/10"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg gold-gradient flex items-center justify-center mb-5">
                  <b.icon size={22} className="text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-charcoal mb-3">{b.title}</h3>
                <p className="text-charcoal-light leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button variant="gold" size="lg" className="text-base px-10 py-6" asChild>
              <a href="#contact">Become a Referral Partner</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealtorPartnersSection;
