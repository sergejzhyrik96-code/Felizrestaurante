import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { venues, trendingDishes } from "@/data/mock";
import { useNavigate } from "react-router-dom";
import { Star, Navigation, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const createDishIcon = (emoji: string) =>
  L.divIcon({
    html: `<div style="background:hsl(28,92%,52%);width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 2px 10px rgba(0,0,0,0.4);border:2px solid hsl(30,10%,6%)">${emoji}</div>`,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

const MapPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const selectedVenue = venues.find((v) => v.id === selected);

  return (
    <div className="relative h-screen w-full bg-background">
      {/* Header overlay */}
      <div className="absolute left-0 right-0 top-0 z-[1000] border-b border-border bg-background/90 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Navigation size={18} className="text-primary" />
          <h2 className="font-display text-lg font-bold text-foreground">
            Dish Radar
          </h2>
          <span className="ml-1 h-2 w-2 animate-pulse-dot rounded-full bg-trending" />
        </div>
        {/* Trending chips */}
        <div className="hide-scrollbar mt-2 flex gap-2 overflow-x-auto">
          {trendingDishes.map((d) => (
            <span
              key={d.name}
              className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-foreground"
            >
              {d.emoji} {d.name}
              <span className="text-primary">{d.count}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={[39.4699, -0.3763]}
        zoom={14}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {venues.map((venue, i) => {
          const dish = trendingDishes[i % trendingDishes.length];
          return (
            <Marker
              key={venue.id}
              position={[venue.lat, venue.lng]}
              icon={createDishIcon(dish.emoji)}
              eventHandlers={{ click: () => setSelected(venue.id) }}
            />
          );
        })}
      </MapContainer>

      {/* Bottom card */}
      <AnimatePresence>
        {selectedVenue && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="absolute bottom-20 left-3 right-3 z-[1000] overflow-hidden rounded-2xl border border-border bg-card shadow-card"
          >
            <button
              onClick={() => navigate(`/venue/${selectedVenue.id}`)}
              className="flex w-full items-center gap-3 p-3 text-left"
            >
              <img
                src={selectedVenue.image}
                alt={selectedVenue.name}
                className="h-20 w-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-foreground">
                  {selectedVenue.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {selectedVenue.category} · {selectedVenue.priceRange}
                </p>
                <div className="mt-1 flex items-center gap-1">
                  <Star size={12} className="fill-primary text-primary" />
                  <span className="text-xs font-semibold text-foreground">
                    {selectedVenue.rating}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({selectedVenue.reviewCount})
                  </span>
                </div>
                <span
                  className={`mt-1 inline-block text-xs font-medium ${
                    selectedVenue.openNow ? "text-success" : "text-destructive"
                  }`}
                >
                  {selectedVenue.openNow ? "Open Now" : "Closed"}
                </span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapPage;
