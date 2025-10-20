import { useCallback, useEffect, useRef, useState } from "react";
import { OnboardingCompletionModal } from "./OnboardingCompletionModal";
import { useAuth } from "@/contexts/AuthContext";
import { ONBOARDING_COMPLETED_KEY } from "@/constants/keys.constants";

export interface OnboardingLeaveBlockerProps {
  enabled: boolean;
  showOnMouseLeave?: boolean;
  onBeforeLeave?: () => void;
}

export function OnboardingLeaveBlocker({
  enabled,
  showOnMouseLeave = true,
  onBeforeLeave,
}: OnboardingLeaveBlockerProps) {
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const showDialogRef = useRef(showOnboardingModal);
  const { isAuthenticated, checkUserNeedsOnboarding } = useAuth();

  
  const hasOnboardingCompleted = localStorage.getItem(ONBOARDING_COMPLETED_KEY) === "true";

  // Keep ref updated
  useEffect(() => {
    showDialogRef.current = showOnboardingModal;
  }, [showOnboardingModal]);

  const handleOnboardingClose = useCallback(() => {
    setShowOnboardingModal(false);
  }, []);

  // Handle browser tab close / refresh
  useEffect(() => {
    if (!enabled || !isAuthenticated || hasOnboardingCompleted || !checkUserNeedsOnboarding() || location.pathname.startsWith('/onboarding')) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      setShowOnboardingModal(true);
      onBeforeLeave?.();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [enabled, isAuthenticated, hasOnboardingCompleted, checkUserNeedsOnboarding, onBeforeLeave]);

  // Handle mouse leave to show modal
  useEffect(() => {
    if (!enabled || !isAuthenticated || !showOnMouseLeave || hasOnboardingCompleted || !checkUserNeedsOnboarding() || location.pathname.startsWith('/onboarding')) return;

    let timeoutId: NodeJS.Timeout;

    const handleMouseLeave = (event: MouseEvent) => {
      if (showDialogRef.current) return;

      const isLeavingTop = event.clientY <= 0;
      const isLeavingLeft = event.clientX <= 0;
      const isLeavingRight = event.clientX >= window.innerWidth;
      const isLeavingBottom = event.clientY >= window.innerHeight;

      if (isLeavingTop || isLeavingLeft || isLeavingRight || isLeavingBottom) {
        timeoutId = setTimeout(() => {
          if (!showDialogRef.current) {
            setShowOnboardingModal(true);
            onBeforeLeave?.();
          }
        }, 300);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseout", handleMouseLeave);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseout", handleMouseLeave);
    };
  }, [enabled, isAuthenticated, showOnMouseLeave, hasOnboardingCompleted, checkUserNeedsOnboarding, onBeforeLeave]);

  return (
    <OnboardingCompletionModal
      isOpen={showOnboardingModal}
      onClose={handleOnboardingClose}
    />
  );
}
