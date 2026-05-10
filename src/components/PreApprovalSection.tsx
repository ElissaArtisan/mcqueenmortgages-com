import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, Loader2 } from "lucide-react";
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

const creditScoreRanges = [
  "Excellent 750+",
  "Good 700–749",
  "Fair 650–699",
  "Below 650",
  "Not sure",
];

const timelineOptions = [
  "Just exploring",
  "0–3 months",
  "3–6 months",
  "6–12 months",
];

const baseSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Last name is required").max(80),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(40),
  purchasePrice: z.string().trim().max(40).optional().or(z.literal("")),
  downPayment: z.string().trim().max(40).optional().or(z.literal("")),
  employmentStatus: z.string().min(1, "Please select your employment status"),
  annualIncome: z.string().trim().min(1, "Annual household income is required").max(40),
  creditScore: z.string().optional().or(z.literal("")),
  timeline: z.string().optional().or(z.literal("")),
  hasCoApplicant: z.enum(["Yes", "No"], { required_error: "Please let me know" }),
  coFirstName: z.string().trim().max(80).optional().or(z.literal("")),
  coLastName: z.string().trim().max(80).optional().or(z.literal("")),
  coEmail: z.string().trim().email("Please enter a valid email").max(255).optional().or(z.literal("")),
  coPhone: z.string().trim().max(40).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required to submit" }) }),
});

const schema = baseSchema.superRefine((data, ctx) => {
  if (data.hasCoApplicant === "Yes") {
    const required: Array<[keyof typeof data, string]> = [
      ["coFirstName", "Co-applicant first name is required"],
      ["coLastName", "Co-applicant last name is required"],
      ["coEmail", "Co-applicant email is required"],
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
  firstName: "", lastName: "", email: "", phone: "",
  purchasePrice: "", downPayment: "",
  employmentStatus: "", annualIncome: "", creditScore: "", timeline: "",
  hasCoApplicant: undefined as unknown as "Yes" | "No",
  coFirstName: "", coLastName: "", coEmail: "", coPhone: "",
  notes: "", consent: false as unknown as true,
};

const selectClass =
  "w-full h-11 rounded-md border border-gold/20 bg-background px-3 py-2 text-base text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2 appearance-none";

const inputClass = "h-11 border-gold/20 focus-visible:ring-gold/40 text-base";

const PreApprovalSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [form, setForm] = useState<FormData>(initialForm);
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
    const parsed = schema.safeParse(form);
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
        employment_status: data.employmentStatus,
        annual_income: data.annualIncome,
        purchase_price: data.purchasePrice || null,
        down_payment: data.downPayment || null,
        credit_score: data.creditScore || null,
        timeline: data.timeline || null,
        has_co_applicant: data.hasCoApplicant === "Yes",
        co_first_name: data.coFirstName || null,
        co_last_name: data.coLastName || null,
        co_email: data.coEmail || null,
        co_phone: data.coPhone || null,
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
      window.scrollTo({ top: ref.current?.offsetTop ?? 0, behavior: "smooth" });
    } catch (err) {
      console.error("Pre-qualification submit failed", err);
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
    <section id="pre-approval" className="py-20 md:py-28 bg-warm-white">
      <div className="container">
        <div ref={ref} className="opacity-0">
          <div className="max-w-xl mx-auto text-center mb-10">
            <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">
              Get Pre-Qualified
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal text-balance leading-tight mb-4">
              Quick <span className="gold-gradient-text">Pre-Qualification</span>
            </h2>
            <p className="text-charcoal-light text-base md:text-lg leading-relaxed">
              A few quick details and I'll personally reach out to discuss your options.
            </p>
          </div>

          {submitted ? (
            <div className="max-w-xl mx-auto bg-background rounded-2xl p-8 md:p-12 shadow-lg shadow-gold/5 border border-gold/10 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-9 h-9 text-gold" />
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-4">
                Thank you — your request is in!
              </h3>
              <p className="text-charcoal-light leading-relaxed mb-6">
                I've received your details and will personally follow up within one business day.
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
              className="max-w-xl mx-auto bg-background rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg shadow-gold/5 border border-gold/10 space-y-8"
            >
              {/* Contact Information */}
              <fieldset className="space-y-4">
                <legend className="text-base font-semibold text-charcoal border-b border-gold/10 pb-2 mb-2 w-full">
                  Contact Information
                </legend>
                <div className="space-y-1.5">
                  <Label htmlFor="pa-firstName" className="text-charcoal text-sm">First Name <span className="text-gold">*</span></Label>
                  <Input id="pa-firstName" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="First name" className={inputClass} aria-invalid={!!errors.firstName} />
                  <ErrText id="pa-firstName" msg={errors.firstName} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pa-lastName" className="text-charcoal text-sm">Last Name <span className="text-gold">*</span></Label>
                  <Input id="pa-lastName" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="Last name" className={inputClass} aria-invalid={!!errors.lastName} />
                  <ErrText id="pa-lastName" msg={errors.lastName} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pa-email" className="text-charcoal text-sm">Email <span className="text-gold">*</span></Label>
                  <Input id="pa-email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" className={inputClass} aria-invalid={!!errors.email} />
                  <ErrText id="pa-email" msg={errors.email} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pa-phone" className="text-charcoal text-sm">Phone <span className="text-gold">*</span></Label>
                  <Input id="pa-phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="(705) 305-4449" className={inputClass} aria-invalid={!!errors.phone} />
                  <ErrText id="pa-phone" msg={errors.phone} />
                </div>
              </fieldset>

              {/* Quick Qualification */}
              <fieldset className="space-y-4">
                <legend className="text-base font-semibold text-charcoal border-b border-gold/10 pb-2 mb-2 w-full">
                  Quick Qualification
                </legend>
                <div className="space-y-1.5">
                  <Label htmlFor="pa-purchasePrice" className="text-charcoal text-sm">Estimated Purchase Price</Label>
                  <Input id="pa-purchasePrice" inputMode="numeric" value={form.purchasePrice} onChange={(e) => update("purchasePrice", e.target.value)} placeholder="$450,000" className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pa-downPayment" className="text-charcoal text-sm">Down Payment Available</Label>
                  <Input id="pa-downPayment" inputMode="numeric" value={form.downPayment} onChange={(e) => update("downPayment", e.target.value)} placeholder="$45,000" className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pa-employmentStatus" className="text-charcoal text-sm">Employment Status <span className="text-gold">*</span></Label>
                  <select id="pa-employmentStatus" value={form.employmentStatus} onChange={(e) => update("employmentStatus", e.target.value)} className={selectClass} aria-invalid={!!errors.employmentStatus}>
                    <option value="">Select status</option>
                    {employmentOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ErrText id="pa-employmentStatus" msg={errors.employmentStatus} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pa-annualIncome" className="text-charcoal text-sm">Annual Household Income <span className="text-gold">*</span></Label>
                  <Input id="pa-annualIncome" inputMode="numeric" value={form.annualIncome} onChange={(e) => update("annualIncome", e.target.value)} placeholder="$95,000" className={inputClass} aria-invalid={!!errors.annualIncome} />
                  <ErrText id="pa-annualIncome" msg={errors.annualIncome} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pa-creditScore" className="text-charcoal text-sm">Estimated Credit Score</Label>
                  <select id="pa-creditScore" value={form.creditScore} onChange={(e) => update("creditScore", e.target.value)} className={selectClass}>
                    <option value="">Select range</option>
                    {creditScoreRanges.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pa-timeline" className="text-charcoal text-sm">Timeline</Label>
                  <select id="pa-timeline" value={form.timeline} onChange={(e) => update("timeline", e.target.value)} className={selectClass}>
                    <option value="">Select timeline</option>
                    {timelineOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </fieldset>

              {/* Co-applicant */}
              <fieldset className="space-y-4">
                <legend className="text-base font-semibold text-charcoal border-b border-gold/10 pb-2 mb-2 w-full">
                  Co-Applicant
                </legend>
                <div className="space-y-2">
                  <Label className="text-charcoal text-sm" id="pa-hasCoApplicant">
                    Will there be a co-applicant on this pre-qualification? <span className="text-gold">*</span>
                  </Label>
                  <RadioGroup
                    aria-labelledby="pa-hasCoApplicant"
                    value={form.hasCoApplicant ?? ""}
                    onValueChange={(v) => update("hasCoApplicant", v as "Yes" | "No")}
                    className="flex gap-6 pt-1"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="pa-co-yes" value="Yes" className="border-gold text-gold" />
                      <Label htmlFor="pa-co-yes" className="text-charcoal cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id="pa-co-no" value="No" className="border-gold text-gold" />
                      <Label htmlFor="pa-co-no" className="text-charcoal cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                  <ErrText id="pa-hasCoApplicant" msg={errors.hasCoApplicant} />
                </div>

                {form.hasCoApplicant === "Yes" && (
                  <div className="space-y-4 pt-2 border-t border-gold/10">
                    <p className="text-charcoal-light text-sm pt-3">
                      Co-Applicant Contact Information
                    </p>
                    <div className="space-y-1.5">
                      <Label htmlFor="pa-coFirstName" className="text-charcoal text-sm">Co-Applicant First Name <span className="text-gold">*</span></Label>
                      <Input id="pa-coFirstName" value={form.coFirstName} onChange={(e) => update("coFirstName", e.target.value)} placeholder="First name" className={inputClass} aria-invalid={!!errors.coFirstName} />
                      <ErrText id="pa-coFirstName" msg={errors.coFirstName} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pa-coLastName" className="text-charcoal text-sm">Co-Applicant Last Name <span className="text-gold">*</span></Label>
                      <Input id="pa-coLastName" value={form.coLastName} onChange={(e) => update("coLastName", e.target.value)} placeholder="Last name" className={inputClass} aria-invalid={!!errors.coLastName} />
                      <ErrText id="pa-coLastName" msg={errors.coLastName} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pa-coEmail" className="text-charcoal text-sm">Co-Applicant Email <span className="text-gold">*</span></Label>
                      <Input id="pa-coEmail" type="email" inputMode="email" value={form.coEmail} onChange={(e) => update("coEmail", e.target.value)} placeholder="coapplicant@email.com" className={inputClass} aria-invalid={!!errors.coEmail} />
                      <ErrText id="pa-coEmail" msg={errors.coEmail} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pa-coPhone" className="text-charcoal text-sm">Co-Applicant Phone</Label>
                      <Input id="pa-coPhone" type="tel" inputMode="tel" value={form.coPhone} onChange={(e) => update("coPhone", e.target.value)} placeholder="(705) 305-4449" className={inputClass} />
                    </div>
                  </div>
                )}
              </fieldset>

              {/* Notes */}
              <div className="space-y-1.5">
                <Label htmlFor="pa-notes" className="text-charcoal text-sm">Anything else you'd like me to know?</Label>
                <Textarea id="pa-notes" value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Optional — share any context that would help." className="border-gold/20 focus-visible:ring-gold/40 min-h-[100px]" />
              </div>

              {/* Consent */}
              <div className="space-y-3 pt-2 border-t border-gold/10">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="pa-consent"
                    checked={form.consent as unknown as boolean}
                    onCheckedChange={(v) => update("consent", (v === true) as unknown as true)}
                    className="mt-1 border-gold data-[state=checked]:bg-gold data-[state=checked]:text-primary-foreground"
                    aria-invalid={!!errors.consent}
                  />
                  <Label htmlFor="pa-consent" className="text-charcoal-light text-sm leading-relaxed cursor-pointer font-normal">
                    I consent to Elissa McQueen / Artisan Mortgages collecting and using the information I submit to respond to my mortgage inquiry and discuss mortgage options. I understand I can withdraw my consent at any time. <span className="text-gold">*</span>
                  </Label>
                </div>
                <ErrText id="pa-consent" msg={errors.consent} />
                <p className="text-xs text-charcoal-light/80 leading-relaxed">
                  Your information is kept confidential and used only for mortgage-related follow-up in accordance with our privacy practices.
                </p>
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                disabled={submitting}
                className="w-full h-12 text-base"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit Pre-Qualification Request"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default PreApprovalSection;
