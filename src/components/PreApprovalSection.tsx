import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const employmentOptions = [
  "Full-time employed",
  "Part-time employed",
  "Self-employed",
  "Contract / Freelance",
  "Retired",
  "Other",
];

const propertyTypes = [
  "Detached House",
  "Semi-detached",
  "Townhouse",
  "Condo / Apartment",
  "Not sure yet",
];

const timelineOptions = [
  "Just exploring",
  "0–3 months",
  "3–6 months",
  "6–12 months",
];

const firstTimeBuyerOptions = ["Yes", "No"];

const creditScoreRanges = [
  "Excellent 750+",
  "Good 700–749",
  "Fair 650–699",
  "Below 650",
  "Not sure",
];

const baseSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Last name is required").max(80),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(40),
  cityProvince: z.string().trim().max(120).optional().or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
  employmentStatus: z.string().min(1, "Please select your employment status"),
  employerName: z.string().trim().max(120).optional().or(z.literal("")),
  jobTitle: z.string().trim().max(120).optional().or(z.literal("")),
  annualIncome: z.string().trim().min(1, "Annual income is required").max(40),
  additionalIncome: z.string().trim().max(120).optional().or(z.literal("")),
  purchasePrice: z.string().trim().max(40).optional().or(z.literal("")),
  downPayment: z.string().trim().max(40).optional().or(z.literal("")),
  propertyType: z.string().optional().or(z.literal("")),
  timeline: z.string().optional().or(z.literal("")),
  firstTimeBuyer: z.string().optional().or(z.literal("")),
  currentPayment: z.string().trim().max(40).optional().or(z.literal("")),
  creditScore: z.string().optional().or(z.literal("")),
  hasCoApplicant: z.enum(["Yes", "No"], { required_error: "Please let me know" }),
  coFirstName: z.string().trim().max(80).optional().or(z.literal("")),
  coLastName: z.string().trim().max(80).optional().or(z.literal("")),
  coEmail: z.string().trim().email("Please enter a valid email").max(255).optional().or(z.literal("")),
  coPhone: z.string().trim().max(40).optional().or(z.literal("")),
  coDateOfBirth: z.string().optional().or(z.literal("")),
  coEmploymentStatus: z.string().optional().or(z.literal("")),
  coEmployerName: z.string().trim().max(120).optional().or(z.literal("")),
  coJobTitle: z.string().trim().max(120).optional().or(z.literal("")),
  coAnnualIncome: z.string().trim().max(40).optional().or(z.literal("")),
  coAdditionalIncome: z.string().trim().max(120).optional().or(z.literal("")),
  coCreditScore: z.string().optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required to submit" }) }),
});

const schema = baseSchema.superRefine((data, ctx) => {
  if (data.hasCoApplicant === "Yes") {
    const required: Array<[keyof typeof data, string]> = [
      ["coFirstName", "Co-applicant first name is required"],
      ["coLastName", "Co-applicant last name is required"],
      ["coEmploymentStatus", "Co-applicant employment status is required"],
      ["coAnnualIncome", "Co-applicant annual income is required"],
    ];
    for (const [field, msg] of required) {
      if (!String(data[field] ?? "").trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: msg, path: [field] });
      }
    }
  }
});

type FormData = z.infer<typeof baseSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

const initialForm: FormData = {
  firstName: "", lastName: "", email: "", phone: "", cityProvince: "", dateOfBirth: "",
  employmentStatus: "", employerName: "", jobTitle: "", annualIncome: "", additionalIncome: "",
  purchasePrice: "", downPayment: "", propertyType: "", timeline: "", firstTimeBuyer: "",
  currentPayment: "", creditScore: "",
  hasCoApplicant: undefined as unknown as "Yes" | "No",
  coFirstName: "", coLastName: "", coEmail: "", coPhone: "", coDateOfBirth: "",
  coEmploymentStatus: "", coEmployerName: "", coJobTitle: "", coAnnualIncome: "",
  coAdditionalIncome: "", coCreditScore: "",
  notes: "", consent: false as unknown as true,
};

const selectClass =
  "w-full h-10 rounded-md border border-gold/20 bg-background px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2 appearance-none";

const PreApprovalSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [form, setForm] = useState<FormData>(initialForm);
  const [dob, setDob] = useState<Date>();
  const [coDob, setCoDob] = useState<Date>();
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && el.classList.add("animate-fade-up"),
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const update = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: FormData = {
      ...form,
      dateOfBirth: dob ? format(dob, "yyyy-MM-dd") : "",
      coDateOfBirth: coDob ? format(coDob, "yyyy-MM-dd") : "",
    };
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormData;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      toast({
        title: "Please review the form",
        description: "A few fields need your attention before I can submit your request.",
        variant: "destructive",
      });
      // scroll to first error
      const firstKey = Object.keys(fieldErrors)[0];
      if (firstKey) {
        const el = document.getElementById(`pa-${firstKey}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setSubmitting(true);
    try {
      const data = parsed.data;
      const { error: dbError } = await supabase.from("pre_approval_leads").insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        city_province: data.cityProvince || null,
        date_of_birth: data.dateOfBirth || null,
        employment_status: data.employmentStatus,
        employer_name: data.employerName || null,
        job_title: data.jobTitle || null,
        annual_income: data.annualIncome,
        additional_income: data.additionalIncome || null,
        purchase_price: data.purchasePrice || null,
        down_payment: data.downPayment || null,
        property_type: data.propertyType || null,
        timeline: data.timeline || null,
        first_time_buyer: data.firstTimeBuyer || null,
        current_payment: data.currentPayment || null,
        credit_score: data.creditScore || null,
        has_co_applicant: data.hasCoApplicant === "Yes",
        co_first_name: data.coFirstName || null,
        co_last_name: data.coLastName || null,
        co_email: data.coEmail || null,
        co_phone: data.coPhone || null,
        co_date_of_birth: data.coDateOfBirth || null,
        co_employment_status: data.coEmploymentStatus || null,
        co_employer_name: data.coEmployerName || null,
        co_job_title: data.coJobTitle || null,
        co_annual_income: data.coAnnualIncome || null,
        co_additional_income: data.coAdditionalIncome || null,
        co_credit_score: data.coCreditScore || null,
        notes: data.notes || null,
        consent: data.consent,
      });
      if (dbError) throw dbError;

      // Best-effort email notification — silently no-ops if not yet configured.
      try {
        await supabase.functions.invoke("send-pre-approval-lead", { body: { lead: data } });
      } catch {
        /* email pipeline not yet active — lead is safely stored in the database */
      }

      setSubmitted(true);
      setForm(initialForm);
      setDob(undefined);
      setCoDob(undefined);
      window.scrollTo({ top: ref.current?.offsetTop ?? 0, behavior: "smooth" });
    } catch (err) {
      console.error("Pre-approval submit failed", err);
      toast({
        title: "Something went wrong",
        description: "I couldn't submit your request. Please try again or call (705) 305-4449.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const ErrText = ({ id, msg }: { id: string; msg?: string }) =>
    msg ? (
      <p id={`${id}-error`} className="text-xs text-destructive mt-1">
        {msg}
      </p>
    ) : null;

  return (
    <section id="pre-approval" className="py-24 md:py-32 bg-warm-white">
      <div className="container">
        <div ref={ref} className="opacity-0">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">
              Get Pre-Approved
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal text-balance leading-tight mb-6">
              Mortgage <span className="gold-gradient-text">Pre-Approval</span> Questionnaire
            </h2>
            <p className="text-charcoal-light text-lg leading-relaxed">
              Share a few details and I'll personally review your situation to help you understand what you qualify for. All information is kept strictly confidential.
            </p>
          </div>

          {submitted ? (
            <div className="max-w-2xl mx-auto bg-background rounded-2xl p-10 md:p-14 shadow-lg shadow-gold/5 border border-gold/10 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-9 h-9 text-gold" />
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-4">
                Thank you — your request is in!
              </h3>
              <p className="text-charcoal-light leading-relaxed mb-6">
                I've received your pre-approval questionnaire and will personally review your details. Expect to hear from me within one business day to discuss your options and next steps.
              </p>
              <p className="text-charcoal-light text-sm mb-8">
                Need to reach me sooner?{" "}
                <a href="tel:+17053054449" className="text-gold font-medium hover:underline">(705) 305-4449</a>
                {" · "}
                <a href="mailto:elissa@artisanmortgages.ca" className="text-gold font-medium hover:underline">elissa@artisanmortgages.ca</a>
              </p>
              <Button variant="gold-outline" onClick={() => setSubmitted(false)}>
                Submit another request
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="max-w-3xl mx-auto bg-background rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg shadow-gold/5 border border-gold/10 space-y-10"
            >
              {/* Personal Information */}
              <fieldset className="space-y-5">
                <legend className="text-lg font-semibold text-charcoal border-b border-gold/10 pb-2 mb-2 w-full">
                  Personal Information
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="pa-firstName" className="text-charcoal text-sm">First Name <span className="text-gold">*</span></Label>
                    <Input id="pa-firstName" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="First name" className="border-gold/20 focus-visible:ring-gold/40" aria-invalid={!!errors.firstName} />
                    <ErrText id="pa-firstName" msg={errors.firstName} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pa-lastName" className="text-charcoal text-sm">Last Name <span className="text-gold">*</span></Label>
                    <Input id="pa-lastName" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="Last name" className="border-gold/20 focus-visible:ring-gold/40" aria-invalid={!!errors.lastName} />
                    <ErrText id="pa-lastName" msg={errors.lastName} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="pa-email" className="text-charcoal text-sm">Email <span className="text-gold">*</span></Label>
                    <Input id="pa-email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" className="border-gold/20 focus-visible:ring-gold/40" aria-invalid={!!errors.email} />
                    <ErrText id="pa-email" msg={errors.email} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pa-phone" className="text-charcoal text-sm">Phone <span className="text-gold">*</span></Label>
                    <Input id="pa-phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="(555) 123-4567" className="border-gold/20 focus-visible:ring-gold/40" aria-invalid={!!errors.phone} />
                    <ErrText id="pa-phone" msg={errors.phone} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="pa-cityProvince" className="text-charcoal text-sm">City / Province</Label>
                    <Input id="pa-cityProvince" value={form.cityProvince} onChange={(e) => update("cityProvince", e.target.value)} placeholder="e.g. Fort McMurray, AB" className="border-gold/20 focus-visible:ring-gold/40" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-charcoal text-sm">Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button type="button" variant="outline" className={cn("w-full justify-start text-left font-normal border-gold/20 hover:bg-gold/5", !dob && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dob ? format(dob, "yyyy-MM-dd") : <span>yyyy-mm-dd</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={dob} onSelect={setDob} disabled={(d) => d > new Date() || d < new Date("1940-01-01")} initialFocus className={cn("p-3 pointer-events-auto")} captionLayout="dropdown-buttons" fromYear={1940} toYear={new Date().getFullYear()} />
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
                    <Label htmlFor="pa-employmentStatus" className="text-charcoal text-sm">Employment Status <span className="text-gold">*</span></Label>
                    <select id="pa-employmentStatus" value={form.employmentStatus} onChange={(e) => update("employmentStatus", e.target.value)} className={selectClass} aria-invalid={!!errors.employmentStatus}>
                      <option value="">Select status</option>
                      {employmentOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ErrText id="pa-employmentStatus" msg={errors.employmentStatus} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pa-employerName" className="text-charcoal text-sm">Employer Name</Label>
                    <Input id="pa-employerName" value={form.employerName} onChange={(e) => update("employerName", e.target.value)} placeholder="Company name" className="border-gold/20 focus-visible:ring-gold/40" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="pa-jobTitle" className="text-charcoal text-sm">Job Title</Label>
                    <Input id="pa-jobTitle" value={form.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} placeholder="Your position" className="border-gold/20 focus-visible:ring-gold/40" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pa-annualIncome" className="text-charcoal text-sm">Annual Income (before tax) <span className="text-gold">*</span></Label>
                    <Input id="pa-annualIncome" value={form.annualIncome} onChange={(e) => update("annualIncome", e.target.value)} placeholder="e.g. $85,000" className="border-gold/20 focus-visible:ring-gold/40" aria-invalid={!!errors.annualIncome} />
                    <ErrText id="pa-annualIncome" msg={errors.annualIncome} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pa-additionalIncome" className="text-charcoal text-sm">Additional Income (if any)</Label>
                  <Input id="pa-additionalIncome" value={form.additionalIncome} onChange={(e) => update("additionalIncome", e.target.value)} placeholder="e.g. $12,000/yr rental income" className="border-gold/20 focus-visible:ring-gold/40" />
                </div>
              </fieldset>

              {/* Property & Mortgage Details */}
              <fieldset className="space-y-5">
                <legend className="text-lg font-semibold text-charcoal border-b border-gold/10 pb-2 mb-2 w-full">
                  Property &amp; Mortgage Details
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="pa-purchasePrice" className="text-charcoal text-sm">Estimated Purchase Price</Label>
                    <Input id="pa-purchasePrice" value={form.purchasePrice} onChange={(e) => update("purchasePrice", e.target.value)} placeholder="e.g. $450,000" className="border-gold/20 focus-visible:ring-gold/40" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pa-downPayment" className="text-charcoal text-sm">Down Payment Available</Label>
                    <Input id="pa-downPayment" value={form.downPayment} onChange={(e) => update("downPayment", e.target.value)} placeholder="e.g. $50,000" className="border-gold/20 focus-visible:ring-gold/40" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="pa-propertyType" className="text-charcoal text-sm">Property Type</Label>
                    <select id="pa-propertyType" value={form.propertyType} onChange={(e) => update("propertyType", e.target.value)} className={selectClass}>
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
                    <Label htmlFor="pa-firstTimeBuyer" className="text-charcoal text-sm">First-Time Home Buyer?</Label>
                    <select id="pa-firstTimeBuyer" value={form.firstTimeBuyer} onChange={(e) => update("firstTimeBuyer", e.target.value)} className={selectClass}>
                      <option value="">Select</option>
                      {firstTimeBuyerOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pa-currentPayment" className="text-charcoal text-sm">Current Rent / Mortgage Payment</Label>
                    <Input id="pa-currentPayment" value={form.currentPayment} onChange={(e) => update("currentPayment", e.target.value)} placeholder="e.g. $1,800/mo" className="border-gold/20 focus-visible:ring-gold/40" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pa-creditScore" className="text-charcoal text-sm">Estimated Credit Score</Label>
                  <select id="pa-creditScore" value={form.creditScore} onChange={(e) => update("creditScore", e.target.value)} className={selectClass}>
                    <option value="">Select range</option>
                    {creditScoreRanges.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </fieldset>

              {/* Co-Applicant question */}
              <fieldset className="space-y-3">
                <legend className="text-lg font-semibold text-charcoal border-b border-gold/10 pb-2 mb-2 w-full">
                  Co-Applicant
                </legend>
                <Label className="text-charcoal text-sm" id="pa-hasCoApplicant">
                  Will there be a co-applicant on this pre-approval? <span className="text-gold">*</span>
                </Label>
                <p className="text-charcoal-light text-xs">
                  If someone else's income will be used to qualify, include them here.
                </p>
                <RadioGroup
                  value={form.hasCoApplicant ?? ""}
                  onValueChange={(v) => update("hasCoApplicant", v as "Yes" | "No")}
                  className="flex gap-6 pt-1"
                  aria-labelledby="pa-hasCoApplicant"
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="Yes" id="pa-co-yes" className="border-gold/40 text-gold" />
                    <span className="text-sm text-charcoal">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="No" id="pa-co-no" className="border-gold/40 text-gold" />
                    <span className="text-sm text-charcoal">No</span>
                  </label>
                </RadioGroup>
                <ErrText id="pa-hasCoApplicant" msg={errors.hasCoApplicant} />
              </fieldset>

              {/* Co-Applicant fields (conditional) */}
              {form.hasCoApplicant === "Yes" && (
                <fieldset className="space-y-5 rounded-xl bg-warm-white/60 border border-gold/10 p-5 sm:p-6">
                  <legend className="px-2 text-base font-semibold text-charcoal">
                    Co-Applicant Information
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="pa-coFirstName" className="text-charcoal text-sm">First Name <span className="text-gold">*</span></Label>
                      <Input id="pa-coFirstName" value={form.coFirstName} onChange={(e) => update("coFirstName", e.target.value)} placeholder="First name" className="border-gold/20 focus-visible:ring-gold/40" aria-invalid={!!errors.coFirstName} />
                      <ErrText id="pa-coFirstName" msg={errors.coFirstName} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pa-coLastName" className="text-charcoal text-sm">Last Name <span className="text-gold">*</span></Label>
                      <Input id="pa-coLastName" value={form.coLastName} onChange={(e) => update("coLastName", e.target.value)} placeholder="Last name" className="border-gold/20 focus-visible:ring-gold/40" aria-invalid={!!errors.coLastName} />
                      <ErrText id="pa-coLastName" msg={errors.coLastName} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="pa-coEmail" className="text-charcoal text-sm">Email</Label>
                      <Input id="pa-coEmail" type="email" value={form.coEmail} onChange={(e) => update("coEmail", e.target.value)} placeholder="co@email.com" className="border-gold/20 focus-visible:ring-gold/40" aria-invalid={!!errors.coEmail} />
                      <ErrText id="pa-coEmail" msg={errors.coEmail} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pa-coPhone" className="text-charcoal text-sm">Phone</Label>
                      <Input id="pa-coPhone" type="tel" value={form.coPhone} onChange={(e) => update("coPhone", e.target.value)} placeholder="(555) 123-4567" className="border-gold/20 focus-visible:ring-gold/40" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-charcoal text-sm">Date of Birth</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button type="button" variant="outline" className={cn("w-full justify-start text-left font-normal border-gold/20 hover:bg-gold/5", !coDob && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {coDob ? format(coDob, "yyyy-MM-dd") : <span>yyyy-mm-dd</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={coDob} onSelect={setCoDob} disabled={(d) => d > new Date() || d < new Date("1940-01-01")} initialFocus className={cn("p-3 pointer-events-auto")} captionLayout="dropdown-buttons" fromYear={1940} toYear={new Date().getFullYear()} />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pa-coEmploymentStatus" className="text-charcoal text-sm">Employment Status <span className="text-gold">*</span></Label>
                      <select id="pa-coEmploymentStatus" value={form.coEmploymentStatus} onChange={(e) => update("coEmploymentStatus", e.target.value)} className={selectClass} aria-invalid={!!errors.coEmploymentStatus}>
                        <option value="">Select status</option>
                        {employmentOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <ErrText id="pa-coEmploymentStatus" msg={errors.coEmploymentStatus} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="pa-coEmployerName" className="text-charcoal text-sm">Employer Name</Label>
                      <Input id="pa-coEmployerName" value={form.coEmployerName} onChange={(e) => update("coEmployerName", e.target.value)} placeholder="Company name" className="border-gold/20 focus-visible:ring-gold/40" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pa-coJobTitle" className="text-charcoal text-sm">Job Title</Label>
                      <Input id="pa-coJobTitle" value={form.coJobTitle} onChange={(e) => update("coJobTitle", e.target.value)} placeholder="Their position" className="border-gold/20 focus-visible:ring-gold/40" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="pa-coAnnualIncome" className="text-charcoal text-sm">Annual Income (before tax) <span className="text-gold">*</span></Label>
                      <Input id="pa-coAnnualIncome" value={form.coAnnualIncome} onChange={(e) => update("coAnnualIncome", e.target.value)} placeholder="e.g. $65,000" className="border-gold/20 focus-visible:ring-gold/40" aria-invalid={!!errors.coAnnualIncome} />
                      <ErrText id="pa-coAnnualIncome" msg={errors.coAnnualIncome} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pa-coAdditionalIncome" className="text-charcoal text-sm">Additional Income (if any)</Label>
                      <Input id="pa-coAdditionalIncome" value={form.coAdditionalIncome} onChange={(e) => update("coAdditionalIncome", e.target.value)} placeholder="e.g. $8,000/yr" className="border-gold/20 focus-visible:ring-gold/40" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pa-coCreditScore" className="text-charcoal text-sm">Estimated Credit Score</Label>
                    <select id="pa-coCreditScore" value={form.coCreditScore} onChange={(e) => update("coCreditScore", e.target.value)} className={selectClass}>
                      <option value="">Select range</option>
                      {creditScoreRanges.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </fieldset>
              )}

              {/* Notes */}
              <div className="space-y-1.5">
                <Label htmlFor="pa-notes" className="text-charcoal text-sm">Anything else you'd like me to know?</Label>
                <Textarea id="pa-notes" value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Any additional details about your situation..." className="border-gold/20 focus-visible:ring-gold/40 min-h-[100px]" />
              </div>

              {/* Consent */}
              <div className="space-y-3 rounded-xl bg-warm-white/60 border border-gold/10 p-4 sm:p-5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    id="pa-consent"
                    checked={form.consent === true}
                    onCheckedChange={(v) => update("consent", (v === true) as unknown as true)}
                    className="mt-0.5 border-gold/40 data-[state=checked]:bg-gold data-[state=checked]:text-white"
                    aria-invalid={!!errors.consent}
                  />
                  <span className="text-sm text-charcoal leading-relaxed">
                    I consent to Elissa McQueen / Artisan Mortgages collecting and using the information I submit to respond to my mortgage inquiry and discuss mortgage options. I understand I can withdraw my consent at any time. <span className="text-gold">*</span>
                  </span>
                </label>
                <ErrText id="pa-consent" msg={errors.consent} />
                <p className="text-charcoal-light text-xs leading-relaxed">
                  Your information is kept confidential and used only for mortgage-related follow-up in accordance with our privacy practices.
                </p>
              </div>

              {/* Submit */}
              <div className="space-y-3">
                <Button type="submit" variant="gold" size="lg" disabled={submitting} className="w-full py-6 text-base">
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                  ) : (
                    "Submit Pre-Approval Request"
                  )}
                </Button>
                <p className="text-charcoal-light text-xs text-center leading-relaxed">
                  This is not a formal mortgage application. Elissa will review your details and reach out to discuss next steps.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default PreApprovalSection;
