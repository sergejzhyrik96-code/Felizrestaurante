import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";

const GALLERY_IMAGE_BASE = "/gallery/";

const GalleryPage = () => {
  const { t } = useLanguage();
  const [images, setImages] = useState<{ src: string; alt: string }[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/gallery.json")
      .then((res) => res.json())
      .then((data: string[]) => {
        setImages(
          data.map((file) => ({
            src: `${GALLERY_IMAGE_BASE}${encodeURIComponent(file)}`,
            alt: `Galería Feliz – ${file.replace(".jpg", "")}`,
          }))
        );
      })
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background pt-24">
        <p className="text-muted-foreground">{t("menu.loading")}</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="mx-auto max-w-7xl px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary">{t("gallery.subtitle")}</p>
            <h1 className="mt-3 font-display text-5xl font-light text-foreground md:text-7xl">
              {t("gallery.title")} <span className="italic font-semibold">—</span>
            </h1>
          </motion.div>
          <p className="mt-8 text-center text-muted-foreground">
            {t("gallery.empty")}
          </p>
        </div>
        <Footer />
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
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary">{t("gallery.subtitle")}</p>
          <h1 className="mt-3 font-display text-5xl font-light text-foreground md:text-7xl">
            <span className="italic font-semibold">{t("gallery.title")}</span>
          </h1>
        </motion.div>

        <div className="mt-12 columns-2 gap-4 space-y-4 pb-24 md:columns-3">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group cursor-pointer break-inside-avoid overflow-hidden rounded-2xl"
              onClick={() => setSelected(i)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelected(null)}
          >
            <button
              type="button"
              className="absolute right-6 top-6 text-white hover:opacity-80"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              <X size={28} />
            </button>
            <motion.img
              key={selected}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={images[selected].src}
              alt={images[selected].alt}
              className="max-h-[85vh] max-w-full rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default GalleryPage;
