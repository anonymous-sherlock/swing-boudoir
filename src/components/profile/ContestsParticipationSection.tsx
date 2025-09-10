import { VoterAuthModal } from "@/components/auth/VoterAuthModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProfile } from "@/hooks/api/useProfile";
import { formatUsdAbbrev } from "@/lib/utils";
import { Contest_Status } from "@/lib/validations/contest.schema";
import { ContestParticipation } from "@/types/competitions.types";
import { Link } from "@tanstack/react-router";
import { Calendar, Eye, Gift, Heart, Trophy, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Icons } from "../icons";
import { Lightbox } from "../Lightbox";

import { useAuth } from "@/contexts/AuthContext";
import { useCastFreeVote, useCheckFreeVoteAvailability } from "@/hooks/api/useVotes";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import { toast } from "sonner";
import VoteModal from "./VoteModal";
import { Profile } from "@/types/profile.types";
import { getImageUrl } from "@/lib/image-helper";

interface ContestsParticipationSectionProps {
  participations: ContestParticipation[];
  profile: Profile;
  onVoteSuccess: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getStatusBadge = (status: keyof typeof Contest_Status) => {
  switch (status) {
    case "ACTIVE":
    case "PUBLISHED":
    case "VOTING":
      return <Badge className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 font-medium">Active</Badge>;
    case "COMPLETED":
    case "BOOKED":
      return (
        <Badge variant="secondary" className="text-xs px-3 py-1 font-medium">
          Ended
        </Badge>
      );
    case "DRAFT":
      return (
        <Badge variant="outline" className="text-xs px-3 py-1 border-blue-200 text-blue-600 font-medium">
          Upcoming
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="text-xs px-3 py-1 font-medium">
          {status}
        </Badge>
      );
  }
};

// Utility function to calculate time remaining for next vote
const getTimeRemainingForNextVote = (lastVoteAt: string): { canVote: boolean; timeRemaining: string; hoursRemaining: number } => {
  const lastVote = new Date(lastVoteAt);
  const now = new Date();
  const timeDiff = now.getTime() - lastVote.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  if (hoursDiff >= 24) {
    return { canVote: true, timeRemaining: "", hoursRemaining: 0 };
  }

  const remainingHours = 24 - hoursDiff;
  const hours = Math.floor(remainingHours);
  const minutes = Math.floor((remainingHours - hours) * 60);

  let timeRemaining = "";
  if (hours > 0) {
    timeRemaining = `${hours}h ${minutes}m`;
  } else {
    timeRemaining = `${minutes}m`;
  }

  return { canVote: false, timeRemaining, hoursRemaining: remainingHours };
};

export function ContestsParticipationSection({ profile, participations, onVoteSuccess }: ContestsParticipationSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const { useProfileByUserId } = useProfile();
  const { data: voterProfile } = useProfileByUserId(user?.id || "");
  const [lightboxImage, setLightboxImage] = useState<{ url: string; caption: string } | null>(null);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [selectedParticipation, setSelectedParticipation] = useState<ContestParticipation | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { data: freeVoteAvailability } = useCheckFreeVoteAvailability({
    profileId: voterProfile?.id || "",
  });
  const { mutateAsync: castFreeVote, isPending: isVoting } = useCastFreeVote();
  const [isFreeVoteAvailable, setIsFreeVoteAvailable] = useState(false);

  // Combined useEffect to handle both API and local state efficiently
  useEffect(() => {
    if (freeVoteAvailability?.available) {
      setIsFreeVoteAvailable(true);
    } else if (voterProfile?.lastFreeVoteAt) {
      const { canVote } = getTimeRemainingForNextVote(voterProfile.lastFreeVoteAt);
      setIsFreeVoteAvailable(canVote);
    } else {
      setIsFreeVoteAvailable(false);
    }
  }, [freeVoteAvailability, voterProfile?.lastFreeVoteAt]);

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const giveFreeVote = useCallback(
    async ({ contestId, voteeId, voterId, voteeName }: { contestId: string; voteeId: string; voterId: string; voteeName: string }) => {
      try {
        const res = await castFreeVote({
          contestId,
          voteeId,
          voterId,
          comment: "",
        });

        if (res && res.id) {
          toast.success("Vote cast successfully", {
            description: `You have cast your free vote for ${voteeName}`,
          });

          // Update local state immediately for better UX
          setIsFreeVoteAvailable(false);

          // Call the callback to refresh data
          onVoteSuccess();
        }
      } catch (error) {
        console.error("Error casting vote:", error);

        // Show error toast
        toast.error("Failed to cast vote", {
          description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        });

        // Don't update state on error - keep the button enabled
      }
    },
    [castFreeVote, onVoteSuccess]
  );

  const handleVoteButtonClick = useCallback(
    (participation: ContestParticipation) => {
      // Always set the selected participation first
      setSelectedParticipation(participation);

      if (!isAuthenticated) {
        setIsAuthModalOpen(true);
        return;
      }

      // User is authenticated, proceed with vote modal
      setIsVoteModalOpen(true);
    },
    [isAuthenticated]
  );

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    // After successful authentication, automatically open the vote modal
    if (selectedParticipation) {
      setIsVoteModalOpen(true);
    }
  };

  if (!participations || participations.length === 0) {
    return (
      <Card className="shadow-sm border-0 bg-gradient-to-br from-gray-50 to-white">
        <CardContent className="text-center py-16 px-8">
          <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Trophy className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">No Contest Participations</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto text-base leading-relaxed">This profile hasn't joined any contests yet. Check back soon for exciting opportunities!</p>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 inline-block">
            <div className="text-sm text-blue-700">
              <strong>💡 Tip:</strong> Contest participations will appear here once they join contests.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Active Contest Participations</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">See what {profile.user?.name || "this model"} is competing in right now</p>
      </div>

      {/* Participations Grid */}
      <div className="grid gap-8">
        {participations.map((participation) => (
          <Card key={participation.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                {/* Contest Photo Section - Fixed sizing */}
                <div className="lg:w-2/5 relative overflow-hidden">
                  {participation.coverImage &&
                    (() => {
                      const optimizedCoverImage = getImageUrl(participation.coverImage.url, "gallery", { w: 600, q: 80 });
                      return (
                        <div className="relative h-80 lg:h-full group">
                          <img
                            src={optimizedCoverImage}
                            alt="Contest Participation Photo"
                            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                            onClick={() =>
                              participation.coverImage &&
                              setLightboxImage({
                                url: participation.coverImage.url,
                                caption: "Contest Participation Photo",
                              })
                            }
                          />
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                            Participation Photo
                          </div>
                          {/* View Icon on Hover */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-white text-gray-900 hover:bg-gray-100"
                                onClick={() =>
                                  participation.coverImage &&
                                  setLightboxImage({
                                    url: participation.coverImage.url,
                                    caption: "",
                                  })
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                </div>

                {/* Contest Info Section */}
                <div className="lg:w-3/5 p-8">
                  {/* Header with Contest Name and Status */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{participation.contest?.name || "Contest"}</h3>
                      {participation.contest?.description && <p className="text-gray-600 text-sm leading-relaxed">{participation.contest.description}</p>}
                    </div>
                    <div className="ml-4">{getStatusBadge(participation.contest?.status || "")}</div>
                  </div>

                  {/* Countdown Timer */}
                  {participation.contest?.endDate && (
                    <div className="mb-6 bg-gray-100 p-2 flex flex-col md:flex-row text-center md:text-left  gap-2 justify-between items-center px-6">
                      <div>
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide text-center md:text-left">Time left for</span>
                        <div className="font-bold text-gray-700 text-sm">{participation.contest?.name || "This Contest"}</div>
                      </div>
                      <FlipClockCountdown
                        to={new Date(participation.contest?.endDate)}
                        labelStyle={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase" }}
                        digitBlockStyle={{ width: 22, height: 38, fontSize: 20 }}
                        duration={0.5}
                      />
                    </div>
                  )}

                  {/* Key Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <Gift className="w-4 h-4 text-green-600" />
                      <div>
                        <span className="text-xs text-gray-500">Prize Pool</span>
                        <div className="font-semibold text-green-600 text-sm">{participation.contest?.prizePool ? formatUsdAbbrev(participation.contest.prizePool) : "-"}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <div>
                        <span className="text-xs text-gray-500">Ends</span>
                        <div className="font-semibold text-sm">{participation.contest?.endDate ? formatDate(participation.contest.endDate) : "-"}</div>
                      </div>
                    </div>
                  </div>

                  {/* Model Rank and Participants */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-yellow-600" />
                      <div>
                        <span className="text-xs text-gray-500">Your Rank</span>
                        <div className="font-semibold text-yellow-600 text-sm">{"N/A"}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <div>
                        <span className="text-xs text-gray-500">Participants</span>
                        <div className="font-semibold text-purple-600 text-sm">{"N/A"}</div>
                      </div>
                    </div>
                  </div>

                  {/* Awards Section */}
                  {participation.contest?.awards && participation.contest.awards.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center space-x-2 mb-4">
                        <Trophy className="w-4 h-4 text-yellow-600" />
                        <span className="text-xs  text-gray-500 ">Awards</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {participation.contest.awards.slice(0, 3).map((award) => (
                          <Badge key={award.id} variant="outline" className="px-3 py-2 border-yellow-200 text-yellow-700 bg-yellow-50 font-medium">
                            {award.icon} {award.name}
                          </Badge>
                        ))}
                        {participation.contest.awards.length > 3 && (
                          <Badge variant="outline" className="px-3 py-2 border-gray-200 text-gray-600 bg-gray-50 font-medium">
                            +{participation.contest.awards.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Call-to-Action Banner */}
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100 p-2 text-xs">
                    <div className="flex items-center justify-between flex-col md:flex-row gap-2 md:gap-0">
                      <div className="flex items-center space-x-4">
                        {/* Red Bar Chart Icon */}
                        <div className="bg-red-100 rounded-lg p-2">
                          <div className="relative">
                            <Icons.barGraphChart className="w-6 h-6 text-red-500" />
                          </div>
                        </div>

                        {/* Text Content */}
                        <div>
                          <p className="text-gray-900 font-medium text-sm">Check out all competitors and see who's leading!</p>
                        </div>
                      </div>

                      {/* Call-to-Action Link */}
                      <div>
                        <Link
                          to="/competitions/$slug/participants"
                          params={{ slug: participation.contest.slug }}
                          className="text-gray-900 underline font-medium hover:text-red-600 transition-colors duration-200 text-xs"
                        >
                          View All Competitors
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Voting Button Section */}
                  <div className="pt-3 mt-3 border-t border-gray-100">
                    <div className="">
                      {isFreeVoteAvailable ? (
                        <Button
                          size="lg"
                          className="w-full truncate text-sm md:text-base bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          onClick={() => {
                            if (!isAuthenticated) {
                              setIsAuthModalOpen(true);
                              return;
                            }
                            giveFreeVote({
                              contestId: participation.contest.id,
                              voteeId: profile.id,
                              voteeName: profile.user?.name || "",
                              voterId: user?.profileId || "",
                            });
                          }}
                          disabled={isVoting}
                        >
                          {isVoting ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Voting...
                            </div>
                          ) : (
                            <>
                              <Heart className="w-5 h-5 mr-2" />
                              Cast a Free Vote for {profile.user?.name || "this model"}
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          size="lg"
                          className="w-full text-sm md:text-base bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          onClick={() => handleVoteButtonClick(participation)}
                        >
                          <Heart className="w-5 h-5 mr-2" />
                          Vote for {profile.user?.name || "this model"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <VoteModal
        open={isVoteModalOpen}
        onOpenChange={setIsVoteModalOpen}
        participation={selectedParticipation ?? ({} as ContestParticipation)}
        profile={profile}
        voterProfile={voterProfile}
        isFreeVoteAvailable={isFreeVoteAvailable}
        onAvailabilityChange={setIsFreeVoteAvailable}
        onFreeVoteRequest={(participation) => {
          // Handle free vote request from modal
          if (selectedParticipation) {
            giveFreeVote({
              contestId: selectedParticipation.contest.id,
              voteeId: profile.id,
              voteeName: profile.user?.name || "",
              voterId: user?.profileId || "",
            });
          }
          setIsVoteModalOpen(false);
        }}
      />

      {/* Voter Authentication Modal */}
      <VoterAuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={handleAuthSuccess} callbackURL={window.location.pathname} />

      {/* Lightbox */}
      {lightboxImage && <Lightbox image={lightboxImage} onClose={closeLightbox} />}
    </div>
  );
}
