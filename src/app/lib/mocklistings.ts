type Slide = {
  src: string;
};

type Listing = {
  id: string;
  user: string;
  condition: string;
  price: string;
  description: string;
  image: string;
  postDate: string;
  inStock: boolean;
  slides: Slide[];
};

type CardData = {
  title: string;
  cardnumber: string;
  releasedate: string;
  set: string;
  listings: Listing[];
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
        description:
          "Rare Klefki in mint condition. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        image: "/klefki.jpg",
        postDate: "August 25, 2025",
        inStock: true,
        slides: [
          { src: "/klefki.jpg" },
          { src: "/klefki.jpg" },
          { src: "/klefki.jpg" },
        ],
      },
      {
        id: "alice-002",
        user: "Bob",
        condition: "Used",
        price: "45.00",
        description: "Played Klefki card, some edge wear.",
        image: "/klefki.jpg",
        postDate: "January 28, 2025",
        inStock: true,
        slides: [{ src: "/klefki.jpg" }, { src: "/klefki.jpg" }, { src: "/klefki.jpg" }]
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
        postDate: "March 3, 2025",
        inStock: true,
        slides: [{ src: "/pikachu.jpg" }],
      },
    ],
  },
};
