"use server";
import { prisma } from "@/lib/prisma.js";
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

export async function updateCategory(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const nameRaw = formData.get("name");
  const descriptionRaw = formData.get("description");

  if (typeof nameRaw !== "string" || !nameRaw.trim()) {
    throw new Error("Name is required");
  }

  const name = nameRaw.trim();
  const description = typeof descriptionRaw === "string" ? descriptionRaw.trim() : null;

  await prisma.category.updateMany({
    where: {
      id,
      userId: session.user.id as string,
    },
    data: {
      name,
      description,
    },
  });

  revalidatePath("/categories");
}