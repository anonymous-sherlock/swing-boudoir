import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileVotes, useTopVoters } from "@/hooks/api/useVotes";
import { useProfile } from "@/hooks/api/useProfile";
import { AlertCircle, Calendar, DollarSign, Heart, MessageSquare, Star, TrendingDown, TrendingUp, UserCheck, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

export function Votes() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("received");

  // Use the hooks we created
  const { data: premiumVotesData, isLoading: premiumVotesLoading, error: premiumVotesError } = useProfileVotes(user?.profileId || "", { page: 1, limit: 50, onlyPaid: true });
  const { data: freeVotesData, isLoading: freeVotesLoading, error: freeVotesError } = useProfileVotes(user?.profileId || "", { page: 1, limit: 50 });
  const { data: topVotersData, isLoading: topVotersLoading, error: topVotersError } = useTopVoters(user?.profileId || "");
  const { data: recentVotesData, isLoading: recentVotesLoading, error: recentVotesError } = useProfileVotes(user?.profileId || "", { page: 1, limit: 20 });
  const { useProfileStats } = useProfile();
  const { data: profileStats } = useProfileStats(user?.profileId || "");

  const getInitials = (name?: string) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || "";
    const second = parts[1]?.[0] || "";
    return (first + second).toUpperCase() || first.toUpperCase() || "?";
  };

  const isRecent = (dateString?: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const dayMs = 24 * 60 * 60 * 1000;
    return diffMs >= 0 && diffMs <= dayMs;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return `${Math.floor(diffInMinutes / 10080)}w ago`;
  };

  // Show loading state
  if (premiumVotesLoading || freeVotesLoading || topVotersLoading || recentVotesLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 sm:p-4">
        <h1 className="text-2xl font-bold text-foreground">Votes</h1>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading vote data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (premiumVotesError || freeVotesError || topVotersError || recentVotesError) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 sm:p-4">
        <h1 className="text-2xl font-bold text-foreground">Votes</h1>

        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Error loading votes</h3>
            <p className="text-muted-foreground mb-4">{premiumVotesError?.message || freeVotesError?.message || topVotersError?.message || recentVotesError?.message}</p>
            {/* <button onClick={fetchVoteData} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
              Try Again
            </button> */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:p-4">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-indigo-950/40 dark:via-background dark:to-pink-950/30 p-6 sm:p-8 shadow-sm">
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">Votes Dashboard</h1>
              <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-300">Track premium, free, and recent votes — stay on top of your momentum.</p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Badge className="bg-indigo-600 text-white">Live</Badge>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-200/40 dark:bg-indigo-400/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-pink-200/40 dark:bg-pink-400/10 blur-2xl" />
      </div>
      {/* Stats Overview */}
      {(() => {
        const totalReceived = profileStats?.totalVotesReceived || 0;
        const totalGiven = profileStats?.totalVotesGiven || 0;
        const freeVotesCount = profileStats?.freeVotesReceived || 0;
        const paidVotesCount = profileStats?.paidVotesReceived || 0;
        return (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border border-gray-100 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalReceived.toLocaleString()}</p>
                  <p className="text-gray-600 text-sm font-medium">Total Received</p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center ring-1 ring-emerald-300/60">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-gray-100 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalGiven}</p>
                  <p className="text-gray-600 text-sm font-medium">Total Given</p>
                </div>
                <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center ring-1 ring-violet-300/60">
                  <TrendingDown className="h-5 w-5 text-violet-600" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-gray-100 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{freeVotesCount.toLocaleString()}</p>
                  <p className="text-gray-600 text-sm font-medium">Free Votes</p>
                </div>
                <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center ring-1 ring-rose-300/60">
                  <Heart className="h-5 w-5 text-rose-600" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-gray-100 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{paidVotesCount.toLocaleString()}</p>
                  <p className="text-gray-600 text-sm font-medium">Premium Votes</p>
                </div>
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center ring-1 ring-amber-300/60">
                  <Star className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </div>
          </div>
        );
      })()}
     

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
          <TabsTrigger value="received" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Votes Received</span>
            <Badge variant="secondary" className="ml-2">
              {latestVotesData?.data?.length || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="given" className="flex items-center space-x-2">
            <TrendingDown className="h-4 w-4" />
            <span>Votes Given</span>
            <Badge variant="secondary" className="ml-2">
              {votesGiven.length}
            </Badge>
          </TabsTrigger>
        </TabsList> */}

        {/* Votes Received Tab */}
        <TabsContent value="received" className="space-y-6">
          {/* Top Voters Section */}
          <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/30">
              <CardTitle className="flex items-center text-blue-900 dark:text-blue-100">
                <Users className="mr-3 h-6 w-6" />
                Top 10 Voters
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {!topVotersData || topVotersData.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-xl font-semibold mb-2 text-muted-foreground">No votes yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Share your profile to start receiving votes! The more you engage with the community, the more votes you'll receive.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white/80 dark:bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-white/50">
                      <TableRow className="hover:bg-muted/50">
                        <TableHead className="font-semibold">Rank</TableHead>
                        <TableHead className="font-semibold">Voter</TableHead>
                        <TableHead className="font-semibold">Votes</TableHead>
                        <TableHead className="font-semibold">Comment</TableHead>
                        <TableHead className="font-semibold">Last Vote</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topVotersData.map((voter, index) => (
                        <TableRow key={voter.profileId} className="hover:bg-muted/30 odd:bg-muted/20">
                          <TableCell>
                            <div className="flex items-center">
                              {index < 3 ? (
                                <Badge variant={index === 0 ? "default" : index === 1 ? "secondary" : "outline"} className="mr-2">
                                  #{index + 1}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground font-medium">#{index + 1}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <div className="relative h-8 w-8 rounded-full p-[2px] bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-amber-500">
                                <Avatar className="h-full w-full">
                                  <AvatarImage src={voter.profilePicture || undefined} alt={voter.userName} />
                                  <AvatarFallback className="text-xs bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-amber-500 text-white">
                                    {getInitials(voter.userName)}
                                  </AvatarFallback>
                                </Avatar>
                                {isRecent(voter.lastVoteAt) && (
                                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-background" />
                                )}
                              </div>
                              <span>{voter.userName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-sm">
                              {voter.totalVotesGiven}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {voter.comment ? (
                              <div className="flex items-center max-w-xs">
                                <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="truncate">{voter.comment}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{formatTime(voter.lastVoteAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Premium Votes Section */}
          <Card className="border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-950/30">
              <CardTitle className="flex items-center text-yellow-900 dark:text-yellow-100">
                <DollarSign className="mr-3 h-6 w-6" />
                Premium Votes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {premiumVotesData?.data.length === 0 ? (
                <div className="text-center py-8 px-6">
                  <DollarSign className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-xl font-semibold mb-2 text-muted-foreground">No premium votes yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">Premium votes will appear here when supporters purchase vote packages for your profile.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white/80 dark:bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-white/50">
                      <TableRow className="hover:bg-muted/50">
                        <TableHead className="font-semibold">Voter</TableHead>
                        <TableHead className="font-semibold">Votes</TableHead>
                        <TableHead className="font-semibold">Comment</TableHead>
                        <TableHead className="font-semibold">Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {premiumVotesData?.data.map((vote, index) => (
                        <TableRow key={index} className="hover:bg-muted/30 odd:bg-muted/20">
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <div className="relative h-8 w-8 rounded-full p-[2px] bg-gradient-to-br from-amber-500 via-pink-500 to-purple-500">
                                <Avatar className="h-full w-full">
                                  <AvatarImage src={undefined} alt={vote.username} />
                                  <AvatarFallback className="text-xs bg-gradient-to-br from-amber-500 via-pink-500 to-purple-500 text-white">
                                    {getInitials(vote.username)}
                                  </AvatarFallback>
                                </Avatar>
                                {isRecent(vote.votedOn) && (
                                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-background" />
                                )}
                              </div>
                              <span>{vote.username}</span>
                              <Badge variant="outline" className="text-xs bg-orange-500 text-white  ">
                                <Star className="h-3 w-3 mr-1" />
                                Premium
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-500 text-white text-sm">{vote.count}</Badge>
                          </TableCell>
                          <TableCell>
                            {vote.comment ? (
                              <div className="flex items-center max-w-xs">
                                <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="truncate">{vote.comment}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{formatTime(vote.votedOn)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Votes Section */}
          <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-green-50 to-transparent dark:from-green-950/30">
              <CardTitle className="flex items-center text-green-900 dark:text-green-100">
                <Calendar className="mr-3 h-6 w-6" />
                Recent Votes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {!recentVotesData?.data || recentVotesData.data.length === 0 ? (
                <div className="text-center py-8 px-6">
                  <p className="text-muted-foreground">No recent votes</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white/80 dark:bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-white/50">
                      <TableRow className="hover:bg-muted/50">
                        <TableHead className="font-semibold">Voter</TableHead>
                        <TableHead className="font-semibold">Votes</TableHead>
                        <TableHead className="font-semibold">Comment</TableHead>
                        <TableHead className="font-semibold">Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentVotesData?.data?.slice(0, 20).map((vote) => (
                        <TableRow key={`${vote.votedOn || "unknown"}_${vote.votedOn}`} className="hover:bg-muted/30 odd:bg-muted/20">
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <div className="relative h-8 w-8 rounded-full p-[2px] bg-gradient-to-br from-sky-500 via-violet-500 to-rose-500">
                                <Avatar className="h-full w-full">
                                  <AvatarImage src={undefined} alt={vote.username || "Unknown Voter"} />
                                  <AvatarFallback className="text-xs bg-gradient-to-br from-sky-500 via-violet-500 to-rose-500 text-white">
                                    {getInitials(vote.username || "?")}
                                  </AvatarFallback>
                                </Avatar>
                                {isRecent(vote.votedOn) && (
                                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-background" />
                                )}
                              </div>
                              <span>{vote.username || "Unknown Voter"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-sm">
                              {vote.count || 0}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {vote.comment ? (
                              <div className="flex items-center max-w-xs">
                                <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="truncate">{vote.comment || "No comment"}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{formatTime(vote.votedOn)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Votes Given Tab */}
        <TabsContent value="given" className="space-y-6">
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-950/30">
              <CardTitle className="flex items-center text-purple-900 dark:text-purple-100">
                <UserCheck className="mr-3 h-6 w-6" />
                Votes You've Given
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <UserCheck className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2 text-muted-foreground">Feature Coming Soon</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">
                  The "Votes Given" functionality is not yet implemented in the backend API. This section will show votes you've given to other creators once the backend endpoint
                  is ready.
                </p>
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Current Status:</strong> The backend team is working on implementing the votes tracking system. You can currently see votes you've received, but the
                    ability to track votes you've given is in development.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Note about free votes */}
      <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-amber-200 dark:border-amber-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">Important Note About Free Votes</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Free votes shown above may include both legitimate votes from real users and potentially fraudulent votes. Premium votes are always verified and legitimate.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
