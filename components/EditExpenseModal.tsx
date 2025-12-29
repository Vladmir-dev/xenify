"use client";

import { useState } from "react";
import { updateExpense } from "@/app/actions/expenses";
import { Pencil } from "lucide-react";
import type { Category } from "@prisma/client";

type ExpenseShape = {
  id: string;
  amount: number;
  description: string;
  categoryId: string;
  paymentMethod: string | null;
  date: string | Date;
};

export default function EditExpenseModal({ expense, categories }: { expense: ExpenseShape; categories: Pick<Category, "id" | "name">[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    await updateExpense(expense.id, formData);
    setPending(false);
    setIsOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:text-blue-900 text-xs font-medium mr-3 inline-flex items-center"
        aria-label="Edit expense"
      >
        <Pencil className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl text-left">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Edit Expense</h2>
            <form action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input name="amount" type="number" step="0.01" required defaultValue={expense.amount} className="mt-1 block w-full rounded-md border border-gray-300 p-2" disabled={pending} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input name="description" required defaultValue={expense.description} className="mt-1 block w-full rounded-md border border-gray-300 p-2" disabled={pending} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select name="categoryId" required defaultValue={expense.categoryId} className="mt-1 block w-full rounded-md border border-gray-300 p-2" disabled={pending}>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <select name="paymentMethod" required defaultValue={expense.paymentMethod || "Cash"} className="mt-1 block w-full rounded-md border border-gray-300 p-2" disabled={pending}>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Mobile Money">Mobile Money</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input name="date" type="date" required defaultValue={new Date(expense.date).toISOString().split('T')[0]} className="mt-1 block w-full rounded-md border border-gray-300 p-2" disabled={pending} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
                <button type="submit" disabled={pending} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-blue-300">
                  {pending ? "Updating..." : "Update Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}