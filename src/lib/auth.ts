import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
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
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email || "" },
          include: { profile: true },
        });

        // If user exists but doesn't have a profile, create one
        if (existingUser && !existingUser.profile) {
          await prisma.profile.create({
            data: {
              userId: existingUser.id,
              name: existingUser.name,
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return true; // Still allow sign in even if profile creation fails
      }
    },
  },
}; 