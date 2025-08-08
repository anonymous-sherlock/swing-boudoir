import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCompetitions } from '@/hooks/useCompetitions';
import { AuthModal } from '@/components/auth/AuthModal';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Calendar, DollarSign, Users, Star, Heart } from 'lucide-react';

interface CompetitionCardProps {
  competition: {
    id: string;
    title: string;
    description: string;
    prize: string;
    endDate: string;
    participants: number;
    status: 'active' | 'inactive' | 'completed';
    coverImage?: string;
    category?: string;
  };
}

export const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition }) => {
  const { user, isAuthenticated } = useAuth();
  const { registerForCompetition, isUserRegistered } = useCompetitions();
  const { toast } = useToast();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Check if user is registered for this competition
  useEffect(() => {
    if (user && isAuthenticated) {
      const registered = isUserRegistered(user.id, competition.id);
      setIsRegistered(registered);
    }
  }, [user, isAuthenticated, competition.id, isUserRegistered]);

  const handleRegister = async () => {
    if (!isAuthenticated || !user) {
      setShowAuthModal(true);
      return;
    }

    if (competition.status !== 'active') {
      toast({
        title: "Competition Not Active",
        description: "This competition is not currently accepting registrations.",
        variant: "destructive"
      });
      return;
    }

    if (isRegistered) {
      toast({
        title: "Already Registered",
        description: "You are already registered for this competition.",
        variant: "destructive"
      });
      return;
    }

    setIsRegistering(true);
    try {
      // Register for competition using API
      const response = await fetch('/api/v1/contests/join', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contestId: competition.id,
          profileId: user.id,
          coverImage: user.image || ''
        })
      });

      if (response.ok) {
        // Update local state
        registerForCompetition(user.id, competition.id);
        setIsRegistered(true);
        
        // Create notification
        const notificationResponse = await fetch('/api/v1/notifications', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `You've successfully registered for ${competition.title}!`,
            userId: user.id,
            icon: 'SUCESS',
            action: `/competitions/${competition.id}`
          })
        });

        if (notificationResponse.ok) {
          // Dispatch storage event to update notifications in real-time
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'notifications',
            newValue: JSON.stringify([{
              id: Date.now().toString(),
              message: `You've successfully registered for ${competition.title}!`,
              userId: user.id,
              icon: 'SUCESS',
              action: `/competitions/${competition.id}`,
              isRead: false,
              createdAt: new Date().toISOString()
            }])
          }));
        }

        toast({
          title: "Registration Successful!",
          description: `You've been registered for ${competition.title}!`,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // After successful login/register, try to register for competition
    setTimeout(() => {
      handleRegister();
    }, 500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {competition.coverImage && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={competition.coverImage}
              alt={competition.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <Badge className={`absolute top-4 right-4 ${getStatusColor(competition.status)}`}>
              {competition.status.charAt(0).toUpperCase() + competition.status.slice(1)}
            </Badge>
          </div>
        )}
        
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                {competition.title}
              </CardTitle>
              <p className="text-gray-600 text-sm line-clamp-2">
                {competition.description}
              </p>
            </div>
            {isRegistered && (
              <Badge className="bg-green-100 text-green-800 ml-2">
                Registered
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Competition Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center space-y-1">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold text-gray-900">{competition.prize}</span>
              <span className="text-xs text-gray-500">Prize</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-900">
                {formatDate(competition.endDate)}
              </span>
              <span className="text-xs text-gray-500">End Date</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-semibold text-gray-900">
                {competition.participants}
              </span>
              <span className="text-xs text-gray-500">Models</span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleRegister}
            disabled={isRegistering || competition.status !== 'active' || isRegistered}
            className={`w-full ${
              isRegistered 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
            }`}
          >
            {isRegistering ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Registering...
              </>
            ) : isRegistered ? (
              <>
                <Heart className="mr-2 h-4 w-4" />
                Registered
              </>
            ) : (
              <>
                <Trophy className="mr-2 h-4 w-4" />
                Register Now
              </>
            )}
          </Button>

          {/* Category Badge */}
          {competition.category && (
            <div className="flex justify-center">
              <Badge variant="outline" className="text-xs">
                {competition.category}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default CompetitionCard;