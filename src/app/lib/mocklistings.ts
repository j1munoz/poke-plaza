type Slide = {
  src: string;
};

type Listing = {
  id: string;
  user: string;
  soldby: string;
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
  "sv9-1": {
    title: "Caterpie",
    cardnumber: "186",
    releasedate: "November 13, 2020",
    set: "SWSH08 - Fusion Strike",
    listings: [
      {
        id: "alice-001",
        user: "Alice",
        soldby: "Alice123",
        condition: "Mint",
        price: "8.99",
        description:
          "This Caterpie card is in pristine, mint condition—ideal for collectors seeking a flawless addition to their Pokémon TCG portfolio. The card features sharp corners, a clean surface with no scratches, and vibrant colors that pop under any lighting. Stored in a protective sleeve since opening, it has never been played or handled without gloves. A true gem from the Fusion Strike set, perfect for grading or showcasing.",
        image: "/caterpie.jpg",
        postDate: "August 25, 2025",
        inStock: true,
        slides: [
          { src: "/caterpie.jpg" },
          { src: "/cat1.png" },
          { src: "/cat2.png" },
        ],
      },
      {
        id: "alice-002",
        user: "Bob",
        soldby: "Bob456",
        condition: "Used",
        price: "3.00",
        description: "Used Caterpie with slight edge wear.",
        image: "/caterpie.jpg",
        postDate: "January 28, 2025",
        inStock: true,
        slides: [{ src: "/caterpie.jpg" }, { src: "/cat3.png" }],
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
        soldby: "Charlie789",
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
