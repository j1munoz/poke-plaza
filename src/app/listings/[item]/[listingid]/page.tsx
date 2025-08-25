import { listingsData } from '../../../lib/mocklistings';

type PageProps = {
  params: {
    item: string;
    listingid: string;
  };
};

export default function ListingDetailPage({ params }: PageProps) {
  const itemCategory = params.item?.toLowerCase();
  const listingId = params.listingid;

  const itemData = listingsData[itemCategory as keyof typeof listingsData];

  if (!itemData) {
    return <p>No listings found for category: {itemCategory}</p>;
  }

  const { title, listings } = itemData;

  const listing = listings.find((l) => l.id === listingId);

  if (!listing) {
    return <p>Listing not found: {listingId}</p>;
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <img src={listing.image} alt={title} className="mb-4 rounded" />
      <h1 className="text-2xl font-bold">
        {title} — Listed by {listing.user}
      </h1>
      <p className="text-gray-700 mt-2">{listing.description}</p>
      <p className="text-lg font-semibold mt-4">
        Condition: {listing.condition}
      </p>
      <p className="text-lg font-semibold mt-1">Price: {listing.price}</p>
      <button className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded">
        Buy Now
      </button>
    </div>
  );
}
