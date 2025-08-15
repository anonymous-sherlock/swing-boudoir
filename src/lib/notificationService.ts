import { api } from './api';
import { 
  Notification, 
  NotificationCreateRequest, 
  NotificationUpdateRequest, 
  NotificationsListResponse,
  NotificationCounts,
  NotificationType 
} from '@/types/notifications.types';

class NotificationService {
  private static instance: NotificationService;
  private unreadCount: number = 0;
  private listeners: ((count: number) => void)[] = [];

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Create a new notification
  async createNotification(data: NotificationCreateRequest): Promise<Notification | null> {
    try {
      const response = await api.post<Notification>('/notifications', data);
      if (response.success) {
        // Increment unread count if notification is not read
        if (!data.isRead) {
          this.incrementUnreadCount();
        }
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  // Get all notifications for a user
  async getNotifications(
    userId: string, 
    page: number = 1, 
    limit: number = 20,
    includeArchived: boolean = false
  ): Promise<NotificationsListResponse | null> {
    try {
      const params = new URLSearchParams({
        userId,
        page: page.toString(),
        limit: limit.toString(),
        includeArchived: includeArchived.toString()
      });

      const response = await api.get<NotificationsListResponse>(`/notifications?${params}`);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return null;
    }
  }

  // Get a specific notification
  async getNotification(id: string): Promise<Notification | null> {
    try {
      const response = await api.get<Notification>(`/notifications/${id}`);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Error fetching notification:', error);
      return null;
    }
  }

  // Update notification (mark as read, archive, etc.)
  async updateNotification(id: string, data: NotificationUpdateRequest): Promise<Notification | null> {
    try {
      const response = await api.patch<Notification>(`/notifications/${id}`, data);
      if (response.success) {
        // Update unread count if marking as read
        if (data.isRead && this.unreadCount > 0) {
          this.decrementUnreadCount();
        }
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating notification:', error);
      return null;
    }
  }

  // Mark notification as read
  async markAsRead(id: string): Promise<boolean> {
    const result = await this.updateNotification(id, { isRead: true });
    return result !== null;
  }

  // Mark notification as archived
  async markAsArchived(id: string): Promise<boolean> {
    const result = await this.updateNotification(id, { isArchived: true });
    return result !== null;
  }

  // Mark all notifications as read
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const response = await api.patch<{ success: boolean }>('/notifications/mark-all-read', { userId });
      if (response.success) {
        this.resetUnreadCount();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  // Get notification counts
  async getNotificationCounts(userId: string): Promise<NotificationCounts | null> {
    try {
      const response = await api.get<NotificationCounts>(`/notifications/counts?userId=${userId}`);
      if (response.success) {
        this.unreadCount = response.data.unread;
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching notification counts:', error);
      return null;
    }
  }

  // Delete notification
  async deleteNotification(id: string): Promise<boolean> {
    try {
      const response = await api.delete<{ success: boolean }>(`/notifications/${id}`);
      return response.success;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  // Competition-specific notification triggers
  async notifyCompetitionJoined(userId: string, profileId: string, competitionName: string): Promise<void> {
    await this.createNotification({
      userId,
      profileId,
      type: 'competition_joined',
      title: 'Competition Joined! 🎉',
      message: `You've successfully joined "${competitionName}". Good luck!`,
      priority: 'medium',
      data: { competitionName }
    });
  }

  async notifyCompetitionLeft(userId: string, profileId: string, competitionName: string): Promise<void> {
    await this.createNotification({
      userId,
      profileId,
      type: 'competition_left',
      title: 'Competition Left',
      message: `You've left "${competitionName}". You can rejoin anytime!`,
      priority: 'low',
      data: { competitionName }
    });
  }

  async notifyCompetitionCreated(userId: string, profileId: string, competitionName: string): Promise<void> {
    await this.createNotification({
      userId,
      profileId,
      type: 'competition_created',
      title: 'New Competition Available! 🆕',
      message: `A new competition "${competitionName}" is now available. Check it out!`,
      priority: 'high',
      data: { competitionName }
    });
  }

  async notifyCompetitionUpcoming(userId: string, profileId: string, competitionName: string, startDate: string): Promise<void> {
    await this.createNotification({
      userId,
      profileId,
      type: 'competition_upcoming',
      title: 'Upcoming Competition! ⏰',
      message: `"${competitionName}" starts soon on ${new Date(startDate).toLocaleDateString()}. Get ready!`,
      priority: 'medium',
      data: { competitionName, startDate }
    });
  }

  // Vote notifications
  async notifyVoteReceived(userId: string, profileId: string, voterName: string, isPremium: boolean = false): Promise<void> {
    const type = isPremium ? 'vote_premium' : 'vote_received';
    const title = isPremium ? 'Premium Vote Received! 💎' : 'New Vote! ❤️';
    const message = isPremium 
      ? `${voterName} gave you a premium vote! This is amazing!`
      : `${voterName} voted for you! Keep up the great work!`;

    await this.createNotification({
      userId,
      profileId,
      type,
      title,
      message,
      priority: 'medium',
      data: { voterName, isPremium }
    });
  }

  // Settings change notification
  async notifySettingsChanged(userId: string, profileId: string, settingName: string): Promise<void> {
    await this.createNotification({
      userId,
      profileId,
      type: 'settings_changed',
      title: 'Settings Updated',
      message: `Your ${settingName} has been updated successfully.`,
      priority: 'low',
      data: { settingName }
    });
  }

  // Daily motivation and tips
  async createDailyMotivations(userId: string, profileId: string): Promise<void> {
    const motivations = [
      {
        type: 'motivation' as NotificationType,
        title: 'Daily Motivation! 🌟',
        message: 'Remember, every vote is a step closer to your dreams. Keep shining!'
      },
      {
        type: 'tip' as NotificationType,
        title: 'Pro Tip! 💡',
        message: 'Update your photos regularly to keep your profile fresh and engaging.'
      },
      {
        type: 'reminder' as NotificationType,
        title: 'Friendly Reminder! ⏰',
        message: 'Don\'t forget to thank your voters - it goes a long way!'
      }
    ];

    // Randomly select 2-3 motivations
    const selectedCount = Math.floor(Math.random() * 2) + 2; // 2 or 3
    const shuffled = motivations.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, selectedCount);

    for (const motivation of selected) {
      await this.createNotification({
        userId,
        profileId,
        type: motivation.type,
        title: motivation.title,
        message: motivation.message,
        priority: 'low'
      });
    }
  }

  // Unread count management
  private incrementUnreadCount(): void {
    this.unreadCount++;
    this.notifyListeners();
  }

  private decrementUnreadCount(): void {
    if (this.unreadCount > 0) {
      this.unreadCount--;
      this.notifyListeners();
    }
  }

  private resetUnreadCount(): void {
    this.unreadCount = 0;
    this.notifyListeners();
  }

  public getUnreadCount(): number {
    return this.unreadCount;
  }

  // Listener management for real-time updates
  public addUnreadCountListener(listener: (count: number) => void): void {
    this.listeners.push(listener);
  }

  public removeUnreadCountListener(listener: (count: number) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.unreadCount));
  }

  // Initialize notification counts
  async initializeCounts(userId: string): Promise<void> {
    const counts = await this.getNotificationCounts(userId);
    if (counts) {
      this.unreadCount = counts.unread;
      this.notifyListeners();
    }
  }
}

export const notificationService = NotificationService.getInstance();
