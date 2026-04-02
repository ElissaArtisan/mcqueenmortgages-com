import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", mortgageType: "", message: "" });
  const { toast } = useToast();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Thank you!", description: "We'll be in touch within 24 hours." });
    setForm({ name: "", email: "", phone: "", mortgageType: "", message: "" });
  };

  const inputClass = "w-full rounded-lg border border-gold/20 bg-background px-4 py-3 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all duration-200";
  const labelClass = "block text-sm font-medium text-charcoal mb-1.5";

  return (
    <section id="contact" className="py-24 md:py-32 bg-warm-white">
      <div className="container">
        <div ref={ref} className="opacity-0">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">Get In Touch</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal text-balance leading-tight mb-6">
              Start Your Mortgage Strategy <span className="gold-gradient-text">With Me Now!</span>
            </h2>
            <p className="text-charcoal-light text-lg">No obligation. No pressure. Just honest mortgage advice.</p>
          </div>
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-background rounded-2xl p-8 md:p-10 shadow-lg shadow-gold/5 border border-gold/10">
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClass}>Full Name</label>
                <input type="text" required className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" required className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input type="tel" className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(780) 555-0123" />
              </div>
              <div>
                <label className={labelClass}>Mortgage Type</label>
                <select className={inputClass} value={form.mortgageType} onChange={(e) => setForm({ ...form, mortgageType: e.target.value })}>
                  <option value="">Select an option</option>
                  <option value="first-time">First-Time Purchase</option>
                  <option value="renewal">Renewal</option>
                  <option value="refinance">Refinancing</option>
                  <option value="investment">Investment Property</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="preapproval">Pre-Approval</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="mb-6">
              <label className={labelClass}>Message</label>
              <textarea rows={4} className={inputClass + " resize-none"} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your situation..." />
            </div>
            <Button variant="gold" type="submit" className="w-full py-6 text-base">
              <Send size={18} className="mr-2" />
              Send My Inquiry
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
