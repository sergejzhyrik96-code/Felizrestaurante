import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const menuBase = "/menu/";

const FeaturedDishes = () => {
  const { t } = useLanguage();

  const dishes = [
    { nameKey: "featuredDishes.paellaName", price: "16,9 €", image: `${menuBase}paella valenciana.jpg`, tagKey: "featuredDishes.tagSignature" },
    { nameKey: "featuredDishes.chuletaName", price: "26,70 €", image: `${menuBase}chuleton a la piedra.png`, tagKey: "featuredDishes.tagChef" },
    { nameKey: "featuredDishes.vivaldiName", price: "13,5 €", image: `${menuBase}ensalada vivaldi .png`, tagKey: "featuredDishes.tagFresh" },
    { nameKey: "featuredDishes.tomateName", price: "14,60 €", image: `${menuBase}Premium tomato.jpeg`, tagKey: "featuredDishes.tagClassic" },
  ];

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 flex items-end justify-between"
        >
          <div>
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary">
              {t("featuredDishes.culinaryArt")}
            </p>
            <h2 className="mt-3 font-display text-4xl font-light text-foreground md:text-6xl">
              <span className="italic font-semibold">{t("featuredDishes.signatureDishes")}</span>
            </h2>
          </div>
          <Link
            to="/menu"
            className="hidden items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-foreground md:flex"
          >
            {t("featuredDishes.fullMenu")} <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Dishes grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dishes.map((dish, i) => (
            <motion.div
              key={dish.nameKey}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <motion.img
                  src={dish.image}
                  alt={t(dish.nameKey)}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute top-4 left-4">
                  <span className="rounded-full glass-dark px-3 py-1 text-xs font-medium text-white">
                    {t(dish.tagKey)}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-lg font-semibold text-white">{dish.price}</p>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-display text-xl font-semibold text-foreground">{t(dish.nameKey)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{dish.price}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <Link
          to="/menu"
          className="mt-10 flex items-center justify-center gap-2 text-sm font-medium text-primary md:hidden"
        >
          {t("featuredDishes.viewFullMenu")} <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
};

export default FeaturedDishes;
