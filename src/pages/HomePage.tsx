import Hero from "@/components/Hero";
import FeaturedDishes from "@/components/FeaturedDishes";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, CalendarDays, UtensilsCrossed } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import cateringHero from "@/assets/catering-hero.jpg";
import gastrobox1 from "@/assets/gastrobox-1.jpg";

const HomePage = () => {
  const { t } = useLanguage();
  const services = [
    { icon: UtensilsCrossed, titleKey: "home.catering", descKey: "home.cateringDesc", link: "/catering", image: cateringHero },
    { icon: Truck, titleKey: "home.gastroBoxes", descKey: "home.gastroBoxesDesc", link: "/gastro-boxes", image: gastrobox1 },
    { icon: CalendarDays, titleKey: "home.reservations", descKey: "home.reservationsDesc", link: "/reservations", image: null },
  ];
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedDishes />
      <AboutSection />

      {/* Services strip */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary">{t("home.services")}</p>
            <h2 className="mt-3 font-display text-4xl font-light text-foreground md:text-6xl">
              {t("home.beyondRestaurant").split(" ").slice(0, -1).join(" ")}{" "}
              <span className="italic font-semibold">{t("home.beyondRestaurant").split(" ").slice(-1)}</span>
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {services.map((service, i) => (
              <motion.div
                key={service.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <Link
                  to={service.link}
                  className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:shadow-luxury hover:-translate-y-1"
                >
                  {service.image && (
                    <div className="overflow-hidden">
                      <img
                        src={service.image}
                        alt={t(service.titleKey)}
                        className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <service.icon size={24} className="text-primary" />
                    <h3 className="mt-3 font-display text-xl font-semibold text-foreground">{t(service.titleKey)}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{t(service.descKey)}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors group-hover:gap-2">
                      {t("home.explore")} <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-gold opacity-90" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-4xl font-light text-white md:text-6xl">
              {t("home.ctaTitle").split(" ").slice(0, -2).join(" ")}{" "}
              <span className="italic font-semibold">{t("home.ctaTitle").split(" ").slice(-2, -1)}</span>{" "}
              {t("home.ctaTitle").split(" ").slice(-1)}?
            </h2>
            <p className="mt-4 text-base text-white/80">{t("home.ctaSubtitle")}</p>
            <Link
              to="/reservations"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-foreground shadow-luxury transition-all hover:shadow-lg hover:scale-[1.02]"
            >
              <CalendarDays size={18} />
              {t("home.reserveNow")}
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
