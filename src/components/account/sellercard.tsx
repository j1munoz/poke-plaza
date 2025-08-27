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
import AddCardForm from "@/components/forms/addCard";

interface SellerCardProps {
  image: string;
  price: string;
  cardName: string;
  datePosted: string;
  inStock: boolean;
}

const SellerCard = ({
  image,
  price,
  cardName,
  datePosted,
  inStock,
}: SellerCardProps) => {
  return (
    <div className="flex justify-between bg-white rounded-xl p-5 text-black drop-shadow-2xl">
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
            In Stock
          </p>
        ) : (
          <p className="bg-poke-red-100 text-poke-red-200 text-xl px-7 py-2 rounded-xl">
            Sold Out
          </p>
        )}
        <div className="flex gap-5">
          {inStock && (
            <Dialog>
              <form>
                <DialogTrigger asChild>
                  <div className="flex items-center gap-2 text-poke-gray-100 text-xl hover:text-poke-blue-100 hover:cursor-pointer">
                    <FiEdit />
                    <p>Edit</p>
                  </div>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>Edit {cardName} Listing</DialogTitle>
                    <DialogDescription>
                      Edit your card&apos;s listing
                    </DialogDescription>
                  </DialogHeader>
                  <AddCardForm />
                </DialogContent>
              </form>
            </Dialog>
          )}
          <Dialog>
            <form>
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
                    Are you sure you want to delete this listing? This listing
                    cannot be recovered.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-8">
                  <DialogClose asChild>
                    <button className="hover:cursor-pointer hover:text-poke-gray-100">
                      Cancel
                    </button>
                  </DialogClose>
                  <button className="hover:cursor-pointer hover:text-poke-red-100">
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

export default SellerCard;
