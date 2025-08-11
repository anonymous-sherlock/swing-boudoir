import { DashboardTourStep } from "@/components/onboarding/DashboardTourStep";
import { FirstCompetitionStep } from "@/components/onboarding/FirstCompetitionStep";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { PreferencesStep } from "@/components/onboarding/PreferencesStep";
import { ProfileSetupStep } from "@/components/onboarding/ProfileSetupStep";
import { RulesStep } from "@/components/onboarding/RulesStep";
import { TutorialStep } from "@/components/onboarding/TutorialStep";
import { WelcomeStep } from "@/components/onboarding/WelcomeStep";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { authPages, DASHBOARD_REDIRECT } from "@/routes";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: isSessionLoading, checkUserNeedsOnboarding } = useAuth();
  const { currentStep, totalSteps, isOnboardingComplete, isLoading, steps, nextStep, prevStep, completeOnboarding } = useOnboarding();

  const [isTransitioning, setIsTransitioning] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isSessionLoading && !isAuthenticated) {
      navigate(authPages.login);
    }

    // Redirect to dashboard if onboarding is complete
    if (isAuthenticated && user && !checkUserNeedsOnboarding()) {
      console.log("Onboarding page - Onboarding complete, redirecting to dashboard");
      navigate(DASHBOARD_REDIRECT);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSessionLoading, isAuthenticated, user]);

  const handleNext = async () => {
    setIsTransitioning(true);
    await nextStep();
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handlePrev = async () => {
    setIsTransitioning(true);
    await prevStep();
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleComplete = async () => {
    try {
      setIsTransitioning(true);
      await completeOnboarding();
      setTimeout(() => {
        setIsTransitioning(false);
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Error completing onboarding:", error);
      setIsTransitioning(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-6"
          />
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-gray-800 mb-2">
            Setting up your experience...
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-gray-600">
            Preparing your personalized dashboard
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Render the appropriate step component
  const renderStep = () => {
    const currentStepData = steps[currentStep];

    const stepComponents = {
      welcome: <WelcomeStep />,
      "profile-setup": <ProfileSetupStep />,
      preferences: <PreferencesStep />,
      tutorial: <TutorialStep />,
      rules: <RulesStep />,
      "first-competition": <FirstCompetitionStep />,
      "dashboard-tour": <DashboardTourStep />,
    };

    return stepComponents[currentStepData?.id] || <WelcomeStep />;
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 overflow-hidden">
      <OnboardingLayout>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mt-6 sm:mt-8 px-4 sm:px-6 lg:px-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrev}
            disabled={isFirstStep || isTransitioning}
            className={`flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
              isFirstStep || isTransitioning ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg"
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Previous</span>
          </motion.button>

          <div className="flex items-center space-x-1 sm:space-x-2">
            {Array.from({ length: totalSteps }, (_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentStep ? "bg-purple-600 scale-125" : index < currentStep ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isLastStep ? handleComplete : handleNext}
            disabled={isTransitioning}
            className={`flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
              isTransitioning
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : isLastStep
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg"
            }`}
          >
            {isTransitioning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : isLastStep ? <CheckCircle className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 mr-2" />}
            <span className="hidden sm:inline">{isLastStep ? "Complete Setup" : "Next"}</span>
            <span className="sm:hidden">{isLastStep ? "Complete" : "Next"}</span>
          </motion.button>
        </motion.div>
      </OnboardingLayout>
    </div>
  );
};

export default Onboarding;
