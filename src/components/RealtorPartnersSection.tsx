import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Zap, HeadphonesIcon, Handshake, Send, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const benefits = [
  { icon: Zap, title: "Fast Pre-Approvals", desc: "Get your buyers qualified quickly so deals don't fall through — whether they're buying in Fort McMurray, Edmonton, Red Deer, Canmore, Sylvan Lake, or beyond." },
  { icon: HeadphonesIcon, title: "Dedicated Support", desc: "Direct communication and updates throughout the mortgage process. You and your clients always know where things stand, no matter where in Alberta." },
  { icon: Handshake, title: "Co-Marketing Opportunities", desc: "Joint open houses, listing support, and client referral programs to grow both our businesses across the province." },
];

const RealtorPartnersSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Partnership Request Sent!", description: "Elissa will be in touch shortly." });
    setForm({ name: "", email: "", phone: "", message: "" });
    setOpen(false);
  };

  const inputClass =
    "w-full rounded-lg border border-gold/20 bg-background px-4 py-3 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all duration-200 placeholder:text-muted-foreground";
  const labelClass = "block text-sm font-medium text-charcoal mb-1.5";

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
              Whether you're selling homes in Fort McMurray, Edmonton, Red Deer, Canmore, Sylvan Lake, or anywhere across Alberta — I'd love to partner with you. Let's work together to get your clients pre-approved and into their dream homes faster.
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
            <Button variant="gold" size="lg" className="text-base px-10 py-6" onClick={() => setOpen(true)}>
              Become a Referral Partner
            </Button>
          </div>

          {/* Modal */}
          {open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)}>
              <div
                className="relative w-full max-w-lg bg-background rounded-2xl p-8 shadow-2xl border border-gold/10 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted transition-colors"
                  aria-label="Close"
                >
                  <X size={20} className="text-charcoal-light" />
                </button>

                <h3 className="font-display text-2xl font-bold text-charcoal mb-1">Become a Referral Partner</h3>
                <p className="text-charcoal-light text-sm mb-6">Fill out the form below and I'll reach out to discuss how we can work together.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={labelClass}>Full Name <span className="text-destructive">*</span></label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      className={inputClass}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email <span className="text-destructive">*</span></label>
                    <input
                      type="email"
                      required
                      maxLength={255}
                      className={inputClass}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@email.com"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone <span className="text-destructive">*</span></label>
                    <input
                      type="tel"
                      required
                      maxLength={20}
                      className={inputClass}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="(780) 555-0123"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Message</label>
                    <textarea
                      rows={3}
                      maxLength={1000}
                      className={inputClass + " resize-none"}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell me about your business and how you'd like to partner..."
                    />
                  </div>
                  <Button variant="gold" type="submit" className="w-full py-5 text-base mt-2">
                    <Send size={18} className="mr-2" />
                    Submit Partnership Request
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RealtorPartnersSection;
