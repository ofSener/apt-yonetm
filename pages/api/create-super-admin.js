import { PrismaClient } from '../../app/generated/prisma';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Create a secure password hash
    const hashedPassword = await hash('SuperAdmin123!', 10);

    // Check if a superadmin already exists
    const existingSuperAdmin = await prisma.user.findFirst({
      where: {
        role: 'SUPER_ADMIN',
      },
    });

    if (existingSuperAdmin) {
      return res.status(400).json({ message: 'SuperAdmin already exists' });
    }

    // Create the SuperAdmin user
    const superAdmin = await prisma.user.create({
      data: {
        email: 'superadmin@aptyonetim.com',
        name: 'Super Admin',
        role: 'SUPER_ADMIN',
        password: hashedPassword,
      },
    });

    return res.status(201).json({ 
      message: 'SuperAdmin created successfully',
      user: {
        id: superAdmin.id,
        email: superAdmin.email,
        name: superAdmin.name,
        role: superAdmin.role
      }
    });
  } catch (error) {
    console.error('Error creating SuperAdmin:', error);
    return res.status(500).json({ message: 'Failed to create SuperAdmin', error: error.message });
  } finally {
    await prisma.$disconnect();
  }
} 