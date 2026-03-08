import { useParams, useNavigate } from "react-router-dom";
import { venues, menuItems, feedPosts } from "@/data/mock";
import { ArrowLeft, Star, Clock, MapPin, Phone, Share2, Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const VenueDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const venue = venues.find((v) => v.id === id) || venues[0];
  const venueMenu = menuItems.filter((m) => m.venueId === venue.id);
  const [activeTab, setActiveTab] = useState<"menu" | "reviews" | "info">("menu");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showBooking, setShowBooking] = useState(false);
  const [guests, setGuests] = useState(2);

  const cartTotal = Object.entries(cart).reduce((sum, [itemId, qty]) => {
    const item = menuItems.find((m) => m.id === itemId);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const addToCart = (itemId: string) => {
    setCart((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[itemId] > 1) next[itemId]--;
      else delete next[itemId];
      return next;
    });
  };

  const handleBook = () => {
    toast.success("Table booked! 🎉", {
      description: `${venue.name} · ${guests} guests · Pre-order: €${cartTotal.toFixed(2)}`,
    });
    setShowBooking(false);
    setCart({});
  };

  const reviews = [
    { name: "María L.", rating: 5, text: "Absolutely incredible! Best I've had in Valencia.", time: "2 days ago" },
    { name: "Carlos R.", rating: 4, text: "Great atmosphere and food. Service was a bit slow but worth the wait.", time: "1 week ago" },
    { name: "Sophie B.", rating: 5, text: "Will definitely come back! Everything was perfect 😍", time: "2 weeks ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative">
        <img src={venue.image} alt={venue.name} className="h-64 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute left-3 top-3 z-10 rounded-full bg-card/80 p-2 backdrop-blur-md"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <div className="absolute right-3 top-3 z-10 flex gap-2">
          <button className="rounded-full bg-card/80 p-2 backdrop-blur-md">
            <Heart size={20} className="text-foreground" />
          </button>
          <button className="rounded-full bg-card/80 p-2 backdrop-blur-md">
            <Share2 size={20} className="text-foreground" />
          </button>
        </div>

        {/* Info overlay with logo */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <div className="flex items-end gap-3">
            <img
              src={venue.logo}
              alt={`${venue.name} logo`}
              className="h-14 w-14 rounded-xl border-2 border-border bg-card object-contain shadow-card"
            />
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold text-foreground">{venue.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star size={14} className="fill-primary text-primary" />
                  <span className="font-semibold text-foreground">{venue.rating}</span>
                  ({venue.reviewCount})
                </span>
                <span>·</span>
                <span>{venue.category}</span>
                <span>·</span>
                <span>{venue.priceRange}</span>
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {venue.distance}
                </span>
                <span className={`font-medium ${venue.openNow ? "text-success" : "text-destructive"}`}>
                  {venue.openNow ? "Open Now" : "Closed"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-30 flex border-b border-border bg-background">
        {(["menu", "reviews", "info"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${
              activeTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 py-4 pb-32">
        {activeTab === "menu" && (
          <div className="space-y-3">
            {venueMenu.map((item) => (
              <motion.div
                key={item.id}
                layout
                className="flex gap-3 rounded-2xl border border-border bg-card p-3"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{item.name}</h4>
                      {item.popular && (
                        <span className="text-[10px] font-semibold text-primary">🔥 Popular</span>
                      )}
                    </div>
                    <span className="text-sm font-bold text-primary">€{item.price.toFixed(2)}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {cart[item.id] ? (
                      <div className="flex items-center gap-2 rounded-full border border-border bg-secondary px-1">
                        <button onClick={() => removeFromCart(item.id)} className="p-1">
                          <Minus size={14} className="text-foreground" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-foreground">
                          {cart[item.id]}
                        </span>
                        <button onClick={() => addToCart(item.id)} className="p-1">
                          <Plus size={14} className="text-foreground" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item.id)}
                        className="rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4">
            {reviews.map((review, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{review.name}</span>
                  <span className="text-xs text-muted-foreground">{review.time}</span>
                </div>
                <div className="mt-1 text-xs text-primary">
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{review.text}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "info" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-4">
              <h3 className="text-sm font-bold text-foreground">Location</h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin size={14} /> {venue.address}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <h3 className="text-sm font-bold text-foreground">Hours</h3>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <div className="flex justify-between"><span>Mon – Fri</span><span>12:00 – 23:00</span></div>
                <div className="flex justify-between"><span>Sat – Sun</span><span>11:00 – 00:00</span></div>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <h3 className="text-sm font-bold text-foreground">Contact</h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Phone size={14} /> +34 963 123 456
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Booking bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 px-4 py-3 backdrop-blur-xl">
        {!showBooking ? (
          <div className="flex items-center gap-3">
            {cartCount > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <ShoppingCart size={16} className="text-primary" />
                <span className="font-semibold text-foreground">€{cartTotal.toFixed(2)}</span>
                <span>({cartCount})</span>
              </div>
            )}
            <Button
              onClick={() => setShowBooking(true)}
              className="ml-auto w-full max-w-xs bg-gradient-primary text-sm font-bold text-primary-foreground hover:opacity-90"
            >
              Book a Table
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Quick Book</h3>
              <button onClick={() => setShowBooking(false)} className="text-xs text-muted-foreground">
                Cancel
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 rounded-xl border border-border bg-secondary p-2 text-center">
                <span className="block text-[10px] text-muted-foreground">Date</span>
                <span className="text-sm font-semibold text-foreground">Today</span>
              </div>
              <div className="flex-1 rounded-xl border border-border bg-secondary p-2 text-center">
                <span className="block text-[10px] text-muted-foreground">Time</span>
                <span className="text-sm font-semibold text-foreground">20:30</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-3 py-2">
                <button onClick={() => setGuests(Math.max(1, guests - 1))}>
                  <Minus size={14} className="text-muted-foreground" />
                </button>
                <div className="text-center">
                  <span className="block text-[10px] text-muted-foreground">Guests</span>
                  <span className="text-sm font-semibold text-foreground">{guests}</span>
                </div>
                <button onClick={() => setGuests(guests + 1)}>
                  <Plus size={14} className="text-muted-foreground" />
                </button>
              </div>
            </div>
            {cartCount > 0 && (
              <p className="text-xs text-muted-foreground">
                Pre-order: {cartCount} items · €{cartTotal.toFixed(2)}
              </p>
            )}
            <Button
              onClick={handleBook}
              className="w-full bg-gradient-primary text-sm font-bold text-primary-foreground hover:opacity-90"
            >
              Confirm Booking
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VenueDetailPage;
