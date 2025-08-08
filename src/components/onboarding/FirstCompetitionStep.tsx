import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Trophy, Calendar, DollarSign, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const FirstCompetitionStep: React.FC = () => {
  const { onboardingData, updateOnboardingData, nextStep, completeStep } = useOnboarding();
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async () => {
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
          contestId: 'comp_1',
          profileId: 'user_profile_id',
          coverImage: onboardingData.profilePhoto || ''
        })
      });

      if (response.ok) {
        updateOnboardingData({ firstCompetition: 'comp_1' });
        completeStep('first-competition');
        
        toast({
          title: "Registration Successful!",
          description: "You've been registered for your first competition!"
        });
        
        nextStep();
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again or contact support",
        variant: "destructive"
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSkip = () => {
    completeStep('first-competition');
    nextStep();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Your First Competition
        </h2>
        <p className="text-gray-600 text-lg">
          Join your first competition and start earning money!
        </p>
      </div>

      {/* Competition Card */}
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
              <Trophy className="h-8 w-8" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-2">Summer Beauty Contest</h3>
              <p className="text-purple-100 text-sm">
                Show off your summer style and win amazing prizes!
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <DollarSign className="h-5 w-5 mx-auto mb-1" />
                <p className="text-sm font-semibold">$5,000 Prize</p>
              </div>
              <div>
                <Calendar className="h-5 w-5 mx-auto mb-1" />
                <p className="text-sm font-semibold">Ends Aug 15</p>
              </div>
              <div>
                <Users className="h-5 w-5 mx-auto mb-1" />
                <p className="text-sm font-semibold">156 Models</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-2xl p-6 max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">💡 Tips for Success</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>• Upload your best, high-quality photos</p>
          <p>• Share your profile on social media</p>
          <p>• Thank people who vote for you</p>
          <p>• Stay active and update your photos</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
        <Button
          onClick={handleRegister}
          disabled={isRegistering}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-2xl disabled:opacity-50"
        >
          {isRegistering ? 'Registering...' : 'Join Competition'}
        </Button>
        
        <Button
          onClick={handleSkip}
          variant="outline"
          size="lg"
          className="px-8 py-4 text-lg font-semibold rounded-2xl"
        >
          Skip for Now
        </Button>
      </div>

      <p className="text-center text-sm text-gray-500">
        You can join more competitions later from your dashboard
      </p>
    </div>
  );
}; 