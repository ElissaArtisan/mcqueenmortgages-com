import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, User, Briefcase, Home, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PreApprovalSection = () => {
  const { toast } = useToast();
  const ref = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cityProvince: "",
    dob: "",
    employmentStatus: "",
    employerName: "",
    jobTitle: "",
    annualIncome: "",
    additionalIncome: "",
    purchasePrice: "",
    downPayment: "",
    propertyType: "",
    timeline: "",
    firstTimeBuyer: "",
    currentPayment: "",
    creditScore: "",
    notes: "",
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
    setForm({
      firstName: "", lastName: "", email: "", phone: "", cityProvince: "", dob: "",
      employmentStatus: "", employerName: "", jobTitle: "", annualIncome: "", additionalIncome: "",
      purchasePrice: "", downPayment: "", propertyType: "", timeline: "", firstTimeBuyer: "",
      currentPayment: "", creditScore: "", notes: "",
    });
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
                <div>
                  <label className={labelClass}>City / Province</label>
                  <input type="text" className={inputClass} value={form.cityProvince} onChange={update("cityProvince")} placeholder="e.g. Calgary, AB" />
                </div>
                <div>
                  <label className={labelClass}>Date of Birth</label>
                  <input type="date" className={inputClass} value={form.dob} onChange={update("dob")} />
                </div>
              </div>
            </div>

            {/* Employment & Income */}
            <div>
              <SectionHeading icon={Briefcase} title="Employment & Income" />
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Employment Status <span className="text-destructive">*</span></label>
                  <select required className={selectClass} value={form.employmentStatus} onChange={update("employmentStatus")}>
                    <option value="">Select status</option>
                    <option value="full-time">Full-Time Employed</option>
                    <option value="part-time">Part-Time Employed</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="contract">Contract / Seasonal</option>
                    <option value="retired">Retired</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Employer Name</label>
                  <input type="text" className={inputClass} value={form.employerName} onChange={update("employerName")} placeholder="Company name" />
                </div>
                <div>
                  <label className={labelClass}>Job Title</label>
                  <input type="text" className={inputClass} value={form.jobTitle} onChange={update("jobTitle")} placeholder="Your position" />
                </div>
                <div>
                  <label className={labelClass}>Annual Income (before tax) <span className="text-destructive">*</span></label>
                  <input type="text" required className={inputClass} value={form.annualIncome} onChange={update("annualIncome")} placeholder="e.g. $75,000" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Additional Income (if any)</label>
                  <input type="text" className={inputClass} value={form.additionalIncome} onChange={update("additionalIncome")} placeholder="e.g. $12,000/yr rental income" />
                </div>
              </div>
            </div>

            {/* Property & Mortgage Details */}
            <div>
              <SectionHeading icon={Home} title="Property & Mortgage Details" />
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Estimated Purchase Price</label>
                  <input type="text" className={inputClass} value={form.purchasePrice} onChange={update("purchasePrice")} placeholder="e.g. $450,000" />
                </div>
                <div>
                  <label className={labelClass}>Down Payment Available</label>
                  <input type="text" className={inputClass} value={form.downPayment} onChange={update("downPayment")} placeholder="e.g. $50,000" />
                </div>
                <div>
                  <label className={labelClass}>Property Type</label>
                  <select className={selectClass} value={form.propertyType} onChange={update("propertyType")}>
                    <option value="">Select type</option>
                    <option value="detached">Detached House</option>
                    <option value="semi-detached">Semi-Detached</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="condo">Condo / Apartment</option>
                    <option value="acreage">Acreage / Rural</option>
                    <option value="vacation">Vacation / Recreational</option>
                    <option value="investment">Investment Property</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Timeline</label>
                  <select className={selectClass} value={form.timeline} onChange={update("timeline")}>
                    <option value="">When are you looking?</option>
                    <option value="asap">As soon as possible</option>
                    <option value="1-3months">1–3 months</option>
                    <option value="3-6months">3–6 months</option>
                    <option value="6-12months">6–12 months</option>
                    <option value="just-exploring">Just exploring</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>First-Time Home Buyer?</label>
                  <select className={selectClass} value={form.firstTimeBuyer} onChange={update("firstTimeBuyer")}>
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Current Rent / Mortgage Payment</label>
                  <input type="text" className={inputClass} value={form.currentPayment} onChange={update("currentPayment")} placeholder="e.g. $1,800/mo" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Estimated Credit Score</label>
                  <select className={selectClass} value={form.creditScore} onChange={update("creditScore")}>
                    <option value="">Select range</option>
                    <option value="excellent">Excellent (760+)</option>
                    <option value="good">Good (700–759)</option>
                    <option value="fair">Fair (650–699)</option>
                    <option value="below-fair">Below Fair (600–649)</option>
                    <option value="poor">Poor (below 600)</option>
                    <option value="unsure">I'm not sure</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <SectionHeading icon={ShieldCheck} title="Anything else you'd like me to know?" />
              <textarea
                rows={4}
                className={inputClass + " resize-none"}
                value={form.notes}
                onChange={update("notes")}
                placeholder="Any additional details about your situation..."
              />
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
