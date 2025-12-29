import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { deleteCategory } from "@/app/actions/categories";
import Navbar from "@/components/Navbar";
import { Trash2 } from "lucide-react";
import CategoryAddModal from "@/components/CategoryAddModal";
import CategoryEditModal from "@/components/CategoryEditModal";
type CategoryRow = { id: string; name: string; description: string | null };

export default async function CategoriesPage() {
  const session = await auth();

  if (!session?.user) {
      redirect("/login");
    }

  const categories: CategoryRow[] = await prisma.category.findMany({
    select: { id: true, name: true, description: true },
    where: { userId: session?.user?.id as string },
  });

  return (
    <div>
        <Navbar />
    <div className="p-8 max-w-4xl mx-auto">
        
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>
      
      {/* Create Modal Trigger */}
      <div className="mb-8">
        <CategoryAddModal />
      </div>

      {/* List Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b last:border-0">
                <td className="p-4 font-medium">{cat.name}</td>
                <td className="p-4 text-gray-500">{cat.description}</td>
                <td className="p-4 text-right flex items-center justify-end gap-2">
                  <CategoryEditModal category={{ id: cat.id, name: cat.name, description: cat.description }} />
                  <form action={async () => { "use server"; await deleteCategory(cat.id); }}>
                    <button className="text-red-600 text-sm" aria-label="Delete category"><Trash2 className="h-4 w-4" /></button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}