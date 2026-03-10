import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const DISH_WIDGET_URL = "https://reservation.dish.co/widget/hydra-2625d610-18f6-11ef-828a-07d0cbeebb1e";

type ReservationModalContextValue = {
  openReservationModal: () => void;
};

const ReservationModalContext = createContext<ReservationModalContextValue | null>(null);

export function useReservationModal(): ReservationModalContextValue {
  const ctx = useContext(ReservationModalContext);
  if (!ctx) throw new Error("useReservationModal must be used within ReservationModalProvider");
  return ctx;
}

type ReservationModalProviderProps = {
  children: ReactNode;
};

export function ReservationModalProvider({ children }: ReservationModalProviderProps) {
  const [open, setOpen] = useState(false);
  const openReservationModal = useCallback(() => setOpen(true), []);

  useEffect(() => {
    if (!open) return;
    const onEscape = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open]);

  const modal = (
    <AnimatePresence>
      {open && (
        <>
          {/* Dark overlay — close on click */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          {/* Centered container — do not close when clicking inside */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card shadow-luxury overflow-hidden"
            style={{ height: "80vh", maxHeight: "calc(100vh - 2rem)" }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Reservar mesa"
          >
            <div className="relative flex h-full flex-col">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-md transition-colors hover:bg-background hover:text-foreground"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
              <div className="flex-1 min-h-0 p-2 sm:p-4 pt-14 sm:pt-14">
                <iframe
                  src={DISH_WIDGET_URL}
                  title="Reservar mesa — FELIZ Valencia"
                  className="h-full w-full rounded-lg border-0"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <ReservationModalContext.Provider value={{ openReservationModal }}>
      {children}
      {typeof document !== "undefined" && createPortal(modal, document.body)}
    </ReservationModalContext.Provider>
  );
}
