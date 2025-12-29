"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createExpense(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const amount = parseFloat(formData.get("amount") as string);
  const description = formData.get("description") as string;
  const categoryId = formData.get("categoryId") as string;
  const paymentMethod = formData.get("paymentMethod") as string;
  const date = new Date(formData.get("date") as string);

  await prisma.expense.create({
    data: {
      amount,
      description,
      paymentMethod,
      date,
      user: { connect: { email: session.user.email as string } },
      category: {
        connect: { id: categoryId },
      },
    },
  });

  // This tells Next.js to clear the cache and fetch fresh data for the dashboard
  revalidatePath("/dashboard");
}


export async function deleteExpense(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.expense.delete({
    where: {
      id,
      userId: session.user.id as string, // Security: Ensure users can only delete their own data
    },
  });

  revalidatePath("/dashboard");
}