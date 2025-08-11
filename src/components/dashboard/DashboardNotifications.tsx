import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { AUTH_TOKEN_KEY } from "@/lib/auth";
import { Notification, NotificationsListResponse } from "@/types/notifications.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, Bell, CheckCircle, Info } from "lucide-react";

// API functions
const fetchNotifications = async (profileId: string): Promise<NotificationsListResponse> => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) throw new Error("No authentication token");
  const response = await api.get<NotificationsListResponse>(`/api/v1/notifications?profileId=${profileId}`);
  if (!response.success) {
    throw new Error(response.error);
  }
  return response.data;
};

const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) throw new Error("No authentication token");

  const response = await api.patch(`/api/v1/notifications/${notificationId}/read`);
  if (!response.success) {
    throw new Error(response.error);
  }
};

const markAllNotificationsAsRead = async (profileId: string): Promise<void> => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) throw new Error("No authentication token");

  const response = await api.patch(`/api/v1/notifications/${profileId}/read`);
};

// Utility functions
const getNotificationIcon = (icon?: string) => {
  switch (icon) {
    case "WARNING":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case "SUCCESS":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "INFO":
      return <Info className="h-4 w-4 text-blue-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

export function DashboardNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const profileId = user?.profileId;

  // Fetch notifications
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["notifications", profileId],
    queryFn: () => fetchNotifications(profileId!),
    enabled: !!profileId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Mark single notification as read
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (_, notificationId) => {
      queryClient.setQueryData(["notifications", profileId], (old: Notification[] | undefined) => {
        if (!old) return old;
        return old.map((notification) => (notification.id === notificationId ? { ...notification, isRead: true } : notification));
      });
    },
  });

  // Mark all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.setQueryData(["notifications", profileId], (old: Notification[] | undefined) => {
        if (!old) return old;
        return old.map((notification) => ({ ...notification, isRead: true }));
      });
    },
  });

  const unreadCount = data?.notifications?.filter((n) => !n.isRead).length ?? 0;

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Error loading notifications</h3>
            <p className="text-muted-foreground mb-4">{error instanceof Error ? error.message : "Failed to load notifications"}</p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No notifications state
  if (!data?.notifications || data.notifications.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">You'll see notifications here when you receive votes, join competitions, or get important updates.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{unreadCount} unread</Badge>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={() => markAllAsReadMutation.mutate(profileId!)} disabled={markAllAsReadMutation.isPending} className="text-xs">
              {markAllAsReadMutation.isPending ? "Marking..." : "Mark all as read"}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {data.notifications.map((notification) => (
          <Card key={notification.id} className={`transition-all duration-200 ${!notification.isRead ? "border-l-4 border-l-primary bg-primary/5" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="mt-1">{getNotificationIcon(notification.icon)}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.isRead ? "font-medium" : "text-muted-foreground"}`}>{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</p>
                  </div>
                </div>
                {!notification.isRead && (
                  <Button variant="ghost" size="sm" onClick={() => markAsReadMutation.mutate(notification.id)} disabled={markAsReadMutation.isPending} className="ml-2">
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
