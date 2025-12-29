"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { email, name, password: hashedPassword }, // Add password field to your User model in schema.prisma first!
  });

  redirect("/login");
}