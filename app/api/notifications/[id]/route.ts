import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id as string;
    const notificationId = params.id;
    
    const body = await req.json();
    const { isRead } = body;
    
    // Ensure the notification belongs to the user
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      select: { userId: true },
    });
    
    if (!notification || notification.userId !== userId) {
      return NextResponse.json({ error: 'Notification not found or access denied' }, { status: 404 });
    }
    
    // Update the notification
    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead },
    });
    
    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id as string;
    const notificationId = params.id;
    
    // Ensure the notification belongs to the user
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      select: { userId: true },
    });
    
    if (!notification || notification.userId !== userId) {
      return NextResponse.json({ error: 'Notification not found or access denied' }, { status: 404 });
    }
    
    // Delete the notification
    await prisma.notification.delete({
      where: { id: notificationId },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
} 