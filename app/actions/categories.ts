"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.category.create({
    data: {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      userId: session.user.id as string,
    },
  });
  revalidatePath("/categories");
}

export async function deleteCategory(id: string) {
  const session = await auth();
  if (!session?.user?.id) return;
  
  await prisma.category.delete({
    where: { id, userId: session.user.id }
  });
  revalidatePath("/categories");
}