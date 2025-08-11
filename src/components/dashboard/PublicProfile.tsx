import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Users, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Share2,
  AlertCircle,
  Eye,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { apiRequest } from '@/lib/api';
import { useCompetitions } from '@/hooks/useCompetitions';
import { Competition as CompetitionType } from '@/types/competitions.types';
import { formatUsdAbbrev } from '@/lib/utils';

interface UserProfile {
  id: string;
  name: string;
  bio: string;
  modelId: string;
  profileImage?: string;
  votingImage?: string;
  hobbies?: string;
  paidVoterMessage?: string;
  freeVoterMessage?: string;
  portfolioPhotos?: string[];
  createdAt: string;
  updatedAt: string;
}

interface UserStats {
  totalVotes: number;
  ranking: number;
  totalParticipants: number;
  votesNeededForFirst: number;
  totalCompetitions: number;
  activeCompetitions: number;
  completedCompetitions: number;
  totalEarnings: number;
}

// Joined contests are read from useCompetitions()

export function PublicProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const { joinedCompetitions, isLoadingJoined } = useCompetitions();

  const fetchUserData = useCallback(async () => {
    try {
      setError(null);

      const token = localStorage.getItem('token');
      
      // Fetch user profile
      const profileResponse = await apiRequest(`/api/v1/users/${user?.id}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (profileResponse.success) {
        const profileData = profileResponse.data;
        setUserProfile(profileData);
      }

      // Fetch user stats
      const statsResponse = await apiRequest(`/api/v1/users/${user?.id}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (statsResponse.success) {
        const statsData = statsResponse.data;
        setUserStats(statsData);
      }

      // Joined contests are loaded via useCompetitions()

    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load profile data');
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.username) {
      fetchUserData();
    }
  }, [user?.username, fetchUserData]);

  // Countdown timer for joined contests
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft: { [key: string]: string } = {};
      
      (joinedCompetitions || []).forEach((competition: CompetitionType) => {
        const now = new Date().getTime();
        const end = new Date(competition.endDate).getTime();
        const difference = end - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          
          newTimeLeft[competition.id] = `${days.toString().padStart(2, '0')} : ${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
        } else {
          newTimeLeft[competition.id] = "Ended";
        }
      });
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [joinedCompetitions]);

  const shareProfile = async () => {
    try {
      const profileUrl = `${window.location.origin}/profile/${user?.username}`;
      await navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Profile link copied!",
        description: "Share this link with your supporters to get more votes.",
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
      toast({
        title: "Error sharing profile",
        description: "Failed to copy profile link to clipboard.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCompetitionStatus = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Active', color: 'bg-green-500' };
      case 'coming-soon':
        return { label: 'Coming Soon', color: 'bg-blue-500' };
      case 'ended':
        return { label: 'Ended', color: 'bg-gray-500' };
      default:
        return { label: 'Unknown', color: 'bg-gray-500' };
    }
  };

  const computeStatusForContest = (contest: CompetitionType): 'active' | 'coming-soon' | 'ended' => {
    const now = new Date();
    const start = new Date(contest.startDate);
    const end = new Date(contest.endDate);
    if (now < start) return 'coming-soon';
    if (now > end) return 'ended';
    return 'active';
  };

  // Show error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Public Profile</h1>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Error loading profile</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchUserData} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Public Profile</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your public profile and track progress
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link 
            to={`/profile/${user?.username}`}
            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs"
          >
            <Eye className="mr-1.5 h-3 w-3" />
            View Profile
          </Link>
        </div>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              {userProfile?.profileImage ? (
                <img 
                  src={userProfile.profileImage} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-primary">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold">{user?.name || 'User'}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{userProfile?.bio || 'No bio available'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{userStats?.totalVotes || 0}</div>
              <div className="text-xs text-muted-foreground">Total Votes</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">#{userStats?.ranking || 0}</div>
              <div className="text-xs text-muted-foreground">Current Rank</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{joinedCompetitions?.length || 0}</div>
              <div className="text-xs text-muted-foreground">Registered</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share URL */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm mb-0.5">Your Profile URL</h3>
              <p className="text-xs text-muted-foreground">
                Share this link to get more votes
              </p>
            </div>
            <Button onClick={shareProfile} variant="outline" size="sm" className="text-xs px-3 py-1.5">
              <Share2 className="mr-1.5 h-3 w-3" />
              Copy
            </Button>
          </div>
          <div className="bg-muted p-2 rounded-md mt-2">
            <code className="text-xs break-all">{window.location.origin}/profile/{user?.username}</code>
          </div>
        </CardContent>
      </Card>

      {/* Joined Contests */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm">Joined Contests</h3>
              <p className="text-xs text-muted-foreground">
                {joinedCompetitions?.length || 0} joined
              </p>
            </div>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </div>
          
          {isLoadingJoined ? (
            <div className="text-center py-6 text-sm text-muted-foreground">Loading...</div>
          ) : (joinedCompetitions?.length || 0) === 0 ? (
            <div className="text-center py-6">
              <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No competitions registered</p>
              <p className="text-xs text-muted-foreground mt-1">
                Register for competitions to start participating
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Registered Active Competitions */}
              {(joinedCompetitions || [])
                .filter((comp: CompetitionType) => computeStatusForContest(comp) === 'active')
                .map((competition: CompetitionType) => (
                  <div key={competition.id} className="border rounded-md p-3 bg-green-50">
                    <div className="flex items-center justify-between mb-1.5">
                      <h5 className="font-medium text-xs">{competition.name}</h5>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1.5">Prize Pool: {formatUsdAbbrev(competition.prizePool)}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>{timeLeft[competition.id] || "Loading..."}</span>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Registered Coming Soon Competitions */}
              {(joinedCompetitions || [])
                .filter((comp: CompetitionType) => computeStatusForContest(comp) === 'coming-soon')
                .map((competition: CompetitionType) => (
                  <div key={competition.id} className="border rounded-md p-3 bg-blue-50">
                    <div className="flex items-center justify-between mb-1.5">
                      <h5 className="font-medium text-xs">{competition.name}</h5>
                      <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800">
                        Coming Soon
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1.5">Starts {formatDate(competition.startDate)}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>{timeLeft[competition.id] || "Loading..."}</span>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Registered Ended Competitions */}
              {(joinedCompetitions || [])
                .filter((comp: CompetitionType) => computeStatusForContest(comp) === 'ended')
                .map((competition: CompetitionType) => (
                  <div key={competition.id} className="border rounded-md p-3 bg-gray-50">
                    <div className="flex items-center justify-between mb-1.5">
                      <h5 className="font-medium text-xs">{competition.name}</h5>
                      <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-gray-100 text-gray-800">
                        Ended
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1.5">Ended {formatDate(competition.endDate)}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>Ended</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}