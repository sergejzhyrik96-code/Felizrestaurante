import { reservations } from "@/data/mock";
import { CalendarDays, Clock, Users, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
  confirmed: "bg-success/15 text-success",
  pending: "bg-warning/15 text-warning",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/15 text-destructive",
};

const BookingsPage = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 px-4 py-4 backdrop-blur-xl">
        <h1 className="font-display text-2xl font-bold text-foreground">My Bookings</h1>
      </header>

      <div className="p-4 space-y-3">
        {reservations.map((res, i) => (
          <motion.div
            key={res.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card"
          >
            <img
              src={res.venueImage}
              alt={res.venueName}
              className="h-16 w-16 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-foreground truncate">{res.venueName}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays size={12} /> {res.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {res.time}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={12} /> {res.guests}
                </span>
              </div>
              <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${statusColors[res.status]}`}>
                {res.status}
              </span>
            </div>
            <ChevronRight size={18} className="text-muted-foreground" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BookingsPage;
