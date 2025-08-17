import { useState, useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share, Star, User, Trophy, Calendar, Users, AlertCircle, Image as ImageIcon, Heart, Clock, Gift, DollarSign, Eye, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/api";
import { Competition } from "@/types/competitions.types";

import { formatUsdAbbrev } from "@/lib/utils";

// API endpoints
const getModelProfileByUsername = async (username) => {
  const response = await apiRequest(`/api/v1/profile/username/${username}`, {
    method: "GET",
  });
  if (response.success) return response.data;
  return null;
};

const getModelJoinedContests = async (profileId) => {
  try {
    const response = await apiRequest(`/api/v1/contest/${profileId}/joined`, {
      method: "GET",
    });
    if (response.success && response.data) {
      const contests = response.data.data || response.data;
      console.log("Extracted contests:", contests);

      if (Array.isArray(contests)) {
        if (contests.length > 0 && contests[0].name) {
          return contests.map((contest) => ({
            id: contest.id,
            contestId: contest.id,
            contest: contest,
            userId: profileId,
            status: "active",
            registrationDate: contest.createdAt || new Date().toISOString(),
            currentVotes: 0,
            ranking: 0,
          }));
        } else {
          return contests;
        }
      }
      return [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching joined contests:", error);
    return [];
  }
};

const PAID_VOTE_PACKAGES = [
  {
    id: "basic",
    name: "Starter Pack",
    votes: 5,
    price: 1,
    savings: null,
  },
  {
    id: "premium",
    name: "Popular Choice",
    votes: 70,
    price: 10,
    savings: "Save 30%",
  },
  {
    id: "vip",
    name: "Ultimate VIP",
    votes: 500,
    price: 50,
    savings: "Save 50%",
  },
];

export default function PublicProfilePage() {
  const { username } = useParams({ from: "/_public/profile/$username" });
  const [modelProfile, setModelProfile] = useState(null);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const [userVotes, setUserVotes] = useState(0);
  const [lastVoteTime, setLastVoteTime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeUntilNextVote, setTimeUntilNextVote] = useState("");
  const [showPaidVoteOptions, setShowPaidVoteOptions] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const safeUserRegistrations = Array.isArray(userRegistrations) ? userRegistrations : [];

  // Load model profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (username) {
        try {
          setIsLoading(true);
          console.log("Loading profile for ID:", username);
          const profile = await getModelProfileByUsername(username);
          console.log("Profile API Response:", profile);
          setModelProfile(profile);

          if (profile?.id) {
            console.log("Loading contests for profile ID:", profile.id);
            const contests = await getModelJoinedContests(profile.id);
            console.log("API Response for joined contests:", contests);

            if (Array.isArray(contests)) {
              console.log("Setting contests:", contests);
              setUserRegistrations(contests);
            } else {
              console.log("Contests is not an array, setting empty array");
              setUserRegistrations([]);
            }
          } else {
            console.log("No profile ID found, setting empty contests array");
            setUserRegistrations([]);
          }
        } catch (err) {
          console.error("Error loading profile:", err);
          setError("Failed to load profile data");
          setUserRegistrations([]);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadProfile();
  }, [username]);

  // Load user's voting history from localStorage
  useEffect(() => {
    if (username) {
      const voteKey = `vote_${username}`;
      const storedVoteTime = localStorage.getItem(voteKey);
      const storedVotes = localStorage.getItem(`votes_${username}`);

      if (storedVoteTime) {
        setLastVoteTime(new Date(storedVoteTime));
      }

      if (storedVotes) {
        setUserVotes(parseInt(storedVotes));
      }
    }
  }, [username]);

  // Countdown timer for competitions
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = {};

      safeUserRegistrations.forEach((reg) => {
        if (reg.contest?.endDate) {
          const now = new Date().getTime();
          const end = new Date(reg.contest.endDate).getTime();
          const difference = end - now;

          if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            newTimeLeft[reg.contestId] =
              `${days.toString().padStart(2, "0")} : ${hours.toString().padStart(2, "0")} : ${minutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`;
          } else {
            newTimeLeft[reg.contestId] = "Ended";
          }
        }
      });

      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [safeUserRegistrations]);

  // Calculate next free vote time
  useEffect(() => {
    if (lastVoteTime && username) {
      const nextVoteTime = new Date(lastVoteTime.getTime() + 24 * 60 * 60 * 1000);
      const now = new Date();

      if (nextVoteTime > now) {
        const options = {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        };
        setTimeUntilNextVote(nextVoteTime.toLocaleDateString("en-US", options));
      } else {
        setTimeUntilNextVote("");
      }
    }
  }, [lastVoteTime, username]);

  const canVote = () => {
    if (!lastVoteTime || !username) return true;
    const now = new Date();
    const hoursSinceLastVote = (now.getTime() - lastVoteTime.getTime()) / (1000 * 60 * 60);
    return hoursSinceLastVote >= 24;
  };

  const handleVote = async () => {
    if (!username) return;

    if (canVote()) {
      const newVoteCount = userVotes + 1;
      const now = new Date();

      const voteKey = `vote_${username}`;
      const votesKey = `votes_${username}`;
      localStorage.setItem(voteKey, now.toISOString());
      localStorage.setItem(votesKey, newVoteCount.toString());

      setUserVotes(newVoteCount);
      setLastVoteTime(now);

      toast({
        title: "Vote Submitted!",
        description: `Your vote has been counted successfully. You can vote again in 24 hours.`,
      });
    } else {
      setShowPaidVoteOptions(true);
    }
  };

  const handlePaidVoteSuccess = (votes) => {
    if (!username) return;

    const newVoteCount = userVotes + votes;
    const votesKey = `votes_${username}`;
    localStorage.setItem(votesKey, newVoteCount.toString());

    setUserVotes(newVoteCount);
    setShowPaidVoteOptions(false);

    toast({
      title: "Paid Votes Added!",
      description: `You've successfully added ${votes} votes!`,
    });
  };

  const handleBuyVotesClick = () => {
    window.location.href = "/voters/buy-votes";
  };

  const shareProfile = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: "Profile link has been copied to clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">Active</Badge>;
      case "ended":
        return (
          <Badge variant="secondary" className="text-xs px-2 py-1">
            Ended
          </Badge>
        );
      case "coming-soon":
        return (
          <Badge variant="outline" className="text-xs px-2 py-1 border-blue-200 text-blue-600">
            Upcoming
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs px-2 py-1">
            {status}
          </Badge>
        );
    }
  };

  const activeRegistrations = safeUserRegistrations.filter((reg) => {
    if (reg.contest) {
      return reg.status === "active" && reg.contest;
    } else {
      return reg.status === "active" || reg.status === undefined;
    }
  });

  if (isLoading) {
    return (
      <>
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex flex-col items-start">
                <div className="text-2xl font-display font-bold text-primary tracking-tight">SWING</div>
                <div className="text-xs font-medium text-muted-foreground -mt-1 tracking-wider">Boudoir</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-800 border-gray-300 hidden sm:flex">
                <DollarSign className="w-4 h-4 mr-1" />
                Buy More Votes
              </Button>
              <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-800 border-gray-300 hidden sm:flex">
                <Share className="w-4 h-4 mr-1" />
                Share Profile
              </Button>
              <Button variant="ghost" size="sm" className="sm:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center pt-16">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !modelProfile) {
    return (
      <>
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex flex-col items-start">
                <div className="text-2xl font-display font-bold text-primary tracking-tight">SWING</div>
                <div className="text-xs font-medium text-muted-foreground -mt-1 tracking-wider">Boudoir</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-800 border-gray-300 hidden sm:flex">
                <DollarSign className="w-4 h-4 mr-1" />
                Buy More Votes
              </Button>
              <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-800 border-gray-300 hidden sm:flex">
                <Share className="w-4 h-4 mr-1" />
                Share Profile
              </Button>
              <Button variant="ghost" size="sm" className="sm:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center pt-16">
          <div className="text-center space-y-4">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="text-lg font-semibold text-gray-900">Profile Not Found</h3>
            <p className="text-gray-600">{error || "This profile could not be loaded."}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex flex-col items-start">
              <div className="text-2xl font-display font-bold text-primary tracking-tight">SWING</div>
              <div className="text-xs font-medium text-muted-foreground -mt-1 tracking-wider">Boudoir</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={() => setShowPaidVoteOptions(true)} variant="outline" size="sm" className="text-gray-600 hover:text-gray-800 border-gray-300 hidden sm:flex">
              <DollarSign className="w-4 h-4 mr-1" />
              Buy More Votes
            </Button>
            <Button onClick={shareProfile} variant="outline" size="sm" className="text-gray-600 hover:text-gray-800 border-gray-300 hidden sm:flex">
              <Share className="w-4 h-4 mr-1" />
              Share Profile
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowMobileMenu(!showMobileMenu)} className="sm:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-lg sm:hidden">
          <div className="p-4 space-y-3">
            <Button onClick={handleBuyVotesClick} variant="outline" size="sm" className="w-full text-gray-600 hover:text-gray-800 border-gray-300">
              <DollarSign className="w-4 h-4 mr-2" />
              Buy More Votes
            </Button>
            <Button onClick={shareProfile} variant="outline" size="sm" className="w-full text-gray-600 hover:text-gray-800 border-gray-300">
              <Share className="w-4 h-4 mr-2" />
              Share Profile
            </Button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-16">
        {/* Banner Section - LinkedIn/YouTube style */}
        <div className="relative w-full h-48 md:h-64 bg-gradient-to-r from-blue-400 to-purple-500 overflow-hidden">
          {modelProfile.coverImage?.url ? (
            <img src={modelProfile.coverImage.url} alt="Profile Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
          )}
          {/* Overlay for better text visibility */}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 py-4">
          {/* Profile Section - Positioned over banner */}
          <div className="relative -mt-16 md:-mt-20 text-center mb-6">
            <div className="inline-block">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-lg border-4 border-white bg-white">
                {modelProfile.coverImage?.url ? (
                  <img src={modelProfile.coverImage.url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <User className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-3 mb-2">{username}</h1>

            {/* Stats Display - Compact */}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm inline-block mb-4">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{activeRegistrations.length}</div>
                  <div className="text-xs text-gray-600">Active Contests</div>
                </div>
              </div>
            </div>

            {/* Bio if available */}
            {modelProfile.bio && <p className="text-sm text-gray-600 mb-4 max-w-xl mx-auto">{modelProfile.bio}</p>}
          </div>

          {/* Active Competitions Section */}
          <div className="mb-24">
            <div className="text-center mb-6">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <h2 className="text-xl font-bold text-gray-900 mb-1">Active Competitions</h2>
              <p className="text-sm text-gray-600">See what {username} is competing in right now</p>
            </div>

            {activeRegistrations.length > 0 ? (
              <div className="space-y-6">
                {activeRegistrations.map((registration) => (
                  <Card key={registration.id} className="border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="flex flex-col lg:flex-row">
                        {/* Contest Photo */}
                        <div className="lg:w-2/5 rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none overflow-hidden bg-gray-50">
                          {registration.coverImage ? (
                            <img src={registration.coverImage} alt="Contest Photo" className="w-full h-48 lg:h-56 object-cover" />
                          ) : (
                            <div className="w-full h-48 lg:h-56 flex items-center justify-center">
                              <ImageIcon className="w-12 h-12 text-gray-300" />
                            </div>
                          )}
                        </div>

                        {/* Contest Info */}
                        <div className="lg:w-3/5 p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-bold text-gray-900">{registration.contest?.name || "Contest"}</h3>
                            <Badge className="bg-green-100 text-green-800 px-2 py-1 text-xs">Active</Badge>
                          </div>

                          {registration.contest?.description && <p className="text-gray-600 mb-4 text-sm leading-relaxed">{registration.contest.description}</p>}

                          <div className="grid md:grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center space-x-2">
                              <Gift className="w-4 h-4 text-green-600" />
                              <div>
                                <span className="text-xs text-gray-500">Prize Pool</span>
                                <div className="font-semibold text-green-600 text-sm">
                                  {registration.contest?.prizePool ? formatUsdAbbrev(registration.contest.prizePool) : "-"}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <div>
                                <span className="text-xs text-gray-500">Ends</span>
                                <div className="font-semibold text-sm">{registration.contest?.endDate ? formatDate(registration.contest.endDate) : "-"}</div>
                              </div>
                            </div>
                          </div>

                          {/* Countdown Timer */}
                          {registration.contest?.endDate && timeLeft[registration.contestId] && (
                            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-3">
                              <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <Clock className="w-4 h-4 text-orange-600 mr-1" />
                                  <span className="font-medium text-orange-800 text-sm">Time Remaining</span>
                                </div>
                                <div className="text-lg font-bold text-orange-600">{timeLeft[registration.contestId]}</div>
                              </div>
                            </div>
                          )}

                          {/* Registration Details */}
                          <div className="mt-4 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Registered: {formatDate(registration.registrationDate)}</span>
                              <span className="capitalize">{registration.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="shadow-sm">
                <CardContent className="text-center py-12">
                  <Trophy className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Competitions</h3>
                  <p className="text-gray-600 mb-4 max-w-md mx-auto text-sm">{username} hasn't joined any competitions yet. Check back soon for exciting opportunities!</p>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 inline-block">
                    <p className="text-sm text-gray-500">
                      <strong>Tip:</strong> Competitions will appear here once {username} joins them.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Voting Section - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
              {/* Vote Info */}
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
                <div className="text-sm text-gray-600">Show your support for {username}</div>
              </div>

              {/* Voting Button */}
              <div className="flex flex-col items-center space-y-2">
                <Button
                  onClick={canVote() ? handleVote : handleBuyVotesClick}
                  className={`w-full sm:w-auto px-6 py-2 rounded-lg font-medium text-sm ${
                    canVote() ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  {canVote() ? `Vote for ${username}` : "Buy More Votes"}
                </Button>

                {/* Free Vote Timer */}
                {timeUntilNextVote && (
                  <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>Free vote in: {timeUntilNextVote}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Paid Voting Options Modal */}
        {showPaidVoteOptions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
              <button onClick={() => setShowPaidVoteOptions(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">
                ×
              </button>

              <div className="text-center mb-8">
                <Heart className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Boost Your Votes!</h3>
                <p className="text-gray-600">Choose a package to support {username} with more votes</p>
              </div>

              <div className="space-y-4 mb-8">
                {PAID_VOTE_PACKAGES.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all duration-200 cursor-pointer hover:shadow-lg"
                    onClick={() => handlePaidVoteSuccess(pkg.votes)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-gray-800 text-xl mb-1">{pkg.name}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600">{pkg.votes} votes</span>
                          {pkg.savings && <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">{pkg.savings}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900">${pkg.price}</div>
                        <div className="text-xs text-gray-500">One-time</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" onClick={() => setShowPaidVoteOptions(false)} className="w-full py-3 text-lg">
                Maybe Later
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
