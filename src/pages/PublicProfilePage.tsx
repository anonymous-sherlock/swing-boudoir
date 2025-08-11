import { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share, Star, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCompetitions } from "@/hooks/useCompetitions";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/api";

// Mock data - In real app, this would come from API based on modelId
const getModelData = async (username: string) => {
  const response = await apiRequest(`/api/v1/profile/username/${username}`, {
    method: "GET",
  });
  if (response.success) return response.data;
  return null;
};

interface ProfileImage {
  id: string;
  key: string;
  caption: string | null;
  url: string;
}
interface Profile {
  id: string;
  userId: string;
  bio?: string;
  avatarUrl?: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  dateOfBirth: string;
  gender: string;
  hobbiesAndPassions: string;
  paidVoterMessage: string;
  freeVoterMessage: string;
  createdAt: string;
  updatedAt: string;
  lastFreeVoteAt: string;
  coverImageId: string;
  coverImage : ProfileImage
  profilePhotos : Array<ProfileImage>
}

export default function PublicProfilePage() {
  const { modelId } = useParams<{ modelId: string }>();
  const [modelProfile, setModelProfile] = useState<Profile | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});
  const [userVotes, setUserVotes] = useState(0);
  const [lastVoteTime, setLastVoteTime] = useState<Date | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get competitions from localStorage using useCompetitions hook
  // const {
  //   modelRegistrations = [],
  //   getActiveCompetitions
  // } = useCompetitions();

  // Load model profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (user?.username) {
        const profile = await getModelData(user.username);
        setModelProfile(profile);
      }
    };
    loadProfile();
  }, [user?.username]);

  if (!user) return <Navigate to="/login" replace />;

  // Default profile data if not loaded yet
  if (!modelProfile) {
    return <Navigate to="/" replace />;
  }

  // Get competitions this model is registered for
  // const activeCompetitions = getActiveCompetitions();

  // Get actual competition data for registered competitions
  // const modelCompetitions = modelRegistrations.map(registration => {
  //   const competition = activeCompetitions.find(comp => comp.id === registration.competitionId);
  //   if (!competition) return null;

  //   return {
  //     id: competition.id,
  //     name: competition.name || 'Competition',
  //     endDate: new Date(competition.endDate),
  //     prize: competition.prize || '$0',
  //     location: competition.location || 'TBD',
  //     perks: competition.perks || [],
  //     currentVotes: registration.currentVotes || 0,
  //     ranking: registration.ranking || 0,
  //     status: competition.status || 'active'
  //   };
  // }).filter(Boolean);

  // Countdown timer using real competition end dates
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     const newTimeLeft: { [key: string]: string } = {};
  //     modelCompetitions.forEach(comp => {
  //       if (!comp) return;

  //       const now = new Date().getTime();
  //       const end = comp.endDate.getTime();
  //       const difference = end - now;

  //       if (difference > 0) {
  //         const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  //         const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  //         const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  //         const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  //         newTimeLeft[comp.id] = `${days.toString().padStart(2, '0')} : ${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
  //       } else {
  //         newTimeLeft[comp.id] =Ended";
  //       }
  //     });
  //     setTimeLeft(newTimeLeft);
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, [modelCompetitions]);

  const canVote = () => {
    if (!lastVoteTime) return true;
    const now = new Date();
    const hoursSinceLastVote =
      (now.getTime() - lastVoteTime.getTime()) / (1000 * 60 * 60);
    return hoursSinceLastVote >= 24;
  };

  const handleVote = async () => {
    if (canVote()) {
      setUserVotes((prev) => prev + 1);
      setLastVoteTime(new Date());
      toast({
        title: "Vote Submitted!",
        description: `Your vote for ${user.name} has been counted successfully.`,
      });
    } else {
      toast({
        title: "Vote Limit Reached",
        description: "You must wait 24 hours to vote again.",
        variant: "destructive",
      });
    }
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
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-black text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="text-xl font-bold">Swing Boudoir</div>
          <div className="flex items-center space-x-4 text-sm">
            {/* <button onClick={() => navigate("/dashboard")} className="hover:text-gray-300">Model Dashboard</button> */}
            {/* <button onClick={() => navigate("/vip")} className="hover:text-gray-300">Maxim VIP Dashboard</button> */}
          </div>
        </div>
      </header>

      {/* Alert Banner */}
      <div className="bg-gray-100 border-b border-gray-200 py-3">
        <div className="container mx-auto px-4 flex items-center">
          <Star className="w-4 h-4 mr-2 text-yellow-500" />
          <span className="text-sm">
            {user?.name} is in Swing Boudior Next! The Next magazine tells us
            which models inspire readers most. Buy {user?.name}'s editions to
            give her more (10+) votes and help us decide who belongs in Maxim
            magazine.
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              <img
                src={
                  user.image ||
                  "https://images.unsplash.com/photo-1494790108755-2616b67661ed?w=400&h=400&fit=crop&crop=face"
                }
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600 mt-1">{modelProfile?.bio}</p>
            </div>
          </div>
          <Button onClick={shareProfile} variant="outline" size="sm">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Model Photo */}
          <div className="space-y-6">
            <div className="aspect-[3/4] rounded-lg overflow-hidden">
              <img
                src={
                  user.image ||
                  "https://images.unsplash.com/photo-1494790108755-2616b67661ed?w=400&h=400&fit=crop&crop=face"
                }
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column - Competition Details */}
          <div className="space-y-6">
            {useCompetitions.length > 0 ? (
              useCompetitions.map((competition) => (
                <Card key={competition.id} className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {competition.name}
                      </h2>
                      <div className="text-2xl font-bold text-green-600 mb-3">
                        {competition.prize}
                      </div>
                    </div>

                    {/* Perks */}
                    {competition.perks && competition.perks.length > 0 && (
                      <div className="bg-gray-900 text-white p-4 rounded-lg mb-4">
                        <div className="space-y-2">
                          {competition.perks.map((perk, index) => (
                            <div
                              key={index}
                              className="flex items-center text-sm"
                            >
                              <span className="mr-2">•</span>
                              {perk}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Competition Info */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Section 1</span>
                        <button className="text-sm text-blue-600 hover:underline">
                          See all rounds
                        </button>
                      </div>

                      <div className="text-sm text-gray-600">
                        Rankings will be revealed after the cut off time on{" "}
                        {competition.endDate.toLocaleDateString()}
                      </div>

                      {/* Timer */}
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">
                          Round ends:
                        </div>
                        <div className="text-2xl font-mono font-bold text-gray-900">
                          {timeLeft[competition.id] || "Loading..."}
                        </div>
                        <div className="flex justify-center space-x-8 text-xs text-gray-500 mt-1">
                          <span>Days</span>
                          <span>Hour</span>
                          <span>Min</span>
                          <span>Sec</span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 text-center">
                        This entry is pausing and will not start the next round
                        automatically.
                      </div>
                    </div>

                    {/* SWEEPSTAKES Banner */}
                    <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-4">
                      <div className="text-center">
                        <div className="font-bold text-yellow-800 mb-1">
                          SWEEPSTAKES ACTIVE!
                        </div>
                        <div className="text-sm text-yellow-700">
                          Your voters can win $5K while supporting you
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border border-gray-200">
                <CardContent className="p-6 text-center">
                  <div className="text-gray-500 mb-4">
                    <Star className="w-12 h-12 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold mb-2">
                      No Competitions Yet
                    </h3>
                    <p className="text-sm">
                      {user.name} hasn't registered for any competitions yet.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer Voting Section */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-200 py-4">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              You have cast {userVotes} votes for {user.name}
            </div>
            <Button
              onClick={handleVote}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-lg font-medium"
              disabled={!canVote()}
            >
              Vote for {user.name}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
