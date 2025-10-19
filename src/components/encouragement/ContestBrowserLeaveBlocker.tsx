import React, { useState, useEffect, useCallback } from "react";
import { useBlocker } from "@tanstack/react-router";
import { ContestEncouragementModal } from "./ContestEncouragementModal";
import { useAuth } from "@/contexts/AuthContext";
import { useJoinedContests } from "@/hooks/api/useContests";
import { COMPETITIONS_JOINED_COUNT_KEY, COMPETITIONS_JOINED_KEY } from "@/constants/keys.constants";

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
  const { user, isAuthenticated, isLoading, checkUserNeedsOnboarding } = useAuth();

  // Check if user has joined any competitions
  const { data: joinedContestsData } = useJoinedContests(user?.profileId || "", 1, 1);
  const hasJoinedContests = joinedContestsData?.data && joinedContestsData.data.length > 0;

  // Also check localStorage as backup
  const localStorageJoinedStatus = localStorage.getItem(COMPETITIONS_JOINED_KEY);
  const hasJoinedFromStorage = localStorageJoinedStatus === "true";

  // TanStack Router navigation blocker - only block browser navigation, not internal routing
  const { proceed, reset, status } = useBlocker({
    shouldBlockFn: () => false, // Never block internal navigation
    enableBeforeUnload: enabled, // Only block browser tab close / refresh
    withResolver: true,
    disabled: hasJoinedFromStorage || hasJoinedContests,
  });

  const handleClose = useCallback(() => {
    setShowDialog(false);
    reset?.(); // Cancel the blocked navigation
  }, [reset]);

  const handleSuccess = useCallback(() => {
    setShowDialog(false);
    // Update localStorage to indicate user has joined a contest
    localStorage.setItem(COMPETITIONS_JOINED_KEY, "true");
    const currentCount = parseInt(localStorage.getItem(COMPETITIONS_JOINED_COUNT_KEY) || "0");
    localStorage.setItem(COMPETITIONS_JOINED_COUNT_KEY, (currentCount + 1).toString());
    onLeaveAllowed?.();
  }, [onLeaveAllowed]);

  // Handle browser beforeunload events
  useEffect(() => {
    if (!enabled || !isAuthenticated || !user || user.profileId === "" || checkUserNeedsOnboarding()) return;

    // Only show modal if user hasn't joined any competitions
    if (hasJoinedContests || hasJoinedFromStorage) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Only prevent default and show custom modal, don't set returnValue
      event.preventDefault();
      setShowDialog(true);
      onBeforeLeave?.();
      // Don't set event.returnValue to avoid browser's default dialog
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [enabled, onBeforeLeave, hasJoinedContests, hasJoinedFromStorage, isAuthenticated, user, checkUserNeedsOnboarding]);

  // Handle mouse leave to show modal
  useEffect(() => {
    if (!enabled || !showOnMouseLeave || !isAuthenticated || !user || user.profileId === "" || checkUserNeedsOnboarding()) return;

    // Only show modal if user hasn't joined any competitions
    if (hasJoinedContests || hasJoinedFromStorage) return;

    let timeoutId: NodeJS.Timeout;

    const handleMouseLeave = (event: MouseEvent) => {
      const isLeavingTop = event.clientY <= 0;
      const isLeavingLeft = event.clientX <= 0;
      const isLeavingRight = event.clientX >= window.innerWidth;
      const isLeavingBottom = event.clientY >= window.innerHeight;

      if (isLeavingTop || isLeavingLeft || isLeavingRight || isLeavingBottom) {
        timeoutId = setTimeout(() => {
          setShowDialog(true);
          onBeforeLeave?.();
        }, 300); // Small delay to prevent accidental triggers
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseout", handleMouseLeave);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseout", handleMouseLeave);
    };
  }, [enabled, showOnMouseLeave, onBeforeLeave, hasJoinedContests, hasJoinedFromStorage, isAuthenticated, user, checkUserNeedsOnboarding]);

  if (isLoading || !isAuthenticated || !user || user.profileId === "" || checkUserNeedsOnboarding()) return null;

  return <ContestEncouragementModal isOpen={showDialog} onClose={handleClose} onSuccess={handleSuccess} title={title} message={message} />;
}
