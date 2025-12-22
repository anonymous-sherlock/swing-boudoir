import React, { useState, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, Archive, Trash2, RefreshCw, Trophy, Heart, Settings, Lightbulb, Clock, Star, AlertCircle, Eye } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { getNotificationIconByType, getNotificationBackgroundByType } from "@/utils/notification";

export function DashboardNotifications() {
  const { notifications, unreadCount, isLoading, error, markAsRead, markAllAsRead, markAsArchived, markAsUnarchived, deleteNotification, refreshNotifications } =
    useNotifications();

  const [selectedFilter, setSelectedFilter] = useState<"all" | "unread" | "archived">("all");

  // Filter notifications based on selected filter
  const filteredNotifications = useMemo(() => {
    if (!Array.isArray(notifications)) return [];
    return notifications.filter((notification) => {
      if (selectedFilter === "unread") {
        return !notification.isRead && !notification.isArchived;
      }
      if (selectedFilter === "archived") {
        return notification.isArchived;
      }
      return !notification.isArchived;
    });
  }, [notifications, selectedFilter]);

  // Get notification icon based on API icon

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
          <Button onClick={() => refreshNotifications()} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          {unreadCount > 0 && (
            <Button onClick={() => markAllAsRead()} variant="outline" size="sm">
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
            <Card
              key={notification.id}
              className={`transition-all duration-200 hover:shadow-md ${!notification.isRead ? `border-l-4 ${getNotificationBackgroundByType(notification.type)}` : ""}`}
            >
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
                      <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)} className="h-8 w-8 p-0" title="Mark as read">
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}

                    {notification.isArchived ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsUnarchived(notification.id)}
                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                        title="Unarchive"
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => markAsArchived(notification.id)} className="h-8 w-8 p-0" title="Archive">
                        <Archive className="h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
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
