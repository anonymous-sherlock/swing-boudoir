import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Trophy, 
  Vote, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Activity,
  Calendar,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { AdminAnalytics } from '../types/adminTypes';
import { Link } from '@tanstack/react-router';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {change && (
        <p className={`text-xs ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {change} from last month
        </p>
      )}
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </CardContent>
  </Card>
);

interface RecentActivityProps {
  activities: Array<{
    id: string;
    type: 'user' | 'competition' | 'vote' | 'report';
    message: string;
    timestamp: string;
    severity?: 'low' | 'medium' | 'high';
  }>;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <Activity className="mr-2 h-5 w-5" />
        Recent Activity
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`w-2 h-2 rounded-full mt-2 ${
              activity.severity === 'high' ? 'bg-red-500' :
              activity.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
            }`} />
            <div className="flex-1">
              <p className="text-sm">{activity.message}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(activity.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const AdminDashboard: React.FC = () => {
  const { analytics, refreshAnalytics, logAdminAction } = useAdmin();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshAnalytics();
    await logAdminAction('REFRESH_DASHBOARD', 'system', 'dashboard');
    setIsRefreshing(false);
  };

  // Mock recent activities
  const recentActivities = [
    {
      id: '1',
      type: 'user' as const,
      message: 'New user registration: john.doe@example.com',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      severity: 'low' as const
    },
    {
      id: '2',
      type: 'competition' as const,
      message: 'Competition "Hot Girl Summer" reached 1000 participants',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      severity: 'medium' as const
    },
    {
      id: '3',
      type: 'report' as const,
      message: 'New content report submitted for review',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      severity: 'high' as const
    },
    {
      id: '4',
      type: 'vote' as const,
      message: 'Suspicious voting pattern detected in Competition #3',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      severity: 'high' as const
    }
  ];

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/dashboard">
            <ExternalLink className="mr-2 h-4 w-4" />
            View User Dashboard
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={analytics.totalUsers.toLocaleString()}
          change="+12%"
          icon={Users}
          description="Registered users"
        />
        <StatCard
          title="Active Competitions"
          value={analytics.activeCompetitions}
          change="+3"
          icon={Trophy}
          description="Currently running"
        />
        <StatCard
          title="Total Votes"
          value={analytics.totalVotes.toLocaleString()}
          change="+8%"
          icon={Vote}
          description="All time votes"
        />
        <StatCard
          title="Revenue"
          value={`$${analytics.totalRevenue.toLocaleString()}`}
          change="+15%"
          icon={DollarSign}
          description="This month"
        />
      </div>

      {/* Alerts and Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium">Content Moderation</p>
                  <p className="text-sm text-muted-foreground">5 items pending review</p>
                </div>
                <Badge variant="secondary">High Priority</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">User Reports</p>
                  <p className="text-sm text-muted-foreground">3 new reports</p>
                </div>
                <Badge variant="outline">Medium Priority</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/admin?section=competitions">
                  <Trophy className="mr-2 h-4 w-4" />
                  Create New Competition
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Review User Reports
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Maintenance
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={recentActivities} />

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.dailyStats.slice(-7).map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{new Date(stat.date).toLocaleDateString()}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm">{stat.newUsers} users</span>
                    <span className="text-sm">{stat.newVotes} votes</span>
                    <span className="text-sm font-medium">${stat.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Server Status</span>
                <Badge variant="default" className="bg-green-500">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <Badge variant="default" className="bg-green-500">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">File Storage</span>
                <Badge variant="default" className="bg-green-500">OK</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Response</span>
                <Badge variant="default" className="bg-green-500">Fast</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 