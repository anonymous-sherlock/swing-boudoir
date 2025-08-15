import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Users, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Share2,
  AlertCircle,
  Eye,
  Clock,
  RefreshCw,
  Gift,
  User,
  Edit,
  Image,
  Camera
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "@tanstack/react-router";
import { apiRequest } from '@/lib/api';
import { useCompetitions } from '@/hooks/useCompetitions';
import { Competition as CompetitionType, Award } from '@/types/competitions.types';
import { formatUsdAbbrev } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

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

export function PublicProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [profilePhotos, setProfilePhotos] = useState<string[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
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

    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load profile data');
    }
  }, [user?.id]);

  const fetchProfilePhotos = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoadingPhotos(true);
    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest(`/api/v1/users/${user.id}/profile/photos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.success && response.data) {
        setProfilePhotos(response.data.map((photo: { url: string }) => photo.url));
      }
    } catch (error) {
      console.error('Error fetching profile photos:', error);
    } finally {
      setIsLoadingPhotos(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.username) {
      fetchUserData();
      fetchProfilePhotos();
    }
  }, [user?.username, fetchUserData, fetchProfilePhotos]);

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

  const computeStatusForContest = (contest: CompetitionType): 'active' | 'coming-soon' | 'ended' => {
    const now = new Date();
    const start = new Date(contest.startDate);
    const end = new Date(contest.endDate);
    if (now < start) return 'coming-soon';
    if (now > end) return 'ended';
    return 'active';
  };

  const getStatusBadge = (status: "active" | "coming-soon" | "ended") => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1 font-medium">Live</Badge>;
      case "ended":
        return <Badge variant="secondary" className="text-xs px-2 py-1 font-medium">Completed</Badge>;
      case "coming-soon":
        return <Badge variant="outline" className="text-xs px-2 py-1 font-medium border-gray-300 text-gray-600">Upcoming</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs px-2 py-1 font-medium">{status}</Badge>;
    }
  };

  const activeCompetitions = (joinedCompetitions || []).filter(comp => computeStatusForContest(comp) === 'active');
  const comingSoonCompetitions = (joinedCompetitions || []).filter(comp => computeStatusForContest(comp) === 'coming-soon');
  const endedCompetitions = (joinedCompetitions || []).filter(comp => computeStatusForContest(comp) === 'ended');

  // Show error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-1">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Error loading profile</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchUserData} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:p-4">
      {/* Header Section with Profile Card */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
            {/* Profile Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-gray-200">
                {userProfile?.profileImage ? (
                  <img 
                    src={userProfile.profileImage} 
                    alt="Profile" 
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <span className="text-2xl sm:text-3xl font-bold text-gray-600">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <div className="text-center sm:text-left space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{user?.name || 'User'}</h1>
                <p className="text-gray-600 text-sm sm:text-base max-w-md leading-relaxed">{userProfile?.bio || 'Welcome to my profile'}</p>
                {userProfile?.hobbies && (
                  <p className="text-gray-500 text-sm">{userProfile.hobbies}</p>
                )}
                <div className="flex items-center justify-center sm:justify-start space-x-4 text-sm text-gray-500">
                  <span>Member since {formatDate(userProfile?.createdAt || '')}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <Link 
                to="/dashboard/edit-profile"
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-gray-700 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
              <Button onClick={shareProfile} variant="outline" size="sm" className="w-full sm:w-auto">
                <Share2 className="mr-2 h-4 w-4" />
                Share Profile
              </Button>
              <Link 
                to={`/profile/${user?.username}`}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-all duration-200"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Public
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg sm:text-xl text-gray-800">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            </div>
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">#{userStats?.ranking || 0}</p>
                  <p className="text-gray-600 text-sm font-medium">Current Rank</p>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{joinedCompetitions?.length || 0}</p>
                  <p className="text-gray-600 text-sm font-medium">Competitions</p>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{formatUsdAbbrev(userStats?.totalEarnings || 0)}</p>
                  <p className="text-gray-600 text-sm font-medium">Total Earnings</p>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Gift className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{activeCompetitions.length}</p>
                  <p className="text-gray-600 text-sm font-medium">Active Now</p>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="competitions" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12">
          <TabsTrigger value="competitions" className="flex items-center space-x-2 text-sm font-medium">
            <Trophy className="h-4 w-4" />
            <span>My Competitions</span>
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex items-center space-x-2 text-sm font-medium">
            <Camera className="h-4 w-4" />
            <span>Photo Gallery</span>
          </TabsTrigger>
        </TabsList>

        {/* Competitions Tab */}
        <TabsContent value="competitions" className="space-y-6">
          {isLoadingJoined ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <RefreshCw className="h-8 w-8 text-gray-600 animate-spin" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">Loading competitions</h3>
                  <p className="text-gray-600">Getting everything ready...</p>
                </div>
              </div>
            </div>
          ) : (joinedCompetitions?.length || 0) === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="text-center p-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Compete?</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                  You haven't joined any competitions yet. Start your journey and showcase your talents!
                </p>
                <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 font-medium rounded-lg">
                  Explore Competitions
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Active Competitions */}
              {activeCompetitions.length > 0 && (
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <CardTitle className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xl font-bold text-gray-800">Active Competitions</span>
                      </CardTitle>
                      <Badge className="bg-gray-100 text-gray-700 text-sm px-3 py-1 w-fit">
                        {activeCompetitions.length} Live Now
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-6">
                      {activeCompetitions.map((competition: CompetitionType) => (
                        <Card key={competition.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                              <div className="flex-1 space-y-4">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                    <Trophy className="mr-2 h-5 w-5 text-gray-600" />
                                    {competition.name}
                                  </h3>
                                  {getStatusBadge('active')}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <p className="text-gray-900 font-semibold">{formatUsdAbbrev(competition.prizePool)} Prize Pool</p>
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Clock className="mr-1 h-4 w-4" />
                                      <span className="font-mono font-bold">
                                        {timeLeft[competition.id] || "Loading..."}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="text-sm">
                                      <span className="font-medium text-gray-700">Awards Available:</span>
                                      <div className="mt-1 flex flex-wrap gap-1">
                                        {competition.awards && competition.awards.slice(0, 2).map((award: Award) => (
                                          <Badge key={award.id} variant="outline" className="text-xs">
                                            {award.icon} {award.name}
                                          </Badge>
                                        ))}
                                        {competition.awards && competition.awards.length > 2 && (
                                          <Badge variant="outline" className="text-xs">
                                            +{competition.awards.length - 2} more
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                  <Button variant="outline" onClick={shareProfile}>
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share Profile
                                  </Button>
                                  <Button variant="outline" asChild>
                                    <Link to={`/competition/${competition.id}`}>View Competition</Link>
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="w-full lg:w-80">
                                {competition.images && competition.images[0] ? (
                                  <img 
                                    src={competition.images[0].url} 
                                    alt={competition.name} 
                                    className="w-full aspect-video object-cover rounded-lg shadow-sm border border-gray-200" 
                                  />
                                ) : (
                                  <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                    <Trophy className="h-12 w-12 text-gray-400" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Upcoming and Completed in a grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Upcoming Competitions */}
                {comingSoonCompetitions.length > 0 && (
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="text-lg font-bold text-gray-800">Upcoming</span>
                        <Badge variant="secondary" className="text-xs">
                          {comingSoonCompetitions.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {comingSoonCompetitions.slice(0, 3).map((competition: CompetitionType) => (
                        <div key={competition.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 text-sm">{competition.name}</h4>
                            {getStatusBadge('coming-soon')}
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{formatUsdAbbrev(competition.prizePool)} Prize</p>
                          <p className="text-xs text-gray-600 font-medium">
                            Starts {formatDistanceToNow(new Date(competition.startDate), { addSuffix: true })}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Completed Competitions */}
                {endedCompetitions.length > 0 && (
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="text-lg font-bold text-gray-800">Completed</span>
                        <Badge variant="secondary" className="text-xs">
                          {endedCompetitions.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {endedCompetitions.slice(0, 3).map((competition: CompetitionType) => (
                        <div key={competition.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 text-sm">{competition.name}</h4>
                            {getStatusBadge('ended')}
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{formatUsdAbbrev(competition.prizePool)} Prize</p>
                          <p className="text-xs text-gray-600">
                            Ended {formatDistanceToNow(new Date(competition.endDate), { addSuffix: true })}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Photo Gallery Tab */}
        <TabsContent value="gallery" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Camera className="h-4 w-4 text-gray-600" />
                  </div>
                  <span className="text-xl font-bold text-gray-800">Photo Gallery</span>
                </div>
                <Link 
                  to="/dashboard/edit-profile"
                  className="text-sm text-gray-600 hover:text-gray-700 flex items-center"
                >
                  <Edit className="mr-1 h-4 w-4" />
                  Manage Photos
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingPhotos ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <RefreshCw className="h-8 w-8 text-gray-600 animate-spin" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">Loading photos...</h3>
                      <p className="text-gray-600">Getting your portfolio ready...</p>
                    </div>
                  </div>
                </div>
              ) : profilePhotos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {profilePhotos.map((photo, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={photo}
                        alt={`Portfolio photo ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
                        onError={(e) => {
                          console.error('Failed to load photo:', e);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button variant="outline" size="sm" className="bg-white text-gray-900 hover:bg-gray-100">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Camera className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No Photos Yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Upload some photos to showcase your portfolio and attract more votes in competitions.
                  </p>
                  <Link 
                    to="/dashboard/edit-profile"
                    className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    Upload Photos
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}