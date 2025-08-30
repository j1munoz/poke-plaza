"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

type Props = {
  listingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated?: () => void;
};

type LoadedListing = {
  id: string;
  price?: number | string;
  condition?: string;
  description?: string;
};

const CONDITIONS = [
  "Mint",
  "Near Mint",
  "Excellent",
  "Good",
  "Light Played",
  "Played",
  "Poor",
] as const;

export default function EditListing({
  listingId,
  open,
  onOpenChange,
  onUpdated,
}: Props) {
  const router = useRouter();

  const [initial, setInitial] = useState<LoadedListing | null>(null);
  const [price, setPrice] = useState<string>("");
  const [condition, setCondition] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load the current listing when the dialog opens
  useEffect(() => {
    if (!open) return;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listings/${listingId}`, {
          cache: "no-store",
        });
        const text = await res.text();
        const data = text ? (JSON.parse(text) as LoadedListing) : null;

        if (!res.ok || !data) {
          alert(
            (data as unknown as { error?: string })?.error ??
              "Failed to load listing.",
          );
          onOpenChange(false);
          return;
        }

        setInitial(data);
        setPrice(String(data.price ?? ""));
        setCondition(String(data.condition ?? ""));
        setDescription(String(data.description ?? ""));
      } finally {
        setLoading(false);
      }
    })();
  }, [open, listingId, onOpenChange]);

  const save = async () => {
    if (!initial) {
      onOpenChange(false);
      return;
    }

    // Only send fields that actually changed
    const payload: Record<string, unknown> = {};
    if (price !== "" && Number(price) !== Number(initial.price)) {
      payload.price = Number(price);
    }
    if ((condition ?? "") !== (initial.condition ?? "")) {
      payload.condition = condition;
    }
    if ((description ?? "") !== (initial.description ?? "")) {
      payload.description = description;
    }

    // Nothing changed – just close
    if (Object.keys(payload).length === 0) {
      onOpenChange(false);
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`/api/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      type PatchResp = { ok?: boolean; error?: string } | null;
      const data: PatchResp = text ? JSON.parse(text) : null;

      if (!res.ok || data?.ok === false) {
        alert(data?.error ?? `Failed to update listing (${res.status}).`);
        return;
      }

      onOpenChange(false);
      router.refresh(); // refresh server components
      onUpdated?.(); // ask parent to re-fetch client state
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Edit Listing</DialogTitle>
          <DialogDescription>Update your listing details.</DialogDescription>
        </DialogHeader>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <label className="text-sm">
            Price ($)
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              disabled={loading || saving}
            />
          </label>

          <label className="text-sm">
            Condition
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              disabled={loading || saving}
            >
              <option value="">Select condition</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            Description
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              disabled={loading || saving}
            />
          </label>
        </div>

        <DialogFooter className="gap-8 mt-4">
          <DialogClose asChild>
            <button
              className="hover:cursor-pointer hover:text-poke-gray-100"
              disabled={saving}
            >
              Cancel
            </button>
          </DialogClose>

          <button
            type="button"
            onClick={save}
            disabled={saving || loading}
            className="hover:cursor-pointer hover:text-poke-blue-100 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
//   DialogClose,
// } from "@/components/ui/dialog";

// type Props = {
//   listingId: string;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onUpdated?: () => void;
// };

// type LoadedListing = {
//   id: string;
//   price?: number | string;
//   condition?: string;
//   description?: string;
// };

// const CONDITIONS = [
//   "Mint",
//   "Near Mint",
//   "Excellent",
//   "Good",
//   "Light Played",
//   "Played",
//   "Poor",
// ] as const;

// export default function EditListing({
//   listingId,
//   open,
//   onOpenChange,
//   onUpdated,
// }: Props) {
//   const router = useRouter();

//   const [initial, setInitial] = useState<LoadedListing | null>(null);
//   const [price, setPrice] = useState<string>("");
//   const [condition, setCondition] = useState<string>("");
//   const [description, setDescription] = useState<string>("");

//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);

//   // Load the current listing when the dialog opens
//   useEffect(() => {
//     if (!open) return;

//     (async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`/api/listings/${listingId}`);
//         const text = await res.text();
//         const data = text ? (JSON.parse(text) as LoadedListing) : null;

//         if (!res.ok || !data) {
//           alert((data as any)?.error ?? "Failed to load listing.");
//           onOpenChange(false);
//           return;
//         }

//         setInitial(data);
//         setPrice(String(data.price ?? ""));
//         setCondition(String(data.condition ?? ""));
//         setDescription(String(data.description ?? ""));
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [open, listingId, onOpenChange]);

//   const save = async () => {
//     if (!initial) {
//       onOpenChange(false);
//       return;
//     }

//     // Only send fields that actually changed
//     const payload: Record<string, unknown> = {};
//     if (price !== "" && Number(price) !== Number(initial.price)) {
//       payload.price = Number(price);
//     }
//     if ((condition ?? "") !== (initial.condition ?? "")) {
//       payload.condition = condition;
//     }
//     if ((description ?? "") !== (initial.description ?? "")) {
//       payload.description = description;
//     }

//     // Nothing changed – just close
//     if (Object.keys(payload).length === 0) {
//       onOpenChange(false);
//       return;
//     }

//     try {
//       setSaving(true);
//       const res = await fetch(`/api/listings/${listingId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       // Be tolerant of empty bodies
//       const text = await res.text();
//       const data = text ? JSON.parse(text) : null;

//       if (!res.ok || (data && data.ok === false)) {
//         alert(data?.error ?? `Failed to update listing (${res.status}).`);
//         return;
//       }

//       onOpenChange(false);
//       onUpdated?.();
//       router.refresh();
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="bg-white">
//         <DialogHeader>
//           <DialogTitle>Edit Listing</DialogTitle>
//           <DialogDescription>Update your listing details.</DialogDescription>
//         </DialogHeader>

//         {/* Form */}
//         <div className="flex flex-col gap-4">
//           <label className="text-sm">
//             Price ($)
//             <input
//               type="number"
//               min="0"
//               step="0.01"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               className="mt-1 w-full border border-gray-300 rounded-md p-2"
//               disabled={loading || saving}
//             />
//           </label>

//           <label className="text-sm">
//             Condition
//             <select
//               value={condition}
//               onChange={(e) => setCondition(e.target.value)}
//               className="mt-1 w-full border border-gray-300 rounded-md p-2"
//               disabled={loading || saving}
//             >
//               <option value="">Select condition</option>
//               {CONDITIONS.map((c) => (
//                 <option key={c} value={c}>
//                   {c}
//                 </option>
//               ))}
//             </select>
//           </label>

//           <label className="text-sm">
//             Description
//             <textarea
//               rows={4}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="mt-1 w-full border border-gray-300 rounded-md p-2"
//               disabled={loading || saving}
//             />
//           </label>
//         </div>

//         <DialogFooter className="gap-8 mt-4">
//           <DialogClose asChild>
//             <button className="hover:cursor-pointer hover:text-poke-gray-100" disabled={saving}>
//               Cancel
//             </button>
//           </DialogClose>

//           <button
//             type="button"
//             onClick={save}
//             disabled={saving || loading}
//             className="hover:cursor-pointer hover:text-poke-blue-100 disabled:opacity-50"
//           >
//             {saving ? "Saving..." : "Save"}
//           </button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
