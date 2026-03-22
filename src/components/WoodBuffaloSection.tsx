import { useRef, useEffect } from "react";
import { Heart, Trees, Users } from "lucide-react";
import landscapeImg from "@/assets/wood-buffalo-landscape.jpg";

const WoodBuffaloSection = () => {
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
    <section className="py-24 md:py-32 bg-background">
      <div className="container">
        <div ref={ref} className="opacity-0">
          <p className="text-gold font-medium tracking-widest uppercase text-sm mb-3 text-center">Our Community</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal text-balance leading-tight mb-6 text-center">
            Proudly Serving the <span className="gold-gradient-text">Wood Buffalo Region</span>
          </h2>
          <p className="text-charcoal-light text-lg leading-relaxed max-w-2xl mx-auto text-center mb-12">
            Fort McMurray isn't just where I work — it's home. With deep roots in the Wood Buffalo community, I understand the unique opportunities and challenges of buying a home in northern Alberta's most vibrant region.
          </p>

          {/* Landscape image */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl mb-12">
            <img
              src={landscapeImg}
              alt="Athabasca River winding through boreal forest at sunset — Wood Buffalo region, northern Alberta"
              className="w-full h-64 md:h-96 lg:h-[28rem] object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
              <p className="text-white font-display text-lg md:text-xl font-semibold drop-shadow-lg">
                The Athabasca River & Boreal Forest
              </p>
              <p className="text-white/80 text-sm drop-shadow-md">
                Wood Buffalo, Alberta
              </p>
            </div>
          </div>

          {/* Community highlights */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: "Community First", desc: "I believe in giving back. Supporting local families on their path to homeownership strengthens the entire region." },
              { icon: Trees, title: "Northern Living", desc: "From Thickwood to Timberlea, Abasand to Beacon Hill, Saprae Creek, Draper Road, and Gregoire Lake Estates — I know these neighbourhoods and what makes each one special." },
              { icon: Users, title: "Built on Trust", desc: "Word-of-mouth referrals are the backbone of my business. Your trust means everything, and I work hard to earn it every day." },
            ].map((item, i) => (
              <div
                key={item.title}
                className="bg-warm-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gold/10"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg gold-gradient flex items-center justify-center mb-5">
                  <item.icon size={22} className="text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-charcoal mb-3">{item.title}</h3>
                <p className="text-charcoal-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WoodBuffaloSection;
