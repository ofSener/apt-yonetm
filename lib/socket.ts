import { Server as HTTPServer } from 'http';
import { Server as IOServer, Socket } from 'socket.io';
import { NextApiRequest } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

// Interface for notification data
export interface NotificationData {
  id: string;
  userId: string;
  type: 'payment' | 'maintenance' | 'announcement' | 'meeting' | 'document';
  title: string;
  message: string;
  isRead: boolean;
  entityId?: string;
  createdAt: Date;
}

// Socket server instance
let io: IOServer | null = null;

// Connected users map: userId -> socketId
const connectedUsers: Map<string, string> = new Map();

// Initialize Socket.IO server
export const initSocketServer = (server: HTTPServer) => {
  if (!io) {
    io = new IOServer(server, {
      path: '/api/socket',
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? process.env.NEXT_PUBLIC_SITE_URL 
          : '*',
        methods: ['GET', 'POST'],
      },
    });

    // Authentication middleware
    io.use(async (socket: Socket, next: (err?: Error | undefined) => void) => {
      try {
        // Get session from cookies
        const req = socket.request as NextApiRequest & { session?: Session };
        const session = await getSession({ req });
        
        if (!session || !session.user) {
          return next(new Error('Unauthorized'));
        }

        // Attach user data to socket
        socket.data.user = session.user;
        next();
      } catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Authentication error'));
      }
    });

    // Socket connection event
    io.on('connection', (socket: Socket) => {
      console.log(`Socket connected: ${socket.id}`);
      
      // Store user connection
      if (socket.data.user?.id) {
        connectedUsers.set(socket.data.user.id, socket.id);
        console.log(`User ${socket.data.user.id} connected`);
      }

      // Join apartment room if user belongs to an apartment
      if (socket.data.user?.apartmentId) {
        socket.join(`apartment-${socket.data.user.apartmentId}`);
        console.log(`User joined apartment-${socket.data.user.apartmentId}`);
      }

      // Handle disconnect
      socket.on('disconnect', () => {
        if (socket.data.user?.id) {
          connectedUsers.delete(socket.data.user.id);
          console.log(`User ${socket.data.user.id} disconnected`);
        }
      });

      // Read notification event
      socket.on('notification:read', (notificationId: string) => {
        // In a real implementation, you'd update the notification status in the database
        console.log(`Notification ${notificationId} marked as read by user ${socket.data.user?.id}`);
      });
    });

    console.log('Socket.IO server initialized');
  }
  
  return io;
};

// Get Socket.IO server instance
export const getSocketServer = () => {
  if (!io) {
    throw new Error('Socket.IO server not initialized');
  }
  
  return io;
};

// Send notification to a specific user
export const sendUserNotification = (userId: string, notification: Omit<NotificationData, 'id' | 'createdAt'>) => {
  if (!io) return;

  const socketId = connectedUsers.get(userId);
  if (!socketId) return;

  const fullNotification: NotificationData = {
    ...notification,
    id: `notification-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date(),
  };

  io.to(socketId).emit('notification', fullNotification);
};

// Send notification to all users in an apartment
export const sendApartmentNotification = (apartmentId: string, notification: Omit<NotificationData, 'id' | 'userId' | 'createdAt'>) => {
  if (!io) return;

  const fullNotification: Omit<NotificationData, 'userId'> = {
    ...notification,
    id: `notification-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date(),
  };

  io.to(`apartment-${apartmentId}`).emit('notification', fullNotification);
};

// Send notification to specific users
export const sendMultiUserNotification = (userIds: string[], notification: Omit<NotificationData, 'id' | 'userId' | 'createdAt'>) => {
  userIds.forEach(userId => {
    sendUserNotification(userId, {
      ...notification,
      userId,
    });
  });
};

// Example notification functions
export const notifyPaymentDue = (userId: string, dueId: string, amount: number, dueDate: string) => {
  sendUserNotification(userId, {
    userId,
    type: 'payment',
    title: 'Aidat Ödemesi',
    message: `${amount.toLocaleString('tr-TR')}₺ tutarındaki aidat ödemesi için son tarih: ${dueDate}`,
    isRead: false,
    entityId: dueId,
  });
};

export const notifyMaintenanceUpdate = (userId: string, requestId: string, requestTitle: string, status: string) => {
  let statusText = '';
  switch (status) {
    case 'pending': statusText = 'Bekliyor'; break;
    case 'inProgress': statusText = 'İşleme Alındı'; break;
    case 'completed': statusText = 'Tamamlandı'; break;
    case 'rejected': statusText = 'Reddedildi'; break;
    default: statusText = status;
  }

  sendUserNotification(userId, {
    userId,
    type: 'maintenance',
    title: 'Bakım Talebi Güncellemesi',
    message: `"${requestTitle}" talebinizin durumu: ${statusText}`,
    isRead: false,
    entityId: requestId,
  });
};

export const notifyNewAnnouncement = (apartmentId: string, announcementId: string, title: string) => {
  sendApartmentNotification(apartmentId, {
    type: 'announcement',
    title: 'Yeni Duyuru',
    message: `Yeni duyuru yayınlandı: ${title}`,
    isRead: false,
    entityId: announcementId,
  });
};

export const notifyMeetingInvitation = (userIds: string[], meetingId: string, title: string, date: string) => {
  sendMultiUserNotification(userIds, {
    type: 'meeting',
    title: 'Toplantı Daveti',
    message: `"${title}" toplantısı için davet: ${date}`,
    isRead: false,
    entityId: meetingId,
  });
};

export const notifyNewDocument = (apartmentId: string, documentId: string, title: string) => {
  sendApartmentNotification(apartmentId, {
    type: 'document',
    title: 'Yeni Doküman',
    message: `Yeni doküman yüklendi: ${title}`,
    isRead: false,
    entityId: documentId,
  });
}; 