import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import GastroCart from "@/components/GastroCart";

interface GastroBoxItem {
  id: string;
  name_es: string;
  name_ru: string;
  description_es: string;
  description_ru: string;
  price: number;
  image: string;
  serves_es: string;
  serves_ru: string;
}

const GastroBoxesPage = () => {
  const { t, locale } = useLanguage();
  const { addItem } = useCart();
  const [boxes, setBoxes] = useState<GastroBoxItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/gastroboxes.json")
      .then((res) => res.json())
      .then((data: GastroBoxItem[]) => setBoxes(data))
      .catch(() => setBoxes([]))
      .finally(() => setLoading(false));
  }, []);

  const getName = (box: GastroBoxItem) => (locale === "ru" ? box.name_ru : box.name_es);
  const getDesc = (box: GastroBoxItem) => (locale === "ru" ? box.description_ru : box.description_es);
  const getServes = (box: GastroBoxItem) => (locale === "ru" ? box.serves_ru : box.serves_es);
  const imageBase = "/images/gastroboxes/";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background pt-24">
        <p className="text-muted-foreground">{t("menu.loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="mx-auto max-w-7xl px-6 flex flex-col lg:flex-row lg:gap-8">
        <div className="flex-1 min-w-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary">{t("gastroBoxes.subtitle")}</p>
          <h1 className="mt-3 font-display text-5xl font-light text-foreground md:text-7xl">
            <span className="italic font-semibold">{t("gastroBoxes.title")}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground">{t("gastroBoxes.description")}</p>
        </motion.div>

        <div className="mt-16 grid gap-8 pb-24 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {boxes.map((box, i) => (
            <motion.div
              key={box.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card-hover transition-shadow duration-500 hover:shadow-luxury"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {box.image ? (
                  <>
                    <img
                      src={`${imageBase}${encodeURIComponent(box.image)}`}
                      alt={getName(box)}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        const wrap = (e.target as HTMLImageElement).parentElement;
                        const fallback = wrap?.querySelector(".gastro-placeholder");
                        if (fallback) (fallback as HTMLElement).style.display = "flex";
                      }}
                    />
                    <div className="gastro-placeholder hidden absolute inset-0 h-full w-full items-center justify-center bg-muted text-muted-foreground" style={{ display: "none" }}>
                      <span className="text-4xl">📦</span>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <span className="text-4xl">📦</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-primary">
                  <Package size={16} />
                  <span className="text-xs font-medium uppercase tracking-wider">{getServes(box)}</span>
                </div>
                <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">{getName(box)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{getDesc(box)}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="font-display text-2xl font-semibold text-foreground">€{box.price.toFixed(2)}</span>
                  <button
                    onClick={() => {
                      addItem({
                        id: box.id,
                        name: getName(box),
                        price: box.price,
                        image: `${imageBase}${box.image}`,
                      });
                      toast.success(locale === "ru" ? "Добавлено в корзину" : "Añadido al carrito");
                    }}
                    className="flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-glow hover:scale-[1.02]"
                  >
                    {t("gastroBoxes.orderButton")}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        </div>
        <GastroCart />
      </div>
      <Footer />
    </div>
  );
};

export default GastroBoxesPage;
