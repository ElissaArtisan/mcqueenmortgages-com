import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

const fmt = (n: number) =>
  n.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtPct = (n: number) =>
  n.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%";

function getCmhcRate(ltv: number): number {
  if (ltv <= 0.65) return 0.006;
  if (ltv <= 0.75) return 0.017;
  if (ltv <= 0.80) return 0.024;
  if (ltv <= 0.85) return 0.028;
  if (ltv <= 0.90) return 0.031;
  return 0.04;
}

function calcPayment(principal: number, annualRate: number, amortYears: number): number {
  if (principal <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = amortYears * 12;
  if (r === 0) return principal / n;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

interface Results {
  homePrice: number;
  downPayment: number;
  downPct: number;
  baseMortgage: number;
  isHighRatio: boolean;
  cmhcRate: number;
  cmhcPremium: number;
  totalMortgage: number;
  contractRate: number;
  monthlyPayment: number;
  qualifyingRate: number;
  stressPayment: number;
}

const CalculatorSection = () => {
  const [homePrice, setHomePrice] = useState(500000);
  const [downPayment, setDownPayment] = useState(100000);
  const [rate, setRate] = useState(5.5);
  const [amortization, setAmortization] = useState(25);
  const [results, setResults] = useState<Results | null>(null);

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
    const baseMortgage = homePrice - downPayment;
    const downPct = homePrice > 0 ? downPayment / homePrice : 0;
    const ltv = homePrice > 0 ? baseMortgage / homePrice : 0;
    const isHighRatio = downPct < 0.2 && homePrice < 1500000;

    let cmhcRate = 0;
    let cmhcPremium = 0;
    if (isHighRatio && baseMortgage > 0) {
      cmhcRate = getCmhcRate(ltv);
      cmhcPremium = baseMortgage * cmhcRate;
    }

    const totalMortgage = baseMortgage + cmhcPremium;
    const monthlyPayment = calcPayment(totalMortgage, rate, amortization);
    const qualifyingRate = Math.max(rate + 2, 5.25);
    const stressPayment = calcPayment(totalMortgage, qualifyingRate, amortization);

    setResults({
      homePrice,
      downPayment,
      downPct: downPct * 100,
      baseMortgage,
      isHighRatio,
      cmhcRate: cmhcRate * 100,
      cmhcPremium,
      totalMortgage,
      contractRate: rate,
      monthlyPayment,
      qualifyingRate,
      stressPayment,
    });
  };

  const inputClass =
    "w-full rounded-lg border border-gold/20 bg-background px-4 py-3 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all duration-200";
  const labelClass = "block text-sm font-medium text-charcoal mb-1.5";

  return (
    <section id="calculator" className="py-24 md:py-32 bg-warm-white">
      <div className="container">
        <div ref={ref} className="opacity-0">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">
              Mortgage Calculator
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal text-balance leading-tight mb-6">
              Estimate Your <span className="gold-gradient-text">Monthly Payment</span>
            </h2>
          </div>

          <div className="max-w-2xl mx-auto bg-background rounded-2xl p-8 md:p-10 shadow-lg shadow-gold/5 border border-gold/10">
            <div className="grid sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label className={labelClass}>Home Price ($)</label>
                <input
                  type="number"
                  className={inputClass}
                  value={homePrice}
                  onChange={(e) => setHomePrice(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div>
                <label className={labelClass}>Down Payment ($)</label>
                <input
                  type="number"
                  className={inputClass}
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div>
                <label className={labelClass}>Interest Rate (%)</label>
                <input
                  type="number"
                  className={inputClass}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  min={0}
                  step={0.1}
                />
              </div>
              <div>
                <label className={labelClass}>Amortization (years)</label>
                <select
                  className={inputClass}
                  value={amortization}
                  onChange={(e) => setAmortization(Number(e.target.value))}
                >
                  {[10, 15, 20, 25, 30].map((y) => (
                    <option key={y} value={y}>
                      {y} years
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button variant="gold" className="w-full py-6 text-base" onClick={calculate}>
              <Calculator size={18} className="mr-2" />
              Calculate Payment
            </Button>

            {results && (
              <div className="mt-8 animate-fade-in">
                {/* Mortgage Details */}
                <div className="rounded-xl border border-gold/15 overflow-hidden">
                  <div className="bg-charcoal px-5 py-3">
                    <h3 className="text-sm font-semibold text-primary-foreground tracking-wide uppercase">
                      Mortgage Summary
                    </h3>
                  </div>
                  <div className="divide-y divide-gold/10">
                    <Row label="Home Price" value={`$${fmt(results.homePrice)}`} />
                    <Row
                      label="Down Payment"
                      value={`$${fmt(results.downPayment)} (${fmtPct(results.downPct)})`}
                    />
                    <Row label="Base Mortgage" value={`$${fmt(results.baseMortgage)}`} />
                    <Row
                      label="Mortgage Type"
                      value={results.isHighRatio ? "High-Ratio Insured" : "Conventional"}
                      highlight={results.isHighRatio}
                    />
                    <Row label="CMHC Premium Rate" value={fmtPct(results.cmhcRate)} />
                    <Row label="CMHC Premium" value={`$${fmt(results.cmhcPremium)}`} />
                    <Row
                      label="Total Mortgage (incl. insurance)"
                      value={`$${fmt(results.totalMortgage)}`}
                      bold
                    />
                  </div>
                </div>

                {/* Payment Details */}
                <div className="rounded-xl border border-gold/15 overflow-hidden mt-4">
                  <div className="bg-charcoal px-5 py-3">
                    <h3 className="text-sm font-semibold text-primary-foreground tracking-wide uppercase">
                      Payment Breakdown
                    </h3>
                  </div>
                  <div className="divide-y divide-gold/10">
                    <Row label="Contract Rate" value={fmtPct(results.contractRate)} />
                    <Row
                      label="Monthly Payment"
                      value={`$${fmt(results.monthlyPayment)}`}
                      bold
                      accent
                    />
                    <Row label="Qualifying Rate (Stress Test)" value={fmtPct(results.qualifyingRate)} />
                    <Row
                      label="Stress Test Payment"
                      value={`$${fmt(results.stressPayment)}`}
                      bold
                    />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-5 text-center leading-relaxed max-w-lg mx-auto">
                  This calculator is for illustrative purposes only. Qualification depends on income,
                  debts, lender guidelines, and full application review.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const Row = ({
  label,
  value,
  bold,
  accent,
  highlight,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: boolean;
  highlight?: boolean;
}) => (
  <div className="flex items-center justify-between px-5 py-3">
    <span className="text-sm text-charcoal-light">{label}</span>
    <span
      className={`text-sm tabular-nums ${bold ? "font-semibold" : ""} ${
        accent ? "gold-gradient-text text-base font-bold" : "text-charcoal"
      } ${highlight ? "text-gold font-medium" : ""}`}
    >
      {value}
    </span>
  </div>
);

export default CalculatorSection;
