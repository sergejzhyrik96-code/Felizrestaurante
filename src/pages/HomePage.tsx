import Hero from "@/components/Hero";
import FeaturedDishes from "@/components/FeaturedDishes";
import AboutSection from "@/components/AboutSection";
import AtmosphereSection from "@/components/AtmosphereSection";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, CalendarDays, UtensilsCrossed } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import cateringHero from "@/assets/catering-hero.jpg";

const GASTROBOX_IMAGE = "/images/gastroboxes/Box Tres Sabores.jpeg";

const HomePage = () => {
  const { t } = useLanguage();
  const services = [
    { icon: UtensilsCrossed, titleKey: "home.catering", descKey: "home.cateringDesc", link: "/catering", image: cateringHero },
    { icon: Truck, titleKey: "home.gastroBoxes", descKey: "home.gastroBoxesDesc", link: "/gastro-boxes", image: GASTROBOX_IMAGE },
    { icon: CalendarDays, titleKey: "home.reservations", descKey: "home.reservationsDesc", link: "/reservations", image: null },
  ];
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedDishes />

      {/* Services strip - Eventos y celebraciones */}
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

      <AtmosphereSection />

      <AboutSection />

      {/* CTA - premium floating card */}
      <section id="reservations-cta" className="scroll-mt-24 px-6 pt-[120px] pb-[120px]">
        <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[28px] bg-gradient-gold py-12 px-6 shadow-luxury md:py-[80px] md:px-[60px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="font-display text-4xl font-light text-white md:text-5xl lg:text-6xl">
              {t("home.ctaTitle").split(" ").slice(0, -2).join(" ")}{" "}
              <span className="italic font-semibold">{t("home.ctaTitle").split(" ").slice(-2, -1)}</span>{" "}
              {t("home.ctaTitle").split(" ").slice(-1)}?
            </h2>
            <p className="mt-4 text-base text-white/70 md:text-lg">
              {t("home.ctaSubtitle")}
            </p>
            <Link
              to="/reservations"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-foreground shadow-luxury transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
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
