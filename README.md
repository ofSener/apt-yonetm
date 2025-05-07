# AptYonetim - Apartman Yönetim Uygulaması

Modern bir apartman yönetim uygulaması. Sakinler, yöneticiler ve admin için farklı yetkilerle borç/ödeme takibi, duyurular, anketler ve daha fazlası.

## Özellikler

- 🏢 Apartman ve daire yönetimi
- 💰 Aidat ve ödeme takibi
- 📣 Duyuru sistemi
- 📊 Anket oluşturma ve katılım
- 📝 Gider/harcama yönetimi ve kayıt
- 📄 Doküman paylaşımı
- 💳 Kredi kartı ile online ödeme
- 📱 Mobil uyumlu tasarım

## Teknoloji Yığını

- **Frontend**: Next.js, TypeScript, TailwindCSS, React
- **Backend**: Next.js API Routes
- **Veritabanı**: PostgreSQL, Prisma ORM
- **Kimlik Doğrulama**: NextAuth.js
- **Ödeme**: Stripe
- **Deployment**: Vercel

## Kurulum

### Gereksinimler

- Node.js (v18 veya üzeri)
- PostgreSQL

### Adımlar

1. Repoyu klonlayın
   ```
   git clone https://github.com/kullanici/aptyonetim.git
   cd aptyonetim
   ```

2. Bağımlılıkları yükleyin
   ```
   npm install
   ```

3. `.env` dosyasını oluşturun
   ```
   # Database
   DATABASE_URL="postgresql://postgres:password@localhost:5432/aptyonetim"

   # Next Auth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET="your-secret-key-change-in-production"

   # Stripe
   STRIPE_SECRET_KEY="your-stripe-secret-key"
   STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
   ```

4. Veritabanını oluşturun
   ```
   npx prisma migrate dev --name init
   ```

5. Geliştirme sunucusunu başlatın
   ```
   npm run dev
   ```

6. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın

## Kullanıcı Rolleri

- **Sakin**: Aidat görüntüleme ve ödeme, duyuruları görüntüleme, anketlere katılma
- **Yönetici**: Sakin yetkileri + Harcama ekleme, duyuru oluşturma, anket oluşturma
- **Admin**: Tüm yetkiler + Apartman ve kullanıcı yönetimi

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.
