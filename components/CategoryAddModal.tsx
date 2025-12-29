"use client";

import { useState } from "react";
import { createCategory } from "@/app/actions/categories";
import { Plus } from "lucide-react";

export default function CategoryAddModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    await createCategory(formData);
    setPending(false);
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500"
        aria-label="Add category"
      >
        <Plus className="h-4 w-4" />
        Add Category
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold">Add Category</h2>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              name="name"
              required
              disabled={pending}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              placeholder="Category name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <input
              name="description"
              disabled={pending}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              placeholder="Optional description"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
            <button type="submit" disabled={pending} className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-green-300">
              {pending ? "Saving..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
