import { COMPETITIONS_JOINED_COUNT_KEY, COMPETITIONS_JOINED_KEY } from "@/constants/keys.constants";
import { useCallback, useEffect, useRef, useState } from "react";
import { ContestEncouragementModal } from "./ContestEncouragementModal";
import { useAuth } from "@/contexts/AuthContext";

export interface ContestBrowserLeaveBlockerProps {
  enabled: boolean;
  message?: string;
  title?: string;
  showOnMouseLeave?: boolean;
  onBeforeLeave?: () => void;
  onLeaveAllowed?: () => void;
  onConfirmLeave?: () => void;
}

export function ContestBrowserLeaveBlocker({
  enabled,
  message = "You have unsaved changes. Are you sure you want to leave?",
  title = "Leave this page?",
  showOnMouseLeave = true,
  onBeforeLeave,
  onLeaveAllowed,
  onConfirmLeave,
}: ContestBrowserLeaveBlockerProps) {
  const [showDialog, setShowDialog] = useState(false);
  const showDialogRef = useRef(showDialog);
  const { isAuthenticated, checkUserNeedsOnboarding } = useAuth();

  // Keep ref updated
  useEffect(() => {
    showDialogRef.current = showDialog;
  }, [showDialog]);

  // Check localStorage
  const hasKeyForJoinedCompetitions = localStorage.getItem(COMPETITIONS_JOINED_KEY);
  const hasJoinedFromStorage = localStorage.getItem(COMPETITIONS_JOINED_KEY) === "true";


  const handleClose = useCallback(() => {
    setShowDialog(false);
  }, []);

  const handleSuccess = useCallback(() => {
    setShowDialog(false);
    localStorage.setItem(COMPETITIONS_JOINED_KEY, "true");
    const currentCount = parseInt(localStorage.getItem(COMPETITIONS_JOINED_COUNT_KEY) || "0");
    localStorage.setItem(COMPETITIONS_JOINED_COUNT_KEY, (currentCount + 1).toString());
    onLeaveAllowed?.();
  }, [onLeaveAllowed]);

  // Handle browser tab close / refresh
  useEffect(() => {
    if (!enabled || !isAuthenticated || !hasKeyForJoinedCompetitions || hasJoinedFromStorage || checkUserNeedsOnboarding()) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      setShowDialog(true);
      onBeforeLeave?.();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [enabled, isAuthenticated, hasKeyForJoinedCompetitions, hasJoinedFromStorage, checkUserNeedsOnboarding, onBeforeLeave]);

  // Handle mouse leave to show modal
  useEffect(() => {
    if (!enabled || !isAuthenticated || !showOnMouseLeave || !hasKeyForJoinedCompetitions || hasJoinedFromStorage || checkUserNeedsOnboarding()) return;

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
            setShowDialog(true);
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
  }, [enabled, isAuthenticated, showOnMouseLeave, hasKeyForJoinedCompetitions, hasJoinedFromStorage, checkUserNeedsOnboarding, onBeforeLeave]);

  return (
    <ContestEncouragementModal
      isOpen={showDialog}
      onClose={handleClose}
      onSuccess={handleSuccess}
      title={title}
      message={message}
    />
  );
}
