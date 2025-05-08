import { AuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "../../../generated/prisma";
import { compare } from "bcrypt";

const prisma = new PrismaClient();

// Define specific types for our user
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  unitNumber?: string;
}

// authOptions const olarak tanımla ama export etme
const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        // Eski kimlik bilgileri
        apartmentCode: { label: "Apartment Code", type: "text" },
        unitNumber: { label: "Unit Number", type: "text" },
        password: { label: "Password", type: "password" },
        isAdmin: { label: "Is Admin", type: "boolean" },
        
        // SuperAdmin ve diğer kullanıcılar için e-posta girişi
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        // SuperAdmin veya email ile giriş
        if (credentials?.email && credentials?.password) {
          try {
            // E-posta ile kullanıcıyı bul
            const user = await prisma.user.findUnique({
              where: {
                email: credentials.email
              }
            });

            // Kullanıcı yoksa veya şifre eşleşmiyorsa null döndür
            if (!user) {
              return null;
            }

            // Şifre kontrolü
            const isPasswordValid = await compare(credentials.password, user.password);
            if (!isPasswordValid) {
              return null;
            }

            // Giriş başarılı, kullanıcı bilgilerini döndür
            return {
              id: user.id,
              name: user.name || user.email.split('@')[0],
              email: user.email,
              role: user.role,
              unitNumber: user.unitId ? String(user.unitId) : undefined,
            } as User;
          } catch (error) {
            console.error("Auth error:", error);
            return null;
          } finally {
            await prisma.$disconnect();
          }
        }

        // Eski kimlik doğrulama yöntemi için kodu koru
        // Admin girişi
        if (credentials?.isAdmin === "true") {
          if (
            credentials.password === "admin123" &&
            credentials.apartmentCode === "APT123"
          ) {
            return {
              id: "admin-1",
              name: "Site Yöneticisi",
              email: "admin@aptyonetim.com",
              role: "ADMIN",
            } as User;
          }
          return null;
        }

        // Sakin girişi - apartman kodu ve daire no ile
        if (credentials?.apartmentCode && credentials?.unitNumber && credentials?.password) {
          try {
            // Apartmanı bul
            const apartment = await prisma.apartment.findUnique({
              where: { code: credentials.apartmentCode }
            });

            if (!apartment) return null;

            // Daireyi bul
            const unit = await prisma.unit.findFirst({
              where: { 
                apartmentId: apartment.id, 
                number: credentials.unitNumber 
              },
              include: {
                residents: true
              }
            });

            if (!unit || unit.residents.length === 0) return null;
            
            // Dairenin sakinini al (ilk kullanıcıyı)
            const resident = unit.residents[0];
            
            // Şifre kontrolü
            const isPasswordValid = await compare(credentials.password, resident.password);
            if (!isPasswordValid) {
              return null;
            }
            
            // Giriş başarılı
            return {
              id: resident.id,
              name: resident.name || resident.email.split('@')[0],
              email: resident.email,
              role: resident.role,
              unitNumber: credentials.unitNumber
            } as User;
          } catch (error) {
            console.error("Auth error:", error);
            return null;
          } finally {
            await prisma.$disconnect();
          }
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "supersecretkey",
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      
      if (token.role && session.user) {
        session.user.role = token.role as string;
      }

      if (token.unitNumber && session.user) {
        (session.user as any).unitNumber = token.unitNumber;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        if ((user as User).unitNumber) {
          token.unitNumber = (user as User).unitNumber;
        }
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