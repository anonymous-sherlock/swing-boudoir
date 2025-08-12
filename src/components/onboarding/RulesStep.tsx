import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Shield, Heart, Camera } from 'lucide-react';

export const RulesStep: React.FC = () => {
  const { onboardingData, updateOnboardingData, nextStep, completeStep } = useOnboarding();

  const rules = [
    {
      icon: <Shield className="h-6 w-6 text-green-500" />,
      title: "Stay Safe",
      description: "Never share personal information like your address or phone number"
    },
    {
      icon: <Camera className="h-6 w-6 text-purple-500" />,
      title: "Upload Quality Photos",
      description: "Only upload professional, appropriate photos"
    },
    {
      icon: <Heart className="h-6 w-6 text-pink-500" />,
      title: "Be Respectful",
      description: "Treat everyone with kindness and respect"
    }
  ];

  const handleAcceptRules = (accepted: boolean) => {
    updateOnboardingData({ rulesAccepted: accepted });
  };

  const handleContinue = () => {
    if (!onboardingData.rulesAccepted) {
      return;
    }
    completeStep('rules');
    nextStep();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Important Rules
        </h2>
        <p className="text-gray-600 text-lg">
          These rules keep everyone safe and happy
        </p>
      </div>

      {/* Simple Rules */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {rules.map((rule, index) => (
            <div key={index} className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  {rule.icon}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {rule.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {rule.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Tips */}
      <div className="bg-red-50 rounded-2xl p-6 max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-red-800 mb-3 text-center">🛡️ Safety First</h3>
        <div className="space-y-2 text-sm text-red-700">
          <p>• Trust your instincts - if something feels wrong, report it</p>
          <p>• Never meet anyone in private places</p>
          <p>• Report any inappropriate behavior immediately</p>
          <p>• We're here to keep you safe 24/7</p>
        </div>
      </div>

      {/* Rules Acceptance */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 max-w-2xl mx-auto">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="accept-rules"
            checked={onboardingData.rulesAccepted}
            onCheckedChange={handleAcceptRules}
            className="mt-1"
          />
          <Label htmlFor="accept-rules" className="text-sm leading-relaxed cursor-pointer">
            I understand and agree to follow these rules. I know that breaking these rules 
            may result in my account being suspended. I want to help create a safe and 
            respectful community for everyone.
          </Label>
        </div>
      </div>

      {/* Continue Button */}
      <div className="text-center pt-6">
        {/* <Button
          onClick={handleContinue}
          size="lg"
          disabled={!onboardingData.rulesAccepted}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 text-lg font-semibold rounded-2xl disabled:opacity-50"
        >
          Continue
        </Button> */}
        {!onboardingData.rulesAccepted && (
          <p className="text-sm text-red-600 mt-2">
            Please accept the rules to continue
          </p>
        )}
      </div>
    </div>
  );
}; 