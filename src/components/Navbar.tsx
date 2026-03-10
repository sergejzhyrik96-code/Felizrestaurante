import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/contexts/LanguageContext";
import { useReservationModal } from "@/components/ReservationModal";

const navLinks = [
  { labelKey: "nav.home", path: "/" },
  { labelKey: "nav.menu", path: "/menu" },
  { labelKey: "nav.gastroBoxes", path: "/gastro-boxes" },
  { labelKey: "nav.catering", path: "/catering" },
  { labelKey: "nav.gallery", path: "/gallery" },
  { labelKey: "nav.reservations", path: "/reservations" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();
  const { t, locale, setLocale } = useLanguage();
  const { openReservationModal } = useReservationModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const isHome = location.pathname === "/";
  const navBg = scrolled || !isHome;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          navBg
            ? "glass shadow-luxury"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className={`font-display text-2xl font-bold tracking-wide transition-colors duration-300 ${
              navBg ? "text-foreground" : "text-white"
            }`}>
              FELIZ
            </span>
            <span className={`hidden text-xs font-light tracking-[0.3em] uppercase sm:block transition-colors duration-300 ${
              navBg ? "text-muted-foreground" : "text-white/70"
            }`}>
              Valencia
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) =>
              link.path === "/reservations" ? (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => { openReservationModal(); }}
                  className={`relative text-sm font-medium tracking-wide transition-colors duration-300 ${
                    navBg ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"
                  }`}
                >
                  {t(link.labelKey)}
                </button>
              ) : (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium tracking-wide transition-colors duration-300 ${
                  location.pathname === link.path
                    ? navBg ? "text-primary" : "text-white"
                    : navBg ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"
                }`}
              >
                {t(link.labelKey)}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            ))}
            <div className="flex items-center gap-1 rounded-full border border-border bg-secondary/80 px-1 py-0.5">
              <button
                type="button"
                onClick={() => setLocale("es")}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${locale === "es" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${locale === "en" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLocale("ru")}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${locale === "ru" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
              >
                RU
              </button>
            </div>
            <Link to="/cart" className="relative">
              <ShoppingCart size={20} className={`transition-colors ${navBg ? "text-foreground" : "text-white"}`} />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-4 lg:hidden">
            <div className="flex items-center gap-1 rounded-full border border-border bg-secondary/80 px-1 py-0.5">
              <button
                type="button"
                onClick={() => setLocale("es")}
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${locale === "es" ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${locale === "en" ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLocale("ru")}
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${locale === "ru" ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                RU
              </button>
            </div>
            <Link to="/cart" className="relative">
              <ShoppingCart size={20} className={`transition-colors ${navBg ? "text-foreground" : "text-white"}`} />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? (
                <X size={24} className={navBg ? "text-foreground" : "text-white"} />
              ) : (
                <Menu size={24} className={navBg ? "text-foreground" : "text-white"} />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-background/98 backdrop-blur-2xl lg:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                {link.path === "/reservations" ? (
                  <button
                    type="button"
                    onClick={() => { setMobileOpen(false); openReservationModal(); }}
                    className="font-display text-3xl font-medium tracking-wide transition-colors text-foreground"
                  >
                    {t(link.labelKey)}
                  </button>
                ) : (
                  <Link
                    to={link.path}
                    className={`font-display text-3xl font-medium tracking-wide transition-colors ${
                      location.pathname === link.path ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {t(link.labelKey)}
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
