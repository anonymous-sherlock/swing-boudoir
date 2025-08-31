import { createFileRoute } from "@tanstack/react-router";
import { useQueryState } from "nuqs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useAdminVotes } from "@/hooks/api/useVotes";
import { format } from "date-fns";
import { Search, Filter, Heart, Calendar, User, Trophy } from "lucide-react";
import { useCallback, useEffect } from "react";

export const Route = createFileRoute("/admin/yuui")({
  component: () => <AdminVotesPage />,
});

function AdminVotesPage() {
  const [page, setPage] = useQueryState("page", { defaultValue: 1, parse: (value) => parseInt(value) || 1 });
  const [limit] = useQueryState("limit", { defaultValue: 20, parse: (value) => parseInt(value) || 20 });
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [type, setType] = useQueryState("type", { defaultValue: "all" });
  const [fromDate, setFromDate] = useQueryState("from_date", { defaultValue: "" });
  const [toDate, setToDate] = useQueryState("to_date", { defaultValue: "" });

  const { data: votesData, isLoading, error } = useAdminVotes({
    page: page || 1,
    limit: limit || 20,
    search: search || undefined,
    type: type === "all" ? undefined : (type as "FREE" | "PAID"),
    from_date: fromDate || undefined,
    to_date: toDate || undefined,
  });

  const votes = votesData?.data || [];
  const pagination = votesData?.pagination;

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== undefined) {
        setPage(1); // Reset to first page when searching
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, setPage]);

  const handleSearch = () => {
    // nuqs will automatically update the URL, no need to manually reset page
  };

  const handleClearFilters = () => {
    setSearch(null);
    setType(null);
    setFromDate(null);
    setToDate(null);
    setPage(null);
  };

  const getVoteTypeBadge = (type: 'FREE' | 'PAID') => {
    if (type === 'PAID') {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <Heart className="h-3 w-3 mr-1" />
          Paid Vote
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
        <Heart className="h-3 w-3 mr-1" />
        Free Vote
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Error loading votes: {error instanceof Error ? error.message : 'An unknown error occurred'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Votes Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage all votes across the platform
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by voter or votee... (auto-searches after typing)"
                  value={search || ""}
                  onChange={(e) => setSearch(e.target.value || null)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Vote Type</label>
              <Select value={type || "all"} onValueChange={(value) => setType(value === "all" ? null : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="FREE">Free votes</SelectItem>
                  <SelectItem value="PAID">Paid votes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">From Date</label>
              <Input
                type="date"
                value={fromDate || ""}
                onChange={(e) => setFromDate(e.target.value || null)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">To Date</label>
              <Input
                type="date"
                value={toDate || ""}
                onChange={(e) => setToDate(e.target.value || null)}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Votes</p>
                <p className="text-2xl font-bold">{pagination?.total || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Paid Votes</p>
                <p className="text-2xl font-bold">
                  {votes.filter(vote => vote.type === 'PAID').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Free Votes</p>
                <p className="text-2xl font-bold">
                  {votes.filter(vote => vote.type === 'FREE').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Votes Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Votes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading votes...</div>
            </div>
          ) : votes.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold">No votes found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your filters or search criteria.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Voter</TableHead>
                      <TableHead>Votee</TableHead>
                      <TableHead>Contest</TableHead>
                      <TableHead>Vote Type</TableHead>
                      <TableHead>Votes</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {votes.map((vote) => (
                      <TableRow key={vote.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={vote.voter.profilePicture} alt={vote.voter.name} />
                              <AvatarFallback>{getInitials(vote.voter.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{vote.voter.name}</p>
                              <p className="text-sm text-muted-foreground">@{vote.voter.username}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={vote.votee.profilePicture} alt={vote.votee.name} />
                              <AvatarFallback>{getInitials(vote.votee.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{vote.votee.name}</p>
                              <p className="text-sm text-muted-foreground">@{vote.votee.username}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Trophy className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{vote.contest.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getVoteTypeBadge(vote.type)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-sm">
                            {vote.count} {vote.count === 1 ? 'vote' : 'votes'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {vote.comment ? (
                            <p className="text-sm text-muted-foreground max-w-[200px] truncate" title={vote.comment}>
                              {vote.comment}
                            </p>
                          ) : (
                            <span className="text-sm text-muted-foreground">No comment</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {format(new Date(vote.createdAt), "MMM dd, yyyy")}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                                             <PaginationItem>
                         <PaginationPrevious 
                           onClick={() => setPage(Math.max(1, (page || 1) - 1))}
                           className={(page || 1) <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                         />
                       </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if ((page || 1) <= 3) {
                          pageNum = i + 1;
                        } else if ((page || 1) >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = (page || 1) - 2 + i;
                        }
                        
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => setPage(pageNum)}
                              isActive={(page || 1) === pageNum}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      {pagination.totalPages > 5 && (page || 1) < pagination.totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setPage(Math.min(pagination.totalPages, (page || 1) + 1))}
                          className={(page || 1) >= pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                  
                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    Showing {(((page || 1) - 1) * (limit || 20)) + 1} to {Math.min((page || 1) * (limit || 20), pagination.total)} of {pagination.total} votes
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


