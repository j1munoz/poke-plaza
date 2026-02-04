//src/components/account/addlisting.tsx

"use client";
import { useState } from "react";
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
import ImageUploader from "@/components/ui/imageupload";
import { useRouter } from "next/navigation";

type ListingCondition =
  | "Mint"
  | "Near Mint"
  | "Excellent"
  | "Good"
  | "Light Played"
  | "Played"
  | "Poor";

export default function AddCard({
  onCreated,
}: {
  onCreated?: (id: string) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [cardNumber, setCardNumber] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [condition, setCondition] = useState<ListingCondition | "">("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const canSubmit =
    Number(cardNumber) > 0 &&
    Number(price) >= 0 &&
    !!condition &&
    description.trim().length > 0 &&
    images.length > 0;

  return (
    <div className="flex justify-center items-center bg-poke-green-100 rounded-xl p-5 text-black drop-shadow-2xl">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-5">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <div className="flex items-center gap-2 text-xl hover:cursor-pointer">
                <p>Add a New Card +</p>
              </div>
            </DialogTrigger>

            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Create A New Listing</DialogTitle>

                <div className="mt-4">
                  <label
                    htmlFor="cardNumber"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Card Number
                  </label>
                  <input
                    type="number"
                    id="cardNumber"
                    min="1"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Enter card number"
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-poke-green-100"
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e") e.preventDefault();
                    }}
                  />
                </div>

                <div className="mt-4">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Upload Images
                  </label>
                  <ImageUploader
                    maxNumber={5}
                    value={images}
                    onChange={setImages}
                  />
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="price"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Price ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price"
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-poke-green-100"
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e") e.preventDefault();
                    }}
                  />
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="condition"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Condition
                  </label>
                  <select
                    id="condition"
                    value={condition}
                    onChange={(e) =>
                      setCondition(e.target.value as ListingCondition | "")
                    }
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-poke-green-100"
                  >
                    <option value="">Select condition</option>
                    <option value="Mint">Mint</option>
                    <option value="Near Mint">Near Mint</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Light Played">Light Played</option>
                    <option value="Played">Played</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="description"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter a description of the card!"
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-poke-green-100"
                    onKeyDown={(e) => {
                      if (["<", ">", '"', "&"].includes(e.key))
                        e.preventDefault();
                    }}
                  />
                </div>

                <DialogDescription className="mt-4">
                  Fill in the card details and click Confirm to save.
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
                  disabled={!canSubmit || loading}
                  onClick={async () => {
                    try {
                      setLoading(true);
                      const res = await fetch("/api/listings", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          cardNumber: Number(cardNumber),
                          price: Number(price),
                          condition,
                          description,
                          images,
                        }),
                      });
                      const data = await res.json();
                      if (!res.ok) {
                        alert("Failed to create listing.");
                        return;
                      }
                      setOpen(false);
                      setCardNumber("");
                      setPrice("");
                      setCondition("");
                      setDescription("");
                      setImages([]);
                      onCreated?.(data.id as string);
                      router.refresh();
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="hover:cursor-pointer hover:text-poke-red-100 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Confirm"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

