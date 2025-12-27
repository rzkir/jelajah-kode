import NextAuth, { NextAuthOptions } from "next-auth";

import GitHubProvider from "next-auth/providers/github";

import GoogleProvider from "next-auth/providers/google";

import CredentialsProvider from "next-auth/providers/credentials";

import { Account } from "@/models/Account";

import { connectToDatabase } from "@/lib/mongodb";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectToDatabase();

          // Find account
          const account = await Account.findOne({ email: credentials.email });
          if (!account) {
            return null;
          }

          // Check password
          const isPasswordValid = await account.comparePassword(
            credentials.password
          );
          if (!isPasswordValid) {
            return null;
          }

          // Return user object with role
          return {
            id: account._id.toString(),
            email: account.email,
            name: account.name,
            image: account.picture,
            role: account.role,
          };
        } catch (error) {
          console.error("Credentials authorize error:", error);
          return null;
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (
        account &&
        (account.provider === "github" || account.provider === "google")
      ) {
        try {
          await connectToDatabase();

          const existingUser = await Account.findOne({ email: user.email });

          if (existingUser) {
            existingUser.provider = account.provider;
            await existingUser.save();
          } else {
            const newUser = new Account({
              email: user.email,
              name: user.name,
              picture: user.image,
              provider: account.provider,
              isVerified: true,
              status: "active",
              role: "user",
              password: `${account.provider}_oauth_user_${Date.now()}`,
            });
            await newUser.save();
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.provider = account.provider;
        token.email = user.email;
      }

      if (token.email) {
        try {
          await connectToDatabase();
          const dbUser = await Account.findOne({ email: token.email });
          if (dbUser) {
            token.role = dbUser.role;
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
        session.user.provider = token.provider as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      },
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
