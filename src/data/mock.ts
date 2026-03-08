// Logos
import logoFeliz from "@/assets/logo-feliz.png";
import logoBurger from "@/assets/logo-burger.png";
import logoHavana from "@/assets/logo-havana.png";
import logoTapas from "@/assets/logo-tapas.png";

// Covers
import coverFeliz from "@/assets/cover-feliz.jpg";
import coverBurger from "@/assets/cover-burger.jpg";
import coverHavana from "@/assets/cover-havana.jpg";
import coverTapas from "@/assets/cover-tapas.jpg";

// Dishes
import dishPaella from "@/assets/dish-paella.jpg";
import dishSecreto from "@/assets/dish-secreto.jpg";
import dishCrema from "@/assets/dish-crema.jpg";
import dishSmashburger from "@/assets/dish-smashburger.jpg";
import dishFries from "@/assets/dish-fries.jpg";
import dishCheesecake from "@/assets/dish-cheesecake.jpg";
import dishMojito from "@/assets/dish-mojito.jpg";
import dishDaiquiri from "@/assets/dish-daiquiri.jpg";
import dishCubano from "@/assets/dish-cubano.jpg";
import dishBravas from "@/assets/dish-bravas.jpg";
import dishJamon from "@/assets/dish-jamon.jpg";
import dishCroquetas from "@/assets/dish-croquetas.jpg";

export interface Venue {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  address: string;
  lat: number;
  lng: number;
  image: string;
  logo: string;
  openNow: boolean;
  distance: string;
}

export interface MenuItem {
  id: string;
  venueId: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  popular: boolean;
}

export interface FeedPost {
  id: string;
  venueId: string;
  venueName: string;
  venueLogo: string;
  dishName: string;
  image: string;
  price: number;
  rating: number;
  likes: number;
  caption: string;
  timeAgo: string;
  trending: boolean;
}

export interface Reservation {
  id: string;
  venueId: string;
  venueName: string;
  venueImage: string;
  date: string;
  time: string;
  guests: number;
  status: "confirmed" | "pending" | "completed" | "cancelled";
}

export interface ChatMessage {
  id: string;
  venueId: string;
  venueName: string;
  lastMessage: string;
  timeAgo: string;
  unread: number;
  venueImage: string;
}

export const venues: Venue[] = [
  {
    id: "1",
    name: "Feliz Valencia",
    category: "Spanish",
    rating: 4.8,
    reviewCount: 342,
    priceRange: "€€€",
    address: "Carrer de la Pau 14, Valencia",
    lat: 39.4699,
    lng: -0.3763,
    image: coverFeliz,
    logo: logoFeliz,
    openNow: true,
    distance: "0.3 km",
  },
  {
    id: "2",
    name: "Burger Club",
    category: "American",
    rating: 4.5,
    reviewCount: 521,
    priceRange: "€€",
    address: "Calle Colón 32, Valencia",
    lat: 39.4685,
    lng: -0.3710,
    image: coverBurger,
    logo: logoBurger,
    openNow: true,
    distance: "0.7 km",
  },
  {
    id: "3",
    name: "Havana Bar",
    category: "Cocktail Bar",
    rating: 4.7,
    reviewCount: 189,
    priceRange: "€€€",
    address: "Carrer del Barón de Cárcer 8, Valencia",
    lat: 39.4730,
    lng: -0.3790,
    image: coverHavana,
    logo: logoHavana,
    openNow: true,
    distance: "1.2 km",
  },
  {
    id: "4",
    name: "Tapas Valencia",
    category: "Tapas",
    rating: 4.9,
    reviewCount: 276,
    priceRange: "€€",
    address: "Plaza del Ayuntamiento 5, Valencia",
    lat: 39.4702,
    lng: -0.3755,
    image: coverTapas,
    logo: logoTapas,
    openNow: true,
    distance: "0.5 km",
  },
];

export const menuItems: MenuItem[] = [
  // Feliz Valencia
  { id: "m1", venueId: "1", name: "Seafood Paella", price: 24.90, image: dishPaella, category: "Mains", description: "Saffron rice with prawns, mussels, and calamari", popular: true },
  { id: "m2", venueId: "1", name: "Secreto Ibérico", price: 19.50, image: dishSecreto, category: "Mains", description: "Grilled Iberian pork with roasted vegetables", popular: true },
  { id: "m3", venueId: "1", name: "Crema Catalana", price: 8.50, image: dishCrema, category: "Desserts", description: "Traditional caramelized custard dessert", popular: false },

  // Burger Club
  { id: "m4", venueId: "2", name: "Smash Burger Deluxe", price: 14.50, image: dishSmashburger, category: "Burgers", description: "Double smash patty with aged cheddar & bacon", popular: true },
  { id: "m5", venueId: "2", name: "Truffle Fries", price: 7.90, image: dishFries, category: "Sides", description: "Loaded truffle fries with parmesan & herbs", popular: true },
  { id: "m6", venueId: "2", name: "NY Cheesecake", price: 9.00, image: dishCheesecake, category: "Desserts", description: "Creamy cheesecake with berry coulis", popular: false },

  // Havana Bar
  { id: "m7", venueId: "3", name: "Classic Mojito", price: 11.00, image: dishMojito, category: "Cocktails", description: "Fresh mint, lime, white rum, crushed ice", popular: true },
  { id: "m8", venueId: "3", name: "Tropical Daiquiri", price: 12.50, image: dishDaiquiri, category: "Cocktails", description: "Pineapple & passion fruit daiquiri", popular: true },
  { id: "m9", venueId: "3", name: "Cubano Sandwich", price: 13.90, image: dishCubano, category: "Food", description: "Pressed ham, cheese & pickle sandwich", popular: false },

  // Tapas Valencia
  { id: "m10", venueId: "4", name: "Patatas Bravas", price: 7.50, image: dishBravas, category: "Tapas", description: "Crispy potatoes with spicy tomato sauce & aioli", popular: true },
  { id: "m11", venueId: "4", name: "Jamón Ibérico", price: 18.00, image: dishJamon, category: "Tapas", description: "Hand-carved Iberian ham with bread & olives", popular: true },
  { id: "m12", venueId: "4", name: "Croquetas de Jamón", price: 9.50, image: dishCroquetas, category: "Tapas", description: "Golden fried ham croquettes with aioli", popular: true },
];

export const feedPosts: FeedPost[] = [
  { id: "1", venueId: "1", venueName: "Feliz Valencia", venueLogo: logoFeliz, dishName: "Seafood Paella", image: dishPaella, price: 24.90, rating: 4.9, likes: 234, caption: "The best paella in Valencia 🥘🔥 Fresh seafood straight from the port!", timeAgo: "12 min", trending: true },
  { id: "2", venueId: "2", venueName: "Burger Club", venueLogo: logoBurger, dishName: "Smash Burger Deluxe", image: dishSmashburger, price: 14.50, rating: 4.7, likes: 189, caption: "Double smash patty with aged cheddar 🍔 Limited edition this weekend!", timeAgo: "28 min", trending: true },
  { id: "3", venueId: "3", venueName: "Havana Bar", venueLogo: logoHavana, dishName: "Classic Mojito", image: dishMojito, price: 11.00, rating: 4.8, likes: 156, caption: "Perfect mojito for a warm Valencia evening 🍹 Live music tonight!", timeAgo: "1h", trending: false },
  { id: "4", venueId: "4", venueName: "Tapas Valencia", venueLogo: logoTapas, dishName: "Jamón Ibérico", image: dishJamon, price: 18.00, rating: 5.0, likes: 312, caption: "Hand-carved perfection — the real deal 🐖✨", timeAgo: "2h", trending: true },
  { id: "5", venueId: "4", venueName: "Tapas Valencia", venueLogo: logoTapas, dishName: "Patatas Bravas", image: dishBravas, price: 7.50, rating: 4.6, likes: 98, caption: "Crispy, spicy, addictive — the holy trinity 🥔🔥", timeAgo: "3h", trending: false },
  { id: "6", venueId: "1", venueName: "Feliz Valencia", venueLogo: logoFeliz, dishName: "Crema Catalana", image: dishCrema, price: 8.50, rating: 4.8, likes: 145, caption: "Cracking the caramel is half the fun 🍮", timeAgo: "4h", trending: false },
  { id: "7", venueId: "3", venueName: "Havana Bar", venueLogo: logoHavana, dishName: "Tropical Daiquiri", image: dishDaiquiri, price: 12.50, rating: 4.7, likes: 120, caption: "Pineapple & passion fruit paradise 🍍🌴", timeAgo: "5h", trending: false },
  { id: "8", venueId: "2", venueName: "Burger Club", venueLogo: logoBurger, dishName: "Truffle Fries", image: dishFries, price: 7.90, rating: 4.5, likes: 87, caption: "These truffle fries are dangerously good 🍟", timeAgo: "6h", trending: false },
];

export const reservations: Reservation[] = [
  { id: "r1", venueId: "1", venueName: "Feliz Valencia", venueImage: coverFeliz, date: "Mar 8, 2026", time: "20:30", guests: 4, status: "confirmed" },
  { id: "r2", venueId: "4", venueName: "Tapas Valencia", venueImage: coverTapas, date: "Mar 12, 2026", time: "19:00", guests: 2, status: "pending" },
  { id: "r3", venueId: "2", venueName: "Burger Club", venueImage: coverBurger, date: "Feb 28, 2026", time: "21:00", guests: 3, status: "completed" },
  { id: "r4", venueId: "3", venueName: "Havana Bar", venueImage: coverHavana, date: "Mar 15, 2026", time: "22:00", guests: 6, status: "confirmed" },
];

export const chatMessages: ChatMessage[] = [
  { id: "c1", venueId: "1", venueName: "Feliz Valencia", lastMessage: "Your table is confirmed! See you at 20:30 🎉", timeAgo: "5 min", unread: 2, venueImage: coverFeliz },
  { id: "c2", venueId: "4", venueName: "Tapas Valencia", lastMessage: "We have a terrace seat available!", timeAgo: "1h", unread: 0, venueImage: coverTapas },
  { id: "c3", venueId: "3", venueName: "Havana Bar", lastMessage: "Happy hour starts at 18:00 🍹", timeAgo: "3h", unread: 1, venueImage: coverHavana },
];

export const trendingDishes = [
  { name: "Paella", emoji: "🥘", count: 47, venue: "Feliz Valencia" },
  { name: "Burger", emoji: "🍔", count: 38, venue: "Burger Club" },
  { name: "Cocktails", emoji: "🍹", count: 31, venue: "Havana Bar" },
  { name: "Tapas", emoji: "🫒", count: 29, venue: "Tapas Valencia" },
];
