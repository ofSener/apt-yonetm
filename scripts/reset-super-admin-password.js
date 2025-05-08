const { PrismaClient } = require('../app/generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function resetSuperAdminPassword() {
  try {
    // Yeni şifre
    const newPassword = 'SuperAdmin123!';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // SuperAdmin kullanıcıyı bulma
    const superAdmin = await prisma.user.findFirst({
      where: {
        role: 'SUPER_ADMIN',
      },
    });
    
    if (!superAdmin) {
      console.error('❌ SuperAdmin kullanıcısı bulunamadı!');
      console.log('SuperAdmin oluşturmak için: node scripts/create-super-admin.js');
      return;
    }
    
    // Şifre güncelleme
    await prisma.user.update({
      where: {
        id: superAdmin.id,
      },
      data: {
        password: hashedPassword,
      },
    });
    
    console.log('✅ SuperAdmin şifresi başarıyla sıfırlandı');
    console.log('------------------------------------');
    console.log('🔑 Yeni giriş bilgileri:');
    console.log(`📧 E-posta: ${superAdmin.email}`);
    console.log(`🔒 Şifre: ${newPassword}`);
    console.log('------------------------------------');
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetSuperAdminPassword(); 