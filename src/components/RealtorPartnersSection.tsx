import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Zap, HeadphonesIcon, Handshake } from "lucide-react";

const benefits = [
  { icon: Zap, title: "Fast Pre-Approvals", desc: "Get your buyers qualified quickly so deals don't fall through. I prioritize speed without sacrificing thoroughness." },
  { icon: HeadphonesIcon, title: "Dedicated Support", desc: "Direct communication and updates throughout the mortgage process. You and your clients always know where things stand." },
  { icon: Handshake, title: "Co-Marketing Opportunities", desc: "Joint open houses, listing support, and client referral programs to grow both our businesses together." },
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
              Realtors, Let's <span className="gold-gradient-text">Work Together</span>
            </h2>
            <p className="text-charcoal-light text-lg leading-relaxed">
              Whether you're selling homes in Fort McMurray, Edmonton, Canmore, or anywhere across Alberta — I'd love to partner with you. Let's work together to get your clients pre-approved and into their dream homes faster.
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
