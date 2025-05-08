const { PrismaClient } = require('../app/generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    // Şifreyi hashleme
    const password = 'SuperAdmin123!';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // SuperAdmin kullanıcı oluşturma
    const superAdmin = await prisma.user.create({
      data: {
        email: 'superadmin@aptyonetim.com',
        name: 'Super Admin',
        role: 'SUPER_ADMIN',
        password: hashedPassword,
      },
    });
    
    console.log('✅ SuperAdmin başarıyla oluşturuldu');
    console.log('------------------------------------');
    console.log('🔑 Giriş bilgileri:');
    console.log(`📧 E-posta: ${superAdmin.email}`);
    console.log(`🔒 Şifre: ${password}`);
    console.log('------------------------------------');
    console.log('SuperAdmin ID:', superAdmin.id);
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.error('❌ Bu e-posta adresi zaten kullanımda!');
      
      // Mevcut SuperAdmin'in şifresini güncelleme seçeneği
      console.log('✏️ Mevcut SuperAdmin şifresini güncellemek için:');
      console.log('node scripts/reset-super-admin-password.js');
    } else {
      console.error('❌ Hata:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin(); 