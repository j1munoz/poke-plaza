//src/components/account/userinfo.tsx

import Image from "next/image";
import Rating from "@/components/account/rating";
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

export interface Review {
  username: string;
  reviewDate: Date;
  reviewText: string;
  rating: number;
  ratings: {
    responsive: number;
    shipping: number;
    reliable: number;
  };
}

export interface UploadedListing {
  card: string;
  listingId: string;
  soldby: string;
}

export interface UserAccount {
  username: string;
  joinedOn: string;
  icon: string;
  rating: number;
  ratings: {
    responsive: number;
    shipping: number;
    reliable: number;
  };
  uploadedListingIds: UploadedListing[]; // Changed type here
  reviews: Review[];
}

interface UserInfoProps {
  user: UserAccount;
}

const UserInfo = ({ user }: UserInfoProps) => {
  return (
    <div className="flex justify-between gap-20 border-b p-5 w-[33vw] border-black">
      <div className="flex flex-col gap-5 items-center">
        <Image
          src={user.icon}
          alt="User Icon"
          width={80}
          height={80}
          className="h-[10vh] w-[10vh] object-cover rounded-full"
        />
        <p className="text-3xl">{user.username}</p>
        <p className="text-poke-gray-100">Joined on {user.joinedOn}</p>
      </div>
      <div className="flex flex-col gap-5">
        <Rating label="Rating" rating={user.rating} textSize="text-3xl" />
        <Rating label="Responsive" rating={user.ratings.responsive} />
        <Rating label="Shipping" rating={user.ratings.shipping} />
        <Rating label="Reliable" rating={user.ratings.reliable} />

        {/* Account Settings */}
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex items-center gap-2 text-poke-gray-100 hover:text-poke-blue-100 hover:cursor-pointer">
              <p>Manage Account</p>
            </div>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Account Settings</DialogTitle>
              <DialogDescription>
                Manage your account settings here.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 p-4">
              {/* Change Password Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded">
                    Change Password
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Enter your current and new password.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-4">
                    <input
                      type="password"
                      placeholder="Current Password"
                      className="border p-2 rounded"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      className="border p-2 rounded"
                    />
                  </div>
                  <DialogFooter className="mt-4">
                    <DialogClose asChild>
                      <button className="hover:text-poke-gray-100">
                        Cancel
                      </button>
                    </DialogClose>
                    <button className="bg-poke-blue-100 text-white px-4 py-2 rounded">
                      Confirm
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Delete Account */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded">
                    Delete Account
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete your account? This action
                      cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <button className="hover:text-poke-gray-100">
                        Cancel
                      </button>
                    </DialogClose>
                    <button className="bg-red-500 text-white px-4 py-2 rounded">
                      Confirm
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UserInfo;
