import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Zap, HeadphonesIcon, Handshake, Send, X, Upload, Home } from "lucide-react";
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
  const [openHouseOpen, setOpenHouseOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [ohForm, setOhForm] = useState({
    firstName: "", lastName: "", phone: "", email: "",
    date: "", time: "", address: "",
  });
  const [ohPhotos, setOhPhotos] = useState<File[]>([]);
  const [ohPortrait, setOhPortrait] = useState<File | null>(null);

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

  const handleOhSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ohPhotos.length === 0) {
      toast({ title: "Photos Required", description: "Please upload up to 3 property photos.", variant: "destructive" });
      return;
    }
    if (!ohPortrait) {
      toast({ title: "Portrait Required", description: "Please upload your business portrait.", variant: "destructive" });
      return;
    }
    toast({ title: "Open House Collab Submitted!", description: "Elissa will review your details and get back to you soon." });
    setOhForm({ firstName: "", lastName: "", phone: "", email: "", date: "", time: "", address: "" });
    setOhPhotos([]);
    setOhPortrait(null);
    setOpenHouseOpen(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 3 - ohPhotos.length);
    setOhPhotos(prev => [...prev, ...newFiles].slice(0, 3));
    e.target.value = "";
  };

  const handlePortraitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setOhPortrait(file);
    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setOhPhotos(prev => prev.filter((_, i) => i !== index));
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="gold" size="lg" className="text-base px-10 py-6" onClick={() => setOpen(true)}>
              Become a Referral Partner
            </Button>
            <Button variant="gold-outline" size="lg" className="text-base px-10 py-6" onClick={() => setOpenHouseOpen(true)}>
              <Home size={18} className="mr-2" />
              Open House Collab
            </Button>
          </div>

          {/* Referral Partner Modal */}
          {open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)}>
              <div
                className="relative w-full max-w-lg bg-background rounded-2xl p-8 shadow-2xl border border-gold/10 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={() => setOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted transition-colors" aria-label="Close">
                  <X size={20} className="text-charcoal-light" />
                </button>
                <h3 className="font-display text-2xl font-bold text-charcoal mb-1">Become a Referral Partner</h3>
                <p className="text-charcoal-light text-sm mb-6">Fill out the form below and I'll reach out to discuss how we can work together.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={labelClass}>Full Name <span className="text-destructive">*</span></label>
                    <input type="text" required maxLength={100} className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
                  </div>
                  <div>
                    <label className={labelClass}>Email <span className="text-destructive">*</span></label>
                    <input type="email" required maxLength={255} className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
                  </div>
                  <div>
                    <label className={labelClass}>Phone <span className="text-destructive">*</span></label>
                    <input type="tel" required maxLength={20} className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(780) 555-0123" />
                  </div>
                  <div>
                    <label className={labelClass}>Message</label>
                    <textarea rows={3} maxLength={1000} className={inputClass + " resize-none"} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell me about your business and how you'd like to partner..." />
                  </div>
                  <Button variant="gold" type="submit" className="w-full py-5 text-base mt-2">
                    <Send size={18} className="mr-2" /> Submit Partnership Request
                  </Button>
                </form>
              </div>
            </div>
          )}

          {/* Open House Collab Modal */}
          {openHouseOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in" onClick={() => setOpenHouseOpen(false)}>
              <div
                className="relative w-full max-w-lg bg-background rounded-2xl p-8 shadow-2xl border border-gold/10 animate-scale-in max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={() => setOpenHouseOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted transition-colors z-10" aria-label="Close">
                  <X size={20} className="text-charcoal-light" />
                </button>
                <h3 className="font-display text-2xl font-bold text-charcoal mb-1">Open House Collab</h3>
                <p className="text-charcoal-light text-sm mb-6">Submit your open house details and let's co-market together.</p>
                <form onSubmit={handleOhSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>First Name <span className="text-destructive">*</span></label>
                      <input type="text" required maxLength={50} className={inputClass} value={ohForm.firstName} onChange={(e) => setOhForm({ ...ohForm, firstName: e.target.value })} placeholder="First name" />
                    </div>
                    <div>
                      <label className={labelClass}>Last Name <span className="text-destructive">*</span></label>
                      <input type="text" required maxLength={50} className={inputClass} value={ohForm.lastName} onChange={(e) => setOhForm({ ...ohForm, lastName: e.target.value })} placeholder="Last name" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number <span className="text-destructive">*</span></label>
                    <input type="tel" required maxLength={20} className={inputClass} value={ohForm.phone} onChange={(e) => setOhForm({ ...ohForm, phone: e.target.value })} placeholder="(780) 555-0123" />
                  </div>
                  <div>
                    <label className={labelClass}>Email <span className="text-destructive">*</span></label>
                    <input type="email" required maxLength={255} className={inputClass} value={ohForm.email} onChange={(e) => setOhForm({ ...ohForm, email: e.target.value })} placeholder="you@email.com" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Open House Date <span className="text-destructive">*</span></label>
                      <input type="date" required className={inputClass} value={ohForm.date} onChange={(e) => setOhForm({ ...ohForm, date: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelClass}>Open House Time <span className="text-destructive">*</span></label>
                      <input type="time" required className={inputClass} value={ohForm.time} onChange={(e) => setOhForm({ ...ohForm, time: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Open House Address <span className="text-destructive">*</span></label>
                    <input type="text" required maxLength={200} className={inputClass} value={ohForm.address} onChange={(e) => setOhForm({ ...ohForm, address: e.target.value })} placeholder="123 Main St, Fort McMurray, AB" />
                  </div>

                  {/* Property Photos */}
                  <div>
                    <label className={labelClass}>Property Photos (up to 3) <span className="text-destructive">*</span></label>
                    <div className="space-y-3">
                      {ohPhotos.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {ohPhotos.map((file, i) => (
                            <div key={i} className="relative group rounded-lg overflow-hidden border border-gold/20 aspect-square">
                              <img src={URL.createObjectURL(file)} alt={`Property ${i + 1}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removePhoto(i)}
                                className="absolute top-1 right-1 bg-charcoal/70 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {ohPhotos.length < 3 && (
                        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gold/20 rounded-lg py-4 cursor-pointer hover:border-gold/40 transition-colors">
                          <Upload size={18} className="text-gold" />
                          <span className="text-sm text-charcoal-light">Upload photos ({ohPhotos.length}/3)</span>
                          <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Business Portrait */}
                  <div>
                    <label className={labelClass}>Business Portrait <span className="text-destructive">*</span></label>
                    {ohPortrait ? (
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold/30">
                          <img src={URL.createObjectURL(ohPortrait)} alt="Portrait" className="w-full h-full object-cover" />
                        </div>
                        <button type="button" onClick={() => setOhPortrait(null)} className="text-sm text-destructive hover:underline">Remove</button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gold/20 rounded-lg py-4 cursor-pointer hover:border-gold/40 transition-colors">
                        <Upload size={18} className="text-gold" />
                        <span className="text-sm text-charcoal-light">Upload your headshot</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handlePortraitUpload} />
                      </label>
                    )}
                  </div>

                  <Button variant="gold" type="submit" className="w-full py-5 text-base mt-2">
                    <Send size={18} className="mr-2" /> Submit Open House Details
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
