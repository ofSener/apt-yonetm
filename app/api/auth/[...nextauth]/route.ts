import { AuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// authOptions const olarak tanımla ama export etme
const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        apartmentCode: { label: "Apartment Code", type: "text" },
        unitNumber: { label: "Unit Number", type: "text" },
      },
      async authorize(credentials) {
        // Demo amaçlı sabit kullanıcı - gerçek uygulamada veritabanından kontrol edilmelidir
        if (
          credentials?.password === "password" &&
          credentials?.apartmentCode === "AKASYA"
        ) {
          return {
            id: "1",
            name: "Demo Kullanıcı",
            email: "demo@example.com",
            role: "RESIDENT",
          };
        }

        // Demo yönetici
        if (
          credentials?.password === "admin" &&
          credentials?.apartmentCode === "AKASYA"
        ) {
          return {
            id: "2",
            name: "Demo Yönetici",
            email: "admin@example.com",
            role: "ADMIN",
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      
      if (token.role && session.user) {
        session.user.role = token.role as string;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    }
  },
  pages: {
    signIn: '/login',
  },
  debug: process.env.NODE_ENV === "development",
};

// Sadece handler'ı export et
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 