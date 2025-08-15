import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { notificationService } from '@/lib/notificationService';
import { Notification, NotificationCounts } from '@/types/notifications.types';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  markAsArchived: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  
  // Competition monitoring
  startCompetitionMonitoring: () => void;
  stopCompetitionMonitoring: () => void;
  
  // Daily motivations
  createDailyMotivations: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Competition monitoring interval
  const [monitoringInterval, setMonitoringInterval] = useState<NodeJS.Timeout | null>(null);

  // Initialize notification service
  useEffect(() => {
    if (user?.id) {
      notificationService.initializeCounts(user.id);
      
      // Add listener for unread count updates
      const handleUnreadCountChange = (count: number) => {
        setUnreadCount(count);
      };
      
      notificationService.addUnreadCountListener(handleUnreadCountChange);
      
      return () => {
        notificationService.removeUnreadCountListener(handleUnreadCountChange);
      };
    }
  }, [user?.id]);

  // Load notifications
  const loadNotifications = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await notificationService.getNotifications(user.id);
      if (response) {
        setNotifications(response.data);
      }
    } catch (err) {
      setError('Failed to load notifications');
      console.error('Error loading notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Load notifications on mount and when user changes
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadNotifications();
    }
  }, [isAuthenticated, user?.id, loadNotifications]);

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      await notificationService.markAllAsRead(user.id);
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [user?.id]);

  // Mark notification as archived
  const markAsArchived = useCallback(async (id: string) => {
    try {
      await notificationService.markAsArchived(id);
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, isArchived: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as archived:', error);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      // Remove from local state
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, []);

  // Refresh notifications
  const refreshNotifications = useCallback(async () => {
    await loadNotifications();
  }, [loadNotifications]);

  // Start competition monitoring
  const startCompetitionMonitoring = useCallback(() => {
    if (!user?.id || monitoringInterval) return;

    const interval = setInterval(async () => {
      try {
        // Check for new competitions
        const availableResponse = await fetch(`/api/v1/contest/${user.id}/available`);
        if (availableResponse.ok) {
          const availableData = await availableResponse.json();
          // Check if there are new competitions (this would need more sophisticated logic in production)
        }

        // Check for upcoming competitions
        const upcomingResponse = await fetch('/api/v1/contest/upcoming');
        if (upcomingResponse.ok) {
          const upcomingData = await upcomingResponse.json();
          // Process upcoming competitions
        }
      } catch (error) {
        console.error('Error monitoring competitions:', error);
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    setMonitoringInterval(interval);
  }, [user?.id, monitoringInterval]);

  // Stop competition monitoring
  const stopCompetitionMonitoring = useCallback(() => {
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
      setMonitoringInterval(null);
    }
  }, [monitoringInterval]);

  // Create daily motivations
  const createDailyMotivations = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      await notificationService.createDailyMotivations(user.id, user.profileId || '');
    } catch (error) {
      console.error('Error creating daily motivations:', error);
    }
  }, [user?.id, user?.profileId]);

  // Start monitoring when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      startCompetitionMonitoring();
      
      // Create daily motivations at midnight
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeUntilMidnight = tomorrow.getTime() - now.getTime();
      
      const dailyMotivationTimer = setTimeout(() => {
        createDailyMotivations();
        // Set up recurring daily timer
        const dailyInterval = setInterval(createDailyMotivations, 24 * 60 * 60 * 1000);
        return () => clearInterval(dailyInterval);
      }, timeUntilMidnight);
      
      return () => {
        clearTimeout(dailyMotivationTimer);
        stopCompetitionMonitoring();
      };
    }
  }, [isAuthenticated, user?.id, startCompetitionMonitoring, stopCompetitionMonitoring, createDailyMotivations]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    markAsArchived,
    deleteNotification,
    refreshNotifications,
    startCompetitionMonitoring,
    stopCompetitionMonitoring,
    createDailyMotivations,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
