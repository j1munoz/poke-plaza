import { listingsData } from "../../lib/mocklistings";
import Link from "next/link";

import Image from "next/image";

export default async function ItemListingsPage({
  params,
}: {
  params: { item: string };
}) {
  const { item } = params;
  const itemKey = item.toLowerCase();

  const itemData = listingsData[itemKey as keyof typeof listingsData];
  if (!itemData) return <p>No listings found for {itemKey}</p>;

  const { title, listings, cardnumber, releasedate, set } = itemData;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 ml-40 mr-40">
      <h1 className="text-4xl font-bold mb-8">{title}</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="bg-white shadow rounded-lg p-4 w-100">
          <Image
            src={listings[0].image}
            alt={title}
            width={600}
            height={600}
            className="mb-2 rounded"
            priority
          />
          <div className="text-center mt-4">
            <p className="text-gray-800 font-semibold">#{cardnumber}</p>
            <p className="text-gray-600">{set}</p>
            <p className="text-gray-500">Released on {releasedate}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white shadow rounded-lg flex justify-between items-center p-4 w-150"
            >
              <div>
                <p className="text-2xl font-bold">${listing.price}</p>
                <p className="text-gray-600 text-sm">
                  Sold by {listing.user} — Condition: {listing.condition}
                </p>
              </div>
              <Link href={`/listings/${itemKey}/${listing.id}`}>
                <button className="bg-yellow-400 text-white font-semibold px-4 py-2 rounded hover:bg-yellow-500 transition">
                  View Card
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
