import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Contest, useContests, useDeleteContest } from '@/hooks/api/useContests';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Trophy,
  Users,
  TrendingUp,
  SortAsc,
  SortDesc,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { Link } from '@tanstack/react-router';
import { api } from '@/lib/api';
import { formatCurrency } from '@/utils/format';

export const Route = createFileRoute('/admin/contests/')({
  component: () => <ContestsPage />,
  loader: async () => {
    const response = await api.get('/api/v1/analytics/contests');

    return response.data as ContestResponse;
  },
});

type ContestResponse = {
  total: number;
  active: number;
  upcoming: number;
  prizePool: number;
};
type SortField = 'name' | 'startDate' | 'endDate' | 'prizePool' | 'createdAt';
type SortOrder = 'asc' | 'desc';

function ContestsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [contestToDelete, setContestToDelete] = useState<Contest | null>(null);

  const contestResponse = Route.useLoaderData();

  const { data: contestsData, isLoading, error } = useContests(page, limit);
  const { mutateAsync: deleteContestMutateAsync, isPending: isDeleting } = useDeleteContest();

  const handleDeleteContest = async () => {
    if (!contestToDelete) return;
    try {
      await deleteContestMutateAsync(contestToDelete.id);
      setIsDeleteOpen(false);
      setContestToDelete(null);
    } catch (error) {
      console.error('Failed to delete contest:', error);
    }
  };

  const getContestStatus = (contest: Contest) => {
    const now = new Date();
    const startDate = new Date(contest.startDate);
    const endDate = new Date(contest.endDate);

    if (now < startDate) return 'upcoming';
    if (now >= startDate && now <= endDate) return 'active';
    if (now > endDate) return 'ended';
    return 'unknown';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
            Upcoming
          </Badge>
        );
      case 'active':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 text-xs px-2 py-1">
            Active
          </Badge>
        );
      case 'ended':
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

  const filteredContests =
    contestsData?.data.filter(contest => {
      const matchesSearch =
        contest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contest.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || getContestStatus(contest) === statusFilter;

      return matchesSearch && matchesStatus;
    }) || [];

  const sortedContests = [...filteredContests].sort((a, b) => {
    let aValue: string | number | Date;
    let bValue: string | number | Date;

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'startDate':
        aValue = new Date(a.startDate);
        bValue = new Date(b.startDate);
        break;
      case 'endDate':
        aValue = new Date(a.endDate);
        bValue = new Date(b.endDate);
        break;
      case 'prizePool':
        aValue = a.prizePool;
        bValue = b.prizePool;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      default:
        aValue = a[sortField];
        bValue = b[sortField];
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <SortAsc className="w-3 h-3 ml-1 opacity-50" />;
    return sortOrder === 'asc' ? (
      <SortAsc className="w-3 h-3 ml-1" />
    ) : (
      <SortDesc className="w-3 h-3 ml-1" />
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Contests</h1>
            <p className="text-sm text-muted-foreground">
              Manage all contests and competitions in the system.
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-3 bg-muted rounded w-1/4 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-1/6 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-1/6 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-1/6 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-1/6 animate-pulse"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Contests</h1>
          <p className="text-sm text-muted-foreground">
            Manage all contests and competitions in the system.
          </p>
        </div>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center text-red-600 text-sm">
              Error loading contests. Please try again.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Contests</h1>
          <p className="text-sm text-muted-foreground">
            Manage all contests and competitions in the system. Total:{' '}
            {contestsData?.pagination.total || 0}
          </p>
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
            <p className="text-lg font-semibold">{contestResponse.total}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs font-medium text-muted-foreground">Active</p>
            <p className="text-lg font-semibold">{contestResponse.active}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs font-medium text-muted-foreground">Upcoming</p>
            <p className="text-lg font-semibold">{contestResponse.upcoming}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs font-medium text-muted-foreground">Prize Pool</p>
            <p className="text-lg font-semibold">
              {formatCurrency(contestResponse.prizePool).toString().slice(0, -3)}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search contests..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 h-9 text-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="ended">Ended</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
            setSortField('createdAt');
            setSortOrder('desc');
          }}
          className="h-9"
        >
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
                    <div className="flex items-center">
                      Contest Name
                      <SortIcon field="name" />
                    </div>
                  </TableHead>
                  <TableHead className="h-10 px-4 text-xs font-medium">
                    <div className="flex items-center">
                      Start Date
                      <SortIcon field="startDate" />
                    </div>
                  </TableHead>
                  <TableHead className="h-10 px-4 text-xs font-medium">
                    <div className="flex items-center">
                      End Date
                      <SortIcon field="endDate" />
                    </div>
                  </TableHead>
                  <TableHead className="h-10 px-4 text-xs font-medium">
                    <div className="flex items-center">
                      Prize Pool
                      <SortIcon field="prizePool" />
                    </div>
                  </TableHead>
                  <TableHead className="h-10 px-4 text-xs font-medium">Status</TableHead>
                  <TableHead className="h-10 px-4 text-xs font-medium">Created</TableHead>
                  <TableHead className="h-10 px-4 text-xs font-medium text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedContests.map(contest => (
                  <TableRow key={contest.id} className="hover:bg-muted/30">
                    <TableCell className="px-4 py-3">
                      <div>
                        <div className="font-medium text-sm">{contest.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                          {contest.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="text-xs">
                        {contest.startDate
                          ? format(new Date(contest.startDate), 'MMM dd, yyyy')
                          : 'Not set'}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="text-xs">
                        {contest.endDate
                          ? format(new Date(contest.endDate), 'MMM dd, yyyy')
                          : 'Not set'}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="font-medium text-sm">
                        ${contest.prizePool.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {getStatusBadge(getContestStatus(contest))}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(contest.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="rounded-full shadow-none"
                              aria-label="Open edit menu"
                            >
                              <MoreHorizontal size={16} aria-hidden="true" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            side="left"
                            align="start"
                            className="flex flex-col items-start gap-2 w-full"
                          >
                            <DropdownMenuItem asChild className="w-full">
                              <Link
                                to={`/admin/contests/$id/leaderboard`}
                                params={{ id: contest.id }}
                              >
                                <div className="flex items-center gap-2">
                                  <Eye className="w-3 h-3" />
                                  <p>View</p>
                                </div>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 w-full">
                              <Edit className="w-3 h-3" />
                              <p>Edit</p>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 w-full"
                              onClick={() => {
                                setContestToDelete(contest);
                                setIsDeleteOpen(true);
                              }}
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
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contest</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <strong>{contestToDelete?.name ?? 'this contest'}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteContest}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pagination */}
      {contestsData && contestsData.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            Showing {(page - 1) * limit + 1} to{' '}
            {Math.min(page * limit, contestsData.pagination.total)} of{' '}
            {contestsData.pagination.total} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={!contestsData.pagination.hasPreviousPage}
              className="h-8"
            >
              <ChevronLeft className="w-3 h-3 mr-1" />
              Previous
            </Button>
            <span className="text-sm px-3">
              Page {page} of {contestsData.pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={!contestsData.pagination.hasNextPage}
              className="h-8"
            >
              Next
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
