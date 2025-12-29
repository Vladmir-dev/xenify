import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns"; // Run: npm install date-fns
import AddExpenseForm from "@/components/AddExpenseForm";
import DeleteExpenseButton from "@/components/DeleteExpenseButton";
import EditExpenseModal from "@/components/EditExpenseModal";
import Navbar from "@/components/Navbar";

type ExpenseWithCategory = {
  id: string;
  amount: number;
  description: string;
  date: Date;
  paymentMethod: string;
  categoryId: string;
  category: { name: string };
};
type CategoryOption = { id: string; name: string };

export default async function DashboardPage() {
  const session = await auth();

  // 1. Security Check
  if (!session?.user) {
    redirect("/login");
  }

  // 2. Fetch Data
  const userId = session.user.id as string;

  const expenses: ExpenseWithCategory[] = await prisma.expense.findMany({
    where: { userId },
    select: {
      id: true,
      amount: true,
      description: true,
      date: true,
      paymentMethod: true,
      categoryId: true,
      category: { select: { name: true } },
    },
    orderBy: { date: "desc" },
  });

  const categories: CategoryOption[] = await prisma.category.findMany({
    where: { userId },
    select: { id: true, name: true },
  });

  // 3. Simple Logic: Total for Current Month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTotal = expenses
    .filter(
      (e: ExpenseWithCategory) =>
        e.date.getMonth() === currentMonth &&
        e.date.getFullYear() === currentYear
    )
    .reduce((sum: number, e: ExpenseWithCategory) => sum + e.amount, 0);

  return (
    <div><Navbar />
    <div className="min-h-screen bg-gray-50 p-8">
        
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">XenFi Dashboard</h1>
          <p className="text-sm text-gray-500">
            Welcome back, {session.user.name}
          </p>

          <AddExpenseForm categories={categories} />
        </header>

        {/* Top Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Expenses (Month)
            </p>
            <p className="text-2xl font-bold text-blue-600">
              ${monthlyTotal.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Active Categories
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {categories.length}
            </p>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Transactions
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {expenses.length}
            </p>
          </div>
        </div>

        {/* Recent Expenses Table */}
        <div className="mt-8 rounded-xl border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Recent Expenses</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Method</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {expenses.map((expense: ExpenseWithCategory) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {format(new Date(expense.date), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {expense.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {expense.paymentMethod}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">
                      ${expense.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                        <EditExpenseModal expense={expense} categories={categories} />
                      <DeleteExpenseButton id={expense.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
