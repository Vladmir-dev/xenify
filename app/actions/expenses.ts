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

  await prisma.expense.deleteMany({
    where: {
      id,
      user: { is: { email: session.user.email as string } },
    },
  });

  revalidatePath("/dashboard");
}


export async function updateExpense(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const amountRaw = formData.get("amount");
  const descriptionRaw = formData.get("description");
  const categoryIdRaw = formData.get("categoryId");
  const paymentMethodRaw = formData.get("paymentMethod");
  const dateRaw = formData.get("date");

  if (typeof amountRaw !== "string" || isNaN(parseFloat(amountRaw))) {
    throw new Error("Invalid amount");
  }
  if (typeof descriptionRaw !== "string" || !descriptionRaw.trim()) {
    throw new Error("Description is required");
  }
  if (typeof categoryIdRaw !== "string" || !categoryIdRaw.trim()) {
    throw new Error("Category is required");
  }
  if (typeof paymentMethodRaw !== "string" || !paymentMethodRaw.trim()) {
    throw new Error("Payment method is required");
  }
  if (typeof dateRaw !== "string" || !dateRaw.trim()) {
    throw new Error("Date is required");
  }

  const amount = parseFloat(amountRaw);
  const description = descriptionRaw.trim();
  const categoryId = categoryIdRaw.trim();
  const paymentMethod = paymentMethodRaw.trim();
  const date = new Date(dateRaw);

  await prisma.expense.updateMany({
    where: {
      id,
      user: { is: { email: session.user.email as string } },
    },
    data: {
      amount,
      description,
      paymentMethod,
      date,
      categoryId,
    },
  });

  revalidatePath("/dashboard");
}