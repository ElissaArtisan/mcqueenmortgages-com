import { useRef, useEffect } from "react";
import { Home, RefreshCw, Building2, Briefcase, CreditCard, CheckCircle2 } from "lucide-react";

const services = [
  { icon: Home, title: "First-Time Home Buyers", desc: "Navigate your first purchase with confidence. We simplify the process and find programs designed for you." },
  { icon: RefreshCw, title: "Renewals & Refinancing", desc: "Don't auto-renew. Let us negotiate better terms or unlock your home's equity through refinancing." },
  { icon: Building2, title: "Investment Properties", desc: "Grow your portfolio with competitive rates and expert advice on investment property financing." },
  { icon: Briefcase, title: "Self-Employed Mortgages", desc: "Flexible solutions for business owners and self-employed professionals with non-traditional income." },
  { icon: CreditCard, title: "Debt Consolidation", desc: "Simplify your finances by consolidating high-interest debt into a single, manageable mortgage payment." },
  { icon: CheckCircle2, title: "Pre-Approvals", desc: "Shop with confidence. Know exactly what you can afford before you start house hunting." },
];

const ServicesSection = () => {
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
    <section id="services" className="py-24 md:py-32">
      <div className="container">
        <div ref={ref} className="opacity-0">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">My Services</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal text-balance leading-tight mb-6">
              Mortgage Solutions <span className="gold-gradient-text">Tailored to You</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div
                key={s.title}
                className="group relative rounded-xl p-8 border border-gold/10 bg-background hover:border-gold/30 transition-all duration-300 hover:shadow-lg hover:shadow-gold/5"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-11 h-11 rounded-lg bg-gold-light flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-200">
                  <s.icon size={20} className="text-gold" />
                </div>
                <h3 className="font-display text-lg font-semibold text-charcoal mb-2">{s.title}</h3>
                <p className="text-charcoal-light text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
