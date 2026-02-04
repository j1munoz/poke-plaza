// app/listings/[item]/page.tsx
import Link from "next/link";

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

type Listing = {
  id: string;
  price: number;
  user: string;
  condition: string;
  image: string;
};

type FullCardData = CardSummary & {
  listings?: Listing[];
};

export default async function ItemListingsPage({
  params,
}: {
  params: { item: string };
}) {
  const { item: slug } = params;

  const match = slug.match(/-(\d+)$/);
  const cardNumber = match ? parseInt(match[1], 10) : null;

  if (!cardNumber) {
    return (
      <p className="text-center mt-20 text-xl font-bold">
        Invalid card number.
      </p>
    );
  }

  let cardData: FullCardData | null = null;
  let listings: Listing[] = [];
  let error = null;

  try {
    console.log("slug:", slug, "cardNumber:", cardNumber);

    // Fetch card info
    const cardRes = await fetch(
      `http://localhost:3000/api/cardlisting/${slug}`,
      { cache: "no-store" }
    );
    if (!cardRes.ok) throw new Error("Failed to fetch card info.");
    cardData = await cardRes.json();

    // Fetch listings
    const listRes = await fetch(`http://localhost:3000/api/cardNumber/${cardNumber}`, { cache: "no-store" });


    if (!listRes.ok) throw new Error("Failed to fetch listings.");
    const listData = await listRes.json();


    listings = listData.map((l: any) => ({
      id: l.id,
      price: l.price,
      user: l.ownerUsername,
      condition: l.condition,
      image: l.images?.[0] ?? "",
    }));

    if (cardData) {
      cardData.listings = listings;
    }
  } catch (err) {
    console.error(err);
    error = "Failed to load card or listings data. Please try again later.";
  }

  if (error || !cardData) {
    return (
      <p className="text-center mt-20 text-xl font-bold">
        {error || "No data found for this card."}
      </p>
    );
  }

  const { name, number, setName, releaseDate, image, averageSellPrice } =
    cardData;

  return (
    <div className="min-h-screen bg-gray-100 p-6 ml-40 mr-40">
      <h1 className="text-4xl font-bold mb-8">{name}</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side*/}
        <div className="bg-white shadow rounded-lg p-4 w-full md:w-1/2 flex flex-col items-center">
          <img src={image} alt={name} className="mb-2 rounded" />
          <div className="text-center mt-4">
            <p className="text-gray-800 font-semibold">#{number}</p>
            <p className="text-gray-600">{setName}</p>
            <p className="text-gray-500">Released on {releaseDate}</p>
            {averageSellPrice && (
              <p className="text-gray-800 font-semibold mt-2">
                Average Price: ${averageSellPrice.toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-4 w-full md:w-1/2">
          <h2 className="text-2xl font-semibold mb-2">Available Listings</h2>
          {listings.length === 0 ? (
            <p>No listings found for this card.</p>
          ) : (
            listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white shadow rounded-lg flex justify-between items-center p-4 w-full"
              >
                <div>
                  <p className="text-2xl font-bold">${listing.price}</p>
                  <p className="text-gray-600 text-sm">
                    Sold by {listing.user} — Condition: {listing.condition}
                  </p>
                </div>
                <Link
                  href={`/listing/${listing.id}`}
                  passHref
                >
                  <button className="bg-yellow-400 text-white font-semibold px-4 py-2 rounded hover:bg-yellow-500 transition">
                    View Card
                  </button>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}