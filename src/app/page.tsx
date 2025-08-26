import Image from "next/image";
import AutoplayCarousel from "../components/AutoplayCarousel";
import FilterMenu from "@/components/FilterDrop";
import SortMenu from "@/components/SortDrop";
import "./globals.css";
import Link from "next/link";
import SellerCard from "@/components/account/sellercard";

export default function Home() {
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
        <div className="card">
          <div className="card-container">
            <Image
              src="/klefki.jpg"
              alt="Card"
              width={600}
              height={600}
              className="rounded-t h-auto"
            />
            <h4>Klefki</h4>
            <p className="text-center">
              <b>$99.99</b>
            </p>
            <Link href="/listings/klefki" passHref>
              {" "}
              {/* Example link to listings page */}
              <button className="button-5" role="button">
                View Listings
              </button>
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-container">
            <Image
              src="/klefki.jpg"
              alt="Card"
              width={600}
              height={600}
              className="rounded-t h-auto"
            />
            <h4>Klefki</h4>
            <p className="text-center">
              <b>$99.99</b>
            </p>
            <button className="button-5" role="button">
              View Listings
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-container">
            <Image
              src="/klefki.jpg"
              alt="Card"
              width={600}
              height={600}
              className="rounded-t h-auto"
            />
            <h4>Klefki</h4>
            <p className="text-center">
              <b>$99.99</b>
            </p>
            <button className="button-5" role="button">
              View Listings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
