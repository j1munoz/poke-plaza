"use client";

import Image from "next/image";
import AutoplayCarousel from "../components/AutoplayCarousel";
import FilterMenu from "@/components/FilterDrop";
import SortMenu from "@/components/SortDrop";
import "./globals.css";
import Card from "@/components/home/card";
import { useState, useEffect } from "react";

export type CardSummary = {
  _id: string;
  cardId: string;
  name: string;
  setName: string;
  setSeries: string;
  image: string;
  releaseDate: string;
  number: string;
  averageSellPrice: number | null;
};

export default function Home() {
  const [cards, setCards] = useState<CardSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      const res = await fetch("/api/cards");
      const data = await res.json();
      setCards(data);
      setLoading(false);
    };

    fetchCards();
  }, []);

  return (
    <div className="font-sans min-h-screen flex flex-col items-center w-full ">
      {/* Carousel */}
      <div className="text-center bg-[#FFCB05] w-full text-black">
        <h1 className="text-3xl mt-8 font-bold whitespace-nowrap">
          Buy, Sell and Trade Your Cards!
        </h1>
        <h2 className="text-xl mt-2 whitespace-nowrap">
          Explore cards from...
        </h2>
      </div>

      <div className="w-full">
        <AutoplayCarousel />
      </div>

      <h1 className="text-3xl font-bold  whitespace-nowrap m-8 text-black">
        {" "}
        Welcome to Poke Plaza! Check out today&apos;s featured cards:
      </h1>

      {/* Search Bar & Filters*/}
      <div className="flex items-center">
        <div className="flex items-center bg-white rounded-full shadow-lg mb-8 px-4 py-2 w-full max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="flex-grow bg-transparent focus:outline-none px-2 text-gray-700 placeholder-gray-400"
          />
          <button className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-full p-2 transition">
            <Image src="/search-icon.png" alt="Search" width={20} height={20} />
          </button>
        </div>

        <FilterMenu filterType={"energy"} />

        <SortMenu />
      </div>

      {/* Card Section 
      
      Should be replaced with dynamic content from database in the future, currently hardcoded for layout purposes.
      using .map? I think?
      
      */}

      <div
        className="grid gap-6 justify-center"
        style={{ gridTemplateColumns: "repeat(3, 350px)" }}
      >
        {loading && <p>Loading cards...</p>}
        {cards &&
          cards.map((card, index) => (
            <Card
              key={index}
              image={card.image}
              name={card.name}
              price={card.averageSellPrice}
              cardId={card.cardId}
            />
          ))}
      </div>
    </div>
  );
}
