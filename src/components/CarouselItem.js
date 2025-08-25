import Image from "next/image";

export default function CarouselItem({ imgUrl, imgTitle }) {
  return (
    <div className="carousel-card">
      <Image src={imgUrl} alt={imgTitle} height={500} width={500} />
    </div>
  );
}
