export interface AdminUser {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'moderator' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  createdAt: string;
  lastLogin: string;
  profileImage?: string;
  competitions: number;
  totalVotes: number;
}

export interface AdminCompetition {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate: string;
  prize: string;
  participants: number;
  totalVotes: number;
  createdAt: string;
  createdBy: string;
}

export interface AdminVote {
  id: string;
  userId: string;
  competitionId: string;
  targetUserId: string;
  voteType: 'regular' | 'premium';
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export interface AdminContent {
  id: string;
  userId: string;
  type: 'photo' | 'video';
  status: 'pending' | 'approved' | 'rejected';
  url: string;
  uploadedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reason?: string;
}

export interface AdminReport {
  id: string;
  reporterId: string;
  targetId: string;
  type: 'user' | 'content' | 'competition';
  reason: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface AdminAnalytics {
  totalUsers: number;
  activeUsers: number;
  totalCompetitions: number;
  activeCompetitions: number;
  totalVotes: number;
  totalRevenue: number;
  dailyStats: {
    date: string;
    newUsers: number;
    newVotes: number;
    revenue: number;
  }[];
}

export interface AdminSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailNotifications: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  rateLimits: {
    votesPerHour: number;
    uploadsPerDay: number;
  };
}

export interface AdminAction {
  id: string;
  adminId: string;
  action: string;
  targetType: 'user' | 'competition' | 'content' | 'system' | 'admin';
  targetId: string;
  details: Record<string, any>;
  timestamp: string;
  ipAddress: string;
}

export interface AdminInvite {
  id: string;
  email: string;
  role: 'admin' | 'moderator';
  inviteCode: string;
  status: 'pending' | 'accepted' | 'expired';
  createdAt: string;
  expiresAt: string;
  invitedBy: string;
}

export type AdminSection = 
  | 'dashboard'
  | 'users'
  | 'competitions'
  | 'moderation'
  | 'analytics'
  | 'prizes'
  | 'settings'
  | 'communication';

export interface AdminSidebarItem {
  id: AdminSection;
  label: string;
  icon: string;
  badge?: number;
} 