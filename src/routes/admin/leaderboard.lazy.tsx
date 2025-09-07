import { createLazyFileRoute } from "@tanstack/react-router";
import { useQueryState } from "nuqs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLeaderboard, type LeaderboardEntry } from "@/hooks/api/useLeaderboard";
import { 
  Trophy, 
  Medal, 
  Award, 
  Crown, 
  Search, 
  Filter, 
  RefreshCw, 
  X, 
  Users, 
  TrendingUp, 
  Star,
  Calendar,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { useMemo, useState, useCallback } from "react";

export const Route = createLazyFileRoute("/admin/leaderboard")({
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const [page, setPage] = useQueryState("page", { defaultValue: 1, parse: (value) => parseInt(value) || 1 });
  const [limit, setLimit] = useQueryState("limit", { defaultValue: 50, parse: (value) => parseInt(value) || 50 });
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [sortBy, setSortBy] = useQueryState<"rank" | "totalVotes" | "createdAt">("sortBy", {
    defaultValue: "rank",
    parse: (value) => (value as "rank" | "totalVotes" | "createdAt") || "rank",
  });

  const { data: leaderboardData, isLoading, error, refetch } = useLeaderboard(page, limit);

  // Memoized computed values for better performance
  const stats = useMemo(() => {
    if (!leaderboardData?.data) return null;
    
    const totalProfiles = leaderboardData.pagination.total;
    const topPerformer = leaderboardData.data[0];
    const averageVotes = Math.round(
      leaderboardData.data.reduce((sum, entry) => sum + entry.totalVotes, 0) / leaderboardData.data.length
    );
    const activeProfiles = leaderboardData.data.filter((entry) => entry.totalVotes > 0).length;
    
    return {
      totalProfiles,
      topPerformer,
      averageVotes,
      activeProfiles,
    };
  }, [leaderboardData]);

  const getRankIcon = useCallback((rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return <Trophy className="h-6 w-6 text-gray-400" />;
  }, []);

  const getRankBadgeVariant = useCallback((rank: number) => {
    if (rank === 1) return "default";
    if (rank === 2) return "secondary";
    if (rank === 3) return "outline";
    return "secondary";
  }, []);

  const filteredData = useMemo(() => {
    if (!leaderboardData?.data) return [];
    
    return leaderboardData.data.filter(
      (entry) =>
        entry.username.toLowerCase().includes(search.toLowerCase()) ||
        entry.displayUsername?.toLowerCase().includes(search.toLowerCase()) ||
        entry.bio?.toLowerCase().includes(search.toLowerCase())
    );
  }, [leaderboardData?.data, search]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      switch (sortBy) {
        case "totalVotes":
          return b.totalVotes - a.totalVotes;
        case "createdAt":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return a.rank - b.rank;
      }
    });
  }, [filteredData, sortBy]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, [setPage]);

  const handleLimitChange = useCallback((newLimit: string) => {
    setLimit(Number(newLimit));
    setPage(1);
  }, [setLimit, setPage]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setSortBy("rank");
    setPage(1);
  }, [setSearch, setSortBy, setPage]);

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <X className="h-12 w-12 mx-auto mb-4 text-red-400" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Leaderboard</h3>
              <p className="text-sm">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gray-100 rounded-xl">
            <Trophy className="h-8 w-8 text-gray-700" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-gray-900">
              Leaderboard
            </h1>
            <p className="text-muted-foreground text-sm">
              Global leaderboard of model profiles ranked by total votes received
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Profiles</CardTitle>
            <div className="p-2 bg-gray-100 rounded-lg group-hover:scale-110 transition-transform">
              <Users className="h-4 w-4 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats?.totalProfiles || 0}</div>
            <p className="text-xs text-gray-500 mt-1">All registered profiles</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Top Performer</CardTitle>
            <div className="p-2 bg-gray-100 rounded-lg group-hover:scale-110 transition-transform">
              <Crown className="h-4 w-4 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats?.topPerformer?.totalVotes || 0}</div>
            <p className="text-xs text-gray-500 mt-1 truncate">
              {stats?.topPerformer?.displayUsername || stats?.topPerformer?.username || "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Average Votes</CardTitle>
            <div className="p-2 bg-gray-100 rounded-lg group-hover:scale-110 transition-transform">
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats?.averageVotes || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Per profile</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Active Profiles</CardTitle>
            <div className="p-2 bg-gray-100 rounded-lg group-hover:scale-110 transition-transform">
              <Star className="h-4 w-4 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats?.activeProfiles || 0}</div>
            <p className="text-xs text-gray-500 mt-1">With votes received</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters and Search */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Filter className="h-4 w-4 text-gray-600" />
            Leaderboard Filters
          </CardTitle>
          <CardDescription>Search and filter profiles to find specific rankings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search profiles by name, username, or bio..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  className="pl-10 w-full md:w-80 h-11" 
                />
              </div>
              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={(value: "rank" | "totalVotes" | "createdAt") => setSortBy(value)}>
                  <SelectTrigger className="w-36 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rank">Rank</SelectItem>
                    <SelectItem value="totalVotes">Votes</SelectItem>
                    <SelectItem value="createdAt">Date</SelectItem>
                  </SelectContent>
                </Select>
                {(search || sortBy !== "rank") && (
                  <Badge variant="secondary" className="text-xs px-3 py-1">
                    {[search ? "Search" : "", sortBy !== "rank" ? "Sorted" : ""].filter(Boolean).length} active
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={limit.toString()} onValueChange={handleLimitChange}>
                <SelectTrigger className="w-24 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => refetch()} 
                disabled={isLoading}
                className="h-11 w-11"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? `animate-spin` : ``}`} />
              </Button>
              {(search || sortBy !== "rank") && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={clearFilters} 
                  title="Clear filters"
                  className="h-11 w-11"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Leaderboard Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 hover:bg-gray-200">
                  <TableHead className="w-20 font-semibold text-gray-700">Rank</TableHead>
                  <TableHead className="font-semibold text-gray-700">Profile</TableHead>
                  <TableHead className="font-semibold text-gray-700">Username</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Total Votes</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Free Votes</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Paid Votes</TableHead>
                  <TableHead className="font-semibold text-gray-700">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-16">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
                        <p className="text-lg font-medium text-gray-600">Loading leaderboard...</p>
                        <p className="text-sm text-gray-500">Please wait while we fetch the latest rankings</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : sortedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-16">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Search className="h-12 w-12 text-gray-400" />
                        <p className="text-lg font-medium text-gray-600">No profiles found</p>
                        <p className="text-sm text-gray-500">
                          {search ? "Try adjusting your search criteria" : "No profiles available"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedData.map((entry, index) => (
                    <TableRow 
                      key={entry.profileId} 
                      className={`hover:bg-gray-50 transition-colors ${
                        index < 3 ? 'bg-gray-50' : ''
                      }`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getRankIcon(entry.rank)}
                          <Badge 
                            variant={getRankBadgeVariant(entry.rank)}
                            className={`font-bold text-sm ${
                              entry.rank === 1 ? 'bg-gray-800 text-white' :
                              entry.rank === 2 ? 'bg-gray-600 text-white' :
                              entry.rank === 3 ? 'bg-gray-500 text-white' : ''
                            }`}
                          >
                            #{entry.rank}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 ring-2 ring-gray-200">
                            <AvatarImage src={entry?.coverImage ?? ""} />
                            <AvatarFallback className="bg-gray-200 text-gray-700 font-semibold text-xs">
                              {entry.displayUsername?.[0] || entry.username[0] || "?"}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">
                            {entry.displayUsername || entry.username}
                          </span>
                          <span className="text-sm text-gray-500">@{entry.username}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="default" className="font-mono text-sm px-3 py-1 bg-gray-600 hover:bg-gray-700">
                          {entry.totalVotes.toLocaleString()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm text-gray-600 font-medium">
                          {entry.freeVotes.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm text-gray-600 font-medium">
                          {entry.paidVotes.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {format(new Date(entry.createdAt), "MMM dd, yyyy")}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Pagination */}
      {leaderboardData?.pagination && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Eye className="h-4 w-4" />
                <span>
                  Showing <span className="font-semibold">{(page - 1) * limit + 1}</span> to{" "}
                  <span className="font-semibold">{Math.min(page * limit, leaderboardData.pagination.total)}</span> of{" "}
                  <span className="font-semibold">{leaderboardData.pagination.total.toLocaleString()}</span> profiles
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePageChange(page - 1)} 
                  disabled={!leaderboardData.pagination.hasPreviousPage}
                  className="h-9 px-4"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    Page {page} of {leaderboardData.pagination.totalPages}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePageChange(page + 1)} 
                  disabled={!leaderboardData.pagination.hasNextPage}
                  className="h-9 px-4"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
