import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PreApprovalSection = () => {
  const { toast } = useToast();
  const ref = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("animate-fade-up");
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Pre-Approval Request Submitted!", description: "Elissa will review your details and reach out shortly." });
    setForm({ firstName: "", lastName: "", email: "", phone: "" });
  };

  const inputClass =
    "w-full rounded-lg border border-gold/20 bg-background px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all duration-200 placeholder:text-muted-foreground";
  const labelClass = "block text-sm font-medium text-charcoal mb-1.5";
  const selectClass = inputClass + " appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%239ca3af%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8";

  const SectionHeading = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
    <div className="flex items-center gap-2.5 mb-5 pb-2 border-b border-gold/15">
      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
        <Icon size={16} className="text-gold" />
      </div>
      <h3 className="font-display text-lg font-semibold text-charcoal">{title}</h3>
    </div>
  );

  return (
    <section id="pre-approval" className="py-24 md:py-32 bg-warm-white">
      <div className="container">
        <div ref={ref} className="opacity-0">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">Get Pre-Approved</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal text-balance leading-tight mb-6">
              Start Your <span className="gold-gradient-text">Pre-Approval</span>
            </h2>
            <p className="text-charcoal-light text-lg leading-relaxed">
              Fill out the form below and I'll review your details to help you understand what you qualify for.
              All information is kept strictly confidential.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-background rounded-2xl p-8 md:p-10 shadow-lg shadow-gold/5 border border-gold/10 space-y-10">

            {/* Personal Information */}
            <div>
              <SectionHeading icon={User} title="Personal Information" />
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>First Name <span className="text-destructive">*</span></label>
                  <input type="text" required className={inputClass} value={form.firstName} onChange={update("firstName")} placeholder="First name" />
                </div>
                <div>
                  <label className={labelClass}>Last Name <span className="text-destructive">*</span></label>
                  <input type="text" required className={inputClass} value={form.lastName} onChange={update("lastName")} placeholder="Last name" />
                </div>
                <div>
                  <label className={labelClass}>Email <span className="text-destructive">*</span></label>
                  <input type="email" required className={inputClass} value={form.email} onChange={update("email")} placeholder="you@email.com" />
                </div>
                <div>
                  <label className={labelClass}>Phone <span className="text-destructive">*</span></label>
                  <input type="tel" required className={inputClass} value={form.phone} onChange={update("phone")} placeholder="(555) 123-4567" />
                </div>
              </div>
            </div>

            {/* Submit */}
            <Button variant="gold" type="submit" className="w-full py-6 text-base">
              <Send size={18} className="mr-2" />
              Submit Pre-Approval Request
            </Button>

            <p className="text-center text-xs text-muted-foreground leading-relaxed">
              This is not a formal mortgage application. Elissa will review your details and reach out to discuss the next steps.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PreApprovalSection;
