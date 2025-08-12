import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Trophy, Camera, Heart, DollarSign } from 'lucide-react';

export const DashboardTourStep: React.FC = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useOnboarding();

  const features = [
    {
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      title: "Competitions",
      description: "See your competitions and track your progress"
    },
    {
      icon: <Camera className="h-6 w-6 text-purple-500" />,
      title: "Photos",
      description: "Upload and manage your portfolio photos"
    },
    {
      icon: <Heart className="h-6 w-6 text-pink-500" />,
      title: "Votes",
      description: "See who voted for you and track your votes"
    },
    {
      icon: <DollarSign className="h-6 w-6 text-green-500" />,
      title: "Earnings",
      description: "Track your money and prize earnings"
    }
  ];

  const handleCompleteOnboarding = async () => {
    try {
      await completeOnboarding();
      // Navigate to dashboard after successful completion
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome to Your Dashboard!
        </h2>
        <p className="text-gray-600 text-lg">
          Here's what you can do in your dashboard
        </p>
      </div>

      {/* Dashboard Features */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">💡 Pro Tips</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>• Update your photos regularly to stay fresh</p>
          <p>• Thank people who vote for you</p>
          <p>• Share your profile on social media</p>
          <p>• Join multiple competitions to earn more</p>
        </div>
      </div>

      {/* Completion */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-8 max-w-lg mx-auto">
          <h3 className="text-2xl font-bold mb-4">
             You're All Set!
          </h3>
          <p className="text-purple-100 mb-6">
            Congratulations!
            Your profile is set up and you understand how everything works!
          </p>
          <Button
            onClick={handleCompleteOnboarding}
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-2xl"
          >
            Go to Dashboard! 🚀
          </Button>
        </div>
      </div>
    </div>
  );
}; 