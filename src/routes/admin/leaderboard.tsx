import { createFileRoute } from "@tanstack/react-router";
import { useQueryState } from "nuqs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLeaderboard, type LeaderboardEntry } from "@/hooks/api/useLeaderboard";
import { Trophy, Medal, Award, Crown, Search, Filter, RefreshCw, X } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/leaderboard")({
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const [page, setPage] = useQueryState("page", { defaultValue: 1, parse: (value) => parseInt(value) || 1 });
  const [limit, setLimit] = useQueryState("limit", { defaultValue: 50, parse: (value) => parseInt(value) || 50 });
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [sortBy, setSortBy] = useQueryState<"rank" | "totalVotes" | "createdAt">("sortBy", { 
    defaultValue: "rank",
    parse: (value) => (value as "rank" | "totalVotes" | "createdAt") || "rank"
  });

  const { data: leaderboardData, isLoading, error, refetch } = useLeaderboard(page, limit);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <Trophy className="h-5 w-5 text-gray-400" />;
  };

  const getRankBadgeVariant = (rank: number) => {
    if (rank === 1) return "default";
    if (rank === 2) return "secondary";
    if (rank === 3) return "outline";
    return "secondary";
  };

  const filteredData = leaderboardData?.data?.filter((entry) =>
    entry.username.toLowerCase().includes(search.toLowerCase()) ||
    entry.displayUsername?.toLowerCase().includes(search.toLowerCase()) ||
    entry.bio?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "totalVotes":
        return b.totalVotes - a.totalVotes;
      case "createdAt":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return a.rank - b.rank;
    }
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: string) => {
    setLimit(Number(newLimit));
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setSortBy("rank");
    setPage(1);
  };


  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Error loading leaderboard: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground">
            Global leaderboard of model profiles ranked by total votes received
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profiles</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaderboardData?.pagination?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaderboardData?.data?.[0]?.totalVotes || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {leaderboardData?.data?.[0]?.displayUsername || leaderboardData?.data?.[0]?.username || "N/A"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Votes</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaderboardData?.data?.length 
                ? Math.round(leaderboardData.data.reduce((sum, entry) => sum + entry.totalVotes, 0) / leaderboardData.data.length)
                : 0
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Profiles</CardTitle>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaderboardData?.data?.filter(entry => entry.totalVotes > 0).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>
            View and manage the global leaderboard rankings
          </CardDescription>
        </CardHeader>
        <CardContent>
                     <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
             <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
               <div className="relative">
                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input
                   placeholder="Search profiles..."
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="pl-8 w-full md:w-64"
                 />
               </div>
               <div className="flex items-center gap-2">
                 <Filter className={`h-4 w-4 ${(search || sortBy !== "rank") ? "text-blue-500" : "text-muted-foreground"}`} />
                 <Select value={sortBy} onValueChange={(value: "rank" | "totalVotes" | "createdAt") => setSortBy(value)}>
                   <SelectTrigger className="w-32">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="rank">Rank</SelectItem>
                     <SelectItem value="totalVotes">Votes</SelectItem>
                     <SelectItem value="createdAt">Date</SelectItem>
                   </SelectContent>
                 </Select>
                 {(search || sortBy !== "rank") && (
                   <Badge variant="secondary" className="text-xs">
                     {[search && "Search", sortBy !== "rank" && "Sorted"].filter(Boolean).length} active
                   </Badge>
                 )}
               </div>
             </div>
                         <div className="flex items-center gap-2">
               <Select value={limit.toString()} onValueChange={handleLimitChange}>
                 <SelectTrigger className="w-20">
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
               >
                 <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
               </Button>
               {(search || sortBy !== "rank") && (
                 <Button
                   variant="outline"
                   size="icon"
                   onClick={clearFilters}
                   title="Clear filters"
                 >
                   <X className="h-4 w-4" />
                 </Button>
               )}
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Profile</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Bio</TableHead>
                <TableHead className="text-right">Total Votes</TableHead>
                <TableHead className="text-right">Free Votes</TableHead>
                <TableHead className="text-right">Paid Votes</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Loading leaderboard...
                    </div>
                  </TableCell>
                </TableRow>
              ) : sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No profiles found
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((entry) => (
                  <TableRow key={entry.profileId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRankIcon(entry.rank)}
                        <Badge variant={getRankBadgeVariant(entry.rank)}>
                          #{entry.rank}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={entry.avatarUrl || undefined} />
                          <AvatarFallback>
                            {entry.displayUsername?.[0] || entry.username[0] || "?"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {entry.displayUsername || entry.username}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          @{entry.username}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {entry.bio || "No bio"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="default" className="font-mono">
                        {entry.totalVotes.toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm text-muted-foreground">
                        {entry.freeVotes.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm text-muted-foreground">
                        {entry.paidVotes.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(entry.createdAt), "MMM dd, yyyy")}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {leaderboardData?.pagination && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, leaderboardData.pagination.total)} of{" "}
                {leaderboardData.pagination.total} profiles
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={!leaderboardData.pagination.hasPreviousPage}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {page} of {leaderboardData.pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!leaderboardData.pagination.hasNextPage}
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


