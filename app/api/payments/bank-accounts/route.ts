import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import NextAuth from 'next-auth';
import { getBankAccounts } from '@/lib/bankTransfer';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Authenticate user
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get user's apartment ID
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { apartment: { select: { id: true } } },
    });

    if (!user?.apartment?.id) {
      return NextResponse.json(
        { message: 'User does not belong to an apartment' },
        { status: 400 }
      );
    }

    // Get bank accounts for the apartment
    const result = await getBankAccounts(user.apartment.id);

    if (!result.success) {
      return NextResponse.json(
        { message: 'Failed to fetch bank accounts' },
        { status: 500 }
      );
    }

    return NextResponse.json({ bankAccounts: result.bankAccounts });
  } catch (error) {
    console.error('Error fetching bank accounts:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 