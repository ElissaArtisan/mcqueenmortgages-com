import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-charcoal text-background/70 py-16">
    <div className="container">
      <div className="grid md:grid-cols-3 gap-12 mb-12">
        <div>
          <a href="#home" className="font-display text-2xl font-bold text-background mb-4 block">
            Artisan<span className="text-gold"> Mortgages</span>
          </a>
          <p className="text-sm leading-relaxed text-background/50">
            Crafting personalized mortgage solutions for Fort McMurray and the Wood Buffalo region.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold text-background mb-4">Contact</h4>
          <div className="flex flex-col gap-3 text-sm">
            <a href="tel:+17053054449" className="flex items-center gap-3 hover:text-gold transition-colors">
              <Phone size={16} className="text-gold" /> (705) 305-4449
            </a>
            <a href="mailto:hello@artisanmortgages.ca" className="flex items-center gap-3 hover:text-gold transition-colors">
              <Mail size={16} className="text-gold" /> hello@artisanmortgages.ca
            </a>
            <span className="flex items-center gap-3">
              <MapPin size={16} className="text-gold" /> Fort McMurray, Alberta, Canada
            </span>
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold text-background mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm">
            {["About", "Services", "Calculator", "Contact"].map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-gold transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-background/10 pt-8">
        <p className="text-xs text-background/40 text-center max-w-3xl mx-auto leading-relaxed">
          Elissa McQueen is licensed through the Real Estate Council of Alberta (RECA). Mortgage brokering in Alberta is regulated under the Real Estate Act. All mortgage products and rates are subject to qualification and approval. This website is for informational purposes only and does not constitute financial advice.
        </p>
        <p className="text-xs text-background/30 text-center mt-4">
          © {new Date().getFullYear()} Artisan Mortgages. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
