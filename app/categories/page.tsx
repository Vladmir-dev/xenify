import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createCategory, deleteCategory } from "@/app/actions/categories";
import Navbar from "@/components/Navbar";

export default async function CategoriesPage() {
  const session = await auth();
  const categories = await prisma.category.findMany({
    where: { userId: session.user?.id },
  });

  return (
    <div>
        <Navbar />
    <div className="p-8 max-w-4xl mx-auto">
        
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>
      
      {/* Create Form */}
      <form action={createCategory} className="flex gap-4 mb-8 bg-white p-4 rounded-lg border">
        <input name="name" placeholder="Category Name" required className="border p-2 rounded w-full" />
        <input name="description" placeholder="Description (optional)" className="border p-2 rounded w-full" />
        <button className="bg-green-600 text-white px-4 py-2 rounded whitespace-nowrap">Add Category</button>
      </form>

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
                <td className="p-4 text-right">
                  <form action={async () => { "use server"; await deleteCategory(cat.id); }}>
                    <button className="text-red-600 text-sm">Delete</button>
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