import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Trophy, 
  Star, 
  TrendingUp, 
  Users, 
  Calendar,
  DollarSign,
  Gift,
  Clock,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface VoterStats {
  totalVotes: number;
  votesThisMonth: number;
  premiumVotes: number;
  freeVotesRemaining: number;
  nextFreeVote: string;
  favoriteModels: number;
  contestsParticipated: number;
}

export function VoterDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<VoterStats>({
    totalVotes: 0,
    votesThisMonth: 0,
    premiumVotes: 0,
    freeVotesRemaining: 0,
    nextFreeVote: '',
    favoriteModels: 0,
    contestsParticipated: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch voter stats from API
    const fetchStats = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await getVoterStats(user?.profile?.id);
        // setStats(response.data);
        
        // Mock data for now
        setStats({
          totalVotes: 45,
          votesThisMonth: 12,
          premiumVotes: 25,
          freeVotesRemaining: 3,
          nextFreeVote: '2025-01-29T13:00:00Z',
          favoriteModels: 8,
          contestsParticipated: 15
        });
      } catch (error) {
        console.error('Error fetching voter stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.profileId) {
      fetchStats();
    }
  }, [user?.profileId]);

  const formatNextFreeVote = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Voter Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's your voting activity overview.
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button asChild variant="outline">
            <Link to="/voters/vote-history">
              <Eye className="w-4 h-4 mr-2" />
              View History
            </Link>
          </Button>
          
          <Button asChild>
            <Link to="/voters/buy-votes">
              <DollarSign className="w-4 h-4 mr-2" />
              Buy Votes
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Votes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVotes}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.votesThisMonth} this month
            </p>
          </CardContent>
        </Card>

        {/* Premium Votes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Votes</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.premiumVotes}</div>
            <p className="text-xs text-muted-foreground">
              Available to use
            </p>
          </CardContent>
        </Card>

        {/* Free Votes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Free Votes</CardTitle>
            <Gift className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.freeVotesRemaining}</div>
            <p className="text-xs text-muted-foreground">
              Next: {formatNextFreeVote(stats.nextFreeVote)}
            </p>
          </CardContent>
        </Card>

        {/* Favorite Models */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.favoriteModels}</div>
            <p className="text-xs text-muted-foreground">
              Models you follow
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vote for Models */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-red-500" />
              Vote for Models
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Discover and vote for your favorite models in active contests.
            </p>
            <div className="flex items-center space-x-3">
              <Button asChild className="flex-1">
                <Link to="/voters/browse-contests">
                  <Trophy className="w-4 h-4 mr-2" />
                  Browse Contests
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/voters/favorites">
                  <Star className="w-4 h-4 mr-2" />
                  My Favorites
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Premium Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-500" />
              Premium Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Unlock premium voting power and exclusive features.
            </p>
            <div className="flex items-center space-x-3">
              <Button asChild className="flex-1">
                <Link to="/voters/buy-votes">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Buy Votes
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/voters/subscriptions">
                  <Gift className="w-4 h-4 mr-2" />
                  Subscriptions
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm">Voted for Sarah in "Summer Glow" contest</span>
              </div>
              <Badge variant="secondary">2 hours ago</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">Added Emma to favorites</span>
              </div>
              <Badge variant="secondary">1 day ago</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="text-sm">Purchased 50 premium votes</span>
              </div>
              <Badge variant="secondary">3 days ago</Badge>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <Button asChild variant="outline">
              <Link to="/voters/activity">
                View All Activity
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default VoterDashboard;
