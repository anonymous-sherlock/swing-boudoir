import { CustomDeleteAlertDailog } from "@/components/global/custom-delete-alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeleteContest, useUpdateContest } from "@/hooks/api/useContests";
import { api } from "@/lib/api";
import { useModal } from "@/providers/modal-provider";
import { Contest } from "@/types/contest.types";
import { formatCurrency } from "@/utils/format";
import { BarChartIcon } from "@radix-ui/react-icons";
import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { format } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight, Edit, Eye, Loader2, MoreHorizontal, Plus, Search, SortAsc, SortDesc, Trash2, TrendingUp, Trophy, Users } from "lucide-react";
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";

const searchSchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
  search: z.string().optional().default(""),
  status: z.enum(["all", "upcoming", "active", "ended", "booked"]).optional().default("all"),
  sortBy: z.enum(["name", "startDate", "endDate", "prizePool", "createdAt"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});
type SearchParams = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/admin/contests/")({
  component: () => <ContestsPage />,
  validateSearch: (search): SearchParams => searchSchema.parse(search),
  loaderDeps: ({ search }) => ({
    page: search.page,
    limit: search.limit,
    searchTerm: search.search,
    status: search.status,
    sortBy: search.sortBy,
    sortOrder: search.sortOrder,
  }),

  loader: async ({ deps }) => {
    const { page, limit, searchTerm, status, sortBy, sortOrder } = deps;

    // Build query string for contests API
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search: searchTerm,
      status,
      sortBy: sortBy,
      sortOrder: sortOrder,
    });

    // your API requests
    const analyticsResponse = await api.get("/api/v1/analytics/contests");
    const contestsResponse = await api.get(`/api/v1/search/contests?${queryParams}`);

    return {
      analytics: analyticsResponse.data as ContestResponse,
      contests: contestsResponse.data,
    };
  },
});

type ContestResponse = {
  total: number;
  active: number;
  upcoming: number;
  prizePool: number;
};

type SortField = "name" | "startDate" | "endDate" | "prizePool" | "createdAt";
type SortOrder = "asc" | "desc";
type StatusFilter = "all" | "upcoming" | "active" | "ended" | "booked";

function ContestsPage() {
  const navigate = Route.useNavigate();
  const pathname = useLocation().pathname;
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(20));
  const [searchTerm, setSearchTerm] = useQueryState("search", { defaultValue: "" });
  const [statusFilter, setStatusFilter] = useQueryState<StatusFilter>("status", parseAsStringLiteral(["all", "upcoming", "active", "ended", "booked"]).withDefault("all"));
  const [sortField, setSortField] = useQueryState<SortField>("sortBy", parseAsStringLiteral(["name", "startDate", "endDate", "prizePool", "createdAt"]).withDefault("createdAt"));
  const [sortOrder, setSortOrder] = useQueryState<SortOrder>("sortOrder", parseAsStringLiteral(["asc", "desc"]).withDefault("desc"));
  const [contestToDelete, setContestToDelete] = useState<Contest | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [searchInputValue, setSearchInputValue] = useState("");
  const { setOpen: setModalOpen, setClose } = useModal();

  const { analytics, contests } = Route.useLoaderData();
  const { mutateAsync: deleteContestMutateAsync, isPending: isDeleting } = useDeleteContest();
  const { mutateAsync: updateContestMutateAsync, isPending: isUpdating } = useUpdateContest();

  const handleToggleVoting = async (contestId: string, currentVotingStatus: boolean) => {
    try {
      await updateContestMutateAsync({
        id: contestId,
        data: {
          isVotingEnabled: !currentVotingStatus,
        },
      });

      navigate({
        to: pathname,
        search: {
          page: Number(page),
          limit: Number(limit),
          search: searchInputValue || "",
          status: statusFilter,
          sortBy: sortField,
          sortOrder: sortOrder,
        },
      });

      toast.success(`Voting ${!currentVotingStatus ? "enabled" : "disabled"} successfully`);
    } catch (error) {
      toast.error("Failed to toggle voting status");
      console.error("Failed to toggle voting:", error);
    }
  };

  const handleDeleteContest = async () => {
    if (!contestToDelete) return;
    try {
      await toast.promise(deleteContestMutateAsync(contestToDelete.id), {
        loading: "Deleting contest...",
        success: () => {
          setContestToDelete(null);
          setClose();
          return "Contest deleted successfully";
        },
        error: (error) => {
          return "Failed to delete contest";
        },
      });
    } catch (error) {
      console.error("Failed to delete contest:", error);
    }
  };

  const getContestStatus = (contest: Contest) => {
    if (contest.status === "BOOKED") return "booked";
    const now = new Date();
    const startDate = new Date(contest.startDate);
    const endDate = new Date(contest.endDate);

    if (now < startDate) return "upcoming";
    if (now >= startDate && now <= endDate) return "active";
    if (now > endDate) return "ended";
    return "unknown";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "booked":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 text-xs px-2 py-1">
            Booked
          </Badge>
        );
      case "upcoming":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
            Upcoming
          </Badge>
        );
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 hover:bg-green-100 text-green-800 text-xs px-2 py-1">
            Active
          </Badge>
        );
      case "ended":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 text-xs px-2 py-1">
            Ended
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs px-2 py-1">
            Unknown
          </Badge>
        );
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInputValue || null);
      setPage(1); // Reset to first page when searching
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchInputValue, setSearchTerm, setPage]);

  // Initialize search input value from URL
  useEffect(() => {
    setSearchInputValue(searchTerm || "");
  }, [searchTerm]);

  const handleClearFilters = () => {
    setSearchInputValue("");
    setSearchTerm("");
    setStatusFilter("all");
    setSortField("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <SortAsc className="w-3 h-3 ml-1 opacity-50" />;
    return sortOrder === "asc" ? <SortAsc className="w-3 h-3 ml-1" /> : <SortDesc className="w-3 h-3 ml-1" />;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Contests</h1>
          <p className="text-sm text-muted-foreground">Manage all contests and competitions in the system. Total: {contests?.pagination.total || 0}</p>
        </div>
        <Button asChild size="sm">
          <Link to="/admin/contests/create">
            <Plus className="w-4 h-4 mr-2" />
            Create Contest
          </Link>
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid gap-3 grid-cols-4">
        <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
          <Trophy className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total</p>
            <p className="text-lg font-semibold">{analytics.total}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs font-medium text-muted-foreground">Active</p>
            <p className="text-lg font-semibold">{analytics.active}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs font-medium text-muted-foreground">Upcoming</p>
            <p className="text-lg font-semibold">{analytics.upcoming}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs font-medium text-muted-foreground">Prize Pool</p>
            <p className="text-lg font-semibold">{formatCurrency(analytics.prizePool).toString().slice(0, -3)}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Search contests..." value={searchInputValue} onChange={(e) => setSearchInputValue(e.target.value)} className="pl-10 h-9 text-sm" />
        </div>
        <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? "all" : (value as StatusFilter))}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="ended">Ended</SelectItem>
            <SelectItem value="booked">Booked</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={handleClearFilters} className="h-9">
          Clear
        </Button>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Contests List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="h-10 px-4 text-xs font-medium">
                    <Button variant="ghost" className="h-auto p-0 font-medium hover:bg-transparent" onClick={() => handleSort("name")}>
                      Contest Name
                      <SortIcon field="name" />
                    </Button>
                  </TableHead>
                  <TableHead className="h-10 px-4 text-xs font-medium">
                    <Button variant="ghost" className="h-auto p-0 font-medium hover:bg-transparent" onClick={() => handleSort("startDate")}>
                      Start Date
                      <SortIcon field="startDate" />
                    </Button>
                  </TableHead>
                  <TableHead className="h-10 px-4 text-xs font-medium">
                    <Button variant="ghost" className="h-auto p-0 font-medium hover:bg-transparent" onClick={() => handleSort("endDate")}>
                      End Date
                      <SortIcon field="endDate" />
                    </Button>
                  </TableHead>
                  <TableHead className="h-10 px-4 text-xs font-medium">
                    <Button variant="ghost" className="h-auto p-0 font-medium hover:bg-transparent" onClick={() => handleSort("prizePool")}>
                      Prize Pool
                      <SortIcon field="prizePool" />
                    </Button>
                  </TableHead>
                  <TableHead className="h-10 px-4 text-xs font-medium">Status</TableHead>
                  <TableHead className="h-10 px-4 text-xs font-medium">Voting</TableHead>
                  <TableHead className="h-10 px-4 text-xs font-medium">
                    <Button variant="ghost" className="h-auto p-0 font-medium hover:bg-transparent" onClick={() => handleSort("createdAt")}>
                      Created
                      <SortIcon field="createdAt" />
                    </Button>
                  </TableHead>
                  <TableHead className="h-10 px-4 text-xs font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contests?.data.map((contest) => (
                  <TableRow key={contest.id} className="hover:bg-muted/30">
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{contest.name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{contest.description}</div>
                        </div>
                        <Button asChild size="icon" variant="ghost" className="h-6 w-6 bg-blue-100 hover:bg-blue-100">
                          <Link to={`/competitions/$slug`} params={{ slug: contest.slug }} title={`View ${contest.name}`}>
                            <Eye className="w-3 h-3" />
                          </Link>
                        </Button>
                        <Button asChild size="icon" variant="ghost" className="h-6 w-6 bg-green-100 hover:bg-green-100">
                          <Link to={`/admin/contests/$id/leaderboard`} params={{ id: contest.id }} title={`View ${contest.name} leaderboard`}>
                            <BarChartIcon className="w-3 h-3" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="text-xs">{contest.startDate ? format(new Date(contest.startDate), "MMM dd, yyyy") : "Not set"}</div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="text-xs">{contest.endDate ? format(new Date(contest.endDate), "MMM dd, yyyy") : "Not set"}</div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="font-medium text-sm">${contest.prizePool.toLocaleString()}</div>
                    </TableCell>
                    <TableCell className="px-4 py-3">{getStatusBadge(getContestStatus(contest))}</TableCell>
                    <TableCell className="px-4 py-3">
                      <Switch
                        checked={contest.isVotingEnabled}
                        onCheckedChange={(checked) => handleToggleVoting(contest.id, contest.isVotingEnabled)}
                        aria-label={`Toggle voting for ${contest.name}`}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="text-xs text-muted-foreground">{format(new Date(contest.createdAt), "MMM dd, yyyy")}</div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <DropdownMenu open={openMenuId === contest.id} onOpenChange={(open) => setOpenMenuId(open ? contest.id : null)}>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="rounded-full shadow-none" aria-label="Open edit menu">
                              {contestToDelete?.id === contest.id && isDeleting ? (
                                <Loader2 size={16} aria-hidden="true" className="animate-spin" />
                              ) : (
                                <MoreHorizontal size={16} aria-hidden="true" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="left" align="start" className="flex flex-col items-start gap-2 w-full">
                            <DropdownMenuItem asChild className="w-full">
                              <Link to={`/admin/contests/$id/leaderboard`} params={{ id: contest.id }}>
                                <div className="flex items-center gap-2">
                                  <Eye className="w-3 h-3" />
                                  <p>View</p>
                                </div>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="flex items-center gap-2 w-full">
                              <Link to={`/admin/contests/$id/edit`} params={{ id: contest.id }}>
                                <div className="flex items-center gap-2 w-full">
                                  <Edit className="w-3 h-3" />
                                  <p>Edit</p>
                                </div>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(null);
                                setContestToDelete(contest);
                                setModalOpen(
                                  <CustomDeleteAlertDailog
                                    title={"Are you sure you want to delete this contest?"}
                                    description={
                                      <>
                                        Are you sure you want to delete <strong>{contest.name}</strong>? This action cannot be undone.
                                      </>
                                    }
                                    isDeleting={isDeleting}
                                    onDelete={handleDeleteContest}
                                    actionText="Delete"
                                  />
                                );
                              }}
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="w-3 h-3 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {contests && contests.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, contests.pagination.total)} of {contests.pagination.total} results
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={!contests.pagination.hasPreviousPage} className="h-8">
              <ChevronLeft className="w-3 h-3 mr-1" />
              Previous
            </Button>
            <span className="text-sm px-3">
              Page {page} of {contests.pagination.totalPages}
            </span>
            <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={!contests.pagination.hasNextPage} className="h-8">
              Next
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
