"use client";

import { useState } from "react";
import { updateCategory } from "@/app/actions/categories";
import { Pencil } from "lucide-react";
type CategoryRow = { id: string; name: string; description: string | null };

export default function CategoryEditModal({ category }: { category: CategoryRow }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    await updateCategory(category.id, formData);
    setPending(false);
    setIsOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:text-blue-900 text-xs font-medium mr-3 inline-flex items-center"
        aria-label="Edit category"
      >
        <Pencil className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">Edit Category</h2>
            <form action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  name="name"
                  required
                  defaultValue={category.name}
                  disabled={pending}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <input
                  name="description"
                  defaultValue={category.description ?? ""}
                  disabled={pending}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
                <button type="submit" disabled={pending} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-blue-300">
                  {pending ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
