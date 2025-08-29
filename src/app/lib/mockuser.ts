import { UserAccount } from "@/components/account/userinfo";

export const mockUsers: UserAccount[] = [
  {
    username: "Alice123",
    joinedOn: "January 16, 2025",
    icon: "/avatar.jpg",
    rating: 5,
    ratings: {
      responsive: 5,
      shipping: 4,
      reliable: 4,
    },
    uploadedListingIds: [
      { card: "sv9-1", listingId: "alice-001", soldby: "Alice123" },
      { card: "sv9-1", listingId: "alice-002", soldby: "Alice123" },
    ],
    reviews: [
      {
        username: "coolBuyer99",
        reviewDate: new Date("2024-01-10"),
        reviewText: "Great seller, items exactly as described!",
        rating: 5,
        ratings: { responsive: 5, shipping: 5, reliable: 5 },
      },
      {
        username: "collectEmAll",
        reviewDate: new Date("2024-03-22"),
        reviewText: "Fast shipping and very responsive. Would buy again.",
        rating: 4,
        ratings: { responsive: 4, shipping: 5, reliable: 3 },
      },
      {
        username: "troll_brian",
        reviewDate: new Date("2025-04-01"),
        reviewText: "Sent me a MTG card instead of pokemon!!!!!",
        rating: 2,
        ratings: { responsive: 1, shipping: 5, reliable: 3 },
      },
    ],
  },
  {
    username: "Bob456",
    joinedOn: "February 20, 2025",
    icon: "/avatar.jpg",
    rating: 4,
    ratings: { responsive: 4, shipping: 4, reliable: 4 },
    uploadedListingIds: [],
    reviews: [],
  },
];
