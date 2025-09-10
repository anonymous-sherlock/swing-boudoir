import onboardingWelcomeImg from "@/assets/onboarding-welcome.jpg";
import identityImage from "@/assets/onboarding-identity.jpg";

import React, { useEffect, useState } from "react";
import ProgressIndicator from "./ProgressIndicator.tsx";
import "./index.css";

// Local storage key for persisting form data
const ONBOARDING_STORAGE_KEY = "swing-boudoir-onboarding-data";

export interface FormData {
  // Identity
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address?: string;
  zipcode: string;
  hobbiesAndPassions: string;

  // Measurements
  height: string;
  weight: string;
  bust: string;
  waist: string;
  hips: string;
  eyeColor: string;
  hairColor: string;
  skinTone: string;

  // Portfolio
  photos: File[];
  profileAvatar: File | null;
  bannerImage: File | null;
  bio: string;
  experienceLevel: string;
  categories: string[];

  // Social Media
  instagram: string;
  twitter: string;
  facebook: string;
  youtube: string;
  tiktok: string;
}

const initialFormData: FormData = {
  dateOfBirth: "",
  gender: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  address: "",
  zipcode: "",
  hobbiesAndPassions: "",
  height: "",
  weight: "",
  bust: "",
  waist: "",
  hips: "",
  eyeColor: "",
  hairColor: "",
  skinTone: "",
  photos: [],
  profileAvatar: null,
  bannerImage: null,
  bio: "",
  experienceLevel: "",
  categories: [],
  instagram: "",
  twitter: "",
  facebook: "",
  youtube: "",
  tiktok: "",
};

// Helper functions for localStorage persistence
const saveFormDataToStorage = (formData: FormData, currentScene: number) => {
  try {
    // Create a copy of formData without File objects for localStorage
    const serializableFormData = {
      ...formData,
      photos: [], // Don't persist File objects
      profileAvatar: null, // Don't persist File objects
      bannerImage: null, // Don't persist File objects
    };
    
    const dataToSave = {
      formData: serializableFormData,
      currentScene,
      timestamp: Date.now(),
    };
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.warn("Failed to save onboarding data to localStorage:", error);
  }
};

const loadFormDataFromStorage = (): { formData: FormData; currentScene: number } | null => {
  try {
    const savedData = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // Check if data is not too old (e.g., within 7 days)
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      if (Date.now() - parsed.timestamp < maxAge) {
        return {
          formData: { 
            ...initialFormData, 
            ...parsed.formData,
            // Ensure File objects are properly initialized
            photos: [],
            profileAvatar: null,
            bannerImage: null,
          },
          currentScene: parsed.currentScene || 0,
        };
      } else {
        // Clear old data
        clearFormDataFromStorage();
      }
    }
  } catch (error) {
    console.warn("Failed to load onboarding data from localStorage:", error);
  }
  return null;
};

const clearFormDataFromStorage = () => {
  try {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear onboarding data from localStorage:", error);
  }
};

const WelcomeSceneLazy = React.lazy(() => import("./WelcomScene").then(module => ({ default: module.default })));
const IdentitySceneLazy = React.lazy(() => import("./IdentityScene").then(module => ({ default: module.default })));
const PortfolioSceneLazy = React.lazy(() => import("./PortfolioScene").then(module => ({ default: module.default })));
const FinalSceneLazy = React.lazy(() => import("./FinalScene").then(module => ({ default: module.default })));

function App() {
  const [currentScene, setCurrentScene] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const scenes = [
    "Welcome to your modeling journey",
    "Tell us about yourself",
    // "Your measurements matter",
    "Show us your portfolio",
    "Ready for the spotlight",
  ];

  // Validation functions for each scene
  const validateScene = (sceneIndex: number): boolean => {
    switch (sceneIndex) {
      case 0: // Welcome scene - always valid
        return true;
      case 1: // Identity scene
        return !!(
          formData.dateOfBirth &&
          formData.gender &&
          formData.country &&
          formData.city &&
          formData.address &&
          formData.zipcode &&
          formData.experienceLevel &&
          formData.phone
        );
      case 2: // Portfolio scene
        return !!(formData.bio && formData.bio.length >= 50 && formData.categories.length > 0);
      case 3: // Final scene - always valid
        return true;
      default:
        return false;
    }
  };

  const canGoNext = validateScene(currentScene);
  const canGoPrevious = currentScene > 0;

  const nextScene = (force: boolean = false) => {
    if (currentScene < scenes.length - 1 && (force || canGoNext)) {
      setIsTransitioning(true);
      setTimeout(() => {
        const newScene = currentScene + 1;
        setCurrentScene(newScene);
        // Save current scene to localStorage
        if (isInitialized) {
          saveFormDataToStorage(formData, newScene);
        }
        setIsTransitioning(false);
      }, 300);
    }
  };

  const previousScene = () => {
    if (currentScene > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        const newScene = currentScene - 1;
        setCurrentScene(newScene);
        // Save current scene to localStorage
        if (isInitialized) {
          saveFormDataToStorage(formData, newScene);
        }
        setIsTransitioning(false);
      }, 300);
    }
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => {
      const newData = { ...prev, ...updates };
      // Save to localStorage whenever form data changes
      if (isInitialized) {
        saveFormDataToStorage(newData, currentScene);
      }
      return newData;
    });
  };

  const handleOnboardingComplete = () => {
    // Clear saved data when onboarding is completed
    clearFormDataFromStorage();
    // The actual completion and redirect is handled in FinalScene component
  };

  const renderCurrentScene = () => {
    const sceneProps = {
      formData,
      updateFormData,
      onNext: () => nextScene(true), // Force navigation when called from form submission
      isTransitioning,
      onComplete: handleOnboardingComplete,
    };

    switch (currentScene) {
      case 0:
        return <WelcomeSceneLazy {...sceneProps} />;
      case 1:
        return <IdentitySceneLazy {...sceneProps} />;
      case 2:
        return <PortfolioSceneLazy {...sceneProps} />;
      case 3:
        return <FinalSceneLazy {...sceneProps} />;
      default:
        return <WelcomeSceneLazy {...sceneProps} />;
    }
  };

  // Initialize component with saved data
  useEffect(() => {
    const savedData = loadFormDataFromStorage();
    if (savedData) {
      setFormData(savedData.formData);
      setCurrentScene(savedData.currentScene);
    }
    setIsInitialized(true);
  }, []);

  // Save data whenever formData or currentScene changes (after initialization)
  useEffect(() => {
    if (isInitialized) {
      saveFormDataToStorage(formData, currentScene);
    }
  }, [formData, currentScene, isInitialized]);

  useEffect(() => {
    // Preload images for smooth transitions
    const imageUrls = [
      onboardingWelcomeImg,
      identityImage
    ];

    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  return (
    <div className="onboarding-app">
      <ProgressIndicator
        scenes={scenes}
        currentScene={currentScene}
        onNext={() => nextScene(false)}
        onPrevious={previousScene}
        canGoNext={canGoNext}
        canGoPrevious={canGoPrevious}
      />
      <main className={`scene-container ${isTransitioning ? "transitioning" : ""}`}>{renderCurrentScene()}</main>
    </div>
  );
}

export default App;
