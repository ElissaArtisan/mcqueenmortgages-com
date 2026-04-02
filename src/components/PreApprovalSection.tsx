import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

const PreApprovalSection = () => {
  const ref = useRef<HTMLDivElement>(null);

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

  const steps = [
    { number: "1", text: 'Click the "Start Now" button below.' },
    { number: "2", text: "A new tab will open to create an account with me." },
    { number: "3", text: "Fill out the form!" },
  ];

  return (
    <section id="pre-approval" className="py-24 md:py-32 bg-warm-white">
      <div className="container">
        <div ref={ref} className="opacity-0">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">Get Pre-Approved</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal text-balance leading-tight mb-6">
              Start Your <span className="gold-gradient-text">Pre-Approval</span> Here
            </h2>
            <p className="text-charcoal-light text-lg leading-relaxed">
              All information provided is strictly confidential.
            </p>
          </div>

          {/* Steps */}
          <div className="max-w-2xl mx-auto bg-background rounded-2xl p-8 md:p-10 shadow-lg shadow-gold/5 border border-gold/10 space-y-8">
            <div className="space-y-5">
              {steps.map((step) => (
                <div key={step.number} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-gold font-bold text-sm">{step.number}</span>
                  </div>
                  <p className="text-charcoal text-base md:text-lg leading-relaxed pt-1">{step.text}</p>
                </div>
              ))}
            </div>

            <p className="text-charcoal-light text-sm leading-relaxed border-t border-gold/10 pt-6">
              At this point I will review your information and request documentation to be shared through our secure portal. Once all documents are collected, I can start matching your mortgage goals with one of our hundreds of lenders.
            </p>

            <Button variant="gold" size="lg" className="w-full py-6 text-base" asChild>
              <a href="https://r.mtg-app.com/elissamcqueen" target="_blank" rel="noopener noreferrer">
                Start Now!
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreApprovalSection;
