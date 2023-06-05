import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  type DefaultUser,
} from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/server/db";
import type { Role } from "@/types/role.enum";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";

import { env } from "@/env.mjs";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
interface IUser extends DefaultUser {
  id: string;
  role: Role;
  isActive: boolean;
  structure: {
    department: string,
    position?: string,
  };
  account: {
    access_token?: string,
    provider?: string,
    address?: string,
  }
}

declare module "next-auth" {
  interface User extends IUser {
    name?: string;
    email?: string;
    image?: string;
  }

  interface Session extends DefaultSession {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends IUser {
    name?: string;
    email?: string;
    image?: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt ({ token, user, account }) {
      if (account?.provider !== "emailAndPassword") {
        token.account.access_token = account?.access_token;
        token.account.provider = account?.provider;
      }

      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isActive = user.isActive;
        token.structure = user.structure;
        token.account.provider = "email";
      }

      return token;
    },
    session ({ session, token }) {
      if (token.account.provider !== "emailAndPassword") {
        session.user.account.access_token = token.account?.access_token;
        session.user.account.provider = token.account?.provider;
        session.user.account.address = token.account?.address;
      }

      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isActive = token.isActive;
        session.user.structure = token.structure;
      }

      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  secret: env.NEXTAUTH_SECRET,
  providers: [
    // Email and Password
    CredentialsProvider({
      id: "emailAndPassword",
      name: "emailAndPassword",
      credentials: {
        email: {
          type: "email",
        },
        password: {
          type: "password",
        },
      },
      authorize: async (credentials: Record<"email" | "password", string> | undefined, _) => {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        if (!email || !password) {
          throw new Error("email and password is required in credentials");
        }

        const currentUser = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        console.log(currentUser?.password)

        if (!currentUser) {
          throw new Error("Wrong email or password");
        } else if (!currentUser.emailVerified) {
          throw new Error("Unverified email");
        } else if (currentUser.blockExpires) {
          throw new Error("Account is still in block");
        } else if (!currentUser.isActive) {
          throw new Error("account is no longer active");
        }

        const isValid = await compare(password, currentUser.password);

        if (!isValid) {
          const countInvalidLogin = await prisma.user.update({
            select: { loginAttempts: true },
            where: {
              id: currentUser.id,
            },
            data: {
              loginAttempts: { increment: 1 },
            }
          });

          if (countInvalidLogin.loginAttempts > 5) {
            await prisma.user.update({
              where: {
                id: currentUser.id,
              },
              data: {
                blockExpires: new Date()
              }
            })
          }

          throw new Error("Wrong email or password");
        }

        return {
          id: currentUser.id,
        };
      },
    }),

    // Ethereum
    // CredentialsProvider({
    //   name: "Ethereum",
    //   credentials: {
    //     message: {
    //       label: "Message",
    //       type: "text",
    //       placeholder: "0x0",
    //     },
    //     signature: {
    //       label: "Signature",
    //       type: "text",
    //       placeholder: "0x0",
    //     },
    //   },
    //   async authorize(credentials) {
    //     try {
    //       const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"))
    //       const nextAuthUrl = new URL(process.env.NEXTAUTH_URL)

    //       const result = await siwe.verify({
    //         signature: credentials?.signature || "",
    //         domain: nextAuthUrl.host,
    //         nonce: await getCsrfToken({ req }),
    //       })

    //       if (result.success) {
    //         return {
    //           id: siwe.address,
    //         }
    //       }
    //       return null
    //     } catch (e) {
    //       return null
    //     }
    //   },
    // }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 7,
    secret: env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    verifyRequest: "/auth/verify",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
