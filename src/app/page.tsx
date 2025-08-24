import Image from "next/image";
import AutoplayCarousel from '../components/AutoplayCarousel';
import RadioGroup from '../components/RadioGroup';
import './globals.css';

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col items-center ">

      {/* Carousel */}
      <div className="text-center bg-[#FFCB05] w-full">
        <h1 className="text-3xl mt-8 font-bold whitespace-nowrap">Buy, Sell and Trade Your Cards!</h1>
        <h2 className="text-xl mt-2 whitespace-nowrap">Explore cards from...</h2>
      </div>

      <div className="w-full">
        <AutoplayCarousel />
      </div>

      <h1 className="text-3xl font-bold whitespace-nowrap m-8"> Welcome to Poke Plaza! Check out today's featured cards:</h1>

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

        {/* Filter By Dropdown */}
        <div className="dropdown flex ml-4 mb-8">
          <button className="dropbtn whitespace-nowrap">Filter By ▼</button>
          <div className="dropdown-content text-white">
            <p className="bg-[#21386E]"> Energy Type </p>
            <EnergyTypeRadios />
          </div>
        </div>

        {/* Sort By Dropdown */}
      <div className="dropdown flex ml-4 mb-8">
        <button className="dropbtn whitespace-nowrap">Sort By ▼</button>
        <div className="dropdown-content text-white">
          <RadioGroup
            name="priceFilter"
            title="Price"
            options={[
              { label: "High to Low", value: "high-to-low" },
              { label: "Low to High", value: "low-to-high" },
            ]}
          />

          <RadioGroup
            name="dateFilter"
            title="Date"
            options={[
              { label: "Newest First", value: "newest" },
              { label: "Oldest First", value: "oldest" },
            ]}
          />
        </div>

        </div>

      </div>


      {/* Card Section 
      
      Should be replaced with dynamic content from database in the future, currently hardcoded for layout purposes.
      using .map? I think?
      
      */}

      <div className="grid gap-6 flex justify-center" style={{ gridTemplateColumns: "repeat(3, 350px)" }}>

        <div className="card">
          <div className="card-container">
            <img src="/klefki.jpg" alt="Card" className="rounded-t h-auto" />
            <h4>Klefki</h4>
            <p className="text-center"><b>$99.99</b></p>
            <button className="button-5" role="button">View Listings</button>
          </div>
        </div>

        <div className="card">
          <div className="card-container">
            <img src="/klefki.jpg" alt="Card" className="rounded-t h-auto" />
            <h4>Klefki</h4>
            <p className="text-center"><b>$99.99</b></p>
            <button className="button-5" role="button">View Listings</button>
          </div>
        </div>

        <div className="card">
          <div className="card-container">
            <img src="/klefki.jpg" alt="Card" className="rounded-t h-auto" />
            <h4>Klefki</h4>
            <p className="text-center">
              <b>$99.99</b>
            </p>
            <button className="button-5" role="button">View Listings</button>
          </div>
        </div>

      </div>

      

    </div>
  );
}

function EnergyTypeRadios() {
  const energyTypes = [
    "Grass",
    "Fire",
    "Water",
    "Lightning",
    "Psychic",
    "Fighting",
    "Darkness",
    "Metal",
    "Fairy",
    "Dragon",
    "Colorless",
  ];

  return (
    <div>
      {energyTypes.map((type) => (
        <label
          key={type}
          className="flex items-center space-x-2 bg-[#1D2C5E]"
        >
          <input
            type="radio"
            name="typeFilter"
            value={type.toLowerCase()}
            className="form-radio text-blue-600"
          />
          <span className="text-white">{type}</span>
        </label>
      ))}
    </div>
  );
}
