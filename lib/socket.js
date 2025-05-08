const { Server } = require('socket.io');
const { getSession } = require('next-auth/react');

// Socket server instance
let io = null;

// Connected users map: userId -> socketId
const connectedUsers = new Map();

// Initialize Socket.IO server
const initSocketServer = (server) => {
  if (!io) {
    io = new Server(server, {
      path: '/api/socket',
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? process.env.NEXT_PUBLIC_SITE_URL 
          : '*',
        methods: ['GET', 'POST'],
      },
    });

    // Authentication middleware
    io.use(async (socket, next) => {
      try {
        // Get session from cookies
        const req = socket.request;
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
    io.on('connection', (socket) => {
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
      socket.on('notification:read', (notificationId) => {
        // In a real implementation, you'd update the notification status in the database
        console.log(`Notification ${notificationId} marked as read by user ${socket.data.user?.id}`);
      });
    });

    console.log('Socket.IO server initialized');
  }
  
  return io;
};

// Get Socket.IO server instance
const getSocketServer = () => {
  if (!io) {
    throw new Error('Socket.IO server not initialized');
  }
  
  return io;
};

// Send notification to a specific user
const sendUserNotification = (userId, notification) => {
  if (!io) return;

  const socketId = connectedUsers.get(userId);
  if (!socketId) return;

  const fullNotification = {
    ...notification,
    id: `notification-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date(),
  };

  io.to(socketId).emit('notification', fullNotification);
};

// Send notification to all users in an apartment
const sendApartmentNotification = (apartmentId, notification) => {
  if (!io) return;

  const fullNotification = {
    ...notification,
    id: `notification-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date(),
  };

  io.to(`apartment-${apartmentId}`).emit('notification', fullNotification);
};

// Export functions
module.exports = {
  initSocketServer,
  getSocketServer,
  sendUserNotification,
  sendApartmentNotification
}; 