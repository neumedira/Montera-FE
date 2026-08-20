import elPrimo from "../assets/costumer/el-primo.png";

export const categories = [
  {
    id: "all",
    name: "All",
    icon: "burger",
  },
  {
    id: "combo",
    name: "Combo",
    icon: "combo",
  },
  {
    id: "burger",
    name: "Burger",
    icon: "burger",
  },
  {
    id: "drink",
    name: "Drink",
    icon: "drink",
  },
  {
    id: "snack",
    name: "Snack",
    icon: "snack",
  },
];

export const menuItems = [
  {
    id: 1,
    name: "EL PRIMO",
    price: 58000,
    category: "combo",
    image: elPrimo,
    bestseller: true,
    description:
      "Beef patty, cheese, pickles, onion, signature sauce. Hand-smashed daily on the flat top for maximum flavor.",
  },
  {
    id: 2,
    name: "EL PINA",
    price: 32000,
    category: "combo",
    image: elPrimo,
    bestseller: false,
    description:
      "Juicy beef patty with fresh vegetables, cheese and our signature sauce.",
  },
];