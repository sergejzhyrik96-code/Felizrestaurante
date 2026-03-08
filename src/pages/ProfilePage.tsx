import { Settings, Star, CalendarDays, Heart, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/90 px-4 py-4 backdrop-blur-xl">
        <h1 className="font-display text-2xl font-bold text-foreground">Profile</h1>
        <button className="rounded-full bg-secondary p-2">
          <Settings size={18} className="text-muted-foreground" />
        </button>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-6"
      >
        {/* Avatar & info */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary text-3xl font-bold text-primary-foreground">
            A
          </div>
          <h2 className="mt-3 text-lg font-bold text-foreground">Alex García</h2>
          <p className="text-sm text-muted-foreground">Food lover · Valencia</p>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { icon: CalendarDays, label: "Bookings", value: "12" },
            { icon: Star, label: "Reviews", value: "8" },
            { icon: Heart, label: "Favorites", value: "24" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-2xl border border-border bg-card p-3"
            >
              <stat.icon size={20} className="text-primary" />
              <span className="mt-1 text-lg font-bold text-foreground">{stat.value}</span>
              <span className="text-[10px] text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Menu items */}
        <div className="mt-6 space-y-1">
          {["My Reviews", "Saved Places", "Payment Methods", "Preferences", "Help & Support"].map(
            (item) => (
              <button
                key={item}
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 hover:bg-secondary/50"
              >
                <span className="text-sm font-medium text-foreground">{item}</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
