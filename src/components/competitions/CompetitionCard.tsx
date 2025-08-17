import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { Link } from "@tanstack/react-router";
import defaultImage from "@/assets/hot-girl-summer.jpg";
import { Contest, useCheckContestParticipation, useJoinContest, useLeaveContest } from "@/hooks/api/useContests";
import { Separator } from "../ui/separator";

interface CompetitionCardProps {
  contest: Contest;
  showJoinButton?: boolean;
}

export const CompetitionCard: React.FC<CompetitionCardProps> = ({ contest, showJoinButton = true }) => {
  const { isAuthenticated, user, checkUserNeedsOnboarding } = useAuth();
  const { toast } = useToast();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const profileId = user?.profileId;

  // Check participation status
  const { data: participation, isLoading: isChecking } = useCheckContestParticipation(contest?.id, profileId || "");
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
      await joinContestMutation.mutateAsync({ profileId, contestId: contest.id, coverImage: null });
      toast({ title: "Success!", description: `You have joined ${contest.name}` });
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
      await leaveContestMutation.mutateAsync({ contestId: contest.id, profileId });
      toast({ title: "Success!", description: `You have left ${contest.name}` });
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

  if (!contest) {
    return null;
  }
  return (
    <>
      <Card className="w-full max-w-sm overflow-hidden relative ">
        <Link to="/competitions/$slug" params={{ slug: contest.slug }} className="block">
          <div className="relative cursor-pointer">
            {showLeave && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 absolute top-2 right-2 z-10">
                Joined
              </Badge>
            )}

            <img src={contest?.images?.[0]?.url || (defaultImage as unknown as string)} alt={contest.name} className="w-full aspect-video object-cover" />
            <div className="absolute top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center">
              {(contest?.images?.length || 0) > 0 && <p className="text-white text-sm">{contest.images?.length} images</p>}
            </div>
          </div>
        </Link>
        <CardHeader>
          <div className="flex items-center justify-between ">
            <Link to="/competitions/$slug" params={{ slug: contest.slug }} className="hover:text-[#d4af37] duration-300">
              <CardTitle className="text-lg font-semibold">{contest.name}</CardTitle>
            </Link>
          </div>
          <CardDescription className="line-clamp-2">{contest.description}</CardDescription>
        </CardHeader>

        <Separator className="my-4" />
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Start Date:</span>
            <span>{formatDate(contest.startDate)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">End Date:</span>
            <span>{formatDate(contest.endDate)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Prize Pool:</span>
            <span className="font-semibold text-green-600">{formatPrize(contest.prizePool)}</span>
          </div>

          {contest.awards && contest.awards.length > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Awards:</span>
              <span>{contest.awards.length} available</span>
            </div>
          )}
        </CardContent>
        <Separator className="my-4" />

        {showJoinButton && (
          <CardFooter className="flex flex-col space-y-2">
            {showLeave ? (
              <Button variant="outline" onClick={handleLeaveContest} disabled={isLeaving} className="w-full">
                {isLeaving ? "Leaving..." : "Leave Contest"}
              </Button>
            ) : (
              <div className="w-full space-y-2">
                {!isAuthenticated ? (
                  <Button onClick={() => setIsAuthModalOpen(true)} className="w-full">
                    Register to Join
                  </Button>
                ) : needsProfileSetup ? (
                  <div className="space-y-2">
                    <Button disabled className="w-full" variant="outline">
                      Complete Profile to Join
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">You need to create a profile before joining contests. Go to your dashboard to set up your profile.</p>
                  </div>
                ) : (
                  <Button onClick={handleJoinContest} disabled={isJoining || isChecking} className="w-full">
                    {isJoining ? "Joining..." : "Join Contest"}
                  </Button>
                )}
              </div>
            )}
          </CardFooter>
        )}

        {/* Error display */}
        {(joinError || leaveError) && (
          <div className="px-6 pb-4">
            <p className="text-sm text-red-600">{joinError ? "Failed to join contest" : "Failed to leave contest"}</p>
          </div>
        )}
      </Card>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={handleAuthSuccess} />
    </>
  );
};

export default CompetitionCard;
