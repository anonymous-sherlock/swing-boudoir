import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Contest, useCheckContestParticipation, useJoinContest, useLeaveContest } from "@/hooks/api/useContests";
import { useContestParticipation } from "@/hooks/api/useContestParticipation";
import { useToast } from "@/hooks/use-toast";
import { notificationService } from "@/lib/notificationService";
import React, { useState } from "react";
import { ContestJoinImageDialog } from "./ContestJoinImageDialog";

interface ContestJoinButtonProps {
  contest: Contest;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showAuthModal?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  customButtonText?: string;
}

export const ContestJoinButton: React.FC<ContestJoinButtonProps> = ({
  contest,
  variant = "default",
  size = "default",
  className = "",
  showAuthModal = true,
  onSuccess,
  onError,
  customButtonText,
}) => {
  const { isAuthenticated, user, checkUserNeedsOnboarding } = useAuth();
  const { toast } = useToast();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const profileId = user?.profileId;

  // Check participation status
  const { data: participation, isLoading: isChecking } = useCheckContestParticipation(contest?.id, profileId || "");
  const showLeave = participation?.hasJoined === true;

  // Mutations
  const joinContestMutation = useJoinContest();
  const leaveContestMutation = useLeaveContest();
  const { uploadCoverImage } = useContestParticipation();

  const isJoining = joinContestMutation.isPending;
  const isLeaving = leaveContestMutation.isPending;
  const isUploadingCover = uploadCoverImage.isPending;
  const joinError = joinContestMutation.error as Error | null;
  const leaveError = leaveContestMutation.error as Error | null;

  const needsProfileSetup = isAuthenticated && checkUserNeedsOnboarding();

  const handleJoinClick = () => {
    if (!isAuthenticated) {
      if (showAuthModal) {
        setIsAuthModalOpen(true);
      }
      return;
    }
    if (!profileId) {
      toast({ title: "Profile Required", description: "Please complete your profile before joining contests", variant: "destructive" });
      return;
    }
    if (needsProfileSetup) {
      toast({ title: "Profile Setup Required", description: "Please complete your profile setup before joining contests", variant: "destructive" });
      return;
    }
    
    // Open image upload dialog
    setIsImageDialogOpen(true);
  };

  const handleJoinWithImage = async (file: File | null) => {
    if (!isAuthenticated || !profileId) {
      toast({ title: "Authentication Required", description: "Please log in to join contests", variant: "destructive" });
      return;
    }
    
    // If no file is selected, don't proceed
    if (!file) {
      toast({ title: "Image Required", description: "Please upload a cover image to join this contest", variant: "destructive" });
      return;
    }
    
    try {
      // First join the contest to get participation ID
      const joinResult = await joinContestMutation.mutateAsync({ 
        profileId, 
        contestId: contest.id
      });
      
      // After joining successfully, upload the cover image
      if (joinResult?.id) {
        try {
          await uploadCoverImage.mutateAsync({
            participationId: joinResult.id,
            file: file
          });
          toast({ title: "Success!", description: `You have joined ${contest.name} with cover image` });
          
          // Send in-app notification
          if (profileId) {
            await notificationService.notifyCompetitionJoined(
              profileId,
              contest.name
            );
          }
        } catch (uploadError) {
          console.error('Failed to upload cover image:', uploadError);
          toast({ title: "Warning", description: "Joined contest but failed to upload cover image", variant: "destructive" });
        }
      }
      
      setIsImageDialogOpen(false);
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to join contest. Please try again.";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
      onError?.(error as Error);
    }
  };

  const handleLeaveContest = async () => {
    if (!isAuthenticated || !profileId) {
      toast({ title: "Authentication Required", description: "Please log in to leave contests", variant: "destructive" });
      return;
    }
    try {
      await leaveContestMutation.mutateAsync({ contestId: contest.id, profileId });
      toast({ title: "Success!", description: `You have left ${contest.name}` });
      
      // Send in-app notification for leaving contest
      await notificationService.notifyCompetitionLeft(
        profileId,
        contest.name
      );
      
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to leave contest. Please try again.";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
      onError?.(error as Error);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    window.location.reload();
  };

  // Check if competition has ended
  const isCompetitionEnded = () => {
    const now = new Date();
    const endDate = new Date(contest.endDate);
    return now > endDate;
  };

  // Determine button text and state
  const getButtonText = () => {
    if (isCompetitionEnded()) {
      return "Competition Ended";
    }
    
    if (showLeave) {
      return isLeaving ? "Leaving..." : "Leave Contest";
    }
    
    if (!isAuthenticated) {
      return "Register to Join";
    }
    
    if (needsProfileSetup) {
      return "Complete Profile to Join";
    }
    
    // Use custom button text if provided, otherwise use default
    const defaultText = isJoining ? "Joining..." : "Join Contest";
    return customButtonText || defaultText;
  };

  const getButtonVariant = () => {
    if (showLeave) return "outline";
    if (!isAuthenticated || needsProfileSetup) return variant;
    return variant;
  };

  const isButtonDisabled = () => {
    if (isCompetitionEnded()) return true;
    if (showLeave) return isLeaving;
    if (!isAuthenticated || needsProfileSetup) return false;
    return isJoining || isChecking || isUploadingCover;
  };

  const handleButtonClick = () => {
    if (showLeave) {
      handleLeaveContest();
    } else {
      handleJoinClick();
    }
  };

  return (
    <>
      <Button
        variant={getButtonVariant()}
        size={size}
        className={className}
        onClick={handleButtonClick}
        disabled={isButtonDisabled()}
      >
        {getButtonText()}
      </Button>

      {/* Image Upload Dialog */}
      <ContestJoinImageDialog
        isOpen={isImageDialogOpen}
        onClose={() => setIsImageDialogOpen(false)}
        onJoin={handleJoinWithImage}
        contestName={contest.name}
        isLoading={isJoining || isUploadingCover}
      />

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onSuccess={handleAuthSuccess} 
        />
      )}
    </>
  );
};

export default ContestJoinButton;
