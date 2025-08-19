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

  private constructor() { }

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
        if (response.data.isRead) {
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
    profileId: string,
    page: number = 1,
    limit: number = 20,
    isArchived: boolean = false
  ): Promise<NotificationsListResponse | null> {
    try {
      const params = new URLSearchParams({
        profileId,
        page: page.toString(),
        limit: limit.toString(),
        includeArchived: isArchived.toString()
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
      const response = await api.put<Notification>(`/notifications/${id}`, data);
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

  // Mark notification as unarchived
  async markAsUnarchived(id: string): Promise<boolean> {
    const result = await this.updateNotification(id, { isArchived: false });
    return result !== null;
  }

  // Mark all notifications as read
  async markAllAsRead(profileId: string): Promise<boolean> {
    try {
      const response = await api.patch<{ success: boolean }>(`/notifications/${profileId}/read-all`);
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
  async getNotificationCounts(profileId: string): Promise<NotificationCounts | null> {
    try {
      const response = await api.get<NotificationCounts>(`/notifications/${profileId}/stats`);
      if (response.success) {
        this.unreadCount = response.data.unreadCount;
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
  async notifyCompetitionJoined(profileId: string, competitionName: string): Promise<void> {
    await this.createNotification({
      profileId,
      title: 'Competition Joined! 🎉',
      message: `You've successfully joined "${competitionName}". Good luck!`,
      type: 'COMPETITION_JOINED'
    });
  }

  async notifyCompetitionLeft(profileId: string, competitionName: string): Promise<void> {
    await this.createNotification({
      profileId,
      title: 'Competition Left',
      message: `You've left "${competitionName}". You can rejoin anytime!`,
      type: 'COMPETITION_LEFT'
    });
  }

  async notifyCompetitionCreated(profileId: string, competitionName: string): Promise<void> {
    await this.createNotification({
      profileId,
      title: 'New Competition Available! 🆕',
      message: `A new competition "${competitionName}" is now available. Check it out!`,
      type: 'COMPETITION_CREATED'
    });
  }

  async notifyCompetitionUpcoming(profileId: string, competitionName: string, startDate: string): Promise<void> {
    await this.createNotification({
      profileId,
      title: 'Upcoming Competition! ⏰',
      message: `"${competitionName}" starts soon on ${new Date(startDate).toLocaleDateString()}. Get ready!`,
      type: 'COMPETITION_UPCOMING'
    });
  }

  // Vote notifications
  async notifyVoteReceived(profileId: string, voterName: string, isPremium: boolean = false): Promise<void> {
    const title = isPremium ? 'Premium Vote Received! 💎' : 'New Vote! ❤️';
    const message = isPremium
      ? `${voterName} gave you a premium vote! This is amazing!`
      : `${voterName} voted for you! Keep up the great work!`;

    await this.createNotification({
      profileId,
      title,
      message,
      type: isPremium ? 'VOTE_PREMIUM' : 'VOTE_RECEIVED'
    });
  }

  // Settings change notification
  async notifySettingsChanged(profileId: string, settingName: string): Promise<void> {
    await this.createNotification({
      profileId,
      title: 'Settings Updated',
      message: `Your ${settingName} has been updated successfully.`,
      type: 'SETTINGS_CHANGED'
    });
  }

  // Daily motivation and tips
  async createDailyMotivations(profileId: string): Promise<void> {
    const motivations: Array<Omit<NotificationCreateRequest, 'profileId'>> = [
      {
        title: 'Daily Motivation! 🌟',
        message: 'Remember, every vote is a step closer to your dreams. Keep shining!',
        type: 'MOTIVATION'
      },
      {
        title: 'Pro Tip! 💡',
        message: 'Update your photos regularly to keep your profile fresh and engaging.',
        type: 'TIP'
      },
      {
        title: 'Friendly Reminder! ⏰',
        message: 'Don\'t forget to thank your voters - it goes a long way!',
        type: 'REMINDER'
      }
    ];

    // Randomly select 2-3 motivations
    const selectedCount = Math.floor(Math.random() * 2) + 2; // 2 or 3
    const shuffled = motivations.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, selectedCount);

    for (const motivation of selected) {
      await this.createNotification({
        profileId,
        title: motivation.title,
        message: motivation.message,
        type: motivation.type
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
  async initializeCounts(profileId: string): Promise<void> {
    const counts = await this.getNotificationCounts(profileId);
    if (counts) {
      this.unreadCount = counts.unreadCount;
      this.notifyListeners();
    }
  }
}

export const notificationService = NotificationService.getInstance();
