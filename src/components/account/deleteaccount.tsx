// src/components/account/deleteaccount.tsx
"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const onConfirm = async () => {
    try {
      setBusy(true);
      const res = await fetch("/api/account", {
        method: "DELETE",
        cache: "no-store",
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        alert(msg || "Failed to delete account.");
        return;
      }
      // Sign out and send them home
      await signOut({ callbackUrl: "/" });
    } finally {
      setBusy(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-red-600 underline">Delete account</button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Delete your account?</DialogTitle>
          <DialogDescription>
            This permanently deletes your account, listings, and your reviews.
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-4">
          <DialogClose asChild>
            <button className="hover:text-poke-gray-100" disabled={busy}>
              Cancel
            </button>
          </DialogClose>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            {busy ? "Deleting…" : "Yes, delete"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
