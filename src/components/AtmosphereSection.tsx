import { motion } from "framer-motion";
import { ArrowRight, CalendarDays } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ATMOSPHERE_IMAGES = {
  main: "/images/hero-foto/Ambiente.png",
  secondary1: "/images/hero-foto/Ambiente2.png",
  secondary2: "/images/hero-foto/ambiente3.png",
};

const AtmosphereSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Images - Desktop: one large + two overlapping; Mobile: stacked */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            {/* Mobile: vertical stack */}
            <div className="flex flex-col gap-6 lg:hidden">
              <img
                src={ATMOSPHERE_IMAGES.main}
                alt="FELIZ Valencia restaurant interior"
                loading="lazy"
                className="w-full rounded-2xl shadow-luxury object-cover aspect-[4/3]"
              />
              <img
                src={ATMOSPHERE_IMAGES.secondary1}
                alt="FELIZ Valencia restaurant atmosphere"
                loading="lazy"
                className="w-full rounded-2xl shadow-luxury object-cover aspect-[4/3]"
              />
              <img
                src={ATMOSPHERE_IMAGES.secondary2}
                alt="FELIZ Valencia dining room"
                loading="lazy"
                className="w-full rounded-2xl shadow-luxury object-cover aspect-[4/3]"
              />
            </div>
            {/* Desktop: one large + two smaller overlapping */}
            <div className="relative hidden lg:block">
              <img
                src={ATMOSPHERE_IMAGES.main}
                alt="FELIZ Valencia restaurant interior"
                loading="lazy"
                className="w-full rounded-2xl shadow-luxury object-cover aspect-[4/3]"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute -bottom-8 -right-4 w-48 md:w-64"
              >
                <img
                  src={ATMOSPHERE_IMAGES.secondary1}
                  alt="FELIZ Valencia restaurant atmosphere"
                  loading="lazy"
                  className="rounded-2xl shadow-luxury object-cover aspect-square border-4 border-background"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -bottom-8 -left-4 w-40 md:w-52"
              >
                <img
                  src={ATMOSPHERE_IMAGES.secondary2}
                  alt="FELIZ Valencia dining room"
                  loading="lazy"
                  className="rounded-2xl shadow-luxury object-cover aspect-square border-4 border-background"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary">
              {t("atmosphere.subtitle")}
            </p>
            <h2 className="mt-3 font-display text-4xl font-light text-foreground md:text-5xl">
              {t("atmosphere.title")}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              {t("atmosphere.paragraph1")}
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {t("atmosphere.paragraph2")}
            </p>
            <a
              href="#reservations-cta"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("reservations-cta")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-8 py-4 text-sm font-semibold text-white shadow-glow transition-all hover:shadow-lg hover:scale-[1.02]"
            >
              <CalendarDays size={18} />
              {t("atmosphere.reserveTable")}
              <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AtmosphereSection;
