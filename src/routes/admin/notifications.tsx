import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminNotificationFilters, useAdminNotifications } from "@/hooks/api/useAdminNotifications";
import { format } from "date-fns";
import { Archive, Bell, Calendar, Eye, EyeOff, Filter, MapPin, Search, User } from "lucide-react";
import React, { useState } from "react";
import { useQueryState } from "nuqs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/notifications")({
  component: AdminNotificationsPage,
});

function AdminNotificationsPage() {
  // Use nuqs for URL-based state management
  const [page, setPage] = useQueryState("page", { defaultValue: "1" });
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [type, setType] = useQueryState("type", { defaultValue: "" });
  const [isRead, setIsRead] = useQueryState("isRead", { defaultValue: "" });
  const [isArchived, setIsArchived] = useQueryState("isArchived", { defaultValue: "" });
  const [startDate, setStartDate] = useQueryState("startDate", { defaultValue: "" });
  const [endDate, setEndDate] = useQueryState("endDate", { defaultValue: "" });
  const [sortOrder, setSortOrder] = useQueryState("sortOrder", { defaultValue: "desc" });

  const [searchQuery, setSearchQuery] = useState(search || "");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(search || "");

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update URL search when debounced query changes
  React.useEffect(() => {
    if (debouncedSearchQuery !== search) {
      setSearch(debouncedSearchQuery || null);
    }
  }, [debouncedSearchQuery, search, setSearch]);

  // Build filters object from URL state
  const filters: AdminNotificationFilters = {
    page: parseInt(page) || 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: sortOrder as "asc" | "desc",
    search: search || undefined,
    type: (type as AdminNotificationFilters["type"]) || undefined,
    isRead: isRead === "true" ? true : isRead === "false" ? false : undefined,
    isArchived: isArchived === "true" ? true : isArchived === "false" ? false : undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  };

  const { data, isLoading, error } = useAdminNotifications(filters);

  const handlePageChange = (newPage: number) => {
    setPage(newPage.toString());
  };

  const handleFilterChange = (key: keyof AdminNotificationFilters, value: string | number | boolean | undefined) => {
    // Reset page to 1 when filters change
    setPage("1");

    switch (key) {
      case "type":
        setType((value as string) || null);
        break;
      case "isRead":
        setIsRead(value?.toString() || null);
        break;
      case "isArchived":
        setIsArchived(value?.toString() || null);
        break;
      case "startDate":
        setStartDate((value as string) || null);
        break;
      case "endDate":
        setEndDate((value as string) || null);
        break;
      case "sortOrder":
        setSortOrder((value as "asc" | "desc") || "desc");
        break;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "COMPETITION_JOINED":
        return "🏆";
      case "COMPETITION_LEFT":
        return "🚪";
      case "COMPETITION_CREATED":
        return "✨";
      case "VOTE_RECEIVED":
        return "❤️";
      case "VOTE_PREMIUM":
        return "💎";
      case "SYSTEM":
        return "🔧";
      default:
        return "📢";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "COMPETITION_JOINED":
      case "VOTE_RECEIVED":
        return "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800";
      case "COMPETITION_LEFT":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800";
      case "SYSTEM":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800";
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Notifications</h2>
          <p className="text-gray-600 mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Notifications</h1>
          <p className="text-muted-foreground mt-1">Monitor and track all system notifications</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">{data && <span className="font-medium text-gray-900">{data.pagination.total}</span>} total notifications</div>
        </div>
      </div>

      {/* Compact Filters */}
      <Card className="border-0 shadow-sm bg-gray-50/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 text-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Type Filter */}
            <Select value={type || "all"} onValueChange={(value) => handleFilterChange("type", value === "all" ? undefined : value)}>
              <SelectTrigger className="h-9 min-w-40 max-w-52 text-sm bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="COMPETITION_JOINED">Competition Joined</SelectItem>
                <SelectItem value="COMPETITION_LEFT">Competition Left</SelectItem>
                <SelectItem value="COMPETITION_CREATED">Competition Created</SelectItem>
                <SelectItem value="VOTE_RECEIVED">Vote Received</SelectItem>
                <SelectItem value="VOTE_PREMIUM">Premium Vote</SelectItem>
                <SelectItem value="SYSTEM">System</SelectItem>
                <SelectItem value="REMINDER">Reminder</SelectItem>
                <SelectItem value="TIP">Tip</SelectItem>
                <SelectItem value="MOTIVATION">Motivation</SelectItem>
              </SelectContent>
            </Select>

            {/* Read Status Filter */}
            <Select value={isRead || "all"} onValueChange={(value) => handleFilterChange("isRead", value === "all" ? undefined : value === "true")}>
              <SelectTrigger className="h-9 w-32 text-sm bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="false">Unread</SelectItem>
                <SelectItem value="true">Read</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Order */}
            <Select value={sortOrder || "desc"} onValueChange={(value) => handleFilterChange("sortOrder", value)}>
              <SelectTrigger className="h-9 w-32 text-sm bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest First</SelectItem>
                <SelectItem value="asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Cards */}
      <Card className="border-0 !p-0 shadow-none">
        <CardHeader className="pb-4 px-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Notifications</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {isLoading ? "Loading..." : data ? `Showing ${data.data.length} of ${data.pagination.total} notifications` : "No notifications"}
              </CardDescription>
            </div>
            {data && data.pagination.total > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Unread</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Read</span>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : data?.data.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data?.data.map((notification) => (
                <Card key={notification.id} className="border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* User Info Section */}
                      <div className="flex-shrink-0">
                        <Link to={`/admin/profiles/$id`} params={{ id: notification.user?.id ?? "" }}>
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={notification.user?.image ?? ""} className="object-cover" />
                            <AvatarFallback className="bg-gray-100 text-gray-600 text-sm font-medium">
                              <User className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                      </div>

                      {/* Main Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900 text-sm">{notification.user?.name || "Unknown User"}</h3>
                              <Badge
                                variant="outline"
                                className={cn("text-xs px-2 py-0.5 h-5", notification.user?.type === "MODEL" ? "bg-purple-100 text-purple-800" : "bg-yellow-100 text-yellow-800")}
                              >
                                {notification.user?.type || "Unknown"}
                              </Badge>
                              {notification.profile?.city && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <MapPin className="h-3 w-3" />
                                  <span>{notification.profile.city}</span>
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mb-2">{notification.user?.email}</p>

                            {/* Notification Message */}
                            {notification.title && <h4 className="font-medium text-gray-900 text-sm mb-2">{notification.title}</h4>}
                            <p className="text-sm text-gray-600 leading-relaxed">{notification.message}</p>
                          </div>

                          {/* Type Badge */}
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                              <Badge className={`${getNotificationColor(notification.type)} text-xs px-2 py-1`}>{notification.type.replace(/_/g, " ")}</Badge>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Row - Status and Date */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-3">
                            {notification.isRead ? (
                              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 text-xs px-2 py-1 hover:bg-green-200 transition-colors">
                                <Eye className="h-3 w-3 mr-1" />
                                Read
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 text-xs px-2 py-1 hover:bg-blue-200 transition-colors">
                                <EyeOff className="h-3 w-3 mr-1" />
                                Unread
                              </Badge>
                            )}
                            {notification.isArchived && (
                              <Badge variant="outline" className="text-xs px-2 py-1 h-5 border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors">
                                <Archive className="h-3 w-3 mr-1" />
                                Archived
                              </Badge>
                            )}
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">{format(new Date(notification.createdAt), "MMM dd, yyyy")}</div>
                            <div className="text-xs text-gray-500">{format(new Date(notification.createdAt), "HH:mm a")}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Pagination */}
              {data && data.pagination.totalPages > 1 && (
                <div className="pt-6 border-t border-gray-200">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(parseInt(page) - 1)}
                          className={parseInt(page) === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>

                      {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <PaginationItem key={pageNum}>
                          <PaginationLink onClick={() => handlePageChange(pageNum)} isActive={pageNum === parseInt(page)} className="cursor-pointer">
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(parseInt(page) + 1)}
                          className={!data.pagination.hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
