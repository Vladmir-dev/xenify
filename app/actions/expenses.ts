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
      categoryId,
      paymentMethod,
      date,
      userId: session.user.id as string,
    },
  });

  // This tells Next.js to clear the cache and fetch fresh data for the dashboard
  revalidatePath("/dashboard");
}