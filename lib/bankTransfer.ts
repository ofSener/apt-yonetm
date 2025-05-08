import prisma from './prisma';
import { BankTransferStatus } from '@/app/generated/prisma';

// Referans kodu oluşturma
export const generateReferenceCode = (userId: string, dueId?: string): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  // Kullanıcı ID'sinin son 4 karakteri
  const userPart = userId.slice(-4);
  
  // Random 3 karakterli bir ek
  const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  // Daire numarası eklentisi (opsiyonel)
  const duePart = dueId ? `-${dueId.slice(-3)}` : '';
  
  return `HVL${year}${month}${day}-${userPart}${randomPart}${duePart}`;
};

// Kullanıcının havale bildirimi oluşturma
export const createBankTransfer = async ({
  userId,
  bankAccountId,
  amount,
  transferDate,
  dueId,
  senderName,
  description,
  receiptUrl,
}: {
  userId: string;
  bankAccountId: string;
  amount: number;
  transferDate: Date;
  dueId?: string;
  senderName?: string;
  description?: string;
  receiptUrl?: string;
}) => {
  try {
    // Referans kodu oluştur
    const referenceCode = generateReferenceCode(userId, dueId);
    
    // Havale bildirimini oluştur
    const bankTransfer = await prisma.bankTransfer.create({
      data: {
        amount,
        transferDate,
        referenceCode,
        senderName,
        description,
        receiptUrl,
        status: BankTransferStatus.PENDING,
        user: { connect: { id: userId } },
        bankAccount: { connect: { id: bankAccountId } },
        ...(dueId && { due: { connect: { id: dueId } } }),
      },
      include: {
        bankAccount: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        due: true,
      },
    });
    
    return { success: true, bankTransfer };
  } catch (error) {
    console.error('Havale bildirimi oluşturulurken hata:', error);
    return { success: false, error };
  }
};

// Kullanıcının havale bildirimlerini getirme
export const getUserBankTransfers = async (userId: string) => {
  try {
    const transfers = await prisma.bankTransfer.findMany({
      where: { userId },
      include: {
        bankAccount: true,
        due: true,
        verifiedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return { success: true, transfers };
  } catch (error) {
    console.error('Kullanıcı havale bildirimleri alınırken hata:', error);
    return { success: false, error };
  }
};

// Yönetici için bekleyen havale bildirimlerini getirme
export const getPendingBankTransfers = async (apartmentId: string) => {
  try {
    const pendingTransfers = await prisma.bankTransfer.findMany({
      where: {
        status: BankTransferStatus.PENDING,
        bankAccount: {
          apartmentId,
        },
      },
      include: {
        bankAccount: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            unitId: true,
            unit: {
              select: {
                number: true,
              },
            },
          },
        },
        due: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return { success: true, pendingTransfers };
  } catch (error) {
    console.error('Bekleyen havale bildirimleri alınırken hata:', error);
    return { success: false, error };
  }
};

// Havale bildirimini onaylama/reddetme
export const updateBankTransferStatus = async ({
  transferId,
  adminId,
  status,
  statusNote,
}: {
  transferId: string;
  adminId: string;
  status: BankTransferStatus;
  statusNote?: string;
}) => {
  try {
    const bankTransfer = await prisma.bankTransfer.update({
      where: { id: transferId },
      data: {
        status,
        statusNote,
        verifiedBy: { connect: { id: adminId } },
        verifiedAt: new Date(),
        ...(status === BankTransferStatus.VERIFIED && {
          due: {
            update: {
              isPaid: true,
            },
          },
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        due: true,
        bankAccount: true,
      },
    });
    
    return { success: true, bankTransfer };
  } catch (error) {
    console.error('Havale bildirimi durumu güncellenirken hata:', error);
    return { success: false, error };
  }
};

// Apartmana ait banka hesaplarını getirme
export const getBankAccounts = async (apartmentId: string) => {
  try {
    const bankAccounts = await prisma.bankAccount.findMany({
      where: {
        apartmentId,
        isActive: true,
      },
      orderBy: { bankName: 'asc' },
    });
    
    return { success: true, bankAccounts };
  } catch (error) {
    console.error('Banka hesapları alınırken hata:', error);
    return { success: false, error };
  }
}; 