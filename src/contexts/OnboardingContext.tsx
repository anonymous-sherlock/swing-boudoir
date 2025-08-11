import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { api, apiRequest } from "@/lib/api";
import { useNavigate, useNavigation } from "react-router-dom";
import { authPages, DASHBOARD_REDIRECT } from "@/routes";

export interface OnboardingData {
  basicInfo: {
    name: string;
    bio: string;
    age: string;
    location: string;
    hobbies?: string;
    paidVoterMessage?: string;
    freeVoterMessage?: string;
    profileImage?: string;
    votingImage?: string;
    socialMedia: {
      instagram?: string;
      tiktok?: string;
      twitter?: string;
    };
  };
  preferences: {
    goals: string[];
    interests: string[];
    notifications: boolean;
  };
  completedSteps: string[];
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  phase: 1 | 2 | 3;
  completed: boolean;
  required: boolean;
}

interface OnboardingContextType {
  currentStep: number;
  totalSteps: number;
  isOnboardingComplete: boolean;
  isLoading: boolean;
  steps: OnboardingStep[];
  onboardingData: OnboardingData;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  nextStep: () => Promise<void>;
  prevStep: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const ONBOARDING_STEPS: OnboardingStep[] = [
  // Phase 1: Welcome & Account Setup
  {
    id: "welcome",
    title: "Welcome to Swing Boudoir!",
    description: "Let's get you set up for success",
    phase: 1,
    completed: false,
    required: true,
  },
  {
    id: "profile-setup",
    title: "Complete Your Profile",
    description: "Tell us about yourself and upload your photos",
    phase: 1,
    completed: false,
    required: true,
  },
  {
    id: "preferences",
    title: "Your Preferences & Goals",
    description: "Help us match you with the right opportunities",
    phase: 1,
    completed: false,
    required: true,
  },

  // Phase 2: Platform Education
  {
    id: "tutorial",
    title: "How It Works",
    description: "Learn how competitions and voting work",
    phase: 2,
    completed: false,
    required: true,
  },
  {
    id: "rules",
    title: "Rules & Guidelines",
    description: "Important information to keep you safe and successful",
    phase: 2,
    completed: false,
    required: true,
  },

  // Phase 3: First Steps
  {
    id: "first-competition",
    title: "Your First Competition",
    description: "Browse and register for your first competition",
    phase: 3,
    completed: false,
    required: true,
  },
  {
    id: "dashboard-tour",
    title: "Dashboard Tour",
    description: "Learn how to navigate your dashboard",
    phase: 3,
    completed: false,
    required: true,
  },
];

const initialOnboardingData: OnboardingData = {
  basicInfo: {
    name: "",
    bio: "",
    age: "",
    location: "",
    socialMedia: {},
  },
  preferences: {
    goals: [],
    interests: [],
    notifications: true,
  },
  completedSteps: [],
};

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, checkUserNeedsOnboarding, isLoading: isSessionLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(initialOnboardingData);
  const [steps, setSteps] = useState<OnboardingStep[]>(ONBOARDING_STEPS);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const totalSteps = steps.length;

  // Initialize onboarding state
  useEffect(() => {
    const initializeOnboarding = async () => {
      // console.log("OnboardingContext - isAuthenticated:", isAuthenticated);

      if (!user || !isAuthenticated) {
        // console.log("OnboardingContext - No user or not authenticated, setting loading to false");
        setIsLoading(false);
        return;
      }

      // User is authenticated, check if they need onboarding
      const needsOnboarding = checkUserNeedsOnboarding();
      if (!needsOnboarding) {
        // User doesn't need onboarding, redirect will be handled by the other useEffect
        setIsLoading(false);
        return;
      }

      // User needs onboarding, proceed with initialization
      console.log("OnboardingContext - User needs onboarding, proceeding with initialization");

      // Check if there's saved onboarding data in localStorage
      const savedData = localStorage.getItem(`onboarding_${user.id}`);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setOnboardingData(parsedData);
        } catch (error) {
          console.error("Error parsing saved onboarding data:", error);
        }
      }

      setIsLoading(false);
    };

    initializeOnboarding();
  }, [user, isAuthenticated]);

  // Save onboarding data to localStorage
  useEffect(() => {
    if (user && onboardingData !== initialOnboardingData) {
      localStorage.setItem(`onboarding_${user.id}`, JSON.stringify(onboardingData));
    }
  }, [onboardingData, user]);

  const nextStep = async () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = async () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
  };

  const completeOnboarding = async () => {
    try {
      setIsLoading(true);

      if (!user) {
        throw new Error("No user found");
      }

      // Create profile data according to API schema
      const profileData = {
        userId: user.id,
        bio: onboardingData.basicInfo?.bio || "",
        avatarUrl: onboardingData.basicInfo?.profileImage || null,
        phone: "", // Will be filled in settings
        address: onboardingData.basicInfo?.location || "",
        city: "",
        country: "",
        postalCode: "",
        dateOfBirth: onboardingData.basicInfo?.age || null,
        gender: "",
        hobbiesAndPassions: onboardingData.basicInfo?.hobbies || "",
        paidVoterMessage: onboardingData.basicInfo?.paidVoterMessage || "",
        freeVoterMessage: onboardingData.basicInfo?.freeVoterMessage || "",
        lastFreeVoteAt: null,
        coverImageId: onboardingData.basicInfo?.votingImage || null,
      };

      const profileResponse = await api.post("/profile", profileData);

      if (!profileResponse.success) {
        console.error("Profile creation failed:", profileResponse.error);
        throw new Error(profileResponse.error || "Failed to create profile");
      }

      console.log("Profile created successfully:", profileResponse.data);

      // Update user data with profile information
      const userUpdateData = {
        name: onboardingData.basicInfo?.name || user.name,
      };

      const userUpdateResponse = await api.patch(`/users/${user.id}`, userUpdateData);

      if (!userUpdateResponse.success) {
        console.error("User update failed:", userUpdateResponse.error);
      }

      // Mark onboarding as complete
      setIsOnboardingComplete(true);
      localStorage.setItem(`onboarding_${user.id}_complete`, "true");
      localStorage.removeItem(`onboarding_${user.id}`); // Clean up saved data

      console.log("Onboarding completed successfully");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: OnboardingContextType = {
    currentStep,
    totalSteps,
    onboardingData,
    steps,
    isOnboardingComplete,
    isLoading,
    nextStep,
    prevStep,
    updateOnboardingData,
    completeOnboarding,
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};
