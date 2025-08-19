import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, Archive, Trash2, RefreshCw, Trophy, Heart, Settings, Lightbulb, Clock, Star, AlertCircle, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { notificationService } from "@/lib/notificationService";
import { useAuth } from "@/contexts/AuthContext";
import { Notification, Notification_Type } from "@/types";
import { getNotificationIconByType, getNotificationBackgroundByType } from "@/utils/notification";

export function DashboardNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "unread" | "archived">("all");

  // Fetch notifications from API
  const fetchNotifications = async () => {
    if (!user?.profileId) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await notificationService.getNotifications(user.profileId);

      // Debug: Log what we're getting from the API
      console.log("Fetched notifications:", response);
      console.log("Type of response:", typeof response);
      console.log("Is array:", Array.isArray(response?.notifications));

      // Ensure we always have an array
      const notificationsArray = response?.notifications ? response.notifications : [];

      setNotifications(notificationsArray);

      // Update unread count
      const counts = await notificationService.getNotificationCounts(user.profileId);
      setUnreadCount(counts?.unreadCount || 0);
    } catch (err) {
      setError("Failed to load notifications");
      console.error("Error fetching notifications:", err);
      // Set empty array on error to prevent filter issues
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh notifications
  const refreshNotifications = () => {
    fetchNotifications();
  };

  // Mark single notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      const success = await notificationService.markAsRead(id);
      if (success) {
        // Update local state
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
        setUnreadCount((prev) => Math.max(0, prev - 1));

        toast({
          title: "Marked as read",
          description: "Notification marked as read successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read.",
        variant: "destructive",
      });
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    if (!user?.profileId) return;

    try {
      const success = await notificationService.markAllAsRead(user.profileId);
      if (success) {
        // Update local state
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);

        toast({
          title: "All marked as read",
          description: "All notifications marked as read successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read.",
        variant: "destructive",
      });
    }
  };

  // Archive notification
  const handleMarkAsArchived = async (id: string) => {
    try {
      const success = await notificationService.markAsArchived(id);
      if (success) {
        // Update local state
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isArchived: true } : n)));

        toast({
          title: "Archived",
          description: "Notification archived successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive notification.",
        variant: "destructive",
      });
    }
  };

  // Unarchive notification
  const handleMarkAsUnarchived = async (id: string) => {
    try {
      const success = await notificationService.markAsUnarchived(id);
      if (success) {
        // Update local state
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isArchived: false } : n)));

        toast({
          title: "Unarchived",
          description: "Notification unarchived successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unarchive notification.",
        variant: "destructive",
      });
    }
  };

  // Delete notification
  const handleDelete = async (id: string) => {
    try {
      const success = await notificationService.deleteNotification(id);
      if (success) {
        // Remove from local state
        setNotifications((prev) => prev.filter((n) => n.id !== id));

        // Update unread count if it was unread
        const deletedNotification = notifications.find((n) => n.id === id);
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }

        toast({
          title: "Deleted",
          description: "Notification deleted successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notification.",
        variant: "destructive",
      });
    }
  };

  // Get notification icon based on API icon

  // Filter notifications based on selected filter
  const filteredNotifications = Array.isArray(notifications)
    ? notifications.filter((notification) => {
        if (selectedFilter === "unread") {
          // Show only unread notifications (not archived)
          return !notification.isRead && !notification.isArchived;
        }
        if (selectedFilter === "archived") {
          // Show only archived notifications (both read and unread)
          return notification.isArchived;
        }
        // Show all notifications (both read and unread, not archived)
        return !notification.isArchived;
      })
    : [];

  // Fetch notifications on component mount and when user changes
  useEffect(() => {
    if (user?.profileId) {
      fetchNotifications();
    }
  }, [user?.profileId]);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        </div>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <div>
                <h3 className="font-semibold text-red-800">Error loading notifications</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
            <Button onClick={refreshNotifications} variant="outline" className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">{unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}` : "All caught up!"}</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button onClick={refreshNotifications} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
              <Check className="mr-2 h-4 w-4" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2">
        <Button variant={selectedFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setSelectedFilter("all")}>
          All
        </Button>
        <Button variant={selectedFilter === "unread" ? "default" : "outline"} size="sm" onClick={() => setSelectedFilter("unread")}>
          Unread
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </Button>
        <Button variant={selectedFilter === "archived" ? "default" : "outline"} size="sm" onClick={() => setSelectedFilter("archived")}>
          Archived
        </Button>
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No notifications</h3>
            <p className="text-muted-foreground">
              {selectedFilter === "unread"
                ? "You're all caught up! No unread notifications."
                : selectedFilter === "archived"
                  ? "No archived notifications yet."
                  : "You'll see notifications here when they arrive."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card key={notification.id} className={`transition-all duration-200 hover:shadow-md ${!notification.isRead ? `border-l-4 ${getNotificationBackgroundByType(notification.type)}` : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">{getNotificationIconByType(notification.type)}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className={`font-semibold ${!notification.isRead ? "text-blue-900" : "text-foreground"}`}>{notification.message}</h4>
                          {notification?.action && (
                            <Badge variant="outline" className="text-xs">
                              {notification?.action}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1">
                    {!notification.isRead && (
                      <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)} className="h-8 w-8 p-0" title="Mark as read">
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}

                    {notification.isArchived ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsUnarchived(notification.id)}
                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                        title="Unarchive"
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => handleMarkAsArchived(notification.id)} className="h-8 w-8 p-0" title="Archive">
                        <Archive className="h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(notification.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
