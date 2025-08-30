"use client";

import { useState } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
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

// ---- Types (unchanged)
export interface Review {
  username: string;
  reviewDate: Date;
  reviewText: string;
  rating: number;
  ratings: { responsive: number; shipping: number; reliable: number };
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
  ratings: { responsive: number; shipping: number; reliable: number };
  uploadedListingIds: UploadedListing[];
  reviews: Review[];
}

interface UserInfoProps {
  user: UserAccount;
}

export default function UserInfo({ user }: UserInfoProps) {
  const [manageOpen, setManageOpen] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      const res = await fetch("/api/account", { method: "DELETE" });

      if (!res.ok) {
        let data: { error?: string } | undefined;
        try {
          data = (await res.json()) as { error?: string };
        } catch {
          data = undefined;
        }
        alert(data?.error ?? "Failed to delete account.");
        return;
      }

      setManageOpen(false);
      await signOut({ callbackUrl: "/" });
    } finally {
      setDeleting(false);
    }
  };

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

        {/* Manage Account (opens single dialog) */}
        <Dialog open={manageOpen} onOpenChange={setManageOpen}>
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
              {/* Change Password: nested dialog with a working form */}
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
                      If your account already has a password, enter your current
                      password. For OAuth-only accounts, you can set a new one
                      without the current password.
                    </DialogDescription>
                  </DialogHeader>

                  <ChangePasswordForm />
                </DialogContent>
              </Dialog>

              {/* Delete Account inline confirm */}
              {!confirmingDelete ? (
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  onClick={() => setConfirmingDelete(true)}
                >
                  Delete Account
                </button>
              ) : (
                <div className="rounded border border-red-300 bg-red-50 p-4">
                  <p className="text-sm text-red-700">
                    This will permanently delete your account and all your
                    listings. This action cannot be undone.
                  </p>
                  <div className="mt-3 flex justify-end gap-3">
                    <button
                      className="px-3 py-2 rounded border border-gray-300"
                      onClick={() => setConfirmingDelete(false)}
                      disabled={deleting}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                      onClick={handleDeleteAccount}
                      disabled={deleting}
                    >
                      {deleting ? "Deleting…" : "Confirm"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

/** Change Password form used inside the nested dialog. */
function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOk(false);

    if (newPassword !== confirm) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (newPassword.length < 8 || newPassword.length > 72) {
      setError("Password must be 8–72 characters.");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/account/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const text = await res.text();
      type PasswordResp = { ok?: boolean; error?: string } | null;
      const data: PasswordResp = text ? JSON.parse(text) : null;

      if (!res.ok || data?.ok === false) {
        setError(data?.error ?? `Failed (${res.status}).`);
        return;
      }

      setOk(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {ok && (
        <p className="text-sm text-green-600" role="status">
          Password updated successfully.
        </p>
      )}

      <input
        type="password"
        placeholder="Current password (if set)"
        className="border p-2 rounded"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        autoComplete="current-password"
      />

      <input
        type="password"
        placeholder="New password"
        className="border p-2 rounded"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        autoComplete="new-password"
        required
      />

      <input
        type="password"
        placeholder="Confirm new password"
        className="border p-2 rounded"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        autoComplete="new-password"
        required
      />

      <DialogFooter className="mt-2">
        <DialogClose asChild>
          <button
            type="button"
            className="hover:text-poke-gray-100"
            disabled={saving}
          >
            Cancel
          </button>
        </DialogClose>
        <button
          type="submit"
          className="bg-poke-blue-100 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={saving}
        >
          {saving ? "Saving..." : "Confirm"}
        </button>
      </DialogFooter>
    </form>
  );
}

// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { signOut } from "next-auth/react";
// import Rating from "@/components/account/rating";

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

// // ---- Types (unchanged)
// export interface Review {
//   username: string;
//   reviewDate: Date;
//   reviewText: string;
//   rating: number;
//   ratings: { responsive: number; shipping: number; reliable: number };
// }
// export interface UploadedListing {
//   card: string;
//   listingId: string;
//   soldby: string;
// }
// export interface UserAccount {
//   username: string;
//   joinedOn: string;
//   icon: string;
//   rating: number;
//   ratings: { responsive: number; shipping: number; reliable: number };
//   uploadedListingIds: UploadedListing[];
//   reviews: Review[];
// }

// interface UserInfoProps {
//   user: UserAccount;
// }

// export default function UserInfo({ user }: UserInfoProps) {
//   const [manageOpen, setManageOpen] = useState(false);
//   const [confirmingDelete, setConfirmingDelete] = useState(false);
//   const [deleting, setDeleting] = useState(false);

//   const handleDeleteAccount = async () => {
//     try {
//       setDeleting(true);
//       const res = await fetch("/api/account", { method: "DELETE" });
//       if (!res.ok) {
//         const data = await res.json().catch(() => ({} as any));
//         alert(data?.error ?? "Failed to delete account.");
//         return;
//       }
//       setManageOpen(false);
//       await signOut({ callbackUrl: "/" });
//     } finally {
//       setDeleting(false);
//     }
//   };

//   return (
//     <div className="flex justify-between gap-20 border-b p-5 w-[33vw] border-black">
//       <div className="flex flex-col gap-5 items-center">
//         <Image
//           src={user.icon}
//           alt="User Icon"
//           width={80}
//           height={80}
//           className="h-[10vh] w-[10vh] object-cover rounded-full"
//         />
//         <p className="text-3xl">{user.username}</p>
//         <p className="text-poke-gray-100">Joined on {user.joinedOn}</p>
//       </div>

//       <div className="flex flex-col gap-5">
//         <Rating label="Rating" rating={user.rating} textSize="text-3xl" />
//         <Rating label="Responsive" rating={user.ratings.responsive} />
//         <Rating label="Shipping" rating={user.ratings.shipping} />
//         <Rating label="Reliable" rating={user.ratings.reliable} />

//         {/* Manage Account opens one dialog; deletion confirm is inline */}
//         <Dialog open={manageOpen} onOpenChange={setManageOpen}>
//           <DialogTrigger asChild>
//             <div className="flex items-center gap-2 text-poke-gray-100 hover:text-poke-blue-100 hover:cursor-pointer">
//               <p>Manage Account</p>
//             </div>
//           </DialogTrigger>

//           <DialogContent className="bg-white">
//             <DialogHeader>
//               <DialogTitle>Account Settings</DialogTitle>
//               <DialogDescription>Manage your account settings here.</DialogDescription>
//             </DialogHeader>

//             <div className="flex flex-col gap-4 p-4">
//               {/* Change Password (placeholder) */}
//               <Dialog>
//                 <DialogTrigger asChild>
//                   <button className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded">
//                     Change Password
//                   </button>
//                 </DialogTrigger>
//                 <DialogContent className="bg-white">
//                   <DialogHeader>
//                     <DialogTitle>Change Password</DialogTitle>
//                     <DialogDescription>
//                       Enter your current and new password.
//                     </DialogDescription>
//                   </DialogHeader>
//                   <div className="flex flex-col gap-4">
//                     <input type="password" placeholder="Current Password" className="border p-2 rounded" />
//                     <input type="password" placeholder="New Password" className="border p-2 rounded" />
//                   </div>
//                   <DialogFooter className="mt-4">
//                     <DialogClose asChild>
//                       <button className="hover:text-poke-gray-100">Cancel</button>
//                     </DialogClose>
//                     <button className="bg-poke-blue-100 text-white px-4 py-2 rounded">Confirm</button>
//                   </DialogFooter>
//                 </DialogContent>
//               </Dialog>

//               {/* Delete Account inline confirm */}
//               {!confirmingDelete ? (
//                 <button
//                   className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
//                   onClick={() => setConfirmingDelete(true)}
//                 >
//                   Delete Account
//                 </button>
//               ) : (
//                 <div className="rounded border border-red-300 bg-red-50 p-4">
//                   <p className="text-sm text-red-700">
//                     This will permanently delete your account and all your listings. This action cannot be undone.
//                   </p>
//                   <div className="mt-3 flex justify-end gap-3">
//                     <button
//                       className="px-3 py-2 rounded border border-gray-300"
//                       onClick={() => setConfirmingDelete(false)}
//                       disabled={deleting}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       className="px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
//                       onClick={handleDeleteAccount}
//                       disabled={deleting}
//                     >
//                       {deleting ? "Deleting…" : "Confirm"}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// }
