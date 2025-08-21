import React, { useState, useEffect } from "react";
import { ChevronRight, Camera, Sparkles, CheckCircle } from "lucide-react";
import WelcomeScene from "./WelcomScene";
import IdentityScene from "./IdentityScene";
import MeasurementsScene from "./MeasurementsScene";
import PortfolioScene from "./PortfolioScene";
import FinalScene from "./FinalScene.tsx";
import ProgressIndicator from "./ProgressIndicator.tsx";
import "./index.css";
import onboardingWelcomeImg from "@/assets/onboarding-welcome.jpg";

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

function App() {
  const [currentScene, setCurrentScene] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
        setCurrentScene(currentScene + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const previousScene = () => {
    if (currentScene > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentScene(currentScene - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const renderCurrentScene = () => {
    const sceneProps = {
      formData,
      updateFormData,
      onNext: () => nextScene(true), // Force navigation when called from form submission
      isTransitioning,
    };

    switch (currentScene) {
      case 0:
        return <WelcomeScene {...sceneProps} />;
      case 1:
        return <IdentityScene {...sceneProps} />;
      case 2:
        return <PortfolioScene {...sceneProps} />;
      case 3:
        return <FinalScene {...sceneProps} />;
      default:
        return <WelcomeScene {...sceneProps} />;
    }
  };

  useEffect(() => {
    // Preload images for smooth transitions
    const imageUrls = [
      onboardingWelcomeImg,
      "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg",
      "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
      "https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg",
      "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg",
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
