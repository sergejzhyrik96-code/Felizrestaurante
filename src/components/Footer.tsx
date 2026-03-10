import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook, MapPinned, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useReservationModal } from "@/components/ReservationModal";
import { getRestaurantCallUrl, RESTAURANT_PHONE_DISPLAY } from "@/lib/notifications";

const FACEBOOK_URL = "https://www.facebook.com/felizrestaurante";
const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Restaurante+Feliz+Centro/@39.4685146,-0.3836778,19z/data=!4m6!3m5!1s0xd604f267520ed19:0x5ed966b64d52c8d2!8m2!3d39.4685146!4d-0.3830341!16s%2Fg%2F11y21nw94n?entry=ttu";
const GOOGLE_REVIEW_URL = "https://www.google.com/maps/place/Restaurante+Feliz+Centro/@39.4685146,-0.3836778,19z/data=!4m8!3m7!1s0xd604f267520ed19:0x5ed966b64d52c8d2!8m2!3d39.4685146!4d-0.3830341!9m1!1b1!16s%2Fg%2F11y21nw94n?entry=ttu";

const footerLinks = [
  { labelKey: "nav.home", path: "/" },
  { labelKey: "nav.menu", path: "/menu" },
  { labelKey: "nav.gastroBoxes", path: "/gastro-boxes" },
  { labelKey: "nav.catering", path: "/catering" },
  { labelKey: "nav.gallery", path: "/gallery" },
  { labelKey: "nav.reservations", path: "/reservations" },
];

const Footer = () => {
  const { t } = useLanguage();
  const { openReservationModal } = useReservationModal();

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
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary" aria-label="Facebook">
                <Facebook size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">{t("footer.navigate")}</h4>
            <div className="mt-3 flex flex-col gap-2">
              {footerLinks.map((link) =>
                link.path === "/reservations" ? (
                  <button
                    key={link.path}
                    type="button"
                    onClick={openReservationModal}
                    className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t(link.labelKey)}
                  </button>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t(link.labelKey)}
                  </Link>
                )
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">{t("footer.hours")}</h4>
            <div className="mt-3 text-sm text-muted-foreground">
              <p>{t("footer.hoursAll")}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">{t("footer.contact")}</h4>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin size={14} /> {t("footer.address")}
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} /> <a href={getRestaurantCallUrl()} className="transition-colors hover:text-foreground">{RESTAURANT_PHONE_DISPLAY}</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} /> <a href="mailto:hola@felizvalencia.com" className="transition-colors hover:text-foreground">hola@felizvalencia.com</a>
              </p>
              <p className="flex items-center gap-2">
                <MapPinned size={14} />
                <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">
                  {t("footer.googleMaps")}
                </a>
              </p>
            </div>
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[hsl(42_70%_55%/0.2)] px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-[hsl(42_70%_55%/0.3)] hover:shadow-md"
            >
              <Star size={16} className="fill-[hsl(var(--gold))] text-[hsl(var(--gold))]" />
              {t("footer.leaveReview")}
            </a>
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
