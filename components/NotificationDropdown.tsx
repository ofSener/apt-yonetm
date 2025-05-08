'use client';

import { useState, useEffect } from 'react';
import { LuBell, LuCheck, LuX } from 'react-icons/lu';
import Link from 'next/link';

// Notification type definition
interface Notification {
  id: string;
  type: 'payment' | 'maintenance' | 'announcement' | 'meeting' | 'document';
  title: string;
  message: string;
  isRead: boolean;
  entityId?: string;
  createdAt: string;
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications();
    
    // Setup socket connection for real-time notifications
    const socket = connectToSocket();
    
    // Listen for new notifications
    if (socket) {
      socket.on('notification', (notification: Notification) => {
        setNotifications(prev => [notification, ...prev]);
        if (!notification.isRead) {
          setUnreadCount(prev => prev + 1);
        }
      });
    }
    
    return () => {
      // Clean up socket connection
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // Connect to the Socket.IO server
  const connectToSocket = () => {
    if (typeof window !== 'undefined') {
      // This should only run on the client side
      const io = require('socket.io-client');
      const socket = io('/', { path: '/api/socket' });
      
      socket.on('connect', () => {
        console.log('Socket connected');
      });
      
      socket.on('connect_error', (error: any) => {
        console.error('Socket connection error:', error);
      });
      
      return socket;
    }
    return null;
  };

  // Fetch notifications from the API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications?limit=10');
      const data = await response.json();
      
      if (data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter((n: Notification) => !n.isRead).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark a notification as read
  const markAsRead = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true }),
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Delete a notification
  const deleteNotification = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        const notificationToRemove = notifications.find(n => n.id === id);
        setNotifications(prev => prev.filter(n => n.id !== id));
        
        if (notificationToRemove && !notificationToRemove.isRead) {
          setUnreadCount(prev => prev - 1);
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Format the time of the notification (e.g., "2 hours ago")
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
      return `${diffDay} gün önce`;
    } else if (diffHour > 0) {
      return `${diffHour} saat önce`;
    } else if (diffMin > 0) {
      return `${diffMin} dakika önce`;
    } else {
      return 'Az önce';
    }
  };

  // Get the appropriate icon and link for each notification type
  const getNotificationDetails = (notification: Notification) => {
    const { type, entityId } = notification;
    
    switch (type) {
      case 'payment':
        return {
          icon: <div className="bg-green-100 p-2 rounded-full text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </div>,
          href: entityId ? `/dashboard/payments/${entityId}` : '/dashboard/payments',
        };
      case 'maintenance':
        return {
          icon: <div className="bg-orange-100 p-2 rounded-full text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>,
          href: entityId ? `/dashboard/maintenance/${entityId}` : '/dashboard/maintenance',
        };
      case 'announcement':
        return {
          icon: <div className="bg-purple-100 p-2 rounded-full text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3z" />
                    <path d="M19 17v1a3 3 0 0 1-6 0v-1" />
                  </svg>
                </div>,
          href: entityId ? `/dashboard/announcements/${entityId}` : '/dashboard/announcements',
        };
      case 'meeting':
        return {
          icon: <div className="bg-blue-100 p-2 rounded-full text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>,
          href: entityId ? `/dashboard/meetings/${entityId}` : '/dashboard/meetings',
        };
      case 'document':
        return {
          icon: <div className="bg-gray-100 p-2 rounded-full text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <line x1="10" y1="9" x2="8" y2="9" />
                  </svg>
                </div>,
          href: entityId ? `/dashboard/documents/${entityId}` : '/dashboard/documents',
        };
      default:
        return {
          icon: <div className="bg-gray-100 p-2 rounded-full text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  <LuBell size={20} />
                </div>,
          href: '/dashboard',
        };
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-label="Notifications"
      >
        <LuBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 text-xs flex items-center justify-center rounded-full bg-red-500 text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Bildirimler</h3>
            <Link href="/dashboard/notifications" className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Tümünü Gör
            </Link>
          </div>
          
          {loading ? (
            <div className="py-6 px-4 text-center text-gray-500 dark:text-gray-400">
              Bildirimler yükleniyor...
            </div>
          ) : notifications.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notification) => {
                const { icon, href } = getNotificationDetails(notification);
                
                return (
                  <Link 
                    key={notification.id}
                    href={href}
                    className={`block px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => {
                      if (!notification.isRead) {
                        // We'll mark as read when clicking on the notification
                        markAsRead(notification.id, new MouseEvent('click') as any);
                      }
                    }}
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        {icon}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-2 flex flex-col space-y-1">
                        {!notification.isRead && (
                          <button
                            onClick={(e) => markAsRead(notification.id, e)}
                            className="p-1 text-gray-400 hover:text-green-500 dark:text-gray-500 dark:hover:text-green-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="Okundu olarak işaretle"
                          >
                            <LuCheck size={14} />
                          </button>
                        )}
                        <button
                          onClick={(e) => deleteNotification(notification.id, e)}
                          className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          title="Sil"
                        >
                          <LuX size={14} />
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-6 px-4 text-center text-gray-500 dark:text-gray-400">
              Bildirim bulunmuyor.
            </div>
          )}
          
          <div className="p-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 text-xs text-center">
            <button 
              onClick={() => {
                // Mark all as read
                notifications.forEach(n => {
                  if (!n.isRead) {
                    markAsRead(n.id, new MouseEvent('click') as any);
                  }
                });
              }}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              disabled={unreadCount === 0}
            >
              Tümünü Okundu İşaretle
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 