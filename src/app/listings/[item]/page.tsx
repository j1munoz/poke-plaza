// app/listings/[item]/page.tsx
import { listingsData } from '../../lib/mocklistings';
import Link from 'next/link';

export default function ItemListingsPage({ params }: { params: { item: string } }) {
  const item = params.item.toLowerCase();
  const listings = listingsData[item as keyof typeof listingsData];

  if (!listings) {
    return <p>No listings found for {item}</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Listings for {item}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {listings.map((listing) => (
          <Link
            key={listing.id}
            href={`/listings/${item}/${listing.id}`}
            className="border p-4 rounded shadow hover:shadow-lg transition"
          >
            <img src={listing.image} alt={item} className="mb-2 rounded" />
            <h2 className="text-xl font-semibold">{listing.user}</h2>
            <p>{listing.condition} — {listing.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
