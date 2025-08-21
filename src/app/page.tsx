import Image from "next/image";
import AutoplayCarousel from '../components/AutoplayCarousel';
import './globals.css';

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col items-center ">
      
      {/* Navigation Bar */}
      <nav className="top-nav w-full text-white p-4 flex justify-between items-center">
        <div className="text-lg font-bold">Poke Plaza</div>
        <div className="flex space-x-4">
          <a href="#home" className="hover:underline">Home</a>
          <a href="#about" className="hover:underline">Account Settings</a>
          <a href="#contact" className="hover:underline">Sign In</a>
        </div>
      </nav>

      {/* Carousel */}
      <div className="text-center bg-[#FFCB05] w-full">
        <h1 className="text-3xl mt-8 font-bold whitespace-nowrap">Buy, Sell and Trade Your Cards!</h1>
        <h2 className="text-xl mt-2 whitespace-nowrap">Explore cards from...</h2>
      </div>

      <div className = "w-full">
        <AutoplayCarousel/>
      </div>

      <h1 className="m-4"> Welcome to Poke Plaza!</h1>
      
    </div>
  );
}
