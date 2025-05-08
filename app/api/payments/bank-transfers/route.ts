import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getUserBankTransfers } from '@/lib/bankTransfer';

export async function GET() {
  try {
    // Authenticate user
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get user's bank transfers
    const result = await getUserBankTransfers(session.user.id);

    if (!result.success) {
      return NextResponse.json(
        { message: 'Failed to fetch bank transfers' },
        { status: 500 }
      );
    }

    return NextResponse.json({ transfers: result.transfers });
  } catch (error) {
    console.error('Error fetching bank transfers:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 