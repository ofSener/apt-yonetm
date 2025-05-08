import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/email';
import { 
  sendUserNotification, 
  sendApartmentNotification, 
  sendMultiUserNotification 
} from '@/lib/socket';

// GET: Fetch notifications for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id as string;
    
    // Get pagination parameters
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Get filter parameters
    const isRead = searchParams.get('isRead');
    const type = searchParams.get('type');
    
    // Build filter
    const filter: any = { userId };
    if (isRead !== null) {
      filter.isRead = isRead === 'true';
    }
    if (type) {
      filter.type = type;
    }

    // Get notifications
    const notifications = await prisma.notification.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    // Count total
    const total = await prisma.notification.count({ where: filter });

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

// POST: Create a new notification
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user is an admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { role: true },
    });
    
    if (user?.role !== 'ADMIN' && user?.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { 
      recipients, 
      type, 
      title, 
      message, 
      entityId, 
      sendEmail: shouldSendEmail,
      apartmentId
    } = body;
    
    // Validate required fields
    if (!type || !title || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Determine recipients
    let userIds: string[] = [];
    if (recipients === 'all') {
      // Send to all users in the apartment
      if (!apartmentId) {
        return NextResponse.json({ error: 'Apartment ID is required for all recipients' }, { status: 400 });
      }
      
      const apartmentUsers = await prisma.user.findMany({
        where: { apartmentId },
        select: { id: true },
      });
      
      userIds = apartmentUsers.map(user => user.id);
    } else if (Array.isArray(recipients)) {
      userIds = recipients;
    } else {
      return NextResponse.json({ error: 'Invalid recipients format' }, { status: 400 });
    }
    
    // Create notifications in database
    const notificationPromises = userIds.map(userId => {
      return prisma.notification.create({
        data: {
          userId,
          type,
          title,
          message,
          isRead: false,
          entityId,
        }
      });
    });
    
    const createdNotifications = await Promise.all(notificationPromises);
    
    // Send real-time notifications
    if (userIds.length === 1) {
      sendUserNotification(userIds[0], {
        userId: userIds[0],
        type,
        title,
        message,
        isRead: false,
        entityId,
      });
    } else if (apartmentId) {
      sendApartmentNotification(apartmentId, {
        type,
        title,
        message,
        isRead: false,
        entityId,
      });
    } else {
      sendMultiUserNotification(userIds, {
        type,
        title,
        message,
        isRead: false,
        entityId,
      });
    }
    
    // Send email notifications if requested
    if (shouldSendEmail) {
      // Fetch user emails
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, email: true, name: true },
      });
      
      // Send emails based on notification type
      const emailPromises = users.map(async (user) => {
        if (!user.email) return;
        
        let emailResult;
        
        switch (type) {
          case 'payment':
            // Assume amount and dueDate are in the message or extract from entityId
            const dueDate = new Date().toLocaleDateString('tr-TR');
            const amount = 100; // Example amount
            emailResult = await sendEmail({
              to: user.email,
              subject: emailTemplates.paymentReminder(user.name || 'Sakin', amount, dueDate).subject,
              html: emailTemplates.paymentReminder(user.name || 'Sakin', amount, dueDate).html,
            });
            break;
            
          case 'maintenance':
            emailResult = await sendEmail({
              to: user.email,
              subject: emailTemplates.maintenanceUpdate(user.name || 'Sakin', title, 'Güncellendi', message).subject,
              html: emailTemplates.maintenanceUpdate(user.name || 'Sakin', title, 'Güncellendi', message).html,
            });
            break;
            
          case 'announcement':
            emailResult = await sendEmail({
              to: user.email,
              subject: emailTemplates.announcementNotification(user.name || 'Sakin', title, message).subject,
              html: emailTemplates.announcementNotification(user.name || 'Sakin', title, message).html,
            });
            break;
            
          case 'meeting':
            // Example meeting details
            const meetingDate = new Date().toLocaleDateString('tr-TR');
            const meetingTime = '18:00';
            const location = 'Apartman Toplantı Salonu';
            
            emailResult = await sendEmail({
              to: user.email,
              subject: emailTemplates.meetingInvitation(user.name || 'Sakin', title, meetingDate, meetingTime, location).subject,
              html: emailTemplates.meetingInvitation(user.name || 'Sakin', title, meetingDate, meetingTime, location).html,
            });
            break;
            
          default:
            // Generic email
            emailResult = await sendEmail({
              to: user.email,
              subject: title,
              html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #3b82f6;">AptYonetim - ${title}</h2>
                <p>Sayın ${user.name || 'Sakin'},</p>
                <p>${message}</p>
                <p>Saygılarımızla,<br>AptYonetim Ekibi</p>
              </div>`,
            });
            break;
        }
        
        return emailResult;
      });
      
      await Promise.all(emailPromises);
    }
    
    return NextResponse.json({
      success: true,
      notificationCount: createdNotifications.length,
    });
    
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
} 