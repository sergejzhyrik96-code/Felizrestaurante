import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Footer from "@/components/Footer";
import cateringHero from "@/assets/catering-hero.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const CARD_IMAGES = {
  gastro: "/gallery/368.jpg",
  kids: "/gallery/128.jpg",
  adults: "/gallery/377.jpg",
};

const CateringPage = () => {
  const { t } = useLanguage();

  const cards = [
    {
      path: "/catering/gastronomicos",
      image: CARD_IMAGES.gastro,
      titleKey: "catering.cardGastro",
      descKey: "catering.cardGastroDesc",
    },
    {
      path: "/catering/infantiles",
      image: CARD_IMAGES.kids,
      titleKey: "catering.cardKids",
      descKey: "catering.cardKidsDesc",
    },
    {
      path: "/catering/adultos",
      image: CARD_IMAGES.adults,
      titleKey: "catering.cardAdults",
      descKey: "catering.cardAdultsDesc",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-end overflow-hidden pt-24">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={cateringHero}
          alt="Catering Feliz"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-white/70">
              Catering
            </p>
            <h1 className="mt-3 font-display text-5xl font-light text-white md:text-7xl">
              <span className="italic font-semibold">{t("catering.heroTitle")}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/80">
              {t("catering.heroDesc")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ambience */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              {t("catering.ambienceTitle")}
            </h2>
            <p className="mt-4 text-muted-foreground">{t("catering.ambienceDesc")}</p>
          </motion.div>
        </div>
      </section>

      {/* 3 Cards - links to separate pages */}
      <section className="py-12 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              {t("catering.chooseTitle")}
            </h2>
            <p className="mt-2 text-muted-foreground">{t("catering.chooseSubtitle")}</p>
          </motion.div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card, i) => (
              <motion.div
                key={card.path}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  to={card.path}
                  className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-card-hover transition-all duration-500 hover:shadow-luxury hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={card.image}
                      alt={t(card.titleKey)}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = cateringHero;
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-2xl font-semibold text-foreground">
                      {t(card.titleKey)}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">{t(card.descKey)}</p>
                    <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all group-hover:shadow-lg group-hover:scale-[1.02]">
                      {t("catering.openProposal")}
                      <ChevronRight size={16} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CateringPage;
