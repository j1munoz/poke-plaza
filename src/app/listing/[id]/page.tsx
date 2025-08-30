// src/app/listing/[id]/page.tsx
import { auth } from "@/auth";
import ImageCarousel from "@/components/Carousel";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import Link from "next/link";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import AddReviewForm from "@/components/forms/review";

type Params = { id: string };

type DbListing = {
  _id: ObjectId;
  images?: string[];
  slides?: { src: string }[];
  price: number | string;
  condition?: string;
  description?: string;
  soldby?: string;
  user?: string;
  title?: string;
  cardName?: string;
  cardnumber?: string | number;
  releasedate?: string;
  set?: string;
};

export default async function ListingPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) return <p>Invalid listing id.</p>;

  const db = await getDb();
  const doc = (await db
    .collection<DbListing>("listings")
    .findOne({ _id: new ObjectId(id) })) as DbListing | null;

  if (!doc) return <p>Listing not found.</p>;

  const session = await auth();
  const loggedIn = Boolean(session?.user);

  const slides =
    (doc.slides && doc.slides.length > 0
      ? doc.slides
      : (doc.images ?? []).map((src) => ({ src }))) || [];

  const price =
    typeof doc.price === "number" ? doc.price.toFixed(2) : String(doc.price);

  const sellerHandle = doc.soldby ?? doc.user ?? "unknown";
  const isOwner =
    loggedIn &&
    (session!.user!.username?.toLowerCase?.() ===
      sellerHandle.toLowerCase?.() ||
      session!.user!.name?.toLowerCase?.() === sellerHandle.toLowerCase?.());

  const title = doc.title ?? doc.cardName ?? "Card";
  const cardnumber = doc.cardnumber ?? "";
  const set = doc.set ?? "";
  const releasedate = doc.releasedate ?? "";

  const callback = encodeURIComponent(`/listing/${id}`);

  return (
    <div className="flex flex-col p-6 w-full">
      <h1 className="text-4xl font-bold mb-8 text-center">{title}</h1>

      <div className="flex flex-col md:flex-row gap-8 w-full w-screen-xl mx-auto">
        <div className="bg-white shadow rounded-lg p-4 w-full md:w-1/3">
          {slides.length > 0 ? (
            <ImageCarousel slides={slides} size={390} />
          ) : (
            <div className="w-[390px] h-[390px] bg-gray-100 grid place-items-center rounded">
              <span className="text-gray-500 text-sm">No images</span>
            </div>
          )}

          <div className="text-center mt-4">
            <p className="text-3xl">${price}</p>
            {cardnumber ? (
              <p className="text-gray-800">#{String(cardnumber)}</p>
            ) : null}
            {set ? <p className="text-gray-600">{set}</p> : null}
            {releasedate ? (
              <p className="text-gray-500">Released on {releasedate}</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-2/3">
          <p className="mt-4">
            Sold by{" "}
            <Link
              href={`/account/${encodeURIComponent(sellerHandle)}`}
              className="hover:cursor-pointer underline hover:text-poke-yellow-100"
            >
              {doc.user ?? sellerHandle}
            </Link>
            <br />
            <br />
            {doc.condition ? (
              <>
                Card Condition: {doc.condition}
                <br />
                <br />
              </>
            ) : null}
            Description:
          </p>

          <blockquote className="ml-5 mr-5">
            {doc.description ?? "No description provided."}
          </blockquote>

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
                      Leave a review to {doc.user ?? sellerHandle}
                    </DialogDescription>
                  </DialogHeader>
                  <AddReviewForm soldBy={sellerHandle} />
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

// src/app/listing/[id]/page.tsx
// import { auth } from "@/auth";
// import ImageCarousel from "@/components/Carousel";
// import { getDb } from "@/lib/db";
// import { ObjectId } from "mongodb";
// import Link from "next/link";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import AddReviewForm from "@/components/forms/review";

// type Params = { id: string };

// type DbListing = {
//   _id: ObjectId;
//   images?: string[];
//   slides?: { src: string }[];
//   price: number | string;
//   condition?: string;
//   description?: string;
//   soldby?: string;
//   user?: string;
//   title?: string;
//   cardName?: string;
//   cardnumber?: string | number;
//   releasedate?: string;
//   set?: string;
// };

// export default async function ListingPage({ params }: { params: Params }) {
//   const { id } = params;

//   if (!ObjectId.isValid(id)) return <p>Invalid listing id.</p>;

//   const db = await getDb();
//   const doc = (await db
//     .collection<DbListing>("listings")
//     .findOne({ _id: new ObjectId(id) })) as DbListing | null;

//   if (!doc) return <p>Listing not found.</p>;

//   const session = await auth();
//   const loggedIn = Boolean(session?.user);

//   const slides =
//     (doc.slides && doc.slides.length > 0
//       ? doc.slides
//       : (doc.images ?? []).map((src) => ({ src }))) || [];

//   const price =
//     typeof doc.price === "number" ? doc.price.toFixed(2) : String(doc.price);

//   const sellerHandle = doc.soldby ?? doc.user ?? "unknown";
//   const isOwner =
//     loggedIn &&
//     (session!.user!.username?.toLowerCase?.() ===
//       sellerHandle.toLowerCase?.() ||
//       session!.user!.name?.toLowerCase?.() === sellerHandle.toLowerCase?.());

//   const title = doc.title ?? doc.cardName ?? "Card";
//   const cardnumber = doc.cardnumber ?? "";
//   const set = doc.set ?? "";
//   const releasedate = doc.releasedate ?? "";

//   const callback = encodeURIComponent(`/listing/${id}`);

//   return (
//     <div className="flex flex-col p-6 w-full">
//       <h1 className="text-4xl font-bold mb-8 text-center">{title}</h1>

//       <div className="flex flex-col md:flex-row gap-8 w-full w-screen-xl mx-auto">
//         {/* Left: Images & quick facts */}
//         <div className="bg-white shadow rounded-lg p-4 w-full md:w-1/3">
//           {slides.length > 0 ? (
//             <ImageCarousel slides={slides} size={390} />
//           ) : (
//             <div className="w-[390px] h-[390px] bg-gray-100 grid place-items-center rounded">
//               <span className="text-gray-500 text-sm">No images</span>
//             </div>
//           )}

//           <div className="text-center mt-4">
//             <p className="text-3xl">${price}</p>
//             {cardnumber ? (
//               <p className="text-gray-800">#{String(cardnumber)}</p>
//             ) : null}
//             {set ? <p className="text-gray-600">{set}</p> : null}
//             {releasedate ? (
//               <p className="text-gray-500">Released on {releasedate}</p>
//             ) : null}
//           </div>
//         </div>

//         {/* Right: Description & actions */}
//         <div className="flex flex-col gap-4 w-full md:w-2/3">
//           <p className="mt-4">
//             Sold by{" "}
//             <Link
//               href={`/account/${encodeURIComponent(sellerHandle)}`}
//               className="hover:cursor-pointer underline hover:text-poke-yellow-100"
//             >
//               {doc.user ?? sellerHandle}
//             </Link>
//             <br />
//             <br />
//             {doc.condition ? (
//               <>
//                 Card Condition: {doc.condition}
//                 <br />
//                 <br />
//               </>
//             ) : null}
//             Description:
//           </p>

//           <blockquote className="ml-5 mr-5">
//             {doc.description ?? "No description provided."}
//           </blockquote>

//           {loggedIn && !isOwner ? (
//             <Dialog>
//               <form>
//                 <DialogTrigger asChild>
//                   <button className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded w-1/4">
//                     Buy Now
//                   </button>
//                 </DialogTrigger>
//                 <DialogContent className="bg-white">
//                   <DialogHeader>
//                     <DialogTitle>Card Purchased</DialogTitle>
//                     <DialogDescription>
//                       Leave a review to {doc.user ?? sellerHandle}
//                     </DialogDescription>
//                   </DialogHeader>
//                   <AddReviewForm soldBy={sellerHandle} />
//                 </DialogContent>
//               </form>
//             </Dialog>
//           ) : !loggedIn ? (
//             <Link
//               href={`/signin?callbackUrl=${callback}`}
//               className="mt-6 inline-block bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded w-1/4 text-center"
//             >
//               Sign in to Buy
//             </Link>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// }
