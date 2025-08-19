import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useVoteHistory, useTopVoters, useLatestVotes } from "@/hooks/api/useVotes";
import { AlertCircle, Calendar, DollarSign, Heart, MessageSquare, Star, TrendingDown, TrendingUp, UserCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface Vote {
  id: string;
  voterId: string;
  voterName: string;
  profileId: string;
  votes: number;
  comment?: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

interface VoteStats {
  totalVotes: number;
  freeVotes: number;
  premiumVotes: number;
  totalVoters: number;
  averageVotesPerVoter: number;
}

interface VoteGiven {
  id: string;
  profileId: string;
  profileName: string;
  profileImage?: string;
  votes: number;
  comment?: string;
  isPremium: boolean;
  createdAt: string;
}

interface VoteHistoryEntry {
  profileId: string;
  userName: string;
  votedOn: string;
  count: number;
  comment?: string;
}

export function Votes() {
  const { user } = useAuth();
  const [recentVotes, setRecentVotes] = useState<Vote[]>([]);
  const [premiumVotes, setPremiumVotes] = useState<Vote[]>([]);
  const [votesGiven, setVotesGiven] = useState<VoteGiven[]>([]);
  const [voteStats, setVoteStats] = useState<VoteStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("received");

  // Use the hooks we created
  const { data: voteHistoryData, isLoading: voteHistoryLoading, error: voteHistoryError } = useVoteHistory(user?.profileId || "", 1, 50);
  const { data: topVotersData, isLoading: topVotersLoading, error: topVotersError } = useTopVoters(user?.profileId || "");
  const { data: latestVotesData, isLoading: latestVotesLoading } = useLatestVotes(1, 20);

  const fetchVoteData = async () => {
    try {
      setError(null);

      // Check if user has a profileId
      if (!user?.profileId) {
        console.log("No profile ID found, setting default stats");
        setVoteStats({
          totalVotes: 0,
          freeVotes: 0,
          premiumVotes: 0,
          totalVoters: 0,
          averageVotesPerVoter: 0,
        });
        setRecentVotes([]);
        setPremiumVotes([]);
        setVotesGiven([]);
        return;
      }

      // For now, set votes given as empty since that API doesn't exist yet
      setVotesGiven([]);
    } catch (error) {
      console.error("Error fetching vote data:", error);
      // Don't set error state for individual API failures, just log them
      // Only set error if all APIs fail completely
    }
  };

  // Process vote history data when it changes
  useEffect(() => {
    if (voteHistoryData?.data) {
      const votes = voteHistoryData.data;

      // Calculate stats from the votes data
      const totalVotes = votes.reduce((sum: number, vote: VoteHistoryEntry) => sum + (vote.count || 0), 0);
      const uniqueVoters = new Set(votes.map((vote: VoteHistoryEntry) => vote.userName)).size;

      setVoteStats({
        totalVotes,
        freeVotes: totalVotes, // API doesn't distinguish between free/paid yet
        premiumVotes: 0, // API doesn't distinguish between free/paid yet
        totalVoters: uniqueVoters,
        averageVotesPerVoter: uniqueVoters > 0 ? totalVotes / uniqueVoters : 0,
      });

      // For now, set premium votes as empty since API doesn't distinguish
      setPremiumVotes([]);
    }
  }, [voteHistoryData]);

  useEffect(() => {
    fetchVoteData();
  }, []);

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
  if (voteHistoryLoading || topVotersLoading || latestVotesLoading) {
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
  if (error || voteHistoryError || topVotersError) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 sm:p-4">
        <h1 className="text-2xl font-bold text-foreground">Votes</h1>

        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Error loading votes</h3>
            <p className="text-muted-foreground mb-4">{error || voteHistoryError?.message || topVotersError?.message}</p>
            <button onClick={fetchVoteData} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Votes</h1>
      </div>
      {/* API Status Info */}
      {!voteStats && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-500 rounded-full">
                <AlertCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">API Endpoints Not Available</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Some vote statistics endpoints are not yet implemented. The dashboard will show default values (0) until the backend is ready. This is normal during development.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
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
        </TabsList>

        {/* Votes Received Tab */}
        <TabsContent value="received" className="space-y-6">
          {/* Top Voters Section */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/30">
              <CardTitle className="flex items-center text-blue-900 dark:text-blue-100">
                <Users className="mr-3 h-6 w-6" />
                Top 10 Voters
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {!topVotersData || topVotersData.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-xl font-semibold mb-2 text-muted-foreground">No votes yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Share your profile to start receiving votes! The more you engage with the community, the more votes you'll receive.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
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
                        <TableRow key={voter.profileId} className="hover:bg-muted/30">
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
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
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

          {/* Recent Votes Section */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="bg-gradient-to-r from-green-50 to-transparent dark:from-green-950/30">
              <CardTitle className="flex items-center text-green-900 dark:text-green-100">
                <Calendar className="mr-3 h-6 w-6" />
                Recent Votes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {!latestVotesData?.data || latestVotesData.data.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No recent votes</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-muted/50">
                        <TableHead className="font-semibold">Voter</TableHead>
                        <TableHead className="font-semibold">Votes</TableHead>
                        <TableHead className="font-semibold">Comment</TableHead>
                        <TableHead className="font-semibold">Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {latestVotesData.data.slice(0, 20).map((vote) => (
                        <TableRow key={`${vote.voter?.id || "unknown"}_${vote.createdAt}`} className="hover:bg-muted/30">
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <span>{vote.voter?.name || "Unknown Voter"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-sm">
                              {vote.totalVotes || 0}
                            </Badge>
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
                          <TableCell className="text-muted-foreground">{formatTime(vote.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Premium Votes Section */}
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-950/30">
              <CardTitle className="flex items-center text-yellow-900 dark:text-yellow-100">
                <DollarSign className="mr-3 h-6 w-6" />
                Premium Votes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {premiumVotes.length === 0 ? (
                <div className="text-center py-8">
                  <DollarSign className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-xl font-semibold mb-2 text-muted-foreground">No premium votes yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">Premium votes will appear here when supporters purchase vote packages for your profile.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-muted/50">
                        <TableHead className="font-semibold">Voter</TableHead>
                        <TableHead className="font-semibold">Votes</TableHead>
                        <TableHead className="font-semibold">Comment</TableHead>
                        <TableHead className="font-semibold">Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {premiumVotes.map((vote) => (
                        <TableRow key={vote.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                              <span>{vote.voterName}</span>
                              <Badge variant="outline" className="text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Premium
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-500 text-white text-sm">{vote.votes}</Badge>
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
                          <TableCell className="text-muted-foreground">{formatTime(vote.createdAt)}</TableCell>
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
