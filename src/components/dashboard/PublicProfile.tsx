import React, { useState, useEffect } from 'react';
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

interface CompetitionRegistration {
  id: string;
  competitionId: string;
  competitionName: string;
  competitionStatus: 'active' | 'coming-soon' | 'ended';
  registrationDate: string;
  votes: number;
  rank: number;
  totalParticipants: number;
  endDate: string;
  prize: string;
}

export function PublicProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [competitions, setCompetitions] = useState<CompetitionRegistration[]>([]);
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id]);

  // Countdown timer for competitions
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft: { [key: string]: string } = {};
      
      competitions.forEach(competition => {
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
  }, [competitions]);

  const fetchUserData = async () => {
    try {
      setError(null);

      const token = localStorage.getItem('token');
      
      // Fetch user profile
      const profileResponse = await fetch(`/api/v1/users/${user?.id}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setUserProfile(profileData);
      }

      // Fetch user stats
      const statsResponse = await fetch(`/api/v1/users/${user?.id}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setUserStats(statsData);
      }

      // Fetch competition registrations
      const competitionsResponse = await fetch(`/api/v1/users/${user?.id}/competitions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (competitionsResponse.ok) {
        const competitionsData = await competitionsResponse.json();
        setCompetitions(competitionsData.competitions || []);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load profile data');
    }
  };

  const shareProfile = async () => {
    try {
      const profileUrl = `${window.location.origin}/profile/${user?.id}`;
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
            to={`/profile/${user?.id}`}
            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs"
          >
            <Eye className="mr-1.5 h-3 w-3" />
            View Profile
          </Link>
          <Button onClick={shareProfile} variant="outline" size="sm" className="text-xs px-3 py-1.5">
            <Share2 className="mr-1.5 h-3 w-3" />
            Share
          </Button>
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
              <div className="text-lg font-bold text-primary">{competitions.length}</div>
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
            <code className="text-xs break-all">{window.location.origin}/profile/{user?.id}</code>
          </div>
        </CardContent>
      </Card>

      {/* Registered Competitions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm">Your Competitions</h3>
              <p className="text-xs text-muted-foreground">
                {competitions.length} registered competitions
              </p>
            </div>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </div>
          
          {competitions.length === 0 ? (
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
              {competitions
                .filter(comp => comp.competitionStatus === 'active')
                .map((competition) => (
                  <div key={competition.id} className="border rounded-md p-3 bg-green-50">
                    <div className="flex items-center justify-between mb-1.5">
                      <h5 className="font-medium text-xs">{competition.competitionName}</h5>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-green-100 text-green-800">
                          Active
                        </Badge>
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                          Rank #{competition.rank || 'N/A'}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1.5">{competition.prize}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>{timeLeft[competition.id] || "Loading..."}</span>
                      </div>
                      <div className="flex items-center">
                        <Trophy className="mr-1 h-3 w-3" />
                        <span>{competition.votes || 0} votes</span>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Registered Coming Soon Competitions */}
              {competitions
                .filter(comp => comp.competitionStatus === 'coming-soon')
                .map((competition) => (
                  <div key={competition.id} className="border rounded-md p-3 bg-blue-50">
                    <div className="flex items-center justify-between mb-1.5">
                      <h5 className="font-medium text-xs">{competition.competitionName}</h5>
                      <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800">
                        Coming Soon
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1.5">{competition.prize}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>{timeLeft[competition.id] || "Loading..."}</span>
                      </div>
                      <div className="flex items-center">
                        <Trophy className="mr-1 h-3 w-3" />
                        <span>0 votes</span>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Registered Ended Competitions */}
              {competitions
                .filter(comp => comp.competitionStatus === 'ended')
                .map((competition) => (
                  <div key={competition.id} className="border rounded-md p-3 bg-gray-50">
                    <div className="flex items-center justify-between mb-1.5">
                      <h5 className="font-medium text-xs">{competition.competitionName}</h5>
                      <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-gray-100 text-gray-800">
                        Ended
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1.5">{competition.prize}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>Ended</span>
                      </div>
                      <div className="flex items-center">
                        <Trophy className="mr-1 h-3 w-3" />
                        <span>{competition.votes || 0} votes</span>
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