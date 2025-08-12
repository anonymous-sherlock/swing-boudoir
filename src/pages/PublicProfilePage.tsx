import { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share, Star, User, Trophy, Calendar, Users, AlertCircle, Image as ImageIcon, Heart, Clock, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/api";
import { PaidVotingModal }  from '@/components/dashboard/PaidVotingModal';

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
  coverImage: ProfileImage;
  profilePhotos: Array<ProfileImage>;
}

interface Competition {
  id: string;
  title: string;
  description?: string;
  prize?: string;
  endDate?: string;
  participants?: number;
  status: 'active' | 'inactive' | 'completed' | 'coming-soon' | 'ended';
  coverImage?: string;
  category?: string;
  location?: string;
  perks?: string[];
}

interface UserRegistration {
  id: string;
  contestId: string;
  coverImage?: string; // The uploaded contest photo
  contest?: Competition;
  userId: string;
  status: 'active' | 'withdrawn';
  registrationDate: string;
  currentVotes?: number;
  ranking?: number;
}

export default function PublicProfilePage() {
  const { modelId } = useParams<{ modelId: string }>();
  const [modelProfile, setModelProfile] = useState<Profile | null>(null);
  const [userRegistrations, setUserRegistrations] = useState<UserRegistration[]>([]);
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});
  const [userVotes, setUserVotes] = useState(0);
  const [lastVoteTime, setLastVoteTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaidVotingModal, setShowPaidVotingModal] = useState(false);
  const [timeUntilNextVote, setTimeUntilNextVote] = useState<string>('');
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load model profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (user?.username) {
        try {
        const profile = await getModelData(user.username);
        setModelProfile(profile);
        } catch (err) {
          console.error('Error loading profile:', err);
          setError('Failed to load profile data');
        }
      }
    };
    loadProfile();
  }, [user?.username]);

  // Load user's joined competitions
  useEffect(() => {
    const loadUserRegistrations = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        console.log('Loading user registrations for profile page, user:', user.id);
        
        const response = await apiRequest(`/contest/${user.id}/joined`, {
          method: 'GET',
          requireAuth: true
        });

        console.log('Profile page - User registrations API response:', response);

        if (response.success && response.data) {
          // The API returns an array of joined contests with coverImage
          setUserRegistrations(response.data);
          console.log('Profile page - Loaded user registrations:', response.data);
        } else if (response.error?.includes('404')) {
          setUserRegistrations([]);
          setError(null);
        } else {
          console.error('Failed to load user registrations:', response.error);
          setError('Failed to load competition data');
        }
      } catch (err) {
        console.error('Error loading user registrations:', err);
        setError('Network error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserRegistrations();
  }, [user?.id]);

  // Countdown timer for competitions
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft: { [key: string]: string } = {};
      
      userRegistrations.forEach(reg => {
        if (reg.contest?.endDate) {
          const now = new Date().getTime();
          const end = new Date(reg.contest.endDate).getTime();
          const difference = end - now;

          if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            newTimeLeft[reg.contestId] = `${days.toString().padStart(2, '0')} : ${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
          } else {
            newTimeLeft[reg.contestId] = "Ended";
          }
        }
      });
      
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [userRegistrations]);

  // Timer for next free vote
  useEffect(() => {
    const timer = setInterval(() => {
      if (lastVoteTime) {
        const now = new Date();
        const timeDiff = 24 * 60 * 60 * 1000 - (now.getTime() - lastVoteTime.getTime());
        
        if (timeDiff > 0) {
          const hours = Math.floor(timeDiff / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
          setTimeUntilNextVote(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeUntilNextVote('');
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastVoteTime]);

  // if (!user) return <Navigate to="/login" replace />;

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
        description: `Your vote for ${user.name} has been counted successfully. You can vote again in 24 hours.`,
      });
    } else {
      // Show paid voting modal instead of error
      setShowPaidVotingModal(true);
    }
  };

  const handlePaidVoteSuccess = (votes: number) => {
    setUserVotes((prev) => prev + votes);
    toast({
      title: "Paid Votes Added!",
      description: `You've successfully added ${votes} votes for ${user.name}!`,
    });
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
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const activeRegistrations = userRegistrations.filter(reg => 
    reg.status === 'active' && reg.contest
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Minimal Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 py-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="text-lg font-semibold text-gray-800">Swing Boudoir</div>
          <Button onClick={shareProfile} variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
            <Share className="w-4 h-4 mr-1" />
            Share
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Compact Profile Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm">
            <img
              src={user?.image || "https://images.unsplash.com/photo-1494790108755-2616b67661ed?w=400&h=400&fit=crop&crop=face"}
                alt={user?.name}
                className="w-full h-full object-cover"
            />
            </div>
            <div>
            <h1 className="text-xl font-semibold text-gray-900">{user.name}</h1>
            <p className="text-sm text-gray-600">{modelProfile?.bio}</p>
            </div>
        </div>

        {/* Main Content - Compact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Model Photo */}
          <div>
            <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-sm bg-white">
              <img
                src={user.image || "https://images.unsplash.com/photo-1494790108755-2616b67661ed?w=400&h=400&fit=crop&crop=face"}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column - Competition Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900 mb-3">My Competitions</h2>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Loading...</p>
                            </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-8 w-8 text-red-400 mb-2" />
                <p className="text-sm text-gray-500 mb-3">{error}</p>
                <Button size="sm" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
                        </div>
            ) : userRegistrations.length > 0 ? (
              userRegistrations.map((registration) => (
                <Card key={registration.id} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex gap-4 items-center">
                    {/* Contest Photo */}
                    <div className="w-20 h-24 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                      {registration.coverImage ? (
                        <img
                          src={registration.coverImage}
                          alt="Contest Photo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-300" />
                      )}
                      </div>
                    {/* Contest Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {registration.contest?.title || 'Contest'}
                      </h3>
                      <p className="text-xs text-gray-600 mb-1">
                        {registration.contest?.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Prize: {registration.contest?.prize || '-'}</span>
                        <span>Ends: {registration.contest?.endDate ? formatDate(registration.contest.endDate) : '-'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 bg-white rounded-lg border border-gray-100">
                <Trophy className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">No Competitions Yet</h3>
                <p className="text-xs text-gray-500 mb-3">
                  {user.name} hasn't joined any competitions yet.
                </p>
                <Button 
                  size="sm"
                  onClick={() => navigate('/dashboard/competitions')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Browse Competitions
                </Button>
                  </div>
            )}
          </div>
        </div>

        {/* Fixed Voting Section - Same position and style */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 shadow-lg">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
                <span className="font-medium">{userVotes}</span> votes cast for {user.name}
              </div>
              {timeUntilNextVote && (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>Next free vote in: {timeUntilNextVote}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {!canVote() && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowPaidVotingModal(true)}
                  className="text-xs"
                >
                  <Gift className="w-3 h-3 mr-1" />
                  Buy More Votes
                </Button>
              )}
            <Button
              onClick={handleVote}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium text-sm"
              disabled={!canVote()}
            >
                <Heart className="w-4 h-4 mr-1" />
              Vote for {user.name}
            </Button>
          </div>
        </div>
        </div>

        {/* Paid Voting Modal */}
        <PaidVotingModal
          isOpen={showPaidVotingModal}
          onClose={() => setShowPaidVotingModal(false)}
          modelName={user.name}
          modelId={user.id}
        />
      </div>
    </div>
  );
}
