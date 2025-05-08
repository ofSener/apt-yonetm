import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getPendingBankTransfers, updateBankTransferStatus } from '@/lib/bankTransfer';
import { BankTransferStatus } from '@/app/generated/prisma';
import prisma from '@/lib/prisma';

// Get pending bank transfers for admin
export async function GET() {
  try {
    // Authenticate user
    const session = await getServerSession();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get admin's apartment ID
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { apartment: { select: { id: true } } },
    });

    if (!user?.apartment?.id) {
      return NextResponse.json(
        { message: 'Admin is not associated with an apartment' },
        { status: 400 }
      );
    }

    // Get pending bank transfers for the apartment
    const result = await getPendingBankTransfers(user.apartment.id);

    if (!result.success) {
      return NextResponse.json(
        { message: 'Failed to fetch bank transfers' },
        { status: 500 }
      );
    }

    return NextResponse.json({ transfers: result.pendingTransfers });
  } catch (error) {
    console.error('Error fetching pending bank transfers:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update bank transfer status (approve/reject)
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { transferId, status, statusNote } = data;

    // Validate required fields
    if (!transferId || !status) {
      return NextResponse.json(
        { message: 'Transfer ID and status are required' },
        { status: 400 }
      );
    }

    // Validate status
    if (![BankTransferStatus.VERIFIED, BankTransferStatus.REJECTED].includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status. Must be VERIFIED or REJECTED' },
        { status: 400 }
      );
    }

    // Update bank transfer status
    const result = await updateBankTransferStatus({
      transferId,
      adminId: session.user.id,
      status,
      statusNote,
    });

    if (!result.success) {
      return NextResponse.json(
        { message: 'Failed to update bank transfer status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Bank transfer ${status === BankTransferStatus.VERIFIED ? 'approved' : 'rejected'} successfully`,
      bankTransfer: result.bankTransfer,
    });
  } catch (error) {
    console.error('Error updating bank transfer status:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}