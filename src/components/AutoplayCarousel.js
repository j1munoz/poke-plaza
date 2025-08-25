import React from "react";
import "./autoplaycarousel.scss";
import { cardDetails } from "./carousel-config";
import CarouselItem from "./CarouselItem";

// Inspo: https://medium.com/@divyakoneti0001/how-to-create-an-autoplay-or-infinite-carousel-in-react-d9f9bff11048

export default function AutoplayCarousel() {
  return (
    <div className="carousel-container">
      <div className="carousel-track">
        {Object.keys(cardDetails).map((detailKey) => (
          <CarouselItem
            key={`first-${detailKey}`}
            imgUrl={cardDetails[detailKey].imgUrl}
            imgTitle={cardDetails[detailKey].title}
          />
        ))}

        {Object.keys(cardDetails).map((detailKey) => (
          <CarouselItem
            key={`second-${detailKey}`}
            imgUrl={cardDetails[detailKey].imgUrl}
            imgTitle={cardDetails[detailKey].title}
          />
        ))}
      </div>
    </div>
  );
}
