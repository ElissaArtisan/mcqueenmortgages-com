import { useRef, useEffect } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah & Mark Olsen",
    role: "First-Time Buyers, Windermere",
    text: "Artisan Mortgages made our first home purchase feel effortless. They found us a rate we didn't think was possible and walked us through every step with patience and professionalism.",
    stars: 5,
  },
  {
    name: "Raj Patel",
    role: "Investment Property Owner",
    text: "I've worked with several brokers over the years, but the personalized attention I received here was unmatched. They structured my investment financing perfectly for my portfolio goals.",
    stars: 5,
  },
  {
    name: "Christine Larouche",
    role: "Self-Employed, Sherwood Park",
    text: "As a self-employed professional, I was told 'no' by my bank. Artisan found me a fantastic lender and made the entire process stress-free. I can't recommend them enough.",
    stars: 5,
  },
];

const TestimonialsSection = () => {
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

  return (
    <section id="testimonials" className="py-24 md:py-32">
      <div className="container">
        <div ref={ref} className="opacity-0">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3">Testimonials</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal text-balance leading-tight mb-6">
              What Our Clients <span className="gold-gradient-text">Are Saying</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="rounded-xl p-8 border border-gold/10 bg-background hover:shadow-lg hover:shadow-gold/5 transition-all duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star key={si} size={16} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-charcoal-light leading-relaxed mb-6 text-sm italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    {t.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
