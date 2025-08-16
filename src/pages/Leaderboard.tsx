import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Trophy, 
  Crown, 
  Star, 
  TrendingUp, 
  Users, 
  Heart, 
  Eye, 
  Filter,
  Search,
  Calendar,
  Award,
  Medal,
  Zap,
  Target,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/api';

interface LeaderboardModel {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  totalVotes: number;
  totalContests: number;
  wins: number;
  rank: number;
  previousRank: number;
  voteChange: number;
  contestChange: number;
  winRate: number;
  averageVotes: number;
  followers: number;
  isVerified: boolean;
  isPremium: boolean;
  badges: string[];
  recentActivity: string;
  lastActive: string;
}

interface LeaderboardFilters {
  timeFrame: 'all-time' | 'monthly' | 'weekly' | 'daily';
  category: 'all' | 'verified' | 'premium' | 'rising';
  sortBy: 'votes' | 'wins' | 'winRate' | 'followers' | 'activity';
  search: string;
}

const timeFrameOptions = [
  { value: 'all-time', label: 'All Time', icon: Trophy },
  { value: 'monthly', label: 'This Month', icon: Calendar },
  { value: 'weekly', label: 'This Week', icon: TrendingUp },
  { value: 'daily', label: 'Today', icon: Zap },
];

const categoryOptions = [
  { value: 'all', label: 'All Models', icon: Users },
  { value: 'verified', label: 'Verified Only', icon: Star },
  { value: 'premium', label: 'Premium Models', icon: Crown },
  { value: 'rising', label: 'Rising Stars', icon: TrendingUp },
];

const sortOptions = [
  { value: 'votes', label: 'Total Votes', icon: Heart },
  { value: 'wins', label: 'Contest Wins', icon: Trophy },
  { value: 'winRate', label: 'Win Rate', icon: Target },
  { value: 'followers', label: 'Followers', icon: Users },
  { value: 'activity', label: 'Recent Activity', icon: TrendingUp },
];

// Mock data for demonstration
const mockLeaderboardData: LeaderboardModel[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    username: 'sarah_j',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    totalVotes: 15420,
    totalContests: 28,
    wins: 12,
    rank: 1,
    previousRank: 1,
    voteChange: 245,
    contestChange: 2,
    winRate: 42.9,
    averageVotes: 551,
    followers: 2840,
    isVerified: true,
    isPremium: true,
    badges: ['verified', 'premium', 'top-performer'],
    recentActivity: 'Won "Summer Glow" contest',
    lastActive: '2 hours ago'
  },
  {
    id: '2',
    name: 'Emma Davis',
    username: 'emma_d',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    totalVotes: 12850,
    totalContests: 25,
    wins: 10,
    rank: 2,
    previousRank: 3,
    voteChange: 189,
    contestChange: 1,
    winRate: 40.0,
    averageVotes: 514,
    followers: 2150,
    isVerified: true,
    isPremium: true,
    badges: ['verified', 'premium'],
    recentActivity: 'Joined "Fashion Forward" contest',
    lastActive: '1 hour ago'
  },
  {
    id: '3',
    name: 'Mia Rodriguez',
    username: 'mia_r',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    totalVotes: 11230,
    totalContests: 22,
    wins: 8,
    rank: 3,
    previousRank: 2,
    voteChange: -45,
    contestChange: 0,
    winRate: 36.4,
    averageVotes: 511,
    followers: 1890,
    isVerified: true,
    isPremium: false,
    badges: ['verified'],
    recentActivity: 'Received 150 votes in "Beauty & Grace"',
    lastActive: '3 hours ago'
  },
  {
    id: '4',
    name: 'Ava Thompson',
    username: 'ava_t',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    totalVotes: 9870,
    totalContests: 20,
    wins: 7,
    rank: 4,
    previousRank: 5,
    voteChange: 156,
    contestChange: 1,
    winRate: 35.0,
    averageVotes: 494,
    followers: 1650,
    isVerified: false,
    isPremium: true,
    badges: ['premium', 'rising-star'],
    recentActivity: 'Won "Emerging Talent" contest',
    lastActive: '5 hours ago'
  },
  {
    id: '5',
    name: 'Isabella Chen',
    username: 'bella_c',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face',
    totalVotes: 8650,
    totalContests: 18,
    wins: 6,
    rank: 5,
    previousRank: 4,
    voteChange: -23,
    contestChange: 0,
    winRate: 33.3,
    averageVotes: 481,
    followers: 1420,
    isVerified: true,
    isPremium: false,
    badges: ['verified'],
    recentActivity: 'Joined "Artistic Expression" contest',
    lastActive: '1 day ago'
  },
  {
    id: '6',
    name: 'Sophia Williams',
    username: 'sophia_w',
    avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    totalVotes: 7430,
    totalContests: 16,
    wins: 5,
    rank: 6,
    previousRank: 8,
    voteChange: 234,
    contestChange: 2,
    winRate: 31.3,
    averageVotes: 464,
    followers: 1280,
    isVerified: false,
    isPremium: false,
    badges: ['rising-star'],
    recentActivity: 'Won "Fresh Faces" contest',
    lastActive: '2 days ago'
  },
  {
    id: '7',
    name: 'Olivia Brown',
    username: 'olivia_b',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    totalVotes: 6890,
    totalContests: 15,
    wins: 4,
    rank: 7,
    previousRank: 6,
    voteChange: -67,
    contestChange: 0,
    winRate: 26.7,
    averageVotes: 459,
    followers: 1150,
    isVerified: true,
    isPremium: false,
    badges: ['verified'],
    recentActivity: 'Received 89 votes in "Style Showcase"',
    lastActive: '3 days ago'
  },
  {
    id: '8',
    name: 'Charlotte Miller',
    username: 'charlotte_m',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    totalVotes: 6120,
    totalContests: 14,
    wins: 4,
    rank: 8,
    previousRank: 10,
    voteChange: 189,
    contestChange: 1,
    winRate: 28.6,
    averageVotes: 437,
    followers: 980,
    isVerified: false,
    isPremium: true,
    badges: ['premium'],
    recentActivity: 'Joined "Creative Vision" contest',
    lastActive: '4 days ago'
  },
  {
    id: '9',
    name: 'Amelia Garcia',
    username: 'amelia_g',
    avatarUrl: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
    totalVotes: 5670,
    totalContests: 13,
    wins: 3,
    rank: 9,
    previousRank: 7,
    voteChange: -123,
    contestChange: 0,
    winRate: 23.1,
    averageVotes: 436,
    followers: 890,
    isVerified: false,
    isPremium: false,
    badges: [],
    recentActivity: 'Received 67 votes in "Natural Beauty"',
    lastActive: '5 days ago'
  },
  {
    id: '10',
    name: 'Harper Martinez',
    username: 'harper_m',
    avatarUrl: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=150&h=150&fit=crop&crop=face',
    totalVotes: 5230,
    totalContests: 12,
    wins: 3,
    rank: 10,
    previousRank: 9,
    voteChange: -45,
    contestChange: 0,
    winRate: 25.0,
    averageVotes: 436,
    followers: 820,
    isVerified: true,
    isPremium: false,
    badges: ['verified'],
    recentActivity: 'Joined "Elegant Portraits" contest',
    lastActive: '1 week ago'
  }
];

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardModel[]>(mockLeaderboardData);
  const [filteredData, setFilteredData] = useState<LeaderboardModel[]>(mockLeaderboardData);
  const [filters, setFilters] = useState<LeaderboardFilters>({
    timeFrame: 'all-time',
    category: 'all',
    sortBy: 'votes',
    search: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, leaderboardData]);

  const fetchLeaderboardData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await apiRequest('/api/v1/leaderboard', { method: 'GET' });
      // setLeaderboardData(response.data);
      
      // Using mock data for now
      setTimeout(() => {
        setLeaderboardData(mockLeaderboardData);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...leaderboardData];

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(model => 
        model.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        model.username.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category !== 'all') {
      switch (filters.category) {
        case 'verified':
          filtered = filtered.filter(model => model.isVerified);
          break;
        case 'premium':
          filtered = filtered.filter(model => model.isPremium);
          break;
        case 'rising':
          filtered = filtered.filter(model => model.voteChange > 0);
          break;
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'votes':
          return b.totalVotes - a.totalVotes;
        case 'wins':
          return b.wins - a.wins;
        case 'winRate':
          return b.winRate - a.winRate;
        case 'followers':
          return b.followers - a.followers;
        case 'activity':
          return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
        default:
          return 0;
      }
    });

    setFilteredData(filtered);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankChangeIcon = (currentRank: number, previousRank: number) => {
    if (currentRank < previousRank) {
      return <ArrowUp className="w-4 h-4 text-green-500" />;
    } else if (currentRank > previousRank) {
      return <ArrowDown className="w-4 h-4 text-red-500" />;
    } else {
      return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'verified':
        return <Star className="w-4 h-4 text-blue-500" />;
      case 'premium':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'top-performer':
        return <Trophy className="w-4 h-4 text-purple-500" />;
      case 'rising-star':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-6">
              <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="w-12 h-12 text-yellow-500 mr-4" />
              <h1 className="text-4xl font-bold text-gray-900">Leaderboard</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the top-performing models and rising stars in our community. 
              Vote for your favorites and watch them climb the ranks!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Total Models</p>
                    <p className="text-3xl font-bold text-yellow-900">{formatNumber(leaderboardData.length)}</p>
                  </div>
                  <Users className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-800">Total Votes</p>
                    <p className="text-3xl font-bold text-purple-900">
                      {formatNumber(leaderboardData.reduce((sum, model) => sum + model.totalVotes, 0))}
                    </p>
                  </div>
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800">Active Contests</p>
                    <p className="text-3xl font-bold text-green-900">
                      {formatNumber(leaderboardData.reduce((sum, model) => sum + model.totalContests, 0))}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters Section */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters & Search
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? 'Hide' : 'Show'} Filters
                </Button>
              </div>
            </CardHeader>
            
            {showFilters && (
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search models..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      className="pl-10"
                    />
                  </div>

                  {/* Time Frame */}
                  <Select value={filters.timeFrame} onValueChange={(value) => setFilters({ ...filters, timeFrame: value as any })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Time Frame" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeFrameOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center">
                              <Icon className="w-4 h-4 mr-2" />
                              {option.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  {/* Category */}
                  <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value as any })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center">
                              <Icon className="w-4 h-4 mr-2" />
                              {option.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  {/* Sort By */}
                  <Select value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value as any })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center">
                              <Icon className="w-4 h-4 mr-2" />
                              {option.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Leaderboard Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Top Models</span>
                <Badge variant="secondary" className="text-sm">
                  {filteredData.length} models
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                {filteredData.map((model, index) => (
                  <div
                    key={model.id}
                    className={`p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Rank */}
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                        {getRankIcon(model.rank)}
                      </div>

                      {/* Avatar */}
                      <div className="relative">
                        <img
                          src={model.avatarUrl || `https://ui-avatars.com/api/?name=${model.name}&size=60&background=random`}
                          alt={model.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        />
                        {model.isVerified && (
                          <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                            <Star className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Model Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {model.name}
                          </h3>
                          <span className="text-sm text-gray-500">@{model.username}</span>
                          {model.isPremium && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              <Crown className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {formatNumber(model.totalVotes)} votes
                          </span>
                          <span className="flex items-center">
                            <Trophy className="w-4 h-4 mr-1" />
                            {model.wins} wins
                          </span>
                          <span className="flex items-center">
                            <Target className="w-4 h-4 mr-1" />
                            {model.winRate}% win rate
                          </span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {formatNumber(model.followers)} followers
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 mt-2">
                          {model.badges.map((badge) => (
                            <div key={badge} className="flex items-center text-xs text-gray-500">
                              {getBadgeIcon(badge)}
                              <span className="ml-1 capitalize">{badge.replace('-', ' ')}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="text-right space-y-1">
                        <div className="flex items-center justify-end space-x-2">
                          {getRankChangeIcon(model.rank, model.previousRank)}
                          <span className={`text-sm font-medium ${
                            model.rank < model.previousRank ? 'text-green-600' :
                            model.rank > model.previousRank ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {model.rank < model.previousRank ? '+' : ''}
                            {model.previousRank - model.rank}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          {model.recentActivity}
                        </div>
                        
                        <div className="text-xs text-gray-400">
                          {model.lastActive}
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Ready to Join the Competition?
              </h3>
              <p className="text-blue-700 mb-6 max-w-2xl mx-auto">
                Create your profile, join contests, and start climbing the leaderboard. 
                Your journey to the top starts here!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Trophy className="w-5 h-5 mr-2" />
                  Join Contest
                </Button>
                <Button variant="outline" size="lg">
                  <Users className="w-5 h-5 mr-2" />
                  Browse Models
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
