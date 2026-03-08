import { trendingDishes } from "@/data/mock";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";

const TrendingBar = () => {
  return (
    <div className="border-b border-border bg-card px-4 py-3">
      <div className="mb-2 flex items-center gap-1.5">
        <Flame size={14} className="text-primary" />
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          Live Dish Radar
        </span>
        <span className="ml-1 h-2 w-2 animate-pulse-dot rounded-full bg-trending" />
      </div>
      <div className="hide-scrollbar flex gap-2 overflow-x-auto">
        {trendingDishes.map((dish, i) => (
          <motion.div
            key={dish.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5"
          >
            <span className="text-sm">{dish.emoji}</span>
            <span className="text-xs font-medium text-foreground">{dish.name}</span>
            <span className="text-[10px] font-bold text-primary">{dish.count}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrendingBar;
