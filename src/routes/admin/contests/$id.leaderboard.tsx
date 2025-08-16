import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '@/components/ui/table';
import { useContestLeaderboard, useContestStats } from '@/hooks/api/useContests';
import { createFileRoute } from '@tanstack/react-router';
import { Award, Crown, Filter, Medal, RefreshCw, Search, Trophy, X } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { format } from 'date-fns';

export type LeaderboardEntry = {
  rank: number;
  profileId: string;
  username: string;
  displayUsername: string | null;
  avatarUrl: string | null;
  bio: string | null;
  totalVotes: number;
  freeVotes: number;
  paidVotes: number;
  isParticipating: boolean;
  coverImage: string | null;
  isApproved: boolean;
};

export type Pagination = {
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
};

export type LeaderboardResponse = {
  data: LeaderboardEntry[];
  pagination: Pagination;
};

export const Route = createFileRoute('/admin/contests/$id/leaderboard')({
  component: RouteComponent,
});

function RouteComponent() {
  const [page, setPage] = useQueryState('page', {
    defaultValue: 1,
    parse: value => parseInt(value) || 1,
  });
  const [limit, setLimit] = useQueryState('limit', {
    defaultValue: 50,
    parse: value => parseInt(value) || 50,
  });
  const [search, setSearch] = useQueryState('search', { defaultValue: '' });
  const [sortBy, setSortBy] = useQueryState<'rank' | 'totalVotes' | 'createdAt'>('sortBy', {
    defaultValue: 'rank',
    parse: value => (value as 'rank' | 'totalVotes' | 'createdAt') || 'rank',
  });

  const params = Route.useParams();
  const { data: contestStats, isLoading, error, refetch } = useContestStats(params.id);
  const { data: contestLeaderboard } = useContestLeaderboard(params.id);

  const handleLimitChange = (newLimit: string) => {
    setLimit(Number(newLimit));
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setSortBy('rank');
    setPage(1);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <Trophy className="h-5 w-5 text-gray-400" />;
  };

  const getRankBadgeVariant = (rank: number) => {
    if (rank === 1) return 'default';
    if (rank === 2) return 'secondary';
    if (rank === 3) return 'outline';
    return 'secondary';
  };

  const filteredData =
    contestLeaderboard?.data?.filter(
      entry =>
        entry.username.toLowerCase().includes(search.toLowerCase()) ||
        entry.displayUsername?.toLowerCase().includes(search.toLowerCase()) ||
        entry.bio?.toLowerCase().includes(search.toLowerCase())
    ) || [];

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case 'totalVotes':
        return b.totalVotes - a.totalVotes;
      default:
        return a.rank - b.rank;
    }
  });

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
          <h1 className="text-3xl font-bold tracking-tight">Contest Leaderboard</h1>
          <p className="text-muted-foreground">
            Contest leaderboard of model profiles ranked by total votes received
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profiles</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contestStats?.totalParticipants}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contestStats?.totalVotes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Votes</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contestStats?.totalVotes! / 2}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Profiles</CardTitle>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>View and manage the global leaderboard rankings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search profiles..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 w-full md:w-64"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter
                  className={`h-4 w-4 ${search || sortBy !== 'rank' ? 'text-blue-500' : 'text-muted-foreground'}`}
                />
                <Select
                  value={sortBy}
                  onValueChange={(value: 'rank' | 'totalVotes' | 'createdAt') => setSortBy(value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rank">Rank</SelectItem>
                    <SelectItem value="totalVotes">Votes</SelectItem>
                    <SelectItem value="createdAt">Date</SelectItem>
                  </SelectContent>
                </Select>
                {(search || sortBy !== 'rank') && (
                  <Badge variant="secondary" className="text-xs">
                    {[search && 'Search', sortBy !== 'rank' && 'Sorted'].filter(Boolean).length}{' '}
                    active
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
              <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              {(search || sortBy !== 'rank') && (
                <Button variant="outline" size="icon" onClick={clearFilters} title="Clear filters">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

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
                sortedData.map(entry => (
                  <TableRow key={entry.profileId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRankIcon(entry.rank)}
                        <Badge variant={getRankBadgeVariant(entry.rank)}>#{entry.rank}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={entry.avatarUrl || undefined} />
                          <AvatarFallback>
                            {entry.displayUsername?.[0] || entry.username[0] || '?'}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {entry.displayUsername || entry.username}
                        </span>
                        <span className="text-sm text-muted-foreground">@{entry.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">{entry.bio || 'No bio'}</div>
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
                        {format(new Date(contestStats?.startDate!), 'MMM dd, yyyy')}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
