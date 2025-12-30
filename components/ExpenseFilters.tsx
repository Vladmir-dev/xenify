"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

type CategoryOption = { id: string; name: string };

export default function ExpenseFilters({
  categories,
}: {
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const categoryId = searchParams.get("categoryId") || "";

  function handleFilter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const params = new URLSearchParams();
    const start = formData.get("startDate") as string;
    const end = formData.get("endDate") as string;
    const catId = formData.get("categoryId") as string;

    if (start) params.set("startDate", start);
    if (end) params.set("endDate", end);
    if (catId) params.set("categoryId", catId);

    router.push(`/dashboard?${params.toString()}`);
  }

  function handleClear() {
    router.push("/dashboard");
  }

  const hasFilters = startDate || endDate || categoryId;

  return (
    <form onSubmit={handleFilter} className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            defaultValue={startDate}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            defaultValue={endDate}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="categoryId"
            defaultValue={categoryId}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Filter
          </button>
          {hasFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-md border border-gray-300 p-2 hover:bg-gray-50"
              aria-label="Clear filters"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
