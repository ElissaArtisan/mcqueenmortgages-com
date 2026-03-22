import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

const CalculatorSection = () => {
  const [homePrice, setHomePrice] = useState(500000);
  const [downPayment, setDownPayment] = useState(100000);
  const [rate, setRate] = useState(5.5);
  const [amortization, setAmortization] = useState(25);
  const [monthly, setMonthly] = useState<number | null>(null);

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

  const calculate = () => {
    const principal = homePrice - downPayment;
    if (principal <= 0) { setMonthly(0); return; }
    const monthlyRate = rate / 100 / 12;
    const n = amortization * 12;
    if (monthlyRate === 0) { setMonthly(principal / n); return; }
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    setMonthly(payment);
  };

  const inputClass = "w-full rounded-lg border border-gold/20 bg-background px-4 py-3 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all duration-200";
  const labelClass = "block text-sm font-medium text-charcoal mb-1.5";

  return (
    <section id="calculator" className="py-24 md:py-32 bg-warm-white">
      <div className="container">
        <div ref={ref} className="opacity-0">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">Mortgage Calculator</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal text-balance leading-tight mb-6">
              Estimate Your <span className="gold-gradient-text">Monthly Payment</span>
            </h2>
          </div>
          <div className="max-w-xl mx-auto bg-background rounded-2xl p-8 md:p-10 shadow-lg shadow-gold/5 border border-gold/10">
            <div className="grid sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label className={labelClass}>Home Price ($)</label>
                <input type="number" className={inputClass} value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value))} min={0} />
              </div>
              <div>
                <label className={labelClass}>Down Payment ($)</label>
                <input type="number" className={inputClass} value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} min={0} />
              </div>
              <div>
                <label className={labelClass}>Interest Rate (%)</label>
                <input type="number" className={inputClass} value={rate} onChange={(e) => setRate(Number(e.target.value))} min={0} step={0.1} />
              </div>
              <div>
                <label className={labelClass}>Amortization (years)</label>
                <select className={inputClass} value={amortization} onChange={(e) => setAmortization(Number(e.target.value))}>
                  {[10, 15, 20, 25, 30].map((y) => (
                    <option key={y} value={y}>{y} years</option>
                  ))}
                </select>
              </div>
            </div>
            <Button variant="gold" className="w-full py-6 text-base" onClick={calculate}>
              <Calculator size={18} className="mr-2" />
              Calculate Payment
            </Button>
            {monthly !== null && (
              <div className="mt-6 text-center p-6 rounded-xl bg-gold-light border border-gold/20 animate-fade-in">
                <p className="text-sm text-charcoal-light mb-1">Estimated Monthly Payment</p>
                <p className="font-display text-4xl font-bold gold-gradient-text tabular-nums">
                  ${monthly.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground mt-2">*Estimate only. Actual payments may vary.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorSection;
