import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Heart, 
  Star, 
  Clock, 
  Users, 
  Trophy,
  Eye,
  Calendar,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface Contest {
  id: string;
  name: string;
  description: string;
  endDate: string;
  participants: number;
  prize: string;
  category: string;
  status: 'active' | 'ending_soon' | 'upcoming';
  coverImage: string;
}

interface ContestModel {
  id: string;
  name: string;
  profileImage: string;
  bio: string;
  votes: number;
  isFavorite: boolean;
  contestPhotos: string[];
}

export function BrowseContests() {
  const { user } = useAuth();
  const [contests, setContests] = useState<Contest[]>([]);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [contestModels, setContestModels] = useState<ContestModel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'contests' | 'models'>('contests');

  const categories = ['all', 'boudoir', 'fashion', 'portrait', 'artistic', 'commercial'];

  useEffect(() => {
    // Fetch contests from API
    const fetchContests = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await getActiveContests();
        // setContests(response.data);
        
        // Mock data for now
        setContests([
          {
            id: '1',
            name: 'Summer Glow 2025',
            description: 'Capture the essence of summer beauty with natural lighting and warm tones.',
            endDate: '2025-02-15T23:59:59Z',
            participants: 45,
            prize: '$5,000 + Magazine Feature',
            category: 'boudoir',
            status: 'active',
            coverImage: '/api/placeholder/400/300'
          },
          {
            id: '2',
            name: 'Urban Elegance',
            description: 'Modern city vibes meet classic elegance in this urban photography contest.',
            endDate: '2025-01-30T23:59:59Z',
            participants: 32,
            prize: '$3,000 + Portfolio Review',
            category: 'fashion',
            status: 'ending_soon',
            coverImage: '/api/placeholder/400/300'
          },
          {
            id: '3',
            name: 'Artistic Expression',
            description: 'Push creative boundaries with artistic and conceptual photography.',
            endDate: '2025-03-01T23:59:59Z',
            participants: 28,
            prize: '$4,000 + Gallery Exhibition',
            category: 'artistic',
            status: 'active',
            coverImage: '/api/placeholder/400/300'
          }
        ]);
      } catch (error) {
        console.error('Error fetching contests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContests();
  }, []);

  useEffect(() => {
    if (selectedContest) {
      // Fetch models for selected contest
      const fetchContestModels = async () => {
        try {
          // TODO: Replace with actual API call
          // const response = await getContestModels(selectedContest.id);
          // setContestModels(response.data);
          
          // Mock data for now
          setContestModels([
            {
              id: '1',
              name: 'Sarah Johnson',
              profileImage: '/api/placeholder/100/100',
              bio: 'Professional model with 5+ years experience in fashion and boudoir photography.',
              votes: 156,
              isFavorite: false,
              contestPhotos: ['/api/placeholder/300/400', '/api/placeholder/300/400']
            },
            {
              id: '2',
              name: 'Emma Davis',
              profileImage: '/api/placeholder/100/100',
              bio: 'Rising star known for her natural beauty and authentic expressions.',
              votes: 89,
              isFavorite: true,
              contestPhotos: ['/api/placeholder/300/400', '/api/placeholder/300/400']
            },
            {
              id: '3',
              name: 'Mia Rodriguez',
              profileImage: '/api/placeholder/100/100',
              bio: 'Versatile model specializing in artistic and commercial photography.',
              votes: 234,
              isFavorite: false,
              contestPhotos: ['/api/placeholder/300/400', '/api/placeholder/300/400']
            }
          ]);
        } catch (error) {
          console.error('Error fetching contest models:', error);
        }
      };

      fetchContestModels();
    }
  }, [selectedContest]);

  const handleVote = async (modelId: string, contestId: string) => {
    try {
      // TODO: Implement actual voting logic
      console.log(`Voting for model ${modelId} in contest ${contestId}`);
      
      // Update local state
      setContestModels(prev => 
        prev.map(model => 
          model.id === modelId 
            ? { ...model, votes: model.votes + 1 }
            : model
        )
      );
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const toggleFavorite = async (modelId: string) => {
    try {
      // TODO: Implement actual favorite logic
      setContestModels(prev => 
        prev.map(model => 
          model.id === modelId 
            ? { ...model, isFavorite: !model.isFavorite }
            : model
        )
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ending_soon':
        return <Badge variant="destructive">Ending Soon</Badge>;
      case 'upcoming':
        return <Badge variant="secondary">Upcoming</Badge>;
      default:
        return <Badge variant="default">Active</Badge>;
    }
  };

  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredContests = contests.filter(contest => {
    const matchesSearch = contest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contest.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || contest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-foreground">Browse Contests</h1>
          <p className="text-muted-foreground mt-2">
            Discover amazing contests and vote for your favorite models
          </p>
        </div>
        
        {viewMode === 'models' && selectedContest && (
          <Button 
            variant="outline" 
            onClick={() => {
              setViewMode('contests');
              setSelectedContest(null);
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            Back to Contests
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search contests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            aria-label="Filter by category"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {viewMode === 'contests' ? (
        /* Contests Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContests.map((contest) => (
            <Card 
              key={contest.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                setSelectedContest(contest);
                setViewMode('models');
              }}
            >
              <div className="relative">
                <img
                  src={contest.coverImage}
                  alt={contest.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-3 right-3">
                  {getStatusBadge(contest.status)}
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg">{contest.name}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {contest.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{contest.participants} participants</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">{contest.prize}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-red-500" />
                    <span>{getDaysLeft(contest.endDate)} days left</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="capitalize">{contest.category}</span>
                  </div>
                </div>
                
                <Button className="w-full" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View Models
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Models Grid */
        <div className="space-y-6">
          {/* Contest Info */}
          {selectedContest && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{selectedContest.name}</h2>
                    <p className="text-muted-foreground mt-1">{selectedContest.description}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-red-500" />
                        <span className="text-sm">{getDaysLeft(selectedContest.endDate)} days left</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">{selectedContest.prize}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">{contestModels.length}</div>
                    <div className="text-sm text-muted-foreground">Models</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contestModels.map((model) => (
              <Card key={model.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={model.profileImage}
                    alt={model.name}
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(model.id);
                    }}
                  >
                    <Star className={`w-4 h-4 ${model.isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-500'}`} />
                  </Button>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg">{model.name}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {model.bio}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="font-medium">{model.votes} votes</span>
                    </div>
                    <Badge variant="secondary">{selectedContest?.category}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {model.contestPhotos.slice(0, 2).map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Contest photo ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={() => handleVote(model.id, selectedContest?.id || '')}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Vote for {model.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BrowseContests;
