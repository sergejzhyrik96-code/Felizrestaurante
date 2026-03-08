import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const footerLinks = [
  { labelKey: "nav.menu", path: "/menu" },
  { labelKey: "nav.gastroBoxes", path: "/gastro-boxes" },
  { labelKey: "nav.catering", path: "/catering" },
  { labelKey: "nav.gallery", path: "/gallery" },
  { labelKey: "nav.reservations", path: "/reservations" },
];

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-secondary py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <h3 className="font-display text-2xl font-bold text-foreground">FELIZ</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("footer.tagline")}</p>
            <div className="mt-4 flex gap-3">
              <a href="#" className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="#" className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary" aria-label="Facebook">
                <Facebook size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">{t("footer.navigate")}</h4>
            <div className="mt-3 flex flex-col gap-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t(link.labelKey)}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">{t("footer.hours")}</h4>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p>{t("footer.hoursWeek")}</p>
              <p>{t("footer.hoursWeekend")}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">{t("footer.contact")}</h4>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin size={14} /> {t("footer.address")}
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} /> <a href="tel:961181824">961 181 824</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} /> hola@felizvalencia.com
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} FELIZ Valencia. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
