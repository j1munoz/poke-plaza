// src/components/account/sellercard.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EditListing from "@/components/account/editlisting";

interface SellerCardProps {
  image: string;
  price: string;
  cardName: string;
  datePosted: string;
  inStock: boolean;
  id: string;
  onUpdated?: () => void;
  onDeleted?: () => void;
}

export default function SellerCard({
  image,
  price,
  cardName,
  datePosted,
  inStock,
  id: listingId,
  onUpdated,
  onDeleted,
}: SellerCardProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const listingUrl = `/listing/${listingId}`;

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const res = await fetch(`/api/listings/${listingId}`, {
        method: "DELETE",
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (!res.ok) {
        alert(data?.error ?? `Failed to delete listing (${res.status}).`);
        return;
      }

      // Success
      setDeleteOpen(false);
      onDeleted?.();
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex justify-between bg-white rounded-xl p-5 text-black drop-shadow-2xl hover:cursor-pointer">
      <div className="flex flex-col items-center gap-4">
        <Image src={image} width={300} height={300} alt={`${cardName} photo`} />
        <p className="font-bold text-black text-3xl">${price}</p>
      </div>
      <div className="flex flex-col ml-10 mr-10 items-center justify-center gap-5">
        <p className="text-3xl font-bold">{cardName}</p>
        <p className="text-xl text-center">
          Posted on <br />
          {datePosted}
        </p>

        {inStock ? (
          <p className="bg-poke-green-100 text-poke-green-200 text-xl px-7 py-2 rounded-xl">
            <Link href={listingUrl}>In Stock</Link>
          </p>
        ) : (
          <p className="bg-poke-red-100 text-poke-red-200 text-xl px-7 py-2 rounded-xl">
            Sold Out
          </p>
        )}

        <div className="flex gap-5">
          {/* EDIT */}
          {inStock && (
            <>
              <div
                className="flex items-center gap-2 text-poke-gray-100 text-xl hover:text-poke-blue-100 hover:cursor-pointer"
                onClick={() => setEditOpen(true)}
              >
                <FiEdit />
                <p>Edit</p>
              </div>

              <EditListing
                listingId={listingId}
                open={editOpen}
                onOpenChange={setEditOpen}
                onUpdated={() => {
                  onUpdated?.();
                  router.refresh();
                }}
              />
            </>
          )}

          {/* DELETE */}
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <div className="flex items-center gap-2 text-poke-gray-100 text-xl hover:text-poke-red-100 hover:cursor-pointer">
                <RiDeleteBin6Line />
                <p>Delete</p>
              </div>
            </DialogTrigger>

            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Remove Listing</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this listing? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="gap-8">
                <DialogClose asChild>
                  <button className="hover:cursor-pointer hover:text-poke-gray-100">
                    Cancel
                  </button>
                </DialogClose>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="hover:cursor-pointer hover:text-poke-red-100 disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Confirm"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

// // src/components/account/sellercard.tsx

// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { FiEdit } from "react-icons/fi";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogClose,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { useState } from "react";
// import EditListing from "@/components/account/editlisting";

// interface SellerCardProps {
//   image: string;
//   price: string;
//   cardName: string;
//   datePosted: string;
//   inStock: boolean;
//   id: string;
//   onUpdated?: () => void;
//   onDeleted?: () => void;
// }

// export default function SellerCard({
//   image,
//   price,
//   cardName,
//   datePosted,
//   inStock,
//   id: listingId,
//   onUpdated,
//   onDeleted,
// }: SellerCardProps) {
//   const [editOpen, setEditOpen] = useState(false);
//   const listingUrl = `/listing/${listingId}`;

//   return (
//     <div className="flex justify-between bg-white rounded-xl p-5 text-black drop-shadow-2xl hover:cursor-pointer">
//       <div className="flex flex-col items-center gap-4">
//         <Image src={image} width={300} height={300} alt={`${cardName} photo`} />
//         <p className="font-bold text-black text-3xl">${price}</p>
//       </div>
//       <div className="flex flex-col ml-10 mr-10 items-center justify-center gap-5">
//         <p className="text-3xl font-bold">{cardName}</p>
//         <p className="text-xl text-center">
//           Posted on <br />
//           {datePosted}
//         </p>
//         {inStock ? (
//           <p className="bg-poke-green-100 text-poke-green-200 text-xl px-7 py-2 rounded-xl">
//             <Link href={listingUrl}>In Stock</Link>
//           </p>
//         ) : (
//           <p className="bg-poke-red-100 text-poke-red-200 text-xl px-7 py-2 rounded-xl">
//             Sold Out
//           </p>
//         )}

//         <div className="flex gap-5">
//           {/* EDIT */}
//           {inStock && (
//             <>
//               <div
//                 className="flex items-center gap-2 text-poke-gray-100 text-xl hover:text-poke-blue-100 hover:cursor-pointer"
//                 onClick={() => setEditOpen(true)}
//               >
//                 <FiEdit />
//                 <p>Edit</p>
//               </div>

//               <EditListing
//                 listingId={listingId}
//                 open={editOpen}
//                 onOpenChange={setEditOpen}
//                 onUpdated={onUpdated}
//               />
//             </>
//           )}

//           {/* DELETE */}
//           <Dialog>
//             <form
//               onSubmit={async (e) => {
//                 e.preventDefault();
//                 const res = await fetch(`/api/listings/${listingId}`, {
//                   method: "DELETE",
//                 });
//                 if (!res.ok) {
//                   alert("Failed to delete listing.");
//                   return;
//                 }
//                 onDeleted?.();
//               }}
//             >
//               <DialogTrigger asChild>
//                 <div className="flex items-center gap-2 text-poke-gray-100 text-xl hover:text-poke-red-100 hover:cursor-pointer">
//                   <RiDeleteBin6Line />
//                   <p>Delete</p>
//                 </div>
//               </DialogTrigger>
//               <DialogContent className="bg-white">
//                 <DialogHeader>
//                   <DialogTitle>Remove Listing</DialogTitle>
//                   <DialogDescription>
//                     Are you sure you want to delete this listing? This action
//                     cannot be undone.
//                   </DialogDescription>
//                 </DialogHeader>
//                 <DialogFooter className="gap-8">
//                   <DialogClose asChild>
//                     <button className="hover:cursor-pointer hover:text-poke-gray-100">
//                       Cancel
//                     </button>
//                   </DialogClose>
//                   <button
//                     type="submit"
//                     className="hover:cursor-pointer hover:text-poke-red-100"
//                   >
//                     Confirm
//                   </button>
//                 </DialogFooter>
//               </DialogContent>
//             </form>
//           </Dialog>
//         </div>
//       </div>
//     </div>
//   );
// }

// import Image from "next/image";
// import Link from "next/link";
// import { FiEdit } from "react-icons/fi";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogClose,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import AddCardForm from "@/components/forms/addCard";

// interface SellerCardProps {
//   image: string;
//   price: string;
//   cardName: string;
//   datePosted: string;
//   inStock: boolean;
//   id: string;
// }

// export default function SellerCard({
//   image,
//   price,
//   cardName,
//   datePosted,
//   inStock,
//   id: listingId, // <-- alias so we’re sure it exists in this scope
// }: SellerCardProps) {
//   // If you kept Option A (old mock route), point to it (only works for mock data):
//   // const listingUrl = `/listings/sv9-1/${listingId}`;

//   // If you chose Option B (new DB route), point to the singular page:
//   const listingUrl = `/listing/${listingId}`;

//   return (
//     <div className="flex justify-between bg-white rounded-xl p-5 text-black drop-shadow-2xl hover:cursor-pointer">
//       <div className="flex flex-col items-center gap-4">
//         <Image src={image} width={300} height={300} alt={`${cardName} photo`} />
//         <p className="font-bold text-black text-3xl">${price}</p>
//       </div>
//       <div className="flex flex-col ml-10 mr-10 items-center justify-center gap-5">
//         <p className="text-3xl font-bold">{cardName}</p>
//         <p className="text-xl text-center">
//           Posted on <br />
//           {datePosted}
//         </p>
//         {inStock ? (
//           <p className="bg-poke-green-100 text-poke-green-200 text-xl px-7 py-2 rounded-xl">
//             <Link href={listingUrl}>In Stock</Link>
//           </p>
//         ) : (
//           <p className="bg-poke-red-100 text-poke-red-200 text-xl px-7 py-2 rounded-xl">
//             Sold Out
//           </p>
//         )}
//         <div className="flex gap-5">
//           {inStock && (
//             <Dialog>
//               <form>
//                 <DialogTrigger asChild>
//                   <div className="flex items-center gap-2 text-poke-gray-100 text-xl hover:text-poke-blue-100 hover:cursor-pointer">
//                     <FiEdit />
//                     <p>Edit</p>
//                   </div>
//                 </DialogTrigger>
//                 <DialogContent className="bg-white">
//                   <DialogHeader>
//                     <DialogTitle>Edit {cardName} Listing</DialogTitle>
//                     <DialogDescription>
//                       Edit your card&apos;s listing
//                     </DialogDescription>
//                   </DialogHeader>
//                   <AddCardForm />
//                 </DialogContent>
//               </form>
//             </Dialog>
//           )}
//           <Dialog>
//             <form>
//               <DialogTrigger asChild>
//                 <div className="flex items-center gap-2 text-poke-gray-100 text-xl hover:text-poke-red-100 hover:cursor-pointer">
//                   <RiDeleteBin6Line />
//                   <p>Delete</p>
//                 </div>
//               </DialogTrigger>
//               <DialogContent className="bg-white">
//                 <DialogHeader>
//                   <DialogTitle>Remove Listing</DialogTitle>
//                   <DialogDescription>
//                     Are you sure you want to delete this listing? This listing
//                     cannot be recovered.
//                   </DialogDescription>
//                 </DialogHeader>
//                 <DialogFooter className="gap-8">
//                   <DialogClose asChild>
//                     <button className="hover:cursor-pointer hover:text-poke-gray-100">
//                       Cancel
//                     </button>
//                   </DialogClose>
//                   <button className="hover:cursor-pointer hover:text-poke-red-100">
//                     Confirm
//                   </button>
//                 </DialogFooter>
//               </DialogContent>
//             </form>
//           </Dialog>
//         </div>
//       </div>
//     </div>
//   );
// }
