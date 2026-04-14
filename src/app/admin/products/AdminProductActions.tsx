"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AdminProductActionsProps {
  productId: string;
  productName: string;
}

export function AdminProductActions({ productId, productName }: AdminProductActionsProps) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Delete "${productName}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success(`"${productName}" deleted.`);
      router.refresh();
    } catch {
      toast.error("Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
      aria-label={`Delete ${productName}`}
    >
      <Trash2 size={15} />
    </button>
  );
}
