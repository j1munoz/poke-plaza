//src/components/carousel.tsx

"use client";

import { useState } from "react";
import Image from "next/image";

interface Slide {
  src: string;
}

interface ImageCarouselProps {
  slides: Slide[];
  size?: number;
}

export default function ImageCarousel({ slides, size }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dim = size ?? 600;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative mx-auto" style={{ width: dim, height: dim }}>
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`transition-opacity duration-700 flex justify-center items-center ${
            index === currentIndex ? "opacity-100 block" : "opacity-0 hidden"
          } w-full h-full`}
        >
          <Image
            src={slide.src}
            alt={`Slide ${index + 1}`}
            width={dim}
            height={dim}
            className="w-auto h-full rounded-lg"
          />
        </div>
      ))}

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded hover:bg-black/70 transition"
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded hover:bg-black/70 transition"
      >
        ❯
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? "bg-gray-800" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// //src/components/carousel.tsx

// "use client";

// import { useState } from "react";
// import Image from "next/image";

// interface Slide {
//   src: string;
// }

// interface ImageCarouselProps {
//   slides: Slide[];
//   size?: number;
// }

// export default function ImageCarousel({ slides, size }: ImageCarouselProps) {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const prevSlide = () => {
//     setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
//   };

//   const nextSlide = () => {
//     setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
//   };

//   const goToSlide = (index: number) => {
//     setCurrentIndex(index);
//   };

//   return (
//     <div className="relative mx-auto" style={{ width: size, height: size }}>
//       {/* Slides */}
//       {slides.map((slide, index) => (
//         <div
//           key={index}
//           className={`transition-opacity duration-700 flex justify-center items-center ${
//             index === currentIndex ? "opacity-100 block" : "opacity-0 hidden"
//           } w-full h-full`}
//         >
//           <img src={slide.src} className=" w-auto h-full rounded-lg" />
//         </div>
//       ))}

//       {/* Navigation buttons */}
//       <button
//         onClick={prevSlide}
//         className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded hover:bg-black/70 transition"
//       >
//         ❮
//       </button>
//       <button
//         onClick={nextSlide}
//         className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded hover:bg-black/70 transition"
//       >
//         ❯
//       </button>

//       {/* Dots */}
//       <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
//         {slides.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => goToSlide(index)}
//             className={`w-3 h-3 rounded-full transition-colors ${
//               index === currentIndex ? "bg-gray-800" : "bg-gray-400"
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
