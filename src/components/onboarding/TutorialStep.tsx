import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Trophy, Camera, Heart, DollarSign, ArrowDown, ArrowRight } from 'lucide-react';

export const TutorialStep: React.FC = () => {
  const { nextStep, completeStep } = useOnboarding();
  
  const steps = [
    {
      icon: <Camera className="h-6 w-6 text-purple-500" />,
      title: "Upload Photos",
      description: "Share your best photos to showcase your talent"
    },
    {
      icon: <Heart className="h-6 w-6 text-pink-500" />,
      title: "Get Votes",
      description: "Fans vote for you daily to help you win"
    },
    {
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      title: "Win Prizes", 
      description: "Earn money and prizes from competitions"
    },
    {
      icon: <DollarSign className="h-6 w-6 text-green-500" />,
      title: "Make Money",
      description: "Build your following and earn income"
    }
  ];

  const handleContinue = () => {
    completeStep('tutorial');
    nextStep();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
        <p className="text-gray-600">Simple steps to succeed on our platform</p>
      </div>

      {/* 2x2 Steps Grid with Arrows */}
      <div className="relative">
        <div className="grid grid-cols-2 gap-8">
          {/* Step 1 */}
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              {steps[0].icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{steps[0].title}</h3>
              <p className="text-sm text-gray-600">{steps[0].description}</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              {steps[1].icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{steps[1].title}</h3>
              <p className="text-sm text-gray-600">{steps[1].description}</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              {steps[2].icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{steps[2].title}</h3>
              <p className="text-sm text-gray-600">{steps[2].description}</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              {steps[3].icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{steps[3].title}</h3>
              <p className="text-sm text-gray-600">{steps[3].description}</p>
            </div>
          </div>
        </div>

        {/* Arrows */}
        <ArrowRight className="absolute top-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 hidden md:block" />
        <ArrowDown className="absolute left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-4 h-4 w-4 text-gray-400" />
        <ArrowRight className="absolute bottom-12 left-1/2 transform -translate-x-1/2 translate-y-1/2 h-4 w-4 text-gray-400 hidden md:block" />
      </div>

      {/* Success Story */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 text-center">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-white font-bold">S</span>
        </div>
        <p className="text-gray-700 font-medium">"I won $5,000 in my first month!"</p>
        <p className="text-sm text-gray-600">- Sarah M.</p>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 mb-2 text-center">💡 Quick Tips</h3>
        <div className="text-sm text-gray-700 space-y-1">
          <p>• Upload high-quality photos to stand out</p>
          <p>• Share your profile on social media</p>
          <p>• Thank people who vote for you</p>
          <p>• Update your photos regularly</p>
        </div>
      </div>

    </div>
  );
};