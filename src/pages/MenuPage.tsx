import { useState, useEffect, useRef, useCallback, type ComponentType } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Croissant,
  UtensilsCrossed,
  Salad,
  Fish,
  Beef,
  Cake,
  Pizza,
  Baby,
  Utensils,
  CalendarDays,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import { AllergenIcon } from "@/components/AllergenIcon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STICKY_TOP = "4rem"; // header height
const STICKY_TOP_PX = 64; // 4rem in px for IntersectionObserver (rem not supported in rootMargin)

const CATEGORY_ICONS: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  tapas: UtensilsCrossed,
  desayunos: Croissant,
  combos: UtensilsCrossed,
  almuerzos: UtensilsCrossed,
  entrantes: Utensils,
  ensaladas: Salad,
  pescados: Fish,
  carnes: Beef,
  complementos: UtensilsCrossed,
  arroces: UtensilsCrossed,
  menu_infantil: Baby,
  postres: Cake,
  pizzas_feliz: Pizza,
  menu_temporada: CalendarDays,
  bebidas: UtensilsCrossed,
};

export interface MenuDish {
  name_es: string;
  name_ru?: string;
  name_en?: string;
  description_es?: string;
  description_ru?: string;
  description_en?: string;
  price: string;
  image?: string;
  allergens?: number[];
  tags?: string[];
  subcategory_es?: string;
  subcategory_en?: string;
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

const DEFAULT_FIRST_CATEGORY = "desayunos";

function getDefaultCategoryByTime(availableKeys: string[]): string {
  const h = new Date().getHours();
  const m = new Date().getMinutes();
  const mins = h * 60 + m;
  if (mins >= 9 * 60 && mins < 12 * 60 + 30) return availableKeys.includes("desayunos") ? "desayunos" : availableKeys[0] ?? DEFAULT_FIRST_CATEGORY;
  if (mins >= 12 * 60 + 30 && mins <= 23 * 60 + 30) return availableKeys.includes("entrantes") ? "entrantes" : availableKeys[0] ?? DEFAULT_FIRST_CATEGORY;
  return availableKeys.includes("entrantes") ? "entrantes" : availableKeys[0] ?? DEFAULT_FIRST_CATEGORY;
}

function groupBySubcategory(dishes: MenuDish[], locale: string): Map<string, MenuDish[]> {
  const map = new Map<string, MenuDish[]>();
  const defaultKey = "platos";
  for (const d of dishes) {
    const key =
      locale === "en" && d.subcategory_en
        ? d.subcategory_en
        : d.subcategory_es
          ? d.subcategory_es
          : defaultKey;
    const list = map.get(key) ?? [];
    list.push(d);
    map.set(key, list);
  }
  return map;
}

const MenuPage = () => {
  const { t, locale } = useLanguage();
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(DEFAULT_FIRST_CATEGORY);
  const [selectedDish, setSelectedDish] = useState<MenuDish | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [dietFilter, setDietFilter] = useState<"vegan" | "vegetarian" | "pescatarian" | null>(null);
  const userHasSelectedCategory = useRef(false);
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const isScrollingTo = useRef(false);

  useEffect(() => {
    fetch("/data/menu.json")
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el menú");
        return res.json();
      })
      .then((data: MenuData) => {
        setMenu(data);
        const keys = Object.keys(data).filter((k) => Array.isArray(data[k]) && (data[k]?.length ?? 0) > 0);
        const defaultCat = getDefaultCategoryByTime(keys);
        setActiveCategory(defaultCat);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const categoriesWithItems = menu
    ? Object.keys(menu).filter((key) => Array.isArray(menu[key]) && (menu[key]?.length ?? 0) > 0)
    : [];

  useEffect(() => {
    if (!menu || categoriesWithItems.length === 0 || userHasSelectedCategory.current) return;
    const defaultCat = getDefaultCategoryByTime(categoriesWithItems);
    const timer = setTimeout(() => {
      scrollToCategory(defaultCat);
    }, 400);
    return () => clearTimeout(timer);
  }, [menu, categoriesWithItems.length]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [navSticky, setNavSticky] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    el.addEventListener("scroll", checkScroll);
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", checkScroll);
    };
  }, [categoriesWithItems.length, checkScroll]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      el.scrollBy({ left: e.deltaY, behavior: "auto" });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setNavSticky(window.scrollY > 120);
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isScrollingTo.current) return;
    const observers: IntersectionObserver[] = [];
    const opts: IntersectionObserverInit = {
      root: null,
      rootMargin: `-${STICKY_TOP_PX}px 0px -60% 0px`,
      threshold: 0,
    };
    categoriesWithItems.forEach((key) => {
      const el = sectionRefs.current.get(key);
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting && !isScrollingTo.current) {
              setActiveCategory(key);
            }
          }
        },
        opts
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((io) => io.disconnect());
  }, [categoriesWithItems]);

  const scrollToCategory = (key: string, userInitiated = false) => {
    if (userInitiated) userHasSelectedCategory.current = true;
    const el = sectionRefs.current.get(key);
    if (!el) return;
    isScrollingTo.current = true;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveCategory(key);
    setTimeout(() => {
      isScrollingTo.current = false;
    }, 1200);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, scrollLeft: el.scrollLeft };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = dragStart.current.scrollLeft - (e.clientX - dragStart.current.x);
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const scrollBy = (delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  const getDishName = (dish: MenuDish) => {
    if (locale === "en" && dish.name_en) return dish.name_en;
    if (locale === "ru") return dish.name_ru || dish.name_en || dish.name_es;
    return dish.name_es;
  };
  const getDishDescription = (dish: MenuDish) => {
    if (locale === "en") return dish.description_en || dish.description_es;
    if (locale === "ru") return dish.description_ru || dish.description_en || dish.description_es;
    return dish.description_es || dish.description_en;
  };

  const dietFilterDishes = (dishes: MenuDish[]): MenuDish[] => {
    if (!dietFilter) return dishes;
    const tags = (d: MenuDish) => new Set((d.tags ?? []).map((t) => t.toLowerCase()));
    const allergens = (d: MenuDish) => new Set(d.allergens ?? []);
    return dishes.filter((d) => {
      const t = tags(d);
      const a = allergens(d);
      if (dietFilter === "vegan") {
        if (t.has("vegan")) return true;
        if (a.has(6) || a.has(7) || a.has(10) || a.has(11) || a.has(12)) return false;
        return true;
      }
      if (dietFilter === "vegetarian") {
        if (t.has("vegetarian") || t.has("vegan")) return true;
        if (a.has(6) || a.has(7) || a.has(11)) return false;
        return true;
      }
      if (dietFilter === "pescatarian") {
        if (t.has("pescatarian") || t.has("vegetarian") || t.has("vegan")) return true;
        if (a.has(6) || a.has(7) || a.has(11)) return true;
        return false;
      }
      return true;
    });
  };

  const getDishDietTag = (dish: MenuDish): "vegan" | "vegetarian" | "pescatarian" | null => {
    const t = (dish.tags ?? []).map((x) => x.toLowerCase());
    if (t.includes("vegan")) return "vegan";
    if (t.includes("vegetarian")) return "vegetarian";
    if (t.includes("pescatarian")) return "pescatarian";
    return null;
  };

  const toggleDietFilter = (filter: "vegan" | "vegetarian" | "pescatarian") => {
    setDietFilter((prev) => (prev === filter ? null : filter));
  };
  const getSubcategoryLabel = (subKey: string) => {
    const tKey = `menu.subcategories.${subKey}`;
    const out = t(tKey);
    return out !== tKey ? out : subKey;
  };
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

        {/* Especialidades de la casa */}
        {categoriesWithItems.includes("pizzas_feliz") && categoriesWithItems.includes("menu_temporada") && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12"
        >
          <h2 className="font-display text-xl font-semibold text-foreground mb-6">
            {t("menu.specialtiesTitle")}
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <button
              type="button"
              onClick={() => scrollToCategory("pizzas_feliz", true)}
              className="group text-left overflow-hidden rounded-2xl border border-border bg-card shadow-card-hover transition-all duration-300 hover:shadow-luxury p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {t("menu.categories.pizzas_feliz")}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t("menu.pizzaCardDesc")}
                  </p>
                </div>
                <span className="shrink-0 flex items-center gap-1 text-sm font-medium text-primary">
                  {t("menu.pizzaCardButton")}
                  <ChevronRightIcon size={16} />
                </span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => scrollToCategory("menu_temporada", true)}
              className="group text-left overflow-hidden rounded-2xl border border-border bg-card shadow-card-hover transition-all duration-300 hover:shadow-luxury p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {t("menu.categories.menu_temporada")}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t("menu.seasonalCardDesc")}
                  </p>
                </div>
                <span className="shrink-0 flex items-center gap-1 text-sm font-medium text-primary">
                  {t("menu.seasonalCardButton")}
                  <ChevronRightIcon size={16} />
                </span>
              </div>
            </button>
          </div>
        </motion.section>
        )}

        {/* Sticky category nav */}
        <div
          className="sticky z-[39] -mx-6 px-6 transition-all duration-300"
          style={{ top: STICKY_TOP }}
        >
          <div
            className={`relative flex items-center py-3 transition-all duration-300 ${
              navSticky ? "bg-background/80 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.06)]" : ""
            }`}
          >
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => scrollBy(-300)}
                aria-label="Scroll left"
                className="absolute left-0 z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background/95 text-muted-foreground shadow-card-hover transition-colors hover:bg-muted hover:text-foreground -translate-x-2"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              className={`flex flex-1 gap-2 overflow-x-auto hide-scrollbar pb-2 select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
              style={{ scrollBehavior: "smooth" }}
            >
              <div className="flex justify-center gap-2 min-w-max mx-auto px-12">
                {categoriesWithItems.map((key) => {
                  const Icon = CATEGORY_ICONS[key] ?? UtensilsCrossed;
                  return (
                    <button
                      key={key}
                      onClick={() => scrollToCategory(key, true)}
                      className={`relative shrink-0 flex items-center gap-2 whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                        activeCategory === key
                          ? "bg-foreground text-background shadow-luxury"
                          : "bg-secondary text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon size={16} className="opacity-80 shrink-0" />
                      {t(`menu.categories.${key}`)}
                    </button>
                  );
                })}
              </div>
            </div>
            {canScrollRight && (
              <button
                type="button"
                onClick={() => scrollBy(300)}
                aria-label="Scroll right"
                className="absolute right-0 z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background/95 text-muted-foreground shadow-card-hover transition-colors hover:bg-muted hover:text-foreground translate-x-2"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Diet filter buttons */}
        <div className="mt-8 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 min-w-max md:min-w-0 md:justify-center pb-2">
            {(["vegan", "vegetarian", "pescatarian"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleDietFilter(key)}
                className={`shrink-0 flex items-center gap-1.5 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                  dietFilter === key
                    ? "bg-foreground text-background shadow-luxury"
                    : "bg-secondary text-muted-foreground hover:bg-muted"
                }`}
              >
                {key === "vegan" && "🌱"}
                {key === "vegetarian" && "🥬"}
                {key === "pescatarian" && "🐟"}
                {t(`menu.diet.${key}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Menu sections */}
        <div className="mt-8 pb-24">
          {categoriesWithItems.map((catKey) => {
            const dishes = (menu[catKey] || []) as MenuDish[];
            const filteredDishes = dietFilterDishes(dishes);
            const bySub = groupBySubcategory(filteredDishes, locale);
            const subEntries = Array.from(bySub.entries());

            if (filteredDishes.length === 0) return null;

            return (
              <section
                key={catKey}
                ref={(el) => {
                  if (el) sectionRefs.current.set(catKey, el);
                }}
                id={`menu-${catKey}`}
                className="scroll-mt-24"
              >
                <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                  {t(`menu.categories.${catKey}`)}
                </h2>

                {subEntries.map(([subKey, subDishes]) => (
                  <div key={subKey} className="mt-10 first:mt-0">
                    {subKey !== "platos" && (
                      <h3 className="font-display text-lg font-medium text-muted-foreground mb-5 uppercase tracking-wider">
                        {getSubcategoryLabel(subKey)}
                      </h3>
                    )}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      <AnimatePresence mode="sync">
                        {subDishes.map((dish, i) => {
                          const imgSrc = dish.image ? `${imageBase}${encodeURIComponent(dish.image)}` : null;
                          const desc = getDishDescription(dish);
                          const dietTag = getDishDietTag(dish);
                          return (
                            <motion.article
                              key={`${catKey}-${dish.name_es}-${i}`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, transition: { duration: 0.25 } }}
                              transition={{ duration: 0.4, delay: i * 0.03 }}
                              onClick={() => setSelectedDish(dish)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => e.key === "Enter" && setSelectedDish(dish)}
                              className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-card-hover transition-all duration-300 hover:shadow-luxury md:hover:scale-[1.02]"
                            >
                              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                {dietTag && (
                                  <span className="absolute top-2 right-2 z-10 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
                                    {dietTag === "vegan" && "🌱"}
                                    {dietTag === "vegetarian" && "🥬"}
                                    {dietTag === "pescatarian" && "🐟"}
                                    {t(`menu.diet.${dietTag}`)}
                                  </span>
                                )}
                              {imgSrc ? (
                                <img
                                  src={imgSrc}
                                  alt={getDishName(dish)}
                                  className="h-full w-full object-cover transition-transform duration-300 md:group-hover:scale-[1.02]"
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
                                  {dish.allergens && dish.allergens.length > 0 && (
                                    <span className="mt-1.5 block text-xs font-medium text-muted-foreground">
                                      {dish.allergens.join(", ")}
                                    </span>
                                  )}
                                  {desc ? (
                                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{desc}</p>
                                  ) : null}
                                </div>
                                <span className="shrink-0 font-display text-lg font-semibold text-foreground transition-colors duration-300 md:group-hover:text-primary">{dish.price}</span>
                              </div>
                            </div>
                          </motion.article>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </section>
            );
          })}

          <section className="mt-16 border-t border-border pt-12">
            <h2 className="font-display text-xl font-semibold text-foreground mb-8">
              {t("menu.allergenLegend")}
            </h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((n) => (
                <AllergenIcon
                  key={n}
                  number={n}
                  label={t(`menu.allergens.${n}`)}
                  size={48}
                />
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Floating back to top */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label={t("menu.backToTop")}
          className="fixed bottom-8 left-8 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/95 shadow-luxury transition-colors hover:bg-muted"
        >
          <ChevronUp size={24} className="text-foreground" />
        </motion.button>
      )}

      {/* Dish quick-view modal */}
      <Dialog open={!!selectedDish} onOpenChange={(open) => !open && setSelectedDish(null)}>
        <DialogContent className="max-w-lg w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto rounded-2xl border-border bg-background p-0 shadow-luxury">
          {selectedDish && (
            <>
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-muted">
                {selectedDish.image ? (
                  <img
                    src={`${imageBase}${encodeURIComponent(selectedDish.image)}`}
                    alt={getDishName(selectedDish)}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <span className="text-6xl">🍽</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl font-semibold text-foreground">
                    {getDishName(selectedDish)}
                  </DialogTitle>
                </DialogHeader>
                {getDishDescription(selectedDish) && (
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                    {getDishDescription(selectedDish)}
                  </p>
                )}
                {(selectedDish as MenuDish & { chef_note?: string }).chef_note && (
                  <p className="mt-3 text-sm italic text-muted-foreground border-l-2 border-primary pl-3">
                    {(selectedDish as MenuDish & { chef_note?: string }).chef_note}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="font-display text-xl font-semibold text-foreground">
                    {selectedDish.price}
                  </span>
                  {selectedDish.allergens && selectedDish.allergens.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedDish.allergens.map((n) => (
                        <AllergenIcon
                          key={n}
                          number={n}
                          label={t(`menu.allergens.${n}`)}
                          size={32}
                          compact
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default MenuPage;
