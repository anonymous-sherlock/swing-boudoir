import { useContestParticipants, useContestParticipation } from "@/hooks/api/useContestParticipation";
import { useContestStats } from "@/hooks/api/useContests";
import { createFileRoute, Link } from "@tanstack/react-router";
import { parseAsInteger, useQueryState } from "nuqs";

export const Route = createFileRoute("/admin/contests/$id/participants")({
  component: ContestParticipants,
});

import { Lightbox } from "@/components/Lightbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { TransformedImage } from "@/components/ui/transformed-image";
import { ArrowLeft, Calendar, Check, CheckCircle, ChevronLeft, ChevronRight, Eye, Filter, Loader2, MoreHorizontal, Search, Trophy, Users, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

const limit = 15;

export default function ContestParticipants() {
  const { id } = Route.useParams();

  // URL state management with nuqs
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [status, setStatus] = useQueryState("status", { defaultValue: "all" });
  const currentPage = page;

  // Local search state for debouncing
  const [searchQuery, setSearchQuery] = useState(search || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search || "");

  // Selection state for bulk operations
  const [selectedParticipants, setSelectedParticipants] = useState<Set<string>>(new Set());
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState<'approve' | 'disapprove' | null>(null);

  // API hooks
  const { toggleApproval, bulkToggleApproval } = useContestParticipation();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      if (searchQuery !== search) {
        setSearch(searchQuery || null);
        setPage(1); // Reset to first page when searching
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, search, setSearch, setPage]);

  // Handle status filter change
  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setPage(1); // Reset to first page when filtering
  };

  // Sync local search state with URL state
  useEffect(() => {
    setSearchQuery(search || "");
  }, [search]);

  // Fetch participants using contest ID with SWR
  const {
    data: participantsData,
    isLoading: isLoadingParticipants,
    error: participantsError,
    isRefetching: isParticipantsFetching,
    refetch: refetchParticipants,
  } = useContestParticipants({
    contestId: id,
    page: currentPage,
    search: debouncedSearch && debouncedSearch.trim() ? debouncedSearch : undefined,
    status: (status || 'all') as 'all' | 'approved' | 'pending',
    limit,
  });

  // Fetch contest stats
  const {
    data: contestStatsData,
    isLoading: isLoadingStats,
    error: statsError,
  } = useContestStats(id);

  const participants = participantsData?.data || [];
  const pagination = participantsData?.pagination || null;

  // Use ContestStats API for accurate counts
  const totalParticipants = contestStatsData?.totalParticipants || 0;
  const approvedParticipants = contestStatsData?.approvedParticipants || 0;
  const pendingParticipants = contestStatsData?.pendingParticipants || 0;
  const totalFreeVotes = contestStatsData?.freeVotes || 0;
  const totalPaidVotes = contestStatsData?.paidVotes || 0;
  const totalVotes = contestStatsData?.totalVotes || 0;
  const totalPrizePool = contestStatsData?.totalPrizePool || 0;
  const participationRate = contestStatsData?.participationRate || 0;
  const daysRemaining = contestStatsData?.daysRemaining || 0;
  const isActive = contestStatsData?.isActive || false;

  // Lightbox state
  const [lightboxImage, setLightboxImage] = useState<{ url: string; caption: string } | null>(null);

  // Handle individual participant approval
  const handleApproveParticipant = async (participantId: string) => {
    try {
      await toggleApproval.mutateAsync(participantId);
    } catch (error) {
      console.error("Failed to approve participant:", error);
    }
  };

  const handleDisapproveParticipant = async (participantId: string) => {
    try {
      await toggleApproval.mutateAsync(participantId);
    } catch (error) {
      console.error("Failed to disapprove participant:", error);
    }
  };

  // Handle bulk operations
  const handleBulkAction = async () => {
    if (!bulkAction || selectedParticipants.size === 0) return;

    try {
      await bulkToggleApproval.mutateAsync({
        participationIds: Array.from(selectedParticipants),
        isApproved: bulkAction === 'approve'
      });
      
      // Clear selection and close dialog
      setSelectedParticipants(new Set());
      setIsSelectAll(false);
      setShowBulkDialog(false);
      setBulkAction(null);
    } catch (error) {
      console.error("Failed to perform bulk action:", error);
    }
  };

  // Handle individual checkbox change
  const handleParticipantSelect = (participantId: string, checked: boolean) => {
    const newSelection = new Set(selectedParticipants);
    if (checked) {
      newSelection.add(participantId);
    } else {
      newSelection.delete(participantId);
    }
    setSelectedParticipants(newSelection);
    setIsSelectAll(newSelection.size === participants.length);
  };

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = participants.map(p => p.id);
      setSelectedParticipants(new Set(allIds));
    } else {
      setSelectedParticipants(new Set());
    }
    setIsSelectAll(checked);
  };

  // Open bulk action dialog
  const openBulkDialog = (action: 'approve' | 'disapprove') => {
    setBulkAction(action);
    setShowBulkDialog(true);
  };

  // Lightbox functions
  const openLightbox = (participant: typeof participants[0]) => {
    if (participant.coverImage) {
      setLightboxImage({
        url: participant.coverImage.url,
        caption: participant.coverImage.caption || `${participant.profile?.user?.name || "Participant"}'s cover image`,
      });
    }
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  // Show full page loading only on initial load (not during search)
  if ((isLoadingParticipants || isLoadingStats) && !searchQuery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="flex min-h-screen">
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-4 p-4">
              {/* Header Skeleton */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-32" />
                </div>
                <Skeleton className="h-8 w-32" />
              </div>

              {/* Stats Cards Skeleton */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="border-primary/20 bg-gradient-to-r from-primary/5 via-primary/8 to-primary/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-6 w-12" />
                        </div>
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Table Skeleton */}
              <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-primary/8 to-primary/10">
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (participantsError || statsError) {
    console.error('🚨 Error details:', { participantsError, statsError });
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="flex min-h-screen">
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-4 p-4">
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <div className="text-center text-red-600">
                    <XCircle className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
                    <p className="text-sm">
                      {(() => {
                        const errorMessage = participantsError?.message || statsError?.message || "Failed to load contest data";
                        // Filter out technical React Query details
                        if (typeof errorMessage === 'string' && errorMessage.includes('[')) {
                          return "Failed to load contest data. Please try again.";
                        }
                        return errorMessage;
                      })()}
                    </p>
                    <Button onClick={() => refetchParticipants()} className="mt-4">
                      Try Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Show main content
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="flex min-h-screen">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-4 p-4">
            {/* Back Navigation */}
            <div className="flex items-center justify-between mb-1">
              <Link
                to="/admin/contests"
                search={{
                  page: 1,
                  search: "",
                  status: "all",
                }}
              >
                <Button variant="outline" size="sm" className="flex items-center hover:bg-primary/5 transition-all duration-200 group text-xs">
                  <ArrowLeft className="w-3 h-3 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
                  Back to Contests
                </Button>
              </Link>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => refetchParticipants()} disabled={isLoadingParticipants} className="text-xs px-3 py-1">
                    {isLoadingParticipants ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Users className="w-3 h-3 mr-1" />}
                    Refresh Participants
                  </Button>
                </div>

                <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg px-4 py-2 border border-primary/20">
                  <div className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">{totalParticipants}</div>
                  <div className="text-xs text-muted-foreground font-medium">Total Participants</div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Approved Participants */}
              <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 shadow-lg shadow-emerald/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Approved</p>
                      <p className="text-2xl font-bold text-emerald-600">{approvedParticipants.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {totalParticipants > 0 ? `${((approvedParticipants / totalParticipants) * 100).toFixed(1)}% of total` : '0% of total'}
                      </p>
                    </div>
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pending Participants */}
              <Card className="border-amber-200 bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50 shadow-lg shadow-amber/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Pending</p>
                      <p className="text-2xl font-bold text-amber-600">{pendingParticipants.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {totalParticipants > 0 ? `${((pendingParticipants / totalParticipants) * 100).toFixed(1)}% of total` : '0% of total'}
                      </p>
                    </div>
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contest Status */}
              <Card className={`border-2 ${isActive ? 'border-teal-200 bg-gradient-to-r from-teal-50 via-teal-100 to-teal-50 shadow-lg shadow-teal/5' : 'border-slate-200 bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 shadow-lg shadow-slate/5'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Contest Status</p>
                      <p className={`text-2xl font-bold ${isActive ? 'text-teal-600' : 'text-slate-600'}`}>
                        {isActive ? 'Active' : 'Inactive'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Contest ended'}
                      </p>
                    </div>
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Trophy className={`h-5 w-5 ${isActive ? 'text-green-600' : 'text-gray-600'}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Prize Pool Card */}
              {totalPrizePool > 0 && (
                <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-50 shadow-lg shadow-yellow/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Total Prize Pool</p>
                        <p className="text-2xl font-bold text-yellow-600">${totalPrizePool.toLocaleString()}</p>
                    </div>
                    <div className="p-2 bg-yellow-100 rounded-lg">
                        <Trophy className="h-5 w-5 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Voting Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Total Votes */}
              <Card className="border-blue-200 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 shadow-lg shadow-blue/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Total Votes</p>
                      <p className="text-2xl font-bold text-blue-600">{totalVotes.toLocaleString()}</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Trophy className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Free Votes */}
              <Card className="border-green-200 bg-gradient-to-r from-green-50 via-green-100 to-green-50 shadow-lg shadow-green/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Free Votes</p>
                      <p className="text-2xl font-bold text-green-600">{totalFreeVotes.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {totalVotes > 0 ? `${((totalFreeVotes / totalVotes) * 100).toFixed(1)}% of total votes` : '0% of total votes'}
                      </p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Trophy className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Paid Votes */}
              <Card className="border-purple-200 bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50 shadow-lg shadow-purple/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Paid Votes</p>
                      <p className="text-2xl font-bold text-purple-600">{totalPaidVotes.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {totalVotes > 0 ? `${((totalPaidVotes / totalVotes) * 100).toFixed(1)}% of total votes` : '0% of total votes'}
                      </p>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Trophy className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Participation Rate */}
              <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 via-indigo-100 to-indigo-50 shadow-lg shadow-indigo/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Participation Rate</p>
                      <p className="text-2xl font-bold text-indigo-600">{participationRate.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {participationRate > 0 ? 'Engagement level' : 'No participation data'}
                      </p>
                    </div>
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Users className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>


            {/* Search and Filters */}
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-primary/8 to-primary/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input placeholder="Search participants..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-9 text-sm" />
                  </div>
                    
                    {/* Status Filter */}
                    <div className="flex items-center space-x-2">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <Select value={status || "all"} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-32 h-9 text-sm">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                  <div className="text-sm text-muted-foreground">
                    {isParticipantsFetching && <Loader2 className="w-4 h-4 animate-spin inline mr-2" />}
                    {totalParticipants} participants found
                  </div>
                  </div>
                  
                  {/* Bulk Actions */}
                  {selectedParticipants.size > 0 && (
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => openBulkDialog('approve')}
                        disabled={toggleApproval.isPending || bulkToggleApproval.isPending}
                        className="text-xs px-2 py-1 h-7 text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Approve ({selectedParticipants.size})
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => openBulkDialog('disapprove')}
                        disabled={toggleApproval.isPending || bulkToggleApproval.isPending}
                        className="text-xs px-2 py-1 h-7 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Disapprove ({selectedParticipants.size})
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setSelectedParticipants(new Set());
                          setIsSelectAll(false);
                        }}
                        className="text-xs px-2 py-1 h-7"
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Participants List */}
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-primary/8 to-primary/10 shadow-lg shadow-primary/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Contest Participants</span>
                </CardTitle>
                  
                  {/* Select All Checkbox */}
                  {participants.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="select-all"
                        checked={isSelectAll}
                        onCheckedChange={handleSelectAll}
                        disabled={toggleApproval.isPending || bulkToggleApproval.isPending}
                      />
                      <label htmlFor="select-all" className="text-sm font-medium text-muted-foreground cursor-pointer">
                        Select All ({participants.length})
                      </label>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoadingParticipants && searchQuery ? (
                  <div className="space-y-4 p-4">
                    {/* Search loading skeleton */}
                    <div className="px-4 py-2 bg-muted/30 border-b border-border/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Searching for "{searchQuery}"...</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Participants skeleton */}
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 bg-white/50 rounded-lg border border-primary/10">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-16 w-16 rounded-lg" />
                        <div className="flex items-center space-x-4">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : participants.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Participants Found</h3>
                    <p className="text-sm text-muted-foreground">
                      {searchQuery ? "No participants match your search criteria." : "This contest doesn't have any participants yet."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 p-4">
                    {participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center space-x-4 p-4 bg-white/50 rounded-lg border border-primary/10 hover:bg-white/80 transition-all duration-200"
                      >
                        {/* Selection Checkbox */}
                        <Checkbox
                          id={`participant-${participant.id}`}
                          checked={selectedParticipants.has(participant.id)}
                          onCheckedChange={(checked) => handleParticipantSelect(participant.id, checked as boolean)}
                          disabled={toggleApproval.isPending || bulkToggleApproval.isPending}
                        />

                        {/* Avatar */}
                        <Avatar className="h-12 w-12">
                          {participant.profile?.user?.image ? (
                            <TransformedImage
                              src={participant.profile.user.image}
                              alt="Profile avatar"
                              size="thumbnail"
                              className="h-full w-full object-cover"
                              transformOptions={{
                                w: 65,
                                h: 65,
                                fit: "cover",
                                f: "webp",
                              }}
                            />
                          ) : (
                            <AvatarFallback>{participant.profile?.user?.name?.[0] || participant.profile?.user?.username?.[0] || "?"}</AvatarFallback>
                          )}
                        </Avatar>

                        {/* Participant Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">
                              {participant.profile?.user?.name || participant.profile?.user?.username || "Unknown User"}
                            </h4>
                            <Badge variant={participant.isApproved ? "default" : "secondary"} className="text-xs">
                              {participant.isApproved ? "Approved" : "Pending"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">@{participant.profile?.user?.username || "unknown"}</p>
                          {participant.profile?.bio && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{participant.profile.bio}</p>}
                        </div>

                        {/* Cover Image */}
                        {participant.coverImage && (
                          <div className="flex-shrink-0">
                            <div 
                              className="relative h-16 w-16 rounded-lg overflow-hidden border border-primary/20 cursor-pointer hover:border-primary/40 transition-all duration-200 group"
                              onClick={() => openLightbox(participant)}
                            >
                              <TransformedImage
                                src={participant.coverImage.url}
                                alt="Cover image"
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                                size="small"
                                transformOptions={{
                                  w: 100,
                                  h: 100,
                                  fit: "cover",
                                  f: "webp",
                                }}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 rounded-lg flex items-center justify-center">
                                <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Vote Counts */}
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-green-600">{participant.totalFreeVotes || 0}</div>
                            <div className="text-xs text-muted-foreground">Free Votes</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-blue-600">{participant.totalPaidVotes || 0}</div>
                            <div className="text-xs text-muted-foreground">Paid Votes</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-primary">{(participant.totalFreeVotes || 0) + (participant.totalPaidVotes || 0)}</div>
                            <div className="text-xs text-muted-foreground">Total</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" asChild className="text-xs">
                            <Link to={`/profile/$username`} params={{ username: participant.profile?.user?.username || "" }}>
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Link>
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {!participant.isApproved ? (
                                <DropdownMenuItem 
                                  onClick={() => handleApproveParticipant(participant.id)} 
                                  className="text-green-600"
                                  disabled={toggleApproval.isPending || bulkToggleApproval.isPending}
                                >
                                  {toggleApproval.isPending ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  ) : (
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  )}
                                  Approve
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem 
                                  onClick={() => handleDisapproveParticipant(participant.id)} 
                                  className="text-red-600"
                                  disabled={toggleApproval.isPending || bulkToggleApproval.isPending}
                                >
                                  {toggleApproval.isPending ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  ) : (
                                  <XCircle className="w-4 h-4 mr-2" />
                                  )}
                                  Disapprove
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, pagination.total)} of {pagination.total} participants
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(currentPage - 1)} disabled={!pagination.hasPreviousPage} className="h-8">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button key={pageNum} variant={currentPage === pageNum ? "default" : "outline"} size="sm" onClick={() => setPage(pageNum)} className="h-8 w-8 p-0">
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setPage(currentPage + 1)} disabled={!pagination.hasNextPage} className="h-8">
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Lightbox */}
      {lightboxImage && <Lightbox image={lightboxImage} onClose={closeLightbox} />}

      {/* Bulk Action Confirmation Dialog */}
      <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {bulkAction === 'approve' ? 'Approve Participants' : 'Disapprove Participants'}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {bulkAction === 'approve' ? 'approve' : 'disapprove'} {selectedParticipants.size} participant{selectedParticipants.size !== 1 ? 's' : ''}?
              {bulkAction === 'approve' 
                ? ' This will make them eligible for voting and public display.' 
                : ' This will remove them from public voting and display.'
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowBulkDialog(false)}
              disabled={toggleApproval.isPending || bulkToggleApproval.isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleBulkAction}
              disabled={toggleApproval.isPending || bulkToggleApproval.isPending}
            >
              {(toggleApproval.isPending || bulkToggleApproval.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {bulkAction === 'approve' ? 'Approve' : 'Disapprove'} {selectedParticipants.size} Participant{selectedParticipants.size !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
