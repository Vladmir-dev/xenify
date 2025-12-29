import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    Credentials({
      name: "Email",
      credentials: { email: { label: "Email", type: "text" } },
      authorize: async (credentials) => {
        if (!credentials?.email) return null;
        // Minimal demo: authenticate any provided email
        return { id: credentials.email, email: credentials.email, name: credentials.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
});
