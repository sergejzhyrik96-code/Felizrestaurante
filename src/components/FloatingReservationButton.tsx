import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PHONE_URL = "tel:+34961181824";
const PHONE_DISPLAY = "+34 961 18 18 24";

const FloatingReservationButton = () => {
  const { t } = useLanguage();

  const button = (
    <motion.a
      href={PHONE_URL}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.3 }}
      className="fixed bottom-8 right-8 z-40 flex items-center gap-2 rounded-full bg-gradient-gold px-5 py-3 text-sm font-semibold text-white shadow-luxury transition-all hover:shadow-glow hover:scale-[1.02]"
      aria-label={t("floatingReservation.callAndReserve")}
    >
      <Phone size={18} />
      <span className="hidden sm:inline">{t("floatingReservation.callAndReserve")}</span>
    </motion.a>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="left" className="text-sm">
        {PHONE_DISPLAY}
      </TooltipContent>
    </Tooltip>
  );
};

export default FloatingReservationButton;
