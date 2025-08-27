import Image from "next/image";
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
import ImageUploader from "../ui/imageupload";

const AddCard = () => {
  return (
    <div className="flex justify-center items-center bg-poke-green-100 rounded-xl p-5 text-black drop-shadow-2xl">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-5">
          <Dialog>
            <form>
              {/* Add Listing Button */}
              <DialogTrigger asChild>
                <div className="flex items-center gap-2 text-xl hover:cursor-pointer">
                  <p>Add a New Card +</p>
                </div>
              </DialogTrigger>

              {/* Enter Listing Details */}
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Create A New Listing</DialogTitle>

                  {/* Find Card Using Unique ID */}
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
                      name="cardNumber"
                      min="1" // <-- this ensures only positive numbers
                      placeholder="Enter card number"
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-poke-green-100"
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "e") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>

                  {/* This would be the part where its like (card found!) based on ID*/}

                  {/* Image Upload */}
                  <div className="mt-4">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Upload Images
                    </label>
                    <ImageUploader maxNumber={5} />
                  </div>

                  {/* Price */}
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
                      name="price"
                      min="0" // <-- this ensures only positive numbers
                      step="0.01" // <-- this allows decimal values
                      placeholder="Enter price"
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-poke-green-100"
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "e") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>

                  {/* Condition */}
                  <div className="mt-4">
                    <label
                      htmlFor="condition"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Condition
                    </label>
                    <select
                      id="condition"
                      name="condition"
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

                  {/* Description */}
                  <div className="mt-4">
                    <label
                      htmlFor="description"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      placeholder="Enter a description of the card!"
                      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-poke-green-100"
                      onKeyDown={(e) => {
                        // No HTML characters for you
                        if (
                          e.key === "<" ||
                          e.key === ">" ||
                          e.key === '"' ||
                          e.key === "&"
                        ) {
                          e.preventDefault();
                        }
                      }}
                    ></textarea>
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
                    type="submit"
                    className="hover:cursor-pointer hover:text-poke-red-100"
                  >
                    Confirm
                  </button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AddCard;
