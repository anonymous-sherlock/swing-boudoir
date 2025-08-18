import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { useCheckContestParticipation, useJoinContest, useLeaveContest, Contest } from "@/hooks/api/useContests";
import defaultImage from "@/assets/hot-girl-summer.jpg";

interface CompetitionListItemProps {
  competition: Contest;
}

export const CompetitionListItem: React.FC<CompetitionListItemProps> = ({ competition }) => {
  const { isAuthenticated, user, checkUserNeedsOnboarding } = useAuth();
  const { toast } = useToast();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const profileId = user?.profileId;

  // Check participation status
  const { data: participation, isLoading: isChecking } = useCheckContestParticipation(competition?.id, profileId || "");
  const showLeave = participation?.hasJoined === true;

  // Mutations
  const joinContestMutation = useJoinContest();
  const leaveContestMutation = useLeaveContest();

  const isJoining = joinContestMutation.isPending;
  const isLeaving = leaveContestMutation.isPending;
  const joinError = joinContestMutation.error as Error | null;
  const leaveError = leaveContestMutation.error as Error | null;

  const needsProfileSetup = isAuthenticated && checkUserNeedsOnboarding();

  const handleJoinContest = async () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!profileId) {
      toast({ title: "Profile Required", description: "Please complete your profile before joining contests", variant: "destructive" });
      return;
    }
    try {
      await joinContestMutation.mutateAsync({ profileId, contestId: competition.id, coverImage: null });
      toast({ title: "Success!", description: `You have joined ${competition.name}` });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to join contest. Please try again.";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  };

  const handleLeaveContest = async () => {
    if (!isAuthenticated || !profileId) {
      toast({ title: "Authentication Required", description: "Please log in to leave contests", variant: "destructive" });
      return;
    }
    try {
      await leaveContestMutation.mutateAsync({ contestId: competition.id, profileId });
      toast({ title: "Success!", description: `You have left ${competition.name}` });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to leave contest. Please try again.";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    window.location.reload();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrize = (prize: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(prize);
  };

  // Get the best available image
  const getImageUrl = () => {
    if (competition.images && competition.images.length > 0) {
      // Try to find an image with a valid URL
      const validImage = competition.images.find((img) => img.url && img.url.trim() !== "");
      if (validImage) return validImage.url;
    }

    // Fallback to placeholder image
    return defaultImage;
  };

  if (!competition) {
    return null;
  }

  return (
    <>
      <Card className="w-full hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Image Section - Bigger Size */}
            <div className="relative w-full lg:w-80 h-48 lg:h-48 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              {showLeave && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 absolute top-2 right-2 z-10">
                  Joined
                </Badge>
              )}

              <img
                src={getImageUrl()}
                alt={competition.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = defaultImage;
                }}
              />

              <div className="absolute top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center">
                {(competition?.images?.length || 0) > 0 && <p className="text-white text-sm">{competition.images?.length} images</p>}
              </div>

              {/* <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="bg-white/90 text-gray-800">
                  {competition.status}
                </Badge>
              </div> */}
            </div>

            {/* Content Section */}
            <div className="flex-1 space-y-4">
              {/* Header */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{competition.name}</h3>
                <p className="text-gray-600 line-clamp-2 text-base">{competition.description}</p>
              </div>

              {/* Competition Details */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Start Date:</span>
                  <p className="font-medium">{formatDate(competition.startDate)}</p>
                </div>
                <div>
                  <span className="text-gray-500">End Date:</span>
                  <p className="font-medium">{formatDate(competition.endDate)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Prize Pool:</span>
                  <p className="font-medium text-green-600">{formatPrize(competition.prizePool)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Awards:</span>
                  <p className="font-medium">{competition.awards?.length || 0} available</p>
                </div>
              </div>

              {/* Error display */}
              {(joinError || leaveError) && (
                <div className="pt-2">
                  <p className="text-sm text-red-600">{joinError ? "Failed to join contest" : "Failed to leave contest"}</p>
                </div>
              )}
            </div>

            {/* Action Buttons - Right Side */}
            <div className="flex flex-col justify-center items-end space-y-3 min-w-[140px]">
              {showLeave ? (
                <Button variant="outline" onClick={handleLeaveContest} disabled={isLeaving} className="w-full">
                  {isLeaving ? "Leaving..." : "Leave Contest"}
                </Button>
              ) : (
                <div className="space-y-2 w-full">
                  {!isAuthenticated ? (
                    <Button onClick={() => setIsAuthModalOpen(true)} className="w-full">
                      Register to Join
                    </Button>
                  ) : needsProfileSetup ? (
                    <div className="space-y-2">
                      <Button disabled className="w-full" variant="outline">
                        Complete Profile to Join
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        You need to create a profile before joining contests. Go to your dashboard to set up your profile.
                      </p>
                    </div>
                  ) : (
                    <Button onClick={handleJoinContest} disabled={isJoining || isChecking} className="w-full">
                      {isJoining ? "Joining..." : "Join Contest"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={handleAuthSuccess} />
    </>
  );
};

export default CompetitionListItem;
