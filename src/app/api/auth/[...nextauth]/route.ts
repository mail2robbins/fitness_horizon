import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, user }) {
      // Add user ID to the session
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email || "" },
      });

      // If user doesn't exist, create a profile
      if (!existingUser) {
        await prisma.profile.create({
          data: {
            userId: user.id,
            fitnessLevel: "beginner",
            preferredUnits: "metric",
          },
        });
      }

      return true;
    },
  },
  session: {
    strategy: "database",
  },
});

export { handler as GET, handler as POST }; 