import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { sendUserNotification } from '@/lib/socket';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id as string;
    
    // Create a test notification in the database
    const notification = await prisma.notification.create({
      data: {
        userId,
        type: 'announcement',
        title: 'Test Bildirimi',
        message: 'Bu bir test bildirimidir. Bildirim sistemi çalışıyor!',
        isRead: false,
      }
    });
    
    // Send a real-time notification
    sendUserNotification(userId, {
      userId,
      type: 'announcement',
      title: 'Test Bildirimi',
      message: 'Bu bir test bildirimidir. Bildirim sistemi çalışıyor!',
      isRead: false,
    });
    
    return NextResponse.json({
      success: true,
      notification,
      message: 'Test bildirimi gönderildi'
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
    return NextResponse.json({ error: 'Failed to send test notification' }, { status: 500 });
  }
} 