import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useContests, useJoinedContests, useJoinContest, Contest } from "@/hooks/api/useContests";
import { notificationService } from "@/lib/notificationService";
import { formatUsdAbbrev } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { formatDistanceToNow, isAfter, isBefore, startOfDay } from "date-fns";
import { Calendar, Gift, RefreshCw, Share, Trophy, Users } from "lucide-react";
import { useState } from "react";

export function DashboardCompetitions() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Pagination state
  const ITEMS_PER_PAGE = 5;
  const [activePage, setActivePage] = useState(1);
  const [joinedPage, setJoinedPage] = useState(1);

  // Use the new useContests hooks
  const { data: contestsData, isLoading } = useContests(1, 100); // Get all contests for filtering
  const { data: joinedContestsData, isLoading: isLoadingJoined } = useJoinedContests(user?.profileId || "", 1, 100);
  const joinContestMutation = useJoinContest();

  // Extract contests from the response
  const allContests = contestsData?.data || [];
  const joinedContests = joinedContestsData?.data || [];

  // Filter contests by status
  const getCompetitionStatus = (contest: Contest): "active" | "coming-soon" | "ended" => {
    const now = startOfDay(new Date());
    const startDate = startOfDay(new Date(contest.startDate));
    const endDate = startOfDay(new Date(contest.endDate));

    if (isAfter(now, endDate)) {
      return "ended";
    } else if (isBefore(now, startDate)) {
      return "coming-soon";
    } else {
      return "active";
    }
  };

  const activeCompetitions = allContests.filter(contest => getCompetitionStatus(contest) === "active");
  const comingSoonCompetitions = allContests.filter(contest => getCompetitionStatus(contest) === "coming-soon");
  const endedCompetitions = allContests.filter(contest => getCompetitionStatus(contest) === "ended");
  
  const joinedActiveCompetitions = joinedContests.filter(contest => getCompetitionStatus(contest) === "active");
  const joinedIds = new Set(joinedContests.map(c => c.id));

  // Pagination calculations
  const activeTotalPages = Math.max(1, Math.ceil(activeCompetitions.length / ITEMS_PER_PAGE));
  const joinedTotalPages = Math.max(1, Math.ceil(joinedActiveCompetitions.length / ITEMS_PER_PAGE));

  const activePageItems = activeCompetitions.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE);
  const joinedPageItems = joinedActiveCompetitions.slice((joinedPage - 1) * ITEMS_PER_PAGE, joinedPage * ITEMS_PER_PAGE);

  const handleJoinContest = async (competitionId: string, competitionName: string) => {
    if (!user?.profileId) {
      toast({
        title: "Profile Required",
        description: "Please complete your profile before joining contests",
        variant: "destructive",
      });
      return;
    }

    try {
      await joinContestMutation.mutateAsync({
        profileId: user.profileId,
        contestId: competitionId,
      });
      
      // Trigger notification for joining competition
      if (user?.id && user?.profileId) {
        await notificationService.notifyCompetitionJoined(
          user.id,
          user.profileId,
          competitionName
        );
      }
      
      toast({
        title: "Success!",
        description: `You have joined ${competitionName}`,
      });
    } catch (error) {
      console.log(error);
      const errorMessage = error instanceof Error ? error.message : "Failed to join contest. Please try again.";

      if (errorMessage.includes("must be logged in")) {
        toast({
          title: "Authentication Required",
          description: "Please log in to join contests",
          variant: "destructive",
        });
      } else if (errorMessage.includes("Profile setup required")) {
        toast({
          title: "Profile Setup Required",
          description: "Please complete your profile before joining contests",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  const formatPrize = (prizePool: number): string => formatUsdAbbrev(prizePool);

  const shareCompetition = async (competitionName: string) => {
    const url = `${window.location.origin}/profile/${user?.username}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: `Your profile link for ${competitionName} has been copied.`,
      });
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const getStatusBadge = (status: "active" | "coming-soon" | "ended") => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "ended":
        return <Badge variant="secondary">Completed</Badge>;
      case "coming-soon":
        return <Badge variant="outline">Upcoming</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const renderCoverImage = (contest: Contest) => {
    const coverUrl = contest.images?.[0]?.url || "/placeholder.svg";
    return <img src={coverUrl} alt={contest.name} className="w-full aspect-video object-cover rounded-md" loading="lazy" />;
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Competitions</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading competitions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:p-4">
      <Tabs defaultValue="active">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Contest</h1>
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="joined">Joined</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active">
          {/* Active Competitions */}
          <div className="space-y-4">
            {activeCompetitions.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {activePageItems.map((contest) => {
                  const status = getCompetitionStatus(contest);
                  return (
                    <Card key={contest.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center">
                            <Trophy className="mr-2 h-5 w-5" />
                            {contest.name}
                          </CardTitle>
                          {getStatusBadge(status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-muted-foreground mb-2">{formatPrize(contest.prizePool)} Prize Pool</p>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Calendar className="mr-1 h-4 w-4" />
                                  Ends: {formatDistanceToNow(new Date(contest.endDate), { addSuffix: true })}
                                </div>
                                {contest.awards.length > 0 && (
                                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                                    <Trophy className="mr-1 h-4 w-4" />
                                    {contest.awards.length} award{contest.awards.length !== 1 ? "s" : ""}
                                  </div>
                                )}
                              </div>
                              <div className="space-y-2">
                                <div className="text-sm">
                                  <span className="font-medium">Awards:</span>
                                  <ul className="mt-1 space-y-1">
                                    {contest.awards.slice(0, 3).map((award) => (
                                      <li key={award.id} className="text-muted-foreground">
                                        {award.icon} {award.name}
                                      </li>
                                    ))}
                                    {contest.awards.length > 3 && <li className="text-muted-foreground">+{contest.awards.length - 3} more</li>}
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {joinedIds.has(contest.id) ? (
                                <Button variant="outline" onClick={() => shareCompetition(contest.name)} className="flex items-center">
                                  <Share className="mr-2 h-4 w-4" />
                                  Share Profile
                                </Button>
                              ) : (
                                <Button 
                                  onClick={() => handleJoinContest(contest.id, contest.name)}
                                  disabled={joinContestMutation.isPending}
                                >
                                  {joinContestMutation.isPending ? "Joining..." : "Register"}
                                </Button>
                              )}
                              <Button variant="outline" asChild>
                                <Link to={`/competitions/$slug`} params={{ slug: contest.slug }}>View Details</Link>
                              </Button>
                            </div>
                          </div>
                          <div className="w-full md:w-1/3">{renderCoverImage(contest)}</div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center p-8">
                  <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Competitions</h3>
                  <p className="text-muted-foreground mb-4">There are no active competitions at the moment. Check back soon for new opportunities!</p>
                </CardContent>
              </Card>
            )}
            {activeTotalPages > 1 && (
              <Pagination className="mt-2">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActivePage(Math.max(1, activePage - 1));
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: activeTotalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === activePage}
                        onClick={(e) => {
                          e.preventDefault();
                          setActivePage(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActivePage(Math.min(activeTotalPages, activePage + 1));
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </TabsContent>

        <TabsContent value="joined">
          {/* Joined Competitions */}
          <div className="space-y-4">
            {isLoadingJoined ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading your joined competitions...</p>
                </div>
              </div>
            ) : joinedActiveCompetitions.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {joinedPageItems.map((contest) => {
                  const status = getCompetitionStatus(contest);
                  return (
                    <Card key={contest.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center">
                            <Trophy className="mr-2 h-5 w-5" />
                            {contest.name}
                          </CardTitle>
                          {getStatusBadge(status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-muted-foreground mb-2">{formatPrize(contest.prizePool)} Prize Pool</p>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Calendar className="mr-1 h-4 w-4" />
                                  Ends: {formatDistanceToNow(new Date(contest.endDate), { addSuffix: true })}
                                </div>
                                {contest.awards.length > 0 && (
                                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                                    <Trophy className="mr-1 h-4 w-4" />
                                    {contest.awards.length} award{contest.awards.length !== 1 ? "s" : ""}
                                  </div>
                                )}
                              </div>
                              <div className="space-y-2">
                                <div className="text-sm">
                                  <span className="font-medium">Awards:</span>
                                  <ul className="mt-1 space-y-1">
                                    {contest.awards.slice(0, 3).map((award) => (
                                      <li key={award.id} className="text-muted-foreground">
                                        {award.icon} {award.name}
                                      </li>
                                    ))}
                                    {contest.awards.length > 3 && <li className="text-muted-foreground">+{contest.awards.length - 3} more</li>}
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" onClick={() => shareCompetition(contest.name)} className="flex items-center">
                                <Share className="mr-2 h-4 w-4" />
                                Share Profile
                              </Button>
                              <Button variant="outline" asChild>
                                <Link to={`/competitions/$slug`} params={{ slug: contest.slug }}>View Details</Link>
                              </Button>
                            </div>
                          </div>
                          <div className="w-full md:w-1/3">{renderCoverImage(contest)}</div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center p-8">
                  <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Joined Competitions</h3>
                  <p className="text-muted-foreground mb-4">You haven't joined any active competitions yet.</p>
                </CardContent>
              </Card>
            )}
            {joinedTotalPages > 1 && (
              <Pagination className="mt-2">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setJoinedPage(Math.max(1, joinedPage - 1));
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: joinedTotalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === joinedPage}
                        onClick={(e) => {
                          e.preventDefault();
                          setJoinedPage(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setJoinedPage(Math.min(joinedTotalPages, joinedPage + 1));
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Completed Competitions - shown above Upcoming so Upcoming stays at the bottom */}
      {endedCompetitions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Completed Competitions</h2>
          <div className="grid grid-cols-1 gap-4">
            {endedCompetitions.map((contest) => {
              const status = getCompetitionStatus(contest);
              return (
                <Card key={contest.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Trophy className="mr-2 h-5 w-5" />
                        {contest.name}
                      </CardTitle>
                      {getStatusBadge(status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-muted-foreground mb-2">{formatPrize(contest.prizePool)} Prize Pool</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="mr-1 h-4 w-4" />
                              Ended: {formatDistanceToNow(new Date(contest.endDate), { addSuffix: true })}
                            </div>
                            {contest.winnerProfileId && (
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Trophy className="mr-1 h-4 w-4" />
                                Winner announced
                              </div>
                            )}
                          </div>
                          <div className="text-center p-4 bg-primary/10 rounded-lg">
                            <Trophy className="mx-auto h-8 w-8 text-primary mb-2" />
                            <p className="font-semibold">Competition Completed</p>
                            <p className="text-sm text-muted-foreground">Final results available</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" asChild>
                            <Link to={`/competitions/$slug`} params={{ slug: contest.slug }}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                      <div className="w-full md:w-1/3">{renderCoverImage(contest)}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming Competitions - always at the very bottom */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Upcoming Competitions</h2>
        <div className="grid grid-cols-1 gap-4">
          {comingSoonCompetitions.map((contest) => {
            const status = getCompetitionStatus(contest);
            return (
              <Card key={contest.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Gift className="mr-2 h-5 w-5" />
                      {contest.name}
                    </CardTitle>
                    {getStatusBadge(status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-4">
                      <p className="text-muted-foreground">{formatPrize(contest.prizePool)} Prize Pool</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          Starts: {formatDistanceToNow(new Date(contest.startDate), { addSuffix: true })}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          Ends: {formatDistanceToNow(new Date(contest.endDate), { addSuffix: true })}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Awards:</span>
                          <ul className="mt-1 space-y-1">
                            {contest.awards.slice(0, 3).map((award) => (
                              <li key={award.id} className="text-muted-foreground">
                                {award.icon} {award.name}
                              </li>
                            ))}
                            {contest.awards.length > 3 && <li className="text-muted-foreground">+{contest.awards.length - 3} more</li>}
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="mr-1 h-4 w-4" />
                          {contest.awards.length} award{contest.awards.length !== 1 ? "s" : ""} available
                        </div>
                        <Button disabled>
                          Coming Soon
                        </Button>
                      </div>
                    </div>
                    <div className="w-full md:w-1/3">{renderCoverImage(contest)}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {comingSoonCompetitions.length === 0 && (
          <Card>
            <CardContent className="text-center p-8">
              <Gift className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Upcoming Competitions</h3>
              <p className="text-muted-foreground">Check back soon for exciting new competitions!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
