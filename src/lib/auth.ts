import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // This is a demo - in production check against DB
                if (credentials?.email === "admin@droplet.com" && credentials?.password === "password123") {
                    return {
                        id: "user_1",
                        name: "Admin User",
                        email: "admin@droplet.com",
                        role: "OWNER",
                        companyId: "company_1"
                    };
                }
                return null;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: { token: any, user: any }) {
            if (user) {
                token.role = user.role;
                token.companyId = user.companyId;
            }
            return token;
        },
        async session({ session, token }: { session: any, token: any }) {
            if (session.user) {
                session.user.role = token.role;
                session.user.companyId = token.companyId;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
