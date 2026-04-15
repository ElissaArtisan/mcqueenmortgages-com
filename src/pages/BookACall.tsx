import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BookACall = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://bookings.nimbuspop.com/assets/embed.js";
    script.async = true;
    script.onload = () => {
      if ((window as any).Bookings && containerRef.current) {
        (window as any).Bookings.inlineEmbed({
          url: "https://artisanmortgages.zohobookings.ca/portal-embed#/1780000001052198",
          parent: "#zoho-inline-container",
          height: "600px",
        });
      }
    };
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <section className="min-h-screen bg-charcoal pt-28 pb-16 px-4">
        <div className="container max-w-3xl mx-auto text-center mb-10">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-background mb-4 leading-tight">
            Book a Phone Consultation
          </h1>
          <p className="text-background/70 text-lg md:text-xl max-w-xl mx-auto">
            Pick a time based on live calendar availability. We'll confirm automatically.
          </p>
        </div>
        <div className="container max-w-3xl mx-auto bg-background rounded-2xl shadow-2xl overflow-hidden">
          <div id="zoho-inline-container" ref={containerRef} />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default BookACall;
