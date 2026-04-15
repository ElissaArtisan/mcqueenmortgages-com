import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const employmentOptions = [
  "Full-Time",
  "Part-Time",
  "Self-Employed",
  "Contract",
  "Retired",
  "Not Currently Employed",
];

const propertyTypes = [
  "Detached Home",
  "Semi-Detached",
  "Townhouse",
  "Condo / Apartment",
  "Duplex / Multi-Family",
  "Acreage / Rural",
  "Other",
];

const timelineOptions = [
  "Immediately (0–3 months)",
  "3–6 months",
  "6–12 months",
  "Just exploring",
];

const firstTimeBuyerOptions = ["Yes", "No", "Not sure"];

const creditScoreRanges = [
  "Excellent (760+)",
  "Good (700–759)",
  "Fair (650–699)",
  "Below Average (600–649)",
  "Poor (below 600)",
  "Not sure",
];

const PreApprovalSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [dob, setDob] = useState<Date>();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cityProvince: "",
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

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.employmentStatus || !form.annualIncome) {
      toast({ title: "Missing required fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    toast({ title: "Pre-Approval Request Submitted!", description: "Elissa will review your details and reach out shortly." });
    setForm({
      firstName: "", lastName: "", email: "", phone: "", cityProvince: "",
      employmentStatus: "", employerName: "", jobTitle: "", annualIncome: "",
      additionalIncome: "", purchasePrice: "", downPayment: "", propertyType: "",
      timeline: "", firstTimeBuyer: "", currentPayment: "", creditScore: "", notes: "",
    });
    setDob(undefined);
  };

  const selectClass =
    "w-full h-10 rounded-md border border-gold/20 bg-background px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2 appearance-none";

  return (
    <section id="pre-approval" className="py-24 md:py-32 bg-warm-white">
      <div className="container">
        <div ref={ref} className="opacity-0">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">
              Get Pre-Approved
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal text-balance leading-tight mb-6">
              Get <span className="gold-gradient-text">Pre-Approved</span>
            </h2>
            <p className="text-charcoal-light text-lg leading-relaxed">
              Fill out the form below and I'll review your details to help you understand what you qualify for. All information is kept strictly confidential.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto bg-background rounded-2xl p-8 md:p-10 shadow-lg shadow-gold/5 border border-gold/10 space-y-10"
          >
            {/* Personal Information */}
            <fieldset className="space-y-5">
              <legend className="text-lg font-semibold text-charcoal border-b border-gold/10 pb-2 mb-2 w-full">
                Personal Information
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pa-firstName" className="text-charcoal text-sm">First Name *</Label>
                  <Input id="pa-firstName" placeholder="First name" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} className="border-gold/20 focus-visible:ring-gold/40" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pa-lastName" className="text-charcoal text-sm">Last Name *</Label>
                  <Input id="pa-lastName" placeholder="Last name" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} className="border-gold/20 focus-visible:ring-gold/40" required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pa-email" className="text-charcoal text-sm">Email *</Label>
                  <Input id="pa-email" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => update("email", e.target.value)} className="border-gold/20 focus-visible:ring-gold/40" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pa-phone" className="text-charcoal text-sm">Phone *</Label>
                  <Input id="pa-phone" type="tel" placeholder="(555) 123-4567" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="border-gold/20 focus-visible:ring-gold/40" required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pa-city" className="text-charcoal text-sm">City / Province</Label>
                  <Input id="pa-city" placeholder="e.g. Calgary, AB" value={form.cityProvince} onChange={(e) => update("cityProvince", e.target.value)} className="border-gold/20 focus-visible:ring-gold/40" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-charcoal text-sm">Date of Birth</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-gold/20 hover:bg-gold/5",
                          !dob && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dob ? format(dob, "yyyy-MM-dd") : <span>yyyy-mm-dd</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dob}
                        onSelect={setDob}
                        disabled={(date) => date > new Date() || date < new Date("1940-01-01")}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </fieldset>

            {/* Employment & Income */}
            <fieldset className="space-y-5">
              <legend className="text-lg font-semibold text-charcoal border-b border-gold/10 pb-2 mb-2 w-full">
                Employment &amp; Income
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pa-employment" className="text-charcoal text-sm">Employment Status *</Label>
                  <select id="pa-employment" value={form.employmentStatus} onChange={(e) => update("employmentStatus", e.target.value)} className={selectClass} required>
                    <option value="">Select status</option>
                    {employmentOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pa-employer" className="text-charcoal text-sm">Employer Name</Label>
                  <Input id="pa-employer" placeholder="Company name" value={form.employerName} onChange={(e) => update("employerName", e.target.value)} className="border-gold/20 focus-visible:ring-gold/40" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pa-jobTitle" className="text-charcoal text-sm">Job Title</Label>
                  <Input id="pa-jobTitle" placeholder="Your position" value={form.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} className="border-gold/20 focus-visible:ring-gold/40" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pa-income" className="text-charcoal text-sm">Annual Income (before tax) *</Label>
                  <Input id="pa-income" placeholder="e.g. $75,000" value={form.annualIncome} onChange={(e) => update("annualIncome", e.target.value)} className="border-gold/20 focus-visible:ring-gold/40" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pa-addIncome" className="text-charcoal text-sm">Additional Income (if any)</Label>
                <Input id="pa-addIncome" placeholder="e.g. $12,000/yr rental income" value={form.additionalIncome} onChange={(e) => update("additionalIncome", e.target.value)} className="border-gold/20 focus-visible:ring-gold/40" />
              </div>
            </fieldset>

            {/* Property & Mortgage Details */}
            <fieldset className="space-y-5">
              <legend className="text-lg font-semibold text-charcoal border-b border-gold/10 pb-2 mb-2 w-full">
                Property &amp; Mortgage Details
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pa-price" className="text-charcoal text-sm">Estimated Purchase Price</Label>
                  <Input id="pa-price" placeholder="e.g. $450,000" value={form.purchasePrice} onChange={(e) => update("purchasePrice", e.target.value)} className="border-gold/20 focus-visible:ring-gold/40" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pa-down" className="text-charcoal text-sm">Down Payment Available</Label>
                  <Input id="pa-down" placeholder="e.g. $50,000" value={form.downPayment} onChange={(e) => update("downPayment", e.target.value)} className="border-gold/20 focus-visible:ring-gold/40" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pa-propType" className="text-charcoal text-sm">Property Type</Label>
                  <select id="pa-propType" value={form.propertyType} onChange={(e) => update("propertyType", e.target.value)} className={selectClass}>
                    <option value="">Select type</option>
                    {propertyTypes.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pa-timeline" className="text-charcoal text-sm">Timeline</Label>
                  <select id="pa-timeline" value={form.timeline} onChange={(e) => update("timeline", e.target.value)} className={selectClass}>
                    <option value="">When are you looking?</option>
                    {timelineOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pa-ftb" className="text-charcoal text-sm">First-Time Home Buyer?</Label>
                  <select id="pa-ftb" value={form.firstTimeBuyer} onChange={(e) => update("firstTimeBuyer", e.target.value)} className={selectClass}>
                    <option value="">Select</option>
                    {firstTimeBuyerOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pa-rent" className="text-charcoal text-sm">Current Rent / Mortgage Payment</Label>
                  <Input id="pa-rent" placeholder="e.g. $1,800/mo" value={form.currentPayment} onChange={(e) => update("currentPayment", e.target.value)} className="border-gold/20 focus-visible:ring-gold/40" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pa-credit" className="text-charcoal text-sm">Estimated Credit Score</Label>
                <select id="pa-credit" value={form.creditScore} onChange={(e) => update("creditScore", e.target.value)} className={selectClass}>
                  <option value="">Select range</option>
                  {creditScoreRanges.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </fieldset>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="pa-notes" className="text-charcoal text-sm">Anything else you'd like me to know?</Label>
              <Textarea
                id="pa-notes"
                placeholder="Any additional details about your situation..."
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                className="border-gold/20 focus-visible:ring-gold/40 min-h-[100px]"
              />
            </div>

            {/* Submit */}
            <div className="space-y-3">
              <Button type="submit" variant="gold" size="lg" className="w-full py-6 text-base">
                Submit Pre-Approval Request
              </Button>
              <p className="text-charcoal-light text-xs text-center leading-relaxed">
                This is not a formal mortgage application. Elissa will review your details and reach out to discuss next steps.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PreApprovalSection;
