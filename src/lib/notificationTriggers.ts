import axios from 'axios';

// Base API configuration
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = isDevelopment ? '/api/v1/notifications' : 'https://api.swingboudoirmag.com/api/v1/notifications';
const API_TOKEN = import.meta.env.VITE_API_TOKEN || 'YOUR_SECRET_TOKEN';

const apiConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_TOKEN}`
  }
};

// ==================== PRESET NOTIFICATION MESSAGES ====================

export const NOTIFICATION_MESSAGES = {
  // Contest related
  CONTEST_CREATED: "A new contest has been created and is now open for registration!",
  CONTEST_UPDATED: "A contest you're participating in has been updated",
  CONTEST_JOINED: "You have successfully joined the contest. Good luck!",
  CONTEST_LEFT: "You have left the contest. You can rejoin anytime before the deadline",
  
  // Voting related
  VOTE_RECEIVED: "You received a new vote! Someone just voted for you",
  VOTE_PREMIUM: "Premium votes have been added to your account",
  
  // Settings
  SETTINGS_CHANGED: "Your profile settings have been updated successfully",
  
  // Reminders
  CONTEST_ENDING_48H: "Contest ending in 48 hours! Time to finalize your entry",
  CONTEST_ENDING_24H: "Contest ending tomorrow! Don't miss the deadline",
  CONTEST_ENDING_1H: "Contest ending in 1 hour! Make sure your submission is ready",
  
  // Daily content
  MOTIVATION: "Remember, every great photo starts with confidence. You've got this! 💪",
  TIP: "Natural lighting works best for boudoir photography. Try shooting near windows during golden hour!",
  
  // Random daily
  NEW_FEATURE: "Check out our new photo editing tools to enhance your contest entries!",
  LEADERBOARD_UPDATE: "The leaderboard has been updated. See where you rank now!",
  PHOTO_TIPS: "Want to win? Use natural lighting and authentic poses for better results!",
  CONTEST_STRATEGY: "Participating in multiple contests increases your chances of winning!",
  TRENDING: "Boudoir photography is trending! Perfect time to showcase your style."
};

// ==================== NOTIFICATION ICONS ====================

export const NOTIFICATION_ICONS = {
  CONTEST: 'TROPHY',
  VOTE: 'HEART',
  SETTINGS: 'SETTINGS',
  REMINDER: 'WARNING',
  TIP: 'LIGHTBULB',
  MOTIVATION: 'STAR',
  SYSTEM: 'INFO'
} as const;

// ==================== API FUNCTIONS ====================

/**
 * Create a new notification
 */
const createNotification = async (notificationData: {
  message: string;
  profileId: string;
  icon: string;
  action?: string;
}): Promise<any> => {
  try {
    const response = await axios.request({
      method: 'POST',
      url: API_BASE_URL,
      headers: apiConfig.headers,
      data: notificationData
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Get notifications for a profile
 */
export const getNotifications = async (profileId: string): Promise<any[]> => {
  try {
    const response = await axios.request({
      method: 'GET',
      url: API_BASE_URL,
      headers: apiConfig.headers,
      params: { profileId }
    });
    
    // Debug: Log the response structure
    console.log('API Response:', response);
    console.log('Response data:', response.data);
    
    // Handle different response structures
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (response.data && response.data.notifications && Array.isArray(response.data.notifications)) {
      return response.data.notifications;
    } else {
      console.warn('Unexpected response structure:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

/**
 * Get notification by ID
 */
export const getNotificationById = async (id: string): Promise<any> => {
  try {
    const response = await axios.request({
      method: 'GET',
      url: `${API_BASE_URL}/${id}`,
      headers: apiConfig.headers
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching notification:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (id: string): Promise<boolean> => {
  try {
    await axios.request({
      method: 'PATCH',
      url: `${API_BASE_URL}/${id}/read`,
      headers: apiConfig.headers
    });
    
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

/**
 * Mark all notifications as read for a profile
 */
export const markAllNotificationsAsRead = async (profileId: string): Promise<boolean> => {
  try {
    await axios.request({
      method: 'PATCH',
      url: `${API_BASE_URL}/${profileId}/read-all`,
      headers: apiConfig.headers
    });
    
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
};

/**
 * Update notification
 */
export const updateNotification = async (id: string, updateData: {
  message?: string;
  profileId?: string;
  isRead?: boolean;
  archived?: boolean;
  icon?: string;
  action?: string;
}): Promise<boolean> => {
  try {
    await axios.request({
      method: 'PUT',
      url: `${API_BASE_URL}/${id}`,
      headers: apiConfig.headers,
      data: updateData
    });
    
    return true;
  } catch (error) {
    console.error('Error updating notification:', error);
    return false;
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (id: string): Promise<boolean> => {
  try {
    await axios.request({
      method: 'DELETE',
      url: `${API_BASE_URL}/${id}`,
      headers: apiConfig.headers
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return false;
  }
};

// ==================== NOTIFICATION TRIGGERS ====================

/**
 * 1. Admin creates a contest
 */
export const triggerContestCreated = async (
  profileId: string, 
  contestName: string
): Promise<void> => {
  const message = `${contestName}: ${NOTIFICATION_MESSAGES.CONTEST_CREATED}`;
  
  await createNotification({
    message,
    profileId,
    icon: NOTIFICATION_ICONS.CONTEST,
    action: 'view_contest'
  });
};

/**
 * 2. Admin updates a contest
 */
export const triggerContestUpdated = async (
  profileId: string, 
  contestName: string,
  updateType: string
): Promise<void> => {
  const message = `${contestName}: ${NOTIFICATION_MESSAGES.CONTEST_UPDATED} - ${updateType}`;
  
  await createNotification({
    message,
    profileId,
    icon: NOTIFICATION_ICONS.CONTEST,
    action: 'view_contest'
  });
};

/**
 * 3. Someone votes for a model
 */
export const triggerVoteReceived = async (
  profileId: string, 
  voterName: string, 
  contestName: string,
  voteCount: number = 1
): Promise<void> => {
  const voteText = voteCount > 1 ? ` (${voteCount} votes)` : '';
  const message = `${NOTIFICATION_MESSAGES.VOTE_RECEIVED} in "${contestName}" from ${voterName}${voteText}`;
  
  await createNotification({
    message,
    profileId,
    icon: NOTIFICATION_ICONS.VOTE,
    action: 'view_contest'
  });
};

/**
 * 4. Settings changed
 */
export const triggerSettingsChanged = async (
  profileId: string, 
  settingType: string
): Promise<void> => {
  const message = `${NOTIFICATION_MESSAGES.SETTINGS_CHANGED}: ${settingType}`;
  
  await createNotification({
    message,
    profileId,
    icon: NOTIFICATION_ICONS.SETTINGS,
    action: 'view_settings'
  });
};

/**
 * 5. User joined a contest
 */
export const triggerContestJoined = async (
  profileId: string, 
  contestName: string
): Promise<void> => {
  const message = `"${contestName}": ${NOTIFICATION_MESSAGES.CONTEST_JOINED}`;
  
  await createNotification({
    message,
    profileId,
    icon: NOTIFICATION_ICONS.CONTEST,
    action: 'view_contest'
  });
};

/**
 * 6. User left a contest
 */
export const triggerContestLeft = async (
  profileId: string, 
  contestName: string
): Promise<void> => {
  const message = `"${contestName}": ${NOTIFICATION_MESSAGES.CONTEST_LEFT}`;
  
  await createNotification({
    message,
    profileId,
    icon: NOTIFICATION_ICONS.CONTEST,
    action: 'view_contest'
  });
};

/**
 * 7. Contest ending reminders (48h, 24h, 1h)
 */
export const triggerContestEndingReminder = async (
  profileId: string, 
  contestName: string, 
  hoursLeft: number
): Promise<void> => {
  let message: string;
  let icon: string;
  
  if (hoursLeft <= 1) {
    message = `"${contestName}": ${NOTIFICATION_MESSAGES.CONTEST_ENDING_1H}`;
    icon = NOTIFICATION_ICONS.REMINDER;
  } else if (hoursLeft <= 24) {
    message = `"${contestName}": ${NOTIFICATION_MESSAGES.CONTEST_ENDING_24H}`;
    icon = NOTIFICATION_ICONS.REMINDER;
  } else {
    message = `"${contestName}": ${NOTIFICATION_MESSAGES.CONTEST_ENDING_48H}`;
    icon = NOTIFICATION_ICONS.REMINDER;
  }
  
  await createNotification({
    message,
    profileId,
    icon,
    action: 'view_contest'
  });
};

/**
 * 8. Premium votes notification
 */
export const triggerPremiumVotes = async (
  profileId: string, 
  voteCount: number, 
  amount: number
): Promise<void> => {
  const message = `${NOTIFICATION_MESSAGES.VOTE_PREMIUM}: ${voteCount} votes for $${amount}`;
  
  await createNotification({
    message,
    profileId,
    icon: NOTIFICATION_ICONS.VOTE,
    action: 'view_votes'
  });
};

/**
 * 9. Motivation notifications
 */
export const triggerMotivation = async (
  profileId: string
): Promise<void> => {
  await createNotification({
    message: NOTIFICATION_MESSAGES.MOTIVATION,
    profileId,
    icon: NOTIFICATION_ICONS.MOTIVATION,
    action: 'view_profile'
  });
};

/**
 * 10. Tips notifications
 */
export const triggerTip = async (
  profileId: string
): Promise<void> => {
  await createNotification({
    message: NOTIFICATION_MESSAGES.TIP,
    profileId,
    icon: NOTIFICATION_ICONS.TIP,
    action: 'view_tips'
  });
};

/**
 * 11. Random daily notifications (2 per day)
 */
export const triggerRandomDailyNotification = async (
  profileId: string
): Promise<void> => {
  const randomMessages = [
    NOTIFICATION_MESSAGES.NEW_FEATURE,
    NOTIFICATION_MESSAGES.LEADERBOARD_UPDATE,
    NOTIFICATION_MESSAGES.PHOTO_TIPS,
    NOTIFICATION_MESSAGES.CONTEST_STRATEGY,
    NOTIFICATION_MESSAGES.TRENDING
  ];
  
  // Select 2 random messages
  const shuffled = randomMessages.sort(() => 0.5 - Math.random());
  const selectedMessages = shuffled.slice(0, 2);
  
  for (const message of selectedMessages) {
    let icon = NOTIFICATION_ICONS.TIP;
    let action = 'view_profile';
    
    if (message.includes('leaderboard')) {
      icon = NOTIFICATION_ICONS.CONTEST;
      action = 'view_leaderboard';
    } else if (message.includes('trending')) {
      icon = NOTIFICATION_ICONS.MOTIVATION;
      action = 'view_trends';
    }
    
    await createNotification({
      message,
      profileId,
      icon,
      action
    });
  }
};

// ==================== BULK NOTIFICATION TRIGGERS ====================

/**
 * Send contest ending reminders to all participants
 */
export const sendContestEndingReminders = async (
  contestName: string,
  participantProfileIds: string[],
  hoursLeft: number
): Promise<void> => {
  const promises = participantProfileIds.map(profileId => 
    triggerContestEndingReminder(profileId, contestName, hoursLeft)
  );
  
  await Promise.all(promises);
};

/**
 * Send contest creation notifications to all eligible users
 */
export const sendContestCreationNotifications = async (
  contestName: string,
  eligibleProfileIds: string[]
): Promise<void> => {
  const promises = eligibleProfileIds.map(profileId => 
    triggerContestCreated(profileId, contestName)
  );
  
  await Promise.all(promises);
};

/**
 * Send daily random notifications to all active users
 */
export const sendDailyRandomNotifications = async (
  activeProfileIds: string[]
): Promise<void> => {
  const promises = activeProfileIds.map(profileId => 
    triggerRandomDailyNotification(profileId)
  );
  
  await Promise.all(promises);
};

// ==================== SCHEDULED NOTIFICATION TRIGGERS ====================

/**
 * Check and send contest ending reminders
 * This should be called by a cron job or scheduled task
 */
export const checkContestEndingReminders = async (): Promise<void> => {
  try {
    // This would need to be implemented based on your contest API
    // For now, this is a placeholder
    console.log('Checking contest ending reminders...');
  } catch (error) {
    console.error('Error checking contest ending reminders:', error);
  }
};

/**
 * Send daily motivation and tips
 * This should be called by a cron job daily
 */
export const sendDailyMotivationAndTips = async (
  activeProfileIds: string[]
): Promise<void> => {
  try {
    for (const profileId of activeProfileIds) {
      await triggerMotivation(profileId);
      await triggerTip(profileId);
    }
  } catch (error) {
    console.error('Error sending daily motivation and tips:', error);
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get unread notification count for a profile
 */
export const getUnreadNotificationCount = async (profileId: string): Promise<number> => {
  try {
    const notifications = await getNotifications(profileId);
    return notifications.filter((n: any) => !n.isRead).length;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};

/**
 * Archive notification (mark as archived)
 */
export const archiveNotification = async (id: string): Promise<boolean> => {
  return updateNotification(id, { archived: true });
};

export default {
  // Messages and Icons
  NOTIFICATION_MESSAGES,
  NOTIFICATION_ICONS,
  
  // Individual triggers
  triggerContestCreated,
  triggerContestUpdated,
  triggerVoteReceived,
  triggerSettingsChanged,
  triggerContestJoined,
  triggerContestLeft,
  triggerContestEndingReminder,
  triggerPremiumVotes,
  triggerMotivation,
  triggerTip,
  triggerRandomDailyNotification,
  
  // Bulk triggers
  sendContestEndingReminders,
  sendContestCreationNotifications,
  sendDailyRandomNotifications,
  
  // Scheduled triggers
  checkContestEndingReminders,
  sendDailyMotivationAndTips,
  
  // API functions
  createNotification,
  getNotifications,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  updateNotification,
  deleteNotification,
  archiveNotification,
  getUnreadNotificationCount
};
