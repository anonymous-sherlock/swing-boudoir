import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ children }) => {
  const { 
    currentStep, 
    totalSteps, 
    nextStep, 
    prevStep 
  } = useOnboarding();

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      {/* Simple Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gray-800">Swing Boudoir</span>
            </div>
            
            <div className="text-sm text-gray-600">
              Step {currentStep + 1} of {totalSteps}
            </div>
          </div>
        </div>
      </div>

      {/* Simple Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-6 py-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-6">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Content Area */}
            <div className="p-8">
              {children}
            </div>

            {/* Simple Navigation */}
            <div className="bg-gray-50 px-8 py-6 border-t">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-2 px-6 py-3"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Back
                </Button>

                <div className="flex space-x-2">
                  {Array.from({ length: totalSteps }, (_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        i === currentStep
                          ? 'bg-purple-500'
                          : i < currentStep
                          ? 'bg-green-400'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 