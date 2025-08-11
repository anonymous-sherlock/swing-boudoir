import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Competition } from "@/types/competitions.types";
import { useCompetitions } from "@/hooks/useCompetitions";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import defaultImage from "@/assets/hot-girl-summer.jpg";

interface CompetitionCardProps {
  competition: Competition;
  showJoinButton?: boolean;
}

export const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition, showJoinButton = true }) => {
  const { joinContest, leaveContest, isJoining, isLeaving, hasJoinedContest, joinError, leaveError, needsProfileSetup } = useCompetitions();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const hasJoined = hasJoinedContest(competition.id);

  const handleJoinContest = async () => {
    try {
      await joinContest(competition.id);
      toast({
        title: "Success!",
        description: `You have joined ${competition.name}`,
      });
    } catch (error) {
      console.log(error);
      const errorMessage = error instanceof Error ? error.message : "Failed to join contest. Please try again.";

      if (errorMessage.includes("must be logged in")) {
        toast({
          title: "Authentication Required",
          description: "Please log in to join contests",
          variant: "destructive",
        });
      } else if (errorMessage.includes("Profile setup required")) {
        toast({
          title: "Profile Setup Required",
          description: "Please complete your profile before joining contests",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  const handleLeaveContest = async () => {
    try {
      await leaveContest(competition.id);
      toast({
        title: "Success!",
        description: `You have left ${competition.name}`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to leave contest. Please try again.";

      if (errorMessage.includes("must be logged in")) {
        toast({
          title: "Authentication Required",
          description: "Please log in to leave contests",
          variant: "destructive",
        });
      } else if (errorMessage.includes("Profile setup required")) {
        toast({
          title: "Profile Setup Required",
          description: "Please complete your profile before leaving contests",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  const handleAuthSuccess = () => {
    // Close the modal and refresh the page or update state as needed
    setIsAuthModalOpen(false);
    // Optionally refresh the page or update authentication state
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

  return (
    <>
      <Card className="w-full max-w-sm overflow-hidden relative ">
        <div className="relative cursor-pointer">
          {hasJoined && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 absolute top-2 right-2 z-10">
              Joined
            </Badge>
          )}

          <img src={competition.images[0]?.url || defaultImage} alt={competition.name} className="w-full aspect-video object-cover" />
          <div className="absolute top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center">
            {competition.images.length > 0 && <p className="text-white text-sm">{competition.images.length} images</p>}
          </div>
        </div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{competition.name}</CardTitle>
          </div>
          <CardDescription className="line-clamp-2">{competition.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Start Date:</span>
            <span>{formatDate(competition.startDate)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">End Date:</span>
            <span>{formatDate(competition.endDate)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Prize Pool:</span>
            <span className="font-semibold text-green-600">{formatPrize(competition.prizePool)}</span>
          </div>

          {competition.awards && competition.awards.length > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Awards:</span>
              <span>{competition.awards.length} available</span>
            </div>
          )}
        </CardContent>

        {showJoinButton && (
          <CardFooter className="flex flex-col space-y-2">
            {hasJoined ? (
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
                  <Button onClick={handleJoinContest} disabled={isJoining} className="w-full">
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
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default CompetitionCard;
