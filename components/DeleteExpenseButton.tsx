"use client";

import { useState } from "react";
import { deleteExpense } from "@/app/actions/expenses";
import { Trash2 } from "lucide-react";

export default function DeleteExpenseButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this expense?")) {
      setIsDeleting(true);
      await deleteExpense(id);
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 disabled:opacity-50 text-xs font-medium inline-flex items-center"
      aria-label="Delete expense"
    >
      {isDeleting ? "..." : <Trash2 className="h-4 w-4" />}
    </button>
  );
}