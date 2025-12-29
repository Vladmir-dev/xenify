"use client";

import { useState } from "react";
import { registerUser } from "@/app/actions/auth";
import Link from "next/link";

export default function RegisterPage() {
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    try {
      await registerUser(formData);
    } catch (error) {
      alert("Registration failed. Email might already exist.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Create XenFi Account</h2>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input name="name" required className="w-full rounded-md border p-2 mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input name="email" type="email" required className="w-full rounded-md border p-2 mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input name="password" type="password" required className="w-full rounded-md border p-2 mt-1" />
          </div>
          <button
            disabled={pending}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {pending ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link href="/login" className="text-blue-600">Login</Link>
        </p>
      </div>
    </div>
  );
}