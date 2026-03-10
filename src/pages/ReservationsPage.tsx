import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import { ReservationForm } from "@/components/ReservationForm";

const ReservationsPage = () => {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="mx-auto max-w-lg px-6 py-24 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-gold"
          >
            <Check size={36} className="text-white" />
          </motion.div>
          <h1 className="font-display text-4xl font-semibold text-foreground">{t("reservation.thankYou")}</h1>
          <p className="mt-4 text-muted-foreground">{t("reservation.thankYouMessage")}</p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-8 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:bg-primary hover:text-primary-foreground"
          >
            {t("reservation.makeAnother")}
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary">{t("reservation.title")}</p>
          <h1 className="mt-3 font-display text-5xl font-light text-foreground md:text-7xl">
            {t("reservation.subtitleMain")} <span className="italic font-semibold">{t("reservation.subtitleHighlight")}</span>
          </h1>
        </motion.div>

        <div className="mt-12 pb-24">
          <ReservationForm onSuccess={() => setSubmitted(true)} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReservationsPage;
