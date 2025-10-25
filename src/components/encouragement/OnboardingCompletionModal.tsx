import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from "@/components/global/modal";
import { useRouter } from "@tanstack/react-router";
import { ArrowRightIcon, User2, Sparkles, Star } from "lucide-react";
import { ONBOARDING_COMPLETED_KEY } from "@/constants/keys.constants";

interface OnboardingCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingCompletionModal({ isOpen, onClose }: OnboardingCompletionModalProps) {
  const router = useRouter();

  const handleGoToOnboarding = () => {
    router.navigate({ to: "/onboarding", replace: true, reloadDocument: true });
    onClose();
  };

  const hasOnboardingCompleted = localStorage.getItem(ONBOARDING_COMPLETED_KEY) === "true";
  if (hasOnboardingCompleted || location.pathname.startsWith("/onboarding")) {
    return null;
  }

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="sm:max-w-[600px] p-0 rounded-2xl border-0 shadow-2xl">
        {/* Background with gradient */}
        <div className="rounded-2xl relative bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-6 flex flex-col items-center justify-center min-h-[400px]">
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 opacity-20">
            <Sparkles className="w-8 h-8 text-pink-500" />
          </div>
          <div className="absolute top-8 right-8 opacity-15">
            <Star className="w-6 h-6 text-purple-500" />
          </div>
          <div className="absolute bottom-6 left-6 opacity-20">
            <Sparkles className="w-6 h-6 text-indigo-500" />
          </div>

          <ModalHeader className="text-center space-y-4 relative z-10 flex flex-col items-center">
            {/* Enhanced icon with better styling */}
            <div className="relative flex justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-2xl">
                <User2 className="w-12 h-12 text-white" />
              </div>
              {/* Animated ring */}
              <div className="absolute inset-0 rounded-full border-4 border-pink-200 animate-pulse"></div>
            </div>

            <div className="space-y-2 flex flex-col items-center">
              <ModalTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent text-center">
                Complete Your Profile
              </ModalTitle>
              <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
            </div>

            <ModalDescription className="text-gray-700 text-lg leading-relaxed max-w-md text-center">
              <span className="font-semibold text-gray-800">Caught you! Your profile’s still unfinished</span>
              <br />
              Don’t let that stop your spotlight moment complete it now and unlock everything waiting for you 
            </ModalDescription>
          </ModalHeader>

          <ModalFooter className="flex justify-center items-center pt-4 pb-4 relative z-10 w-full">
            <Button
              onClick={handleGoToOnboarding}
              className="group relative px-10 py-4 text-lg font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-full flex items-center justify-center mx-auto"
            >
              <span className="flex items-center space-x-3">
                <span>Complete Profile</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
              {/* Shine effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 group-hover:animate-pulse"></div>
            </Button>
          </ModalFooter>
        </div>
      </ModalContent>
    </Modal>
  );
}
