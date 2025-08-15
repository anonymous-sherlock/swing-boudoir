import React from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { FormData } from "./index";
import onboardingWelcomeImg from "@/assets/onboarding-welcome.jpg";

interface WelcomeSceneProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  onNext: () => void;
  isTransitioning: boolean;
}

const WelcomeScene: React.FC<WelcomeSceneProps> = ({ onNext }) => {
  return (
    <div className="relative">
      <div
        className="scene-background"
        style={{
          backgroundImage: `url(${onboardingWelcomeImg})`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/90" />

      <div className="scene-content">
        <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
          {/* <div className="mb-8">
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-yellow-400 animate-pulse" />
          </div> */}

          <h1 className="headline mb-6">
            Welcome to your
            <br />
            modeling journey
          </h1>

          <p className="subheading mb-8 max-w-2xl mx-auto !text-base">
            Step into the spotlight and discover your potential. This is where dreams meet opportunity, and every story begins with a single frame.
          </p>

          {/* <div className="mb-12">
            <div className="glass-card inline-block p-8 animate-fade-in-scale">
              <p className="text-lg font-light mb-4 text-center">
                "Every model started with a single step.
                <br />
                Today, that step is yours."
              </p>
              <div className="w-16 h-0.5 bg-gradient-to-r from-yellow-400 to-pink-400 mx-auto"></div>
            </div>
          </div> */}

          <button onClick={onNext} className="btn-primary flash-effect group">
            Begin Your Story
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScene;
