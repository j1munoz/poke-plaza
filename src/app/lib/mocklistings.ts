import { release } from "os";

type CardData = {
  title: string;
  cardnumber: string;
  releasedate: string;
  set: string;
  listings: {
    id: string;
    user: string;
    condition: string;
    price: string;
    description: string;
    image: string;
  }[];
};


export const listingsData: Record<string, CardData> = {
  klefki: {
    title: "Klefki", 
    cardnumber: "186",
    releasedate: "November 13, 2020",
    set: "SWSH08 - Fusion Strike",
    listings: [
      {
        id: "alice-001",
        user: "Alice",
        condition: "Mint",
        price: "99.99",
        description: "Rare Klefki in mint condition.",
        image: "/klefki.jpg",
      },
      {
        id: "bob-002",
        user: "Bob",
        condition: "Used",
        price: "45.00",
        description: "Played Klefki card, some edge wear.",
        image: "/klefki.jpg",
      },
    ],
  },

  pikachu: {
    title: "Pikachu",
    cardnumber: "999",
    releasedate: "February 22, 2003",
    set: "Testing Set",
    listings: [
      {
        id: "charlie-001",
        user: "Charlie",
        condition: "Mint",
        price: "120.00",
        description: "Rare Pikachu holographic card.",
        image: "/pikachu.jpg",
      },
    ],
  },
};
