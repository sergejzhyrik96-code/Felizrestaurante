import dishPaella from "@/assets/dish-paella.jpg";
import dishSecreto from "@/assets/dish-secreto.jpg";
import dishCrema from "@/assets/dish-crema.jpg";
import dishBravas from "@/assets/dish-bravas.jpg";
import dishJamon from "@/assets/dish-jamon.jpg";
import dishCroquetas from "@/assets/dish-croquetas.jpg";
import dishMojito from "@/assets/dish-mojito.jpg";
import dishDaiquiri from "@/assets/dish-daiquiri.jpg";
import dishCubano from "@/assets/dish-cubano.jpg";
import dishSmashburger from "@/assets/dish-smashburger.jpg";
import dishFries from "@/assets/dish-fries.jpg";
import dishCheesecake from "@/assets/dish-cheesecake.jpg";

export interface MenuItemData {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  popular?: boolean;
}

export const menuCategories = ["Tapas", "Paella", "Meat", "Fish", "Desserts", "Drinks"] as const;

export const menuItems: MenuItemData[] = [
  // Tapas
  { id: "t1", name: "Patatas Bravas", price: 7.50, image: dishBravas, category: "Tapas", description: "Crispy potatoes with spicy tomato sauce & homemade aioli", popular: true },
  { id: "t2", name: "Jamón Ibérico de Bellota", price: 22.00, image: dishJamon, category: "Tapas", description: "Hand-carved 36-month acorn-fed Iberian ham", popular: true },
  { id: "t3", name: "Croquetas de Jamón", price: 9.50, image: dishCroquetas, category: "Tapas", description: "Golden fried ham croquettes with truffle aioli" },
  { id: "t4", name: "Pan con Tomate", price: 5.50, image: dishFries, category: "Tapas", description: "Toasted sourdough with fresh tomato & EVOO" },

  // Paella
  { id: "p1", name: "Paella Valenciana", price: 24.90, image: dishPaella, category: "Paella", description: "Traditional saffron rice with prawns, mussels & calamari", popular: true },
  { id: "p2", name: "Arroz Negro", price: 22.00, image: dishPaella, category: "Paella", description: "Black squid ink rice with cuttlefish & alioli" },
  { id: "p3", name: "Fideuà", price: 19.50, image: dishPaella, category: "Paella", description: "Toasted noodle paella with seafood & romesco" },

  // Meat
  { id: "me1", name: "Secreto Ibérico", price: 26.50, image: dishSecreto, category: "Meat", description: "Grilled Iberian pork with charred vegetables & mojo verde", popular: true },
  { id: "me2", name: "Solomillo al Pedro Ximénez", price: 32.00, image: dishSecreto, category: "Meat", description: "Beef tenderloin in PX sherry reduction" },
  { id: "me3", name: "Smash Burger FELIZ", price: 16.50, image: dishSmashburger, category: "Meat", description: "Double smash patty, aged cheddar, truffle mayo" },

  // Fish
  { id: "f1", name: "Lubina a la Sal", price: 28.00, image: dishCubano, category: "Fish", description: "Salt-crusted Mediterranean sea bass" },
  { id: "f2", name: "Pulpo a la Gallega", price: 19.50, image: dishBravas, category: "Fish", description: "Galician-style octopus with paprika & olive oil" },

  // Desserts
  { id: "d1", name: "Crema Catalana", price: 8.50, image: dishCrema, category: "Desserts", description: "Traditional caramelized custard with cinnamon & citrus", popular: true },
  { id: "d2", name: "Tarta de Santiago", price: 9.00, image: dishCheesecake, category: "Desserts", description: "Galician almond cake with powdered sugar" },
  { id: "d3", name: "Churros con Chocolate", price: 7.50, image: dishCrema, category: "Desserts", description: "Crispy churros with thick dark chocolate dipping sauce" },

  // Drinks
  { id: "dr1", name: "Sangría de la Casa", price: 8.00, image: dishMojito, category: "Drinks", description: "House sangria with seasonal fruits & cinnamon" },
  { id: "dr2", name: "Valencia Mojito", price: 11.00, image: dishMojito, category: "Drinks", description: "Fresh mint, lime, white rum & orange blossom", popular: true },
  { id: "dr3", name: "Passion Daiquiri", price: 12.50, image: dishDaiquiri, category: "Drinks", description: "Pineapple & passion fruit frozen daiquiri" },
];

export interface GastroBox {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  items: string[];
  serves: string;
}

export const gastroBoxes: GastroBox[] = [
  {
    id: "gb1",
    name: "Mediterranean Tapas Box",
    description: "A curated selection of our finest tapas — perfect for sharing at home.",
    price: 45.00,
    image: "",
    items: ["Jamón Ibérico", "Croquetas", "Patatas Bravas", "Pan con Tomate", "Manchego Cheese"],
    serves: "2-3 persons",
  },
  {
    id: "gb2",
    name: "Paella Experience Box",
    description: "Everything you need for an authentic Valencian paella night.",
    price: 65.00,
    image: "",
    items: ["Paella Kit (rice, saffron, broth)", "Fresh Seafood Mix", "Alioli", "Bread & Olive Oil"],
    serves: "4 persons",
  },
  {
    id: "gb3",
    name: "Premium Ibérico Box",
    description: "The finest Iberian selections for a luxury tasting experience.",
    price: 89.00,
    image: "",
    items: ["Jamón Ibérico de Bellota", "Lomo Ibérico", "Chorizo Ibérico", "Manchego DOP", "Olives & Bread"],
    serves: "4-6 persons",
  },
];
