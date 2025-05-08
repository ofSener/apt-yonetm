import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { createBankTransfer } from '@/lib/bankTransfer';
import { uploadFile } from '@/lib/fileUpload';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Parse the form data
    const formData = await request.formData();
    
    const bankAccountId = formData.get('bankAccountId') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const transferDate = new Date(formData.get('transferDate') as string);
    const dueId = formData.get('dueId') as string || undefined;
    const senderName = formData.get('senderName') as string;
    const description = formData.get('description') as string || undefined;
    const receiptFile = formData.get('receiptFile') as File || null;

    // Validate required fields
    if (!bankAccountId || isNaN(amount) || !transferDate || !senderName) {
      return NextResponse.json(
        { message: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // Upload receipt file if provided
    let receiptUrl: string | undefined;
    if (receiptFile) {
      const uploadResult = await uploadFile(receiptFile, 'bank-receipts');
      if (uploadResult.success) {
        receiptUrl = uploadResult.url;
      } else {
        return NextResponse.json(
          { message: 'Failed to upload receipt file' },
          { status: 500 }
        );
      }
    }

    // Create bank transfer record
    const result = await createBankTransfer({
      userId: session.user.id,
      bankAccountId,
      amount,
      transferDate,
      dueId,
      senderName,
      description,
      receiptUrl,
    });

    if (!result.success) {
      return NextResponse.json(
        { message: 'Failed to create bank transfer' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Bank transfer submitted successfully',
      bankTransfer: result.bankTransfer
    });
  } catch (error) {
    console.error('Error creating bank transfer:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 