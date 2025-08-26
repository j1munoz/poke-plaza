export interface Review {
  username: string;
  reviewDate: Date;
  reviewText: string;
  rating: number;
  ratings: {
    responsive: number;
    shipping: number;
    reliable: number;
  };
}

