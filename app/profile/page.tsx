import { auth } from "@/lib/auth";
import { updateProfile } from "@/app/actions/user";
import Navbar from "@/components/Navbar";

export default async function ProfilePage() {
  const session = await auth();

  return (
    <div>
        <Navbar />
    <div className="p-8 max-w-md mx-auto">
        
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      <form action={updateProfile} className="space-y-4 bg-white p-6 rounded-lg border shadow-sm">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input name="name" defaultValue={session?.user?.name || ""} className="w-full border p-2 rounded mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input name="email" defaultValue={session?.user?.email || ""} className="w-full border p-2 rounded mt-1" />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Update Profile
        </button>
      </form>
    </div>
    </div>
  );
}