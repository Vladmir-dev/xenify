"use client";

import { useState } from "react";
import { createExpense } from "@/app/actions/expenses";
import type { Category } from "@prisma/client";


export default function AddExpenseForm({ categories }: { categories: Category[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    await createExpense(formData);
    setPending(false);
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
      >
        + Add Expense
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold">Add New Expense</h2>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Amount</label>
            <input
              name="amount"
              type="number"
              step="0.01"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <input
              name="description"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              placeholder="Lunch, Software subscription, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              name="categoryId"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Payment Method</label>
            <select
              name="paymentMethod"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            >
              <option>Card</option>
              <option>Cash</option>
              <option>Bank Transfer</option>
              <option>Mobile Money</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              name="date"
              type="date"
              required
              defaultValue={new Date().toISOString().split("T")[0]}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:bg-blue-300"
            >
              {pending ? "Saving..." : "Save Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}