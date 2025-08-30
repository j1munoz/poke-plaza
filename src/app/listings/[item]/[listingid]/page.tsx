import { listingsData } from "../../../lib/mocklistings";
import ImageCarousel from "@/components/Carousel";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import AddReviewForm from "@/components/forms/review";
import Link from "next/link";
import { auth } from "@/auth";
// import Image from "next/image";

type PageProps = {
  params: {
    item: string;
    listingid: string;
  };
};

export default async function ListingDetailPage({ params }: PageProps) {
  const { item, listingid } = params;
  const itemCategory = item.toLowerCase();
  const listingId = listingid;

  const session = await auth();
  const loggedIn = Boolean(session?.user);

  const itemData = listingsData[itemCategory as keyof typeof listingsData];
  if (!itemData) return <p>No listings found for category: {itemCategory}</p>;

  const { title, listings, cardnumber, releasedate, set } = itemData;
  const listing = listings.find((l) => l.id === listingId);
  if (!listing) return <p>Listing not found: {listingId}</p>;

  const sessionName = session?.user?.name?.toLowerCase?.();
  const isOwner =
    (sessionName && sessionName === listing.soldby.toLowerCase?.()) ||
    (sessionName && sessionName === listing.user.toLowerCase?.());

  const callback = encodeURIComponent(`/listings/${item}/${listingid}`);

  return (
    <div className="flex flex-col p-6 w-full">
      <h1 className="text-4xl font-bold mb-8 text-center">{title}</h1>

      <div className="flex flex-col md:flex-row gap-8 w-full w-screen-xl mx-auto">
        <div className="bg-white shadow rounded-lg p-4 w-full md:w-1/3">
          <ImageCarousel slides={listing.slides} size={390} />
          <div className="text-center mt-4">
            <p className="text-3xl">${listing.price}</p>
            <p className="text-gray-800 ">#{cardnumber}</p>
            <p className="text-gray-600">{set}</p>
            <p className="text-gray-500">Released on {releasedate}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-2/3">
          <p className="mt-4">
            Sold by{" "}
            <Link
              href={`/account/${listing.soldby}`}
              className="hover:cursor-pointer underline hover:text-poke-yellow-100"
            >
              {listing.user}
            </Link>
            <br />
            <br />
            Card Condition: {listing.condition}
            <br />
            <br />
            Description:
          </p>

          <blockquote className="ml-5 mr-5">{listing.description}</blockquote>

          {loggedIn && !isOwner ? (
            <Dialog>
              <form>
                <DialogTrigger asChild>
                  <button className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded w-1/4">
                    Buy Now
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>Card Purchased</DialogTitle>
                    <DialogDescription>
                      Leave a review to {listing.user}
                    </DialogDescription>
                  </DialogHeader>
                  <AddReviewForm soldBy={listing.soldby} />
                </DialogContent>
              </form>
            </Dialog>
          ) : !loggedIn ? (
            <Link
              href={`/signin?callbackUrl=${callback}`}
              className="mt-6 inline-block bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded w-1/4 text-center"
            >
              Sign in to Buy
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// // app/listings/[item]/page.tsx
// // import SortMenu from "@/components/SortDrop";
// // import FilterMenu from "@/components/FilterDrop";
// // import { getDb } from "@/lib/db";
// // import Image from "next/image";
// import { listingsData } from "../../lib/mocklistings";
// import Link from "next/link";

// export type CardSummary = {
//   _id: string;
//   cardId: string;
//   name: string;
//   setName: string;
//   setSeries: string;
//   image: string;
//   releaseDate: string;
//   number: string;
//   averageSellPrice: number | null;
//   types?: string[];
// };

// export default async function ItemListingsPage({
//   params,
// }: {
//   params: Promise<{ item: string }>;
// }) {
//   const { item } = await params;
//   const itemKey = item.toLocaleLowerCase();

//   const itemData = listingsData[itemKey as keyof typeof listingsData];

//   if (!itemData) {
//     return <p>No listings found for {itemKey}</p>;
//   }

//   const { title, listings, cardnumber, releasedate, set } = itemData;

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 ml-40 mr-40">
//       {/* Title */}
//       <h1 className="text-4xl font-bold mb-8">{title}</h1>

//       {/* Content */}
//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Left: Card Image & Info */}
//         <div className="bg-white shadow rounded-lg p-4 w-100">
//           <img src={listings[0].image} alt={title} className="mb-2 rounded" />
//           <div className="text-center mt-4">
//             <p className="text-gray-800 font-semibold">#{cardnumber}</p>
//             <p className="text-gray-600">{set}</p>
//             <p className="text-gray-500">Released on {releasedate}</p>
//           </div>
//         </div>

//         {/* Right: Listings */}
//         <div className="flex flex-col gap-4">
//           {listings.map((listing) => (
//             <div
//               key={listing.id}
//               className="bg-white shadow rounded-lg flex justify-between items-center p-4 w-150"
//             >
//               <div>
//                 <p className="text-2xl font-bold">${listing.price}</p>
//                 <p className="text-gray-600 text-sm">
//                   Sold by {listing.user} — Condition: {listing.condition}
//                 </p>
//               </div>
//               <Link href={`/listings/${itemKey}/${listing.id}`} passHref>
//                 <button className="bg-yellow-400 text-white font-semibold px-4 py-2 rounded hover:bg-yellow-500 transition">
//                   View Card
//                 </button>
//               </Link>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
