import { AuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Basitleştirilmiş authOptions - veritabanı bağlantısı olmadan çalışacak şekilde
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        apartmentCode: { label: "Apartman Kodu", type: "text" },
        unitNumber: { label: "Daire Numarası", type: "text" },
        password: { label: "Şifre", type: "password" },
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 