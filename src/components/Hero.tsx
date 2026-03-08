import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, UtensilsCrossed } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImg from "@/assets/hero-restaurant.jpg";

const Hero = () => {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      {/* Background image with parallax feel */}
      <motion.div
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img
          src={heroImg}
          alt="FELIZ restaurant Valencia interior"
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 pt-40 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-4 text-sm font-medium tracking-[0.3em] uppercase text-white/70"
          >
            {t("hero.badge")}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="font-display text-5xl font-light leading-[1.1] text-white md:text-7xl lg:text-8xl"
          >
            {t("hero.headlinePart1")}
            <br />
            <span className="font-semibold italic">{t("hero.headlineHighlight")}</span> {t("hero.headlinePart2")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mt-6 max-w-lg text-base leading-relaxed text-white/70 md:text-lg"
          >
            {t("hero.subheadline")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              to="/reservations"
              className="group flex items-center gap-2 rounded-full bg-gradient-gold px-8 py-4 text-sm font-semibold text-white shadow-glow transition-all hover:shadow-lg hover:scale-[1.02]"
            >
              <CalendarDays size={18} />
              {t("hero.reserveTable")}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/menu"
              className="group flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              <UtensilsCrossed size={18} />
              {t("hero.viewMenu")}
            </Link>
            <Link
              to="/gastro-boxes"
              className="flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              {t("hero.orderOnline")}
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="h-10 w-6 rounded-full border-2 border-white/30 flex items-start justify-center pt-2"
          >
            <div className="h-2 w-1 rounded-full bg-white/60" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
