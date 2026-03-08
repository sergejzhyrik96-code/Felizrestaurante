import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const CartPage = () => {
  const { t } = useLanguage();
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="mx-auto max-w-lg px-6 py-24 text-center">
          <ShoppingBag size={48} className="mx-auto text-muted-foreground" />
          <h1 className="mt-4 font-display text-3xl font-semibold text-foreground">{t("cart.empty")}</h1>
          <p className="mt-2 text-muted-foreground">{t("cart.emptyHint")}</p>
          <Link
            to="/menu"
            className="mt-6 inline-flex rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:bg-primary hover:text-primary-foreground"
          >
            {t("common.browseMenu")}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="mx-auto max-w-2xl px-6 pb-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl font-semibold text-foreground"
        >
          {t("cart.title")}
        </motion.h1>

        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
                <p className="text-sm text-muted-foreground">€{item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="rounded-full bg-secondary p-1.5">
                  <Minus size={14} className="text-foreground" />
                </button>
                <span className="w-6 text-center text-sm font-semibold text-foreground">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="rounded-full bg-secondary p-1.5">
                  <Plus size={14} className="text-foreground" />
                </button>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between text-lg">
            <span className="font-display font-semibold text-foreground">{t("cart.total")}</span>
            <span className="font-display text-2xl font-semibold text-foreground">€{total.toFixed(2)}</span>
          </div>
          <button
            onClick={() => { toast.success(t("cart.orderSuccess")); clearCart(); }}
            className="mt-4 w-full rounded-full bg-gradient-gold py-4 text-sm font-semibold text-white shadow-glow transition-all hover:shadow-lg hover:scale-[1.01]"
          >
            {t("cart.placeOrder")}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
