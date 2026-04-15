import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const CONSULTATION_OPTIONS = [
  {
    value: "phone-15",
    label: "Phone Meeting - 15 min",
    url: "https://artisanmortgages.zohobookings.ca/portal-embed#/1780000001052198",
  },
  {
    value: "phone-60",
    label: "Phone Meeting - 1 Hour",
    url: "https://artisanmortgages.zohobookings.ca/portal-embed#/1780000001052162",
  },
  {
    value: "online-30",
    label: "Online Meet & Greet - 30 min",
    url: "https://artisanmortgages.zohobookings.ca/portal-embed#/1780000001052236",
  },
];

const BookACall = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(CONSULTATION_OPTIONS[0].value);
  const scriptLoadedRef = useRef(false);

  const selectedUrl = CONSULTATION_OPTIONS.find((o) => o.value === selected)!.url;

  useEffect(() => {
    const loadScript = () => {
      return new Promise<void>((resolve) => {
        if (scriptLoadedRef.current) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = "https://bookings.nimbuspop.com/assets/embed.js";
        script.async = true;
        script.onload = () => {
          scriptLoadedRef.current = true;
          resolve();
        };
        document.body.appendChild(script);
      });
    };

    loadScript().then(() => {
      if ((window as any).Bookings && containerRef.current) {
        containerRef.current.innerHTML = "";
        const embedDiv = document.createElement("div");
        embedDiv.id = "zoho-inline-container";
        containerRef.current.appendChild(embedDiv);

        (window as any).Bookings.inlineEmbed({
          url: selectedUrl,
          parent: "#zoho-inline-container",
          height: "600px",
        });
      }
    });
  }, [selectedUrl]);

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

        <div className="container max-w-3xl mx-auto mb-6">
          <Label className="text-background/80 text-sm font-medium mb-2 block">
            Select Consultation Type
          </Label>
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger className="w-full sm:w-80 bg-charcoal border-gold/40 text-background hover:border-gold focus:ring-gold/30 h-12 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-charcoal border-gold/40 text-background">
              {CONSULTATION_OPTIONS.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="text-background focus:bg-gold/20 focus:text-background"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="container max-w-3xl mx-auto bg-background rounded-2xl shadow-2xl overflow-hidden">
          <div ref={containerRef} />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default BookACall;
