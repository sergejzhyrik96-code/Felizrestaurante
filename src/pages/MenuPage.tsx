import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";

export interface MenuDish {
  name_es: string;
  name_ru?: string;
  description_es?: string;
  description_ru?: string;
  price: string;
  image?: string;
}

export interface MenuData {
  tapas?: MenuDish[];
  ensaladas?: MenuDish[];
  arroces?: MenuDish[];
  carnes?: MenuDish[];
  pescados?: MenuDish[];
  postres?: MenuDish[];
  bebidas?: MenuDish[];
  complementos?: MenuDish[];
  menu_infantil?: MenuDish[];
  [key: string]: MenuDish[] | undefined;
}

const DEFAULT_FIRST_CATEGORY = "tapas";

const MenuPage = () => {
  const { t, locale } = useLanguage();
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(DEFAULT_FIRST_CATEGORY);

  useEffect(() => {
    fetch("/data/menu.json")
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el menú");
        return res.json();
      })
      .then((data: MenuData) => {
        setMenu(data);
        const keys = Object.keys(data).filter((k) => Array.isArray(data[k]) && (data[k]?.length ?? 0) > 0);
        setActiveCategory(keys.includes(DEFAULT_FIRST_CATEGORY) ? DEFAULT_FIRST_CATEGORY : keys[0] ?? DEFAULT_FIRST_CATEGORY);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const dishes = menu && activeCategory ? (menu[activeCategory] || []) : [];
  const categoriesWithItems = menu
    ? Object.keys(menu).filter((key) => Array.isArray(menu[key]) && (menu[key]?.length ?? 0) > 0)
    : [];

  const getDishName = (dish: MenuDish) => (locale === "ru" && dish.name_ru ? dish.name_ru : dish.name_es);
  const getDishDescription = (dish: MenuDish) =>
    locale === "ru" ? (dish.description_ru || dish.description_es) : (dish.description_es || dish.description_ru);
  const imageBase = "/menu/";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background pt-24">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-muted-foreground">
          {t("menu.loading")}
        </motion.p>
      </div>
    );
  }

  if (error || !menu) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background pt-24">
        <p className="text-destructive">{error ?? t("menu.error")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary">{t("menu.subtitle")}</p>
          <h1 className="mt-3 font-display text-5xl font-light text-foreground md:text-7xl">
            {t("menu.titleMain")} <span className="italic font-semibold">{t("menu.titleHighlight")}</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex justify-center gap-2 overflow-x-auto hide-scrollbar pb-2"
        >
          {categoriesWithItems.map((key) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`relative whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                activeCategory === key
                  ? "bg-foreground text-background shadow-luxury"
                  : "bg-secondary text-muted-foreground hover:bg-muted"
              }`}
            >
              {t(`menu.categories.${key}`)}
            </button>
          ))}
        </motion.div>

        <div className="mt-12 pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {dishes.map((dish, i) => {
                const imgSrc = dish.image ? `${imageBase}${encodeURIComponent(dish.image)}` : null;
                const desc = getDishDescription(dish);
                return (
                  <motion.article
                    key={`${activeCategory}-${dish.name_es}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card-hover transition-shadow duration-500 hover:shadow-luxury"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={getDishName(dish)}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <span className="text-4xl">🍽</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-display text-lg font-semibold text-foreground">{getDishName(dish)}</h3>
                          {desc ? (
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{desc}</p>
                          ) : null}
                        </div>
                        <span className="shrink-0 font-display text-lg font-semibold text-foreground">{dish.price}</span>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {dishes.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">{t("menu.emptyCategory")}</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MenuPage;
